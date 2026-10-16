from datetime import datetime, time as clock_time


class Master:
    def __init__(self, master_id: int, name: str):
        self.master_id = master_id
        self.name = name


class Service:
    def __init__(self, service_id: int, name: str):
        self.service_id = service_id
        self.name = name


class Appoinment:
    """Запись клиента. Название класса сохранено как в задании."""

    def __init__(
        self,
        appointment_id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ):
        self.id = appointment_id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time


masters = [Master(1, "Марина Орлова"), Master(2, "Ольга Соколова")]
services = [Service(1, "Женская стрижка")]
appointments: list[Appoinment] = []

OPENING_TIME = clock_time(8, 0)
CLOSING_TIME = clock_time(20, 0)


def get_master(master_id: int) -> Master | None:
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    for service in services:
        if service.service_id == service_id:
            return service
    return None


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appoinment | None:
    if not isinstance(client_name, str) or not client_name.strip():
        return None
    if not isinstance(time, str) or not time.strip():
        return None
    if type(master_id) is not int or type(service_id) is not int:
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    time = time.strip()
    try:
        selected_time = datetime.strptime(time, "%H:%M").time()
    except ValueError:
        return None

    # Проверяем точный формат ЧЧ:ММ и рабочие часы салона.
    if selected_time.strftime("%H:%M") != time:
        return None
    if not OPENING_TIME <= selected_time <= CLOSING_TIME:
        return None

    # Сохраняем упомянутое в условии ограничение на уже занятое время.
    if any(appointment.time == time for appointment in appointments):
        return None

    appointment = Appoinment(
        appointment_id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


def main():
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    no_name = create_appointment("", 1, 1, "12:00")
    wrong_time = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print("Запись без имени:", no_name)
    print("Запись на 00:00:", wrong_time)
    print("Количество записей:", len(appointments))


if __name__ == "__main__":
    main()
