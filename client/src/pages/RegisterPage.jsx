import { useState } from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
    gender: "",
  });

  const handleUserDataChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container">
      <h1>Welcome to Meal-Master!</h1>
      <h1>Please Register</h1>
      <RegisterForm
        userData={userData}
        onUserDataChange={handleUserDataChange}
      />
    </div>
  );
}
