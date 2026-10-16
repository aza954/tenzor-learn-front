import unittest

from main import Appoinment, appointments, create_appointment


class AppointmentTests(unittest.TestCase):
    def setUp(self):
        appointments.clear()

    def tearDown(self):
        appointments.clear()

    def test_two_valid_appointments(self):
        first = create_appointment("Иванова А.А.", 1, 1, "10:00")
        second = create_appointment("Петрова А.А.", 1, 1, "11:00")

        self.assertIsInstance(first, Appoinment)
        self.assertIsInstance(second, Appoinment)
        self.assertEqual(first.id, 1)
        self.assertEqual(second.id, 2)
        self.assertEqual(first.master_id, 1)
        self.assertEqual(first.service_id, 1)
        self.assertEqual(
            [(item.client_name, item.time) for item in appointments],
            [("Иванова А.А.", "10:00"), ("Петрова А.А.", "11:00")],
        )

    def test_empty_fields_do_not_create_appointment(self):
        cases = [
            ("", 1, 1, "12:00"),
            ("   ", 1, 1, "12:00"),
            (None, 1, 1, "12:00"),
            ("Иванова А.А.", None, 1, "12:00"),
            ("Иванова А.А.", 1, None, "12:00"),
            ("Иванова А.А.", 1, 1, ""),
            ("Иванова А.А.", 1, 1, "   "),
            ("Иванова А.А.", 1, 1, None),
        ]
        for args in cases:
            with self.subTest(args=args):
                self.assertIsNone(create_appointment(*args))
                self.assertEqual(appointments, [])

    def test_unknown_master_or_service(self):
        for master_id, service_id in [(99, 1), (1, 99), (0, 1), (1, 0)]:
            with self.subTest(master_id=master_id, service_id=service_id):
                self.assertIsNone(create_appointment("Иванова А.А.", master_id, service_id, "12:00"))
                self.assertEqual(appointments, [])

    def test_outside_working_hours(self):
        for time in ["00:00", "07:59", "20:01", "23:59"]:
            with self.subTest(time=time):
                self.assertIsNone(create_appointment("Сидорова А.А.", 1, 1, time))
                self.assertEqual(appointments, [])

    def test_working_hours_boundaries(self):
        for time in ["08:00", "08:01", "19:59", "20:00"]:
            with self.subTest(time=time):
                self.assertIsInstance(create_appointment("Иванова А.А.", 1, 1, time), Appoinment)

    def test_invalid_time_format(self):
        for time in ["24:00", "10:60", "8:00", "08:0", "12", "утром", "10:00:00"]:
            with self.subTest(time=time):
                self.assertIsNone(create_appointment("Иванова А.А.", 1, 1, time))
                self.assertEqual(appointments, [])

    def test_rejected_appointment_keeps_existing_records(self):
        create_appointment("Иванова А.А.", 1, 1, "10:00")
        create_appointment("Петрова А.А.", 1, 1, "11:00")
        self.assertIsNone(create_appointment("", 1, 1, "12:00"))
        self.assertIsNone(create_appointment("Сидорова А.А.", 1, 1, "00:00"))
        self.assertEqual(len(appointments), 2)
        third = create_appointment("Сидорова А.А.", 1, 1, "12:00")
        self.assertEqual(third.id, 3)

    def test_busy_time_is_not_booked_again(self):
        first = create_appointment("Иванова А.А.", 1, 1, "10:00")
        self.assertIsNone(create_appointment("Петрова А.А.", 1, 1, "10:00"))
        self.assertIsNone(create_appointment("Петрова А.А.", 2, 1, "10:00"))
        self.assertEqual(appointments, [first])

    def test_extra_spaces_are_removed(self):
        appointment = create_appointment("  Иванова А.А.  ", 1, 1, " 10:00 ")
        self.assertEqual(appointment.client_name, "Иванова А.А.")
        self.assertEqual(appointment.time, "10:00")


if __name__ == "__main__":
    unittest.main()
