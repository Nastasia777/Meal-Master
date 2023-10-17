import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import { useContext } from "react";
import AuthContext from "../contexts/authcontext";

const NavBar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <nav>
      <ul>
        <li>
          <Link to="/homepage">Home</Link>
        </li>
        <li>
          <Link to="/account">My Account</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <button onClick={logout}>Logout</button>
      </ul>
    </nav>
  );
};

export default NavBar;
