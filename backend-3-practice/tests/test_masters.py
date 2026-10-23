from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect, select
from sqlalchemy.orm import Session

from database import get_db
from main import app
from models import Master
from seed import init_db


class MasterApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_directory = TemporaryDirectory()
        database_path = Path(self.temp_directory.name) / "test.db"
        self.database_url = f"sqlite:///{database_path.as_posix()}"
        self.engine = create_engine(self.database_url, connect_args={"check_same_thread": False})
        init_db(self.engine)

        def get_test_db():
            with Session(self.engine) as session:
                yield session

        app.dependency_overrides[get_db] = get_test_db
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()
        app.dependency_overrides.clear()
        self.engine.dispose()
        self.temp_directory.cleanup()

    def test_list_masters(self):
        response = self.client.get("/masters")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [
            {"id": 1, "name": "Марина Орлова", "specialization": "Парикмахер"},
            {"id": 2, "name": "Ольга Соколова", "specialization": "Визажист"},
        ])

    def test_filter_masters_by_specialization(self):
        with Session(self.engine) as session:
            session.add(Master(name="Анна", specialization="Парикмахер"))
            session.commit()

        response = self.client.get("/masters", params={"specialization": "Парикмахер"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([master["name"] for master in response.json()], ["Марина Орлова", "Анна"])
        self.assertTrue(all(master["specialization"] == "Парикмахер" for master in response.json()))

    def test_unknown_specialization_returns_empty_list(self):
        response = self.client.get("/masters", params={"specialization": "Массажист"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_get_master_by_id(self):
        response = self.client.get("/masters/2")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "id": 2, "name": "Ольга Соколова", "specialization": "Визажист",
        })

    def test_missing_master_returns_404(self):
        for master_id in [0, -1, 99]:
            with self.subTest(master_id=master_id):
                response = self.client.get(f"/masters/{master_id}")
                self.assertEqual(response.status_code, 404)
                self.assertEqual(response.json(), {"detail": "Master not found"})

    def test_master_id_must_be_integer(self):
        self.assertEqual(self.client.get("/masters/abc").status_code, 422)

    def test_api_reads_current_data_from_database(self):
        with Session(self.engine) as session:
            master = session.get(Master, 1)
            master.name = "Новое имя"
            master.specialization = "Колорист"
            session.commit()

        response = self.client.get("/masters/1")
        self.assertEqual(response.json()["name"], "Новое имя")
        filtered = self.client.get("/masters", params={"specialization": "Колорист"})
        self.assertEqual([master["id"] for master in filtered.json()], [1])

    def test_database_schema_and_persistence(self):
        columns = inspect(self.engine).get_columns("masters")
        self.assertEqual({column["name"] for column in columns}, {"id", "name", "specialization"})
        self.engine.dispose()
        reopened_engine = create_engine(self.database_url)
        try:
            with Session(reopened_engine) as session:
                self.assertEqual(session.get(Master, 1).name, "Марина Орлова")
        finally:
            reopened_engine.dispose()

    def test_repeated_initialization_keeps_existing_data(self):
        with Session(self.engine) as session:
            session.get(Master, 1).name = "Изменённое имя"
            session.commit()
        init_db(self.engine)
        with Session(self.engine) as session:
            self.assertEqual(len(session.scalars(select(Master)).all()), 2)
            self.assertEqual(session.get(Master, 1).name, "Изменённое имя")

    def test_categories_are_still_available(self):
        self.assertEqual(self.client.get("/categories").status_code, 200)
        self.assertEqual(self.client.get("/categories/1").json()["name"], "Стрижки и укладки")
        self.assertEqual(self.client.get("/categories/99").status_code, 404)


if __name__ == "__main__":
    unittest.main()
