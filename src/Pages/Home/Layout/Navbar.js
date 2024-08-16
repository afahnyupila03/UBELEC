import { NavLink, useNavigate } from "react-router-dom";
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

  const role = user?.user?.user_metadata.role;
  const navigate = useNavigate();

  const firstName = user?.user?.user_metadata.firstName;
  const lastName = user?.user?.user_metadata.lastName;

  const handleSignOut = () => {
    signOutUser();
    navigate(
      role === "student"
        ? "/create-account-&-log-in"
        : "/admin/create-account-&-log-in"
    );
  };

  return (
    <Navbar fluid rounded>
      {user?.user && (
        <>
          <Navbar.Brand>
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              UBEVOTE
            </span>
          </Navbar.Brand>
          <div className="flex md:order-2">
            <Dropdown arrowIcon={false} inline label={<Avatar rounded />}>
              <Dropdown.Header>
                <span className="block text-sm">
                  {`${firstName} ${lastName}`}
                </span>
                <span className="block truncate text-sm font-medium">
                  {user?.user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            {navigation(role)?.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "text-blue-700 text-lg" : "text-gray-900 text-lg"
                }
                end
              >
                {link.link}
              </NavLink>
            ))}
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
}
