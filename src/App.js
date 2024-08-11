import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import { useNavigate, useRoutes } from "react-router-dom";
import { AppRoutes } from "./Routes";
import NavbarComponent from "./Pages/Home/Layout/Navbar";
import { AppState } from "./Store";

const FALLBACK = () => {
  return (
    <div>
      <div>
        <p>Loading...</p>
      </div>
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
    <Suspense fallback={checkUser && <FALLBACK />}>
      <div className="App">
        <NavbarComponent />
        {appNav}
      </div>
    </Suspense>
  );
}

export default App;
