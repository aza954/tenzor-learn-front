# Backend. Задание 3

Мастера хранятся в SQLite (`salon.db`), запросы выполняются через SQLAlchemy. Таблица `masters` и две начальные записи создаются при первом запуске. Повторный запуск не дублирует записи.

Запуск (Python 3.10+):

```sh
cd backend-3-practice
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe main.py
```

- `GET /masters` — все мастера.
- `GET /masters?specialization=Парикмахер` — фильтр по специализации.
- `GET /masters/1` — мастер по ID; если его нет, ответ 404.

Проверить запросы: [Swagger](http://127.0.0.1:8001/docs). Категории из задания 2 тоже доступны.

Тесты:

```sh
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.venv\Scripts\python.exe -m unittest discover -s tests -v
```
