from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel


class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


# Количество услуг пока задано вручную, как допускается в условии.
categories = [
    Category(id=1, name="Стрижки и укладки", servicesCount=5),
    Category(id=2, name="Маникюр и педикюр", servicesCount=5),
    Category(id=3, name="Брови и ресницы", servicesCount=4),
    Category(id=4, name="Спа-процедуры", servicesCount=4),
]

app = FastAPI(title="НЕБО — категории услуг")


@app.get("/categories", response_model=list[Category])
def get_categories():
    return categories


@app.get(
    "/categories/{category_id}",
    response_model=Category,
    responses={
        404: {
            "description": "Category not found",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        }
    },
)
def get_category(category_id: int):
    for category in categories:
        if category.id == category_id:
            return category
    return PlainTextResponse("Category not found", status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
