import React, { useState, useEffect } from "react";
import { getToken, getUser, logout } from "./Login";
import { Edit3, Save, X } from "lucide-react";
import "./dashboard.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";
function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [empstats, setEmpStats] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [editform2, seteditform2] = useState("");
  const [isediting, setisediting] = useState(false);
  const [image, setImage] = useState(null);
  const [isuploading, setisuploading] = useState(false);
  const [isupdating, setisupdating] = useState(false);

  const handleChangei = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    setisupdating(true);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/upload/${userData.data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setUserData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          imageurl: response.data.url,
        },
      }));
      console.log(editform2.imageurl);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setisupdating(false);
    }
  };
  function handleedit2() {
    seteditform2({ ...userData.data });
    setisediting(true);
  }
  function cancel2() {
    setisediting(false);
    setisuploading(false);
  }
  const handleSave2 = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/allusers/${userData.data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editform2),
        },
      );

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message);

      setEmployees(
        employees.map((e) =>
          e.id === userData.data.id ? updated.data.employee : e,
        ),
      );
      setAllUsers(
        allusers.map((u) =>
          u.id === userData.data.id ? updated.data.employee : u,
        ),
      );
      setUserData((prev) => ({
        ...prev,
        data: updated.data.employee, // make sure this matches your API's returned user object
      }));
      cancel2();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };
  function handlefinalsave() {
    handleUpload();
    handleSave2();
  }
  const user = getUser();
  const is_admin = userData?.data.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUserData(data);

        if (data.data.role === "admin") {
          const statsRes = await fetch(
            `${API_BASE_URL}/api/users/dashboard/stats`,
            {
              headers: { Authorization: `Bearer ${getToken()}` },
            },
          );
          const statsData = await statsRes.json();
          setEmpStats(statsData.data.stats);

          const empRes = await fetch(`${API_BASE_URL}/api/users/employees`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          const empData = await empRes.json();
          setEmployees(empData.data.employees);

          const userRes = await fetch(`${API_BASE_URL}/api/users/allusers`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          const allData = await userRes.json();
          setAllUsers(allData.data.employees);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredEmployees2 = allusers.map((emp) => emp.is_admin);

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({ ...emp });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/employees/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message);

      setEmployees(
        employees.map((e) => (e.id === editingId ? updated.data.employee : e)),
      );
      setAllUsers(
        allusers.map((u) => (u.id === editingId ? updated.data.employee : u)),
      );
      handleCancel();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };
  const handleChange2 = (field, value) => {
    seteditform2({ ...editform2, [field]: value });
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h1>{is_admin ? "Admin Dashboard" : "My Dashboard"}</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <button className="edit-btn" onClick={handleedit2}>
          Edit Profile
        </button>
      </div>
      {isediting && (
        <div className="profile-edit-modal">
          <label>First Name</label>
          <input
            value={editform2.firstName || ""}
            onChange={(e) => handleChange2("firstName", e.target.value)}
            placeholder="First Name"
          />{" "}
          <label>Last Name</label>
          <input
            value={editform2.lastName || ""}
            onChange={(e) => handleChange2("lastName", e.target.value)}
            placeholder="Last Name"
          />{" "}
          <label>Email</label>
          <input
            value={editform2.email || ""}
            onChange={(e) => handleChange2("email", e.target.value)}
            placeholder="Email"
          />{" "}
          <label>Department</label>
          <input
            value={editform2.department || ""}
            onChange={(e) => handleChange2("department", e.target.value)}
            placeholder="Department"
          />{" "}
          <label>Position</label>
          <input
            value={editform2.position || ""}
            onChange={(e) => handleChange2("position", e.target.value)}
            placeholder="Position"
          />
          <label className="submit2">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleChangei}
              style={{ display: "none" }}
            />
          </label>
          <br></br>
          <button onClick={handlefinalsave}>Save</button>
          <button className="submit" onClick={cancel2}>
            Cancel
          </button>
        </div>
      )}
      {!isediting && (
        <div className="profile-card">
          <div className="profile-wrapper">
            {userData ? (
              <>
                <div className="profile-content">
                  <h2>
                    {userData.data.firstName} {userData.data.lastName}
                  </h2>
                  <p>{userData.data.email}</p>
                  <p>Access Level: {userData.data.role} </p>
                  <p>Department:{userData.data.department}</p>
                  <p>Position:{userData.data.position}</p>
                  <p>Salary:${Number(userData.data.salary).toLocaleString()}</p>
                </div>
                <div className="profileimage">
                  {isupdating ? (
                    <p>Loading</p>
                  ) : (
                    <img
                      src={userData.data.imageurl}
                      alt="Uploaded"
                      className="avatar"
                    />
                  )}
                </div>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>
      )}

      {is_admin && (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-green">
              <p>Total Employees: {empstats.totalEmployees}</p>
            </div>
            <div className="stat-card stat-purple">
              <p>
                Avg Salary: $
                {Number(
                  Math.round(
                    allusers.reduce((a, e) => a + Number(e.salary), 0) /
                      (empstats.totalUsers || 1),
                  ),
                ).toLocaleString()}
              </p>
            </div>
            <div className="stat-card stat-red">
              <p>Total Admins: {empstats.totalAdmins}</p>
            </div>
            <div className="stat-card stat-orange">
              <p>Total Users: {empstats.totalUsers}</p>
            </div>
          </div>

          <div className="employee-table-container">
            <h3>Employee Management</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Acess Level</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .filter((emp) => emp.role === "employee") // 👈 Filter only employees
                  .map((emp) => (
                    <tr key={emp.id}>
                      {editingId === emp.id ? (
                        <>
                          <td>
                            <input
                              className="input-field"
                              value={editForm.firstName}
                              onChange={(e) =>
                                handleChange("firstName", e.target.value)
                              }
                              placeholder="First Name"
                            />
                            <input
                              className="input-field"
                              value={editForm.lastName}
                              onChange={(e) =>
                                handleChange("lastName", e.target.value)
                              }
                              placeholder="Last Name"
                            />
                          </td>
                          <td>
                            <input
                              className="input-field"
                              value={editForm.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <select
                              className="select-field"
                              value={editForm.department}
                              onChange={(e) =>
                                handleChange("department", e.target.value)
                              }
                            >
                              <option value=" ">Choose</option>
                              <option value="Engineering">Engineering</option>
                              <option value="HR">HR</option>
                              <option value="Sales">Sales</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Other">Other</option>
                            </select>

                            {editForm.department === "Other" && (
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Enter department"
                                value={editForm.customDepartment || ""}
                                onChange={(e) =>
                                  handleChange(
                                    "customDepartment",
                                    e.target.value,
                                  )
                                }
                              />
                            )}
                          </td>
                          <td>
                            <input
                              className="input-field"
                              value={editForm.position}
                              onChange={(e) =>
                                handleChange("position", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <select
                              className="select-field"
                              value={editForm.role}
                              onChange={(e) => {
                                const role = e.target.value;
                                setEditForm((prevForm) => ({
                                  ...prevForm,
                                  role,
                                  is_admin: role === "admin",
                                }));
                              }}
                            >
                              <option>employee</option>
                              <option>admin</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-field"
                              value={editForm.salary}
                              onChange={(e) =>
                                handleChange("salary", parseInt(e.target.value))
                              }
                            />
                          </td>
                          <td>
                            <button className="action-btn" onClick={handleSave}>
                              <Save />
                            </button>
                            <button
                              className="action-btn"
                              onClick={handleCancel}
                            >
                              <X />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {emp.firstName} {emp.lastName}
                          </td>
                          <td>{emp.email}</td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td>
                            <span
                              className={`role-badge ${emp.role === "admin" ? "admin-badge" : "employee-badge"}`}
                            >
                              {emp.role}
                            </span>
                          </td>
                          <td>${Number(emp.salary).toLocaleString()}</td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => handleEdit(emp)}
                            >
                              <Edit3 />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="admin-table-container">
            <h3>Admin Details</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search admins by name, email, or department..."
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
            />
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Acess Level</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {allusers
                  .filter(
                    (emp) =>
                      emp.role === "admin" &&
                      (`${emp.firstName} ${emp.lastName}`
                        .toLowerCase()
                        .includes(searchTerm2.toLowerCase()) ||
                        emp.email
                          .toLowerCase()
                          .includes(searchTerm2.toLowerCase()) ||
                        emp.department
                          .toLowerCase()
                          .includes(searchTerm2.toLowerCase())),
                  )
                  .map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>
                        <span
                          className={`role-badge ${emp.role === "admin" ? "admin-badge" : "employee-badge"}`}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td>${Number(emp.salary).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
