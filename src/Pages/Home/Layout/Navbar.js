import { Link } from "react-router-dom";

export default function NavbarComponent() {
    return (
        <div>
            <div>
               <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/candidates">Candidates</Link>
                </li>
               </ul>
            </div>
        </div>
    )
}