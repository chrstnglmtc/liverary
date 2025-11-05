import { useNavigate } from "react-router-dom";
import { logout as logoutUser, getCurrentUser } from "../api/authStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser() || JSON.parse(sessionStorage.getItem("authUser") || "null");
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    sessionStorage.removeItem("authUser");
    navigate("/"); // redirect to homepage/login
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToHomepage = () => {
    navigate("/library");
  };
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <a className="text-xl font-bold">Liverary</a>
      </div>
      {user && (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button onClick={goToHomepage} className="btn btn-ghost">
                Home
              </button>
            </li>
            <li>
              <button onClick={goToProfile} className="btn btn-ghost">
                Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
