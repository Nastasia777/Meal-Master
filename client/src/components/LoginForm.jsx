import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "../contexts/authcontext";
import { useNavigate } from "react-router-dom";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  message,
  setMessage,
}) {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    localStorage.clear(); //?

    if (email.length > 0 && password.length > 0) {
      fetch("http://localhost:5000/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            throw new Error(res.status);
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", JSON.stringify(data.token));
          setToken(data.token); // update AuthContext with the token
          setMessage("User logged in successfully.");
          setTimeout(() => {
            setMessage("");
            navigate("/homepage");
          }, 300);
        })
        .catch((err) => {
          console.log(err);
          setMessage("Invalid email or password.");
          setTimeout(() => {
            setMessage("");
          }, 5000);
        });
      setEmail("");
      setPassword("");
    } else {
      setMessage("Please fill in all fields.");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        Email:{" "}
        <input
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        Password:{" "}
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {/* <button type="submit">Login</button> */}
      <input type="submit" value="Login" />
      <p>
        New User? <Link to="/register">Register</Link>
      </p>
      <p className="message">{message}</p>
    </form>
  );
}
LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  message: PropTypes.string,
  setMessage: PropTypes.func.isRequired,
};
