from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Master
from seed import init_db


class MasterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


categories = [
    Category(id=1, name="Стрижки и укладки", servicesCount=5),
    Category(id=2, name="Маникюр и педикюр", servicesCount=5),
    Category(id=3, name="Брови и ресницы", servicesCount=4),
    Category(id=4, name="Спа-процедуры", servicesCount=4),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="НЕБО — мастера и категории", lifespan=lifespan)


@app.get("/masters", response_model=list[MasterResponse])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = select(Master).order_by(Master.id)
    if specialization is not None:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


@app.get("/masters/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


# Эндпоинты категорий из предыдущего задания.
@app.get("/categories", response_model=list[Category])
def get_categories():
    return categories


@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: int):
    for category in categories:
        if category.id == category_id:
            return category
    return PlainTextResponse("Category not found", status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8001)
