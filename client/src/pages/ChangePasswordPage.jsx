import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ChangePasswordPage.css";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token"); // Get token from local storage

    if (!token) {
      toast.error("No token found. Please log in.");
      return; // Return early if there's no token
    }

    try {
      const response = await fetch(
        "http://localhost:5000/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.replace(/"/g, "")}`, // Add this header
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // This is an unauthorized error due to incorrect password
          // Clear the password fields
          setOldPassword("");
          setNewPassword("");
        }
        toast.error(errorData.message); // Show error popup
        return;
      }

      // Password changed successfully
      toast.success("Password was changed successfully"); // Show success popup
      setTimeout(() => {
        navigate("/account"); // Redirect to /account after 1 second
      }, 1000);
    } catch (error) {
      // Other network or syntax errors
      toast.error(`Failed to change password: ${error.message}`); // Show error popup
    }
  };

  return (
    <div className="change-password-page">
      <div className="input-field">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="input-field">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <button className="button" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePasswordPage;
