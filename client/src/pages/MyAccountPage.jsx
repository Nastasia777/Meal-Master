import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyAccountPage = () => {
  console.log("Rendering MyAccountPage");
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    weight: "",
    height: "",
    gender: "",
  });
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    weight: false,
    height: false,
    gender: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage
      console.log("Navigated to MyAccountPage");
      console.log(token); // Log the token to the console
      console.log("Token from localStorage:", localStorage.getItem("token"));
      console.log(
        "Authorization header:",
        `Bearer ${localStorage.getItem("token")}`
      );

      // Sending request to the server to get user data
      const response = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      });
      console.log(response); // Logging server response to the console
      if (!response.ok) {
        console.error("Failed to fetch user data:", response.statusText);
        return;
      }
      const data = await response.json();
      setUserData(data); // Updating state with the fetched data
    };

    // Calling fetchUserData within useEffect
    fetchUserData();
  }, [navigate]); // Now navigate is included in the dependencies list

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    // Send updated user data to the server
    await fetch("/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: userData[field] }),
    });
    handleEditToggle(field);
  };

  return (
    <div className="account-page">
      {Object.keys(userData).map((key) =>
        key !== "email" ? (
          <div key={key} className="account-field">
            <span>{key}:</span>
            {isEditing[key] ? (
              <>
                <input
                  value={userData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
                <button onClick={() => handleSave(key)}>Save</button>
              </>
            ) : (
              <>
                <span>{userData[key]}</span>
                <button onClick={() => handleEditToggle(key)}>Change</button>
              </>
            )}
          </div>
        ) : (
          <div key={key} className="account-field">
            <span>{key}:</span>
            <span>{userData[key]}</span>
          </div>
        )
      )}
    </div>
  );
};

export default MyAccountPage;
