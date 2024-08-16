import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../../../Store";

export default function NavbarComponent() {
  const { signOutUser, user } = AppState();

  const role = user?.user.user_metadata.role;
  const redirectTo =
    role === "student"
      ? "/create-account-&-log-in"
      : "/admin/create-account-&-log-in";

  const navigate = useNavigate();

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="/student/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/candidates">Candidates</Link>
          </li>
          <li>
            <Link to="/votes">Votes</Link>
          </li>
          <li>User role: {role}</li>
          <li>
            <button
              onClick={async () => {
                try {
                  await signOutUser();
                  navigate(redirectTo, { replace: true });
                } catch (error) {
                  console.error("Error logging out: , error.message");
                  alert("Error logging out: ", error.message);
                  throw error;
                }
              }}
              type="button"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
