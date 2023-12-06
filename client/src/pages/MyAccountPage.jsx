import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyAccountPage.css";

const MyAccountPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    password: false,
    weight: false,
    height: false,
    gender: false,
  });

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserData({
          ...data,
          weight: { value: data.weight || "", unit: data.weightUnit || "kg" },
          height: { value: data.height || "", unit: data.heightUnit || "cm" },
        });
      } else {
        console.error("Failed to fetch user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangeValue = (field, e) => {
    const value = e.target.value || "";
    if (field === "weight" || field === "height") {
      setUserData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleChangeUnit = (field, e) => {
    const newUnit = e.target.value;
    setUserData((prev) => {
      let value = prev[field].value;
      if (field === "weight") {
        if (newUnit === "lb" && prev[field].unit === "kg") {
          value = (parseFloat(value) * 2.20462).toFixed(1); // Convert kg to lb
        } else if (newUnit === "kg" && prev[field].unit === "lb") {
          value = (parseFloat(value) / 2.20462).toFixed(1); // Convert lb to kg
        }
      } else if (field === "height") {
        if (newUnit === "inch" && prev[field].unit === "cm") {
          value = (parseFloat(value) / 2.54).toFixed(1); // Convert cm to inch
        } else if (newUnit === "cm" && prev[field].unit === "inch") {
          value = (parseFloat(value) * 2.54).toFixed(0); // Convert inch to cm
        }
      }
      return {
        ...prev,
        [field]: {
          value: value,
          unit: newUnit,
        },
      };
    });
  };

  const handleSave = async (field) => {
    let payload;
    if (field === "weight" || field === "height") {
      payload = {
        [field]: `${userData[field].value} ${userData[field].unit}`,
      };
    } else {
      payload = { [field]: userData[field] };
    }

    console.log(`Sending data for ${field} with payload:`, payload);

    try {
      const response = await fetch(
        `http://localhost:5000/users/${userData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Data saved successfully");
        fetchUserData();
      } else {
        console.error("Failed to save data:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }

    handleEditToggle(field);
  };
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-page">
      <h1>Welcome to your account page, {userData.first_name}!</h1>

      <div className="account-section">
        <div className="account-field">
          <span>Email:</span>
          <span>{userData.email}</span>
          <a onClick={() => navigate("/change-password")}>Change Password</a>
        </div>
        {[
          { key: "first_name", label: "Name" },
          { key: "last_name", label: "Surname" },
          { key: "gender", label: "Gender" },
          { key: "weight", label: "Weight", units: ["kg", "lb"] },
          { key: "height", label: "Height", units: ["cm", "inch"] },
        ].map(({ key, label, units }) => (
          <div key={key} className="account-field">
            <span>{label}:</span>
            {isEditing[key] ? (
              <>
                {units ? (
                  <>
                    <input
                      type="text"
                      value={userData[key].value || ""}
                      onChange={(e) => handleChangeValue(key, e)}
                    />
                    <select
                      value={userData[key].unit}
                      onChange={(e) => handleChangeUnit(key, e)}
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <input
                    type="text"
                    value={userData[key] || ""}
                    onChange={(e) => handleChangeValue(key, e)}
                  />
                )}
                <button onClick={() => handleSave(key)}>Save</button>
              </>
            ) : (
              <span>
                {units
                  ? `${userData[key].value} ${userData[key].unit}`
                  : userData[key]}
              </span>
            )}
            <button onClick={() => handleEditToggle(key)}>Change</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAccountPage;
