# Backend. Задание 2

API категорий услуг на FastAPI. Количество услуг пока задано вручную.

Запуск из корня репозитория (Python 3.10+):

```sh
cd backend-2-practice
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe main.py
```

- `GET /categories` — список категорий с количеством услуг.
- `GET /categories/{category_id}` — категория по ID. Если её нет — 404, `Category not found`.

Проверить запросы можно в [Swagger](http://127.0.0.1:8000/docs).
