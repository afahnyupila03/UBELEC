import AuthenticationPage from "../Pages/Auth/Authentication";
import CandidatePage from "../Pages/Candidates/CandidatesPage";
import DashboardPage from "../Pages/Dashboard/Dashboard";
import VotesPage from "../Pages/Votes/VotesPage";

const createRoute = (path, element) => ({ path, element });

export const routes = [
  createRoute("/create-account-&-log-in", <AuthenticationPage />),
  createRoute("/admin/create-account-&-log-in", <AuthenticationPage />),
  createRoute("/student/dashboard", <DashboardPage />),
  createRoute("/admin/dashboard", <DashboardPage />),
  createRoute("/student/candidates", <CandidatePage />),
  createRoute("/admin/candidates", <CandidatePage />),
  createRoute("/student/votes", <VotesPage />),
  createRoute("/admin/votes", <VotesPage />),
];
