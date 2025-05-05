import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/organism/Header";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center pt-10">
        <h1 className="text-3xl font-semibold text-purple-800 mb-8">
          Welcome to Your Dashboard
        </h1>

        <div className="grid gap-6 w-full max-w-md px-4">
          <button
            onClick={() => navigate("/video-idea")}
            className="flex items-center justify-center gap-3 bg-purple-700 text-white text-lg px-6 py-4 rounded-xl shadow-md hover:bg-white hover:text-purple-700 border border-purple-700 transition-all duration-300"
          >
            <LightbulbIcon />
            Video Idea Generator
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="flex items-center justify-center gap-3 bg-purple-700 text-white text-lg px-6 py-4 rounded-xl shadow-md hover:bg-white hover:text-purple-700 border border-purple-700 transition-all duration-300"
          >
            <CloudUploadIcon />
            Video Upload
          </button>

          <button
            onClick={() => navigate("/content-dashboard")}
            className="flex items-center justify-center gap-3 bg-purple-700 text-white text-lg px-6 py-4 rounded-xl shadow-md hover:bg-white hover:text-purple-700 border border-purple-700 transition-all duration-300"
          >
            <DashboardCustomizeIcon />
            Content Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
