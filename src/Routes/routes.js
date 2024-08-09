import AuthenticationPage from "../Pages/Auth/Authentication";
import DashboardPage from "../Pages/Dashboard/Dashboard";


export const routes = [
    {
        path: "/create-account-&-log-in",
        element: <AuthenticationPage />
    },
    {
        path: "/dashboard",
        element: <DashboardPage />
    }
]