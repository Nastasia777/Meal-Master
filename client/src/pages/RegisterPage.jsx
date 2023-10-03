import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    weight: "",
    height: "",
    gender: "",
  });
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          alert(data.message);
        }
        setRedirectToLogin(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (redirectToLogin) {
      navigate("/login");
    }
  }, [redirectToLogin, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        required
      />
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleInputChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleInputChange}
        placeholder="Last Name"
        required
      />
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleInputChange}
        placeholder="Weight"
        required
      />
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleInputChange}
        placeholder="Height"
        required
      />
      <input
        type="text"
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        placeholder="Gender"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
