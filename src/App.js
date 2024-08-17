import React, { Suspense, useState, useEffect, StrictMode } from "react";

import { useNavigate, useRoutes } from "react-router-dom";
import { AppRoutes } from "./Routes";
import NavbarComponent from "./Pages/Home/Layout/Navbar";
import { AppState } from "./Store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Blockquote, Spinner } from "flowbite-react";

const FALLBACK = () => {
  return (
    <div className="flex justify-center items-center">
      <Spinner
        className="mx-auto py-10 my-10 px-10 container flex justify-center"
        aria-label={`Loading vote information`}
      />
    </div>
  );
};

function App() {
  const appNav = useRoutes(AppRoutes);
  const navigate = useNavigate();
  const [checkUser, setCheckUser] = useState(true);

  const { user } = AppState();
  const userRole = user?.user.user_metadata.role;

  useEffect(() => {
    if (user !== null) {
      if (userRole === "student") {
        setCheckUser(false);
        navigate("/student/dashboard", { replace: true });
      } else {
        setCheckUser(false);
        navigate("/admin/dashboard", { replace: true });
      }
    } else {
      setCheckUser(false);
      navigate("/create-account-&-log-in", { replace: true });
    }
  }, [user, userRole, navigate]);

  return (
    <Suspense fallback=<FALLBACK />>
      <QueryClientProvider client={new QueryClient()}>
        <StrictMode>
          <NavbarComponent />
          {appNav}
          <div className="my-4 py-2 flex justify-center">
            <Blockquote className="text-center text-lg font-sans font-normal">
              &copy; {new Date().getFullYear()}
            </Blockquote>
          </div>
        </StrictMode>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
