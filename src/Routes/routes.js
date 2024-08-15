import AuthenticationPage from "../Pages/Auth/Authentication";
import CandidatePage from "../Pages/Candidates/CandidatesPage";
import DashboardPage from "../Pages/Dashboard/Dashboard";

export const routes = [
  {
    path: "/create-account-&-log-in",
    element: <AuthenticationPage />,
  },
  {
    path: "/admin/create-account-&-log-in",
    element: <AuthenticationPage />,
  },
  {
    path: "/student/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/candidates",
    element: <CandidatePage />,
  },
];
