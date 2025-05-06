import React from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <button
        className="flex items-center gap-2 text-purple-800 font-medium px-4 py-2 rounded hover:bg-purple-100 transition"
        onClick={() => navigate("/")}
      >
        <HomeIcon />
        Home
      </button>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-purple-800 font-medium px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          <DashboardCustomizeIcon />
          Work History
        </button>

        <button
          className="flex items-center gap-2 text-red-600 font-medium px-4 py-2 rounded hover:bg-red-100 transition"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
