import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

const kgToLb = (kg) => (kg * 2.20462).toFixed(1);
const lbToKg = (lb) => (lb / 2.20462).toFixed(1);
const cmToInch = (cm) => (cm / 2.54).toFixed(2);
const inchToCm = (inch) => (inch * 2.54).toFixed(0);

export default function RegisterForm({ userData, onUserDataChange }) {
  const {
    firstName,
    lastName,
    email,
    password,
    weight,
    weightUnit,
    height,
    heightUnit,
    gender,
  } = userData;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validating user input
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !weight ||
      !height ||
      !gender
    ) {
      window.alert("Please fill out all fields.");
      return;
    }

    fetch("http://localhost:5000/users/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        last_name: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        email: email,
        password: password,
        weight: weight + weightUnit,
        height: height + heightUnit,
        gender: gender,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 400) {
            throw new Error(
              "Email is already in use. Please use a different email."
            );
          }
          return res.json().then((err) => {
            throw new Error(err.detail || "Unknown error occurred");
          });
        }
        return res.json();
      })
      .then(() => {
        onUserDataChange("message", "User registered successfully.");
        setTimeout(() => {
          onUserDataChange("message", "");
          navigate("/login");
        }, 300);
      })
      .catch((err) => {
        console.log(err.message);
        if (
          err.message ===
          "Email is already in use. Please use a different email."
        ) {
          onUserDataChange("email", ""); // Clearing email field
        }
        window.alert(err.message); // Displaying alert
        onUserDataChange("message", err.message);
        setTimeout(() => {
          onUserDataChange("message", "");
        }, 5000);
      });
  };

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (field === "weight") {
      if (userData.weightUnit === "kg" || userData.weightUnit === "lb") {
        const match = value.match(/^\d*(\.\d{0,1})?$/);
        if (match) onUserDataChange(field, value);
      }
    } else if (field === "height") {
      if (userData.heightUnit === "cm") {
        const match = value.match(/^\d*$/);
        if (match) onUserDataChange(field, value);
      } else if (userData.heightUnit === "inch") {
        const match = value.match(/^\d*(\.\d{0,2})?$/);
        if (match) onUserDataChange(field, value);
      }
    } else {
      onUserDataChange(field, value);
    }
  };

  const handleUnitChange = (e, unitType) => {
    const unit = e.target.value;
    if (unitType === "weight") {
      const convertedWeight = unit === "kg" ? lbToKg(weight) : kgToLb(weight);
      onUserDataChange("weight", convertedWeight);
      onUserDataChange("weightUnit", unit);
    } else if (unitType === "height") {
      const convertedHeight =
        unit === "cm" ? inchToCm(height) : cmToInch(height);
      onUserDataChange("height", convertedHeight);
      onUserDataChange("heightUnit", unit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div>
        <label>
          First Name:{" "}
          <input
            type="text"
            value={firstName}
            onChange={(e) => handleInputChange(e, "firstName")}
          />
        </label>
      </div>
      <div>
        <label>
          Last Name:{" "}
          <input
            type="text"
            value={lastName}
            onChange={(e) => handleInputChange(e, "lastName")}
          />
        </label>
      </div>
      <div>
        <label>
          Email:{" "}
          <input
            type="text"
            value={email}
            onChange={(e) => handleInputChange(e, "email")}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => handleInputChange(e, "password")}
          />
        </label>
      </div>
      <div>
        <label>
          Weight:{" "}
          <input
            type="text"
            value={weight}
            onChange={(e) => handleInputChange(e, "weight")}
          />
          <select
            value={weightUnit}
            onChange={(e) => handleUnitChange(e, "weight")}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Height:{" "}
          <input
            type="text"
            value={height}
            onChange={(e) => handleInputChange(e, "height")}
          />
          <select
            value={heightUnit}
            onChange={(e) => handleUnitChange(e, "height")}
          >
            <option value="cm">cm</option>
            <option value="inch">inch</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Gender:{" "}
          <select
            value={gender}
            onChange={(e) => onUserDataChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
      </div>
      <input type="submit" value="Register" />
      <p>
        Already Registered? <Link to="/login">Login</Link>
      </p>
      <p className="message">{userData.message}</p>
    </form>
  );
}

RegisterForm.propTypes = {
  userData: PropTypes.object.isRequired,
  onUserDataChange: PropTypes.func.isRequired,
};
