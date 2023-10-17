import { useState } from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");

  return (
    <div className="container">
      <h1>Welcome to Meal-Master!</h1>
      <h1>Please Register</h1>
      <RegisterForm
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        message={message}
        setMessage={setMessage}
        weight={weight}
        setWeight={setWeight}
        height={height}
        setHeight={setHeight}
        gender={gender}
        setGender={setGender}
      />
    </div>
  );
}
