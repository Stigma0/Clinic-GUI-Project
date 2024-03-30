import { Counter } from "./components/Counter";
import { Home } from "./components/Home";
import ManageDoctors from "./components/ManageDoctors";
import ManagePatients from "./components/ManagePatients";
import ManageSchedules from "./components/ManageSchedules";
import SchedulePatient from "./components/SchedulePatient";
import VisitSlotPatient from "./components/VisitSlotPatient";
const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/manage-doctors',
    element: <ManageDoctors />
  },
  {
    path: '/manage-patients',
    element: <ManagePatients />
  },
  {
    path: '/manage-schedules',
    element: <ManageSchedules />
  },
  {
    path: '/schedule-patient',
    element: <SchedulePatient />
  },
  {
    path: '/visit-slots/:scheduleID',
    element: <VisitSlotPatient />
  }
];

export default AppRoutes;
