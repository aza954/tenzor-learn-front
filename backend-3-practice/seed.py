from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base, engine
from models import Master


def init_db(bind=engine):
    Base.metadata.create_all(bind)
    with Session(bind) as session:
        # Начальные данные добавляются только в пустую таблицу.
        if session.scalar(select(Master.id).limit(1)) is None:
            session.add_all([
                Master(id=1, name="Марина Орлова", specialization="Парикмахер"),
                Master(id=2, name="Ольга Соколова", specialization="Визажист"),
            ])
            session.commit()
