import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../../../Store";
import { Avatar, Dropdown, Navbar } from "flowbite-react";

const navigation = (role) => [
  {
    path: `/${role}/dashboard`,
    link: "Dashboard",
  },
  {
    path: `/${role}/candidates`,
    link: "Candidates",
  },
  {
    path: `/${role}/votes`,
    link: "Votes",
  },
];

export default function NavbarComponent() {
  const { signOutUser, user } = AppState();

  const role = user?.user.user_metadata.role;
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser();
    navigate(
      role === "student"
        ? "/create-account-&-log-in"
        : "/admin/create-account-&-log-in"
    );
  };

  return (
    <div className="bg-red-500">
      <p className="font-medium text-4xl text-white">Hello world</p>
    </div>
  );
}
