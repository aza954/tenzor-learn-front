import unittest

from fastapi.testclient import TestClient

from main import app


class CategoryApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    def test_categories_list(self):
        response = self.client.get("/categories")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "application/json")
        self.assertEqual(
            response.json(),
            [
                {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
                {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
                {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
                {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
            ],
        )

    def test_each_category_can_be_requested_by_id(self):
        categories = self.client.get("/categories").json()
        for category in categories:
            with self.subTest(category_id=category["id"]):
                response = self.client.get(f"/categories/{category['id']}")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json(), category)

    def test_missing_category_returns_404(self):
        for category_id in [0, -1, 99]:
            with self.subTest(category_id=category_id):
                response = self.client.get(f"/categories/{category_id}")
                self.assertEqual(response.status_code, 404)
                self.assertEqual(response.text, "Category not found")
                self.assertTrue(response.headers["content-type"].startswith("text/plain"))

    def test_category_id_must_be_integer(self):
        response = self.client.get("/categories/abc")
        self.assertEqual(response.status_code, 422)

    def test_endpoints_are_available_in_openapi(self):
        response = self.client.get("/openapi.json")
        self.assertEqual(response.status_code, 200)
        paths = response.json()["paths"]
        self.assertIn("get", paths["/categories"])
        self.assertIn("get", paths["/categories/{category_id}"])
        self.assertIn("404", paths["/categories/{category_id}"]["get"]["responses"])


if __name__ == "__main__":
    unittest.main()
