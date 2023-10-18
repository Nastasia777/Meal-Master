import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch user data:", response.statusText);
        return;
      }
      const data = await response.json();
      console.log(data);
      setUserData({
        ...data,
        weight: { value: data.weight || 0, unit: "kg" },
        height: { value: data.height || 0, unit: "cm" },
      });
    };
    fetchUserData();
  }, [navigate]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    if (field === "weight" || field === "height") {
      setUserData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value: value.value !== undefined ? value.value : prev[field]?.value,
          unit: value.unit || prev[field]?.unit,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleUnitChange = (field, unit) => {
    // Define conversion functions
    const kgToLb = (kg) => (kg * 2.20462).toFixed(1);
    const lbToKg = (lb) => (lb / 2.20462).toFixed(1);
    const cmToInch = (cm) => (cm / 2.54).toFixed(2);
    const inchToCm = (inch) => (inch * 2.54).toFixed(0);

    setUserData((prev) => {
      let convertedValue;
      // Determine which conversion function to use based on field and unit
      if (field === "weight") {
        convertedValue =
          unit === "kg" ? lbToKg(prev[field].value) : kgToLb(prev[field].value);
      } else if (field === "height") {
        convertedValue =
          unit === "cm"
            ? inchToCm(prev[field].value)
            : cmToInch(prev[field].value);
      }
      // Update the value and unit for the specified field
      return {
        ...prev,
        [field]: {
          value: convertedValue,
          unit: unit,
        },
      };
    });
  };

  const handleSave = async (field) => {
    const payload =
      field === "weight" || field === "height"
        ? { [field]: parseInt(userData[field].value, 10) }
        : { [field]: userData[field] };
    await fetch(`http://localhost:5000/users/${userData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    handleEditToggle(field);
  };

  if (!userData) {
    return null; // or return a loading spinner
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
          { key: "weight", label: "Weight" },
          { key: "height", label: "Height" },
        ].map(({ key, label }) => (
          <div key={key} className="account-field">
            <span>{label}:</span>
            {isEditing[key] ? (
              <>
                {key === "gender" ? (
                  <select
                    value={userData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : key === "weight" || key === "height" ? (
                  <>
                    <input
                      type="text"
                      value={userData[key].value || ""}
                      onChange={(e) =>
                        handleChange(key, {
                          ...userData[key],
                          value: e.target.value,
                        })
                      }
                    />
                    <select
                      value={userData[key].unit}
                      onChange={(e) => handleUnitChange(key, e.target.value)}
                    >
                      {key === "weight" ? (
                        <>
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                        </>
                      ) : (
                        <>
                          <option value="cm">cm</option>
                          <option value="inch">inch</option>
                        </>
                      )}
                    </select>
                  </>
                ) : (
                  <input
                    type="text"
                    value={userData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
                <button onClick={() => handleSave(key)}>Save</button>
              </>
            ) : (
              <>
                <span>
                  {key === "weight" || key === "height"
                    ? `${userData[key].value || "0"} ${
                        userData[key].unit || "kg"
                      }`
                    : userData[key]}
                </span>

                <button onClick={() => handleEditToggle(key)}>Change</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyAccountPage;
