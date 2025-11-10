import { useNavigate } from "react-router-dom";
import { logout as logoutUser, getCurrentUser } from "../api/authStore";
import { useEffect, useState } from "react";
import logo from "../assets/logo.svg"; // ✅ import your logo

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser =
      getCurrentUser() || JSON.parse(sessionStorage.getItem("authUser") || "null");
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
      {/* Left side: Logo */}
      <div className="flex-1">
        <button onClick={goToHomepage} className="flex items-center gap-2">
        <img
          src={logo}
          alt="LIVErary logo"
          className="h-8 w-auto transition-all filter dark:invert"
        />
        </button>
      </div>

      {/* Right side: Menu */}
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
