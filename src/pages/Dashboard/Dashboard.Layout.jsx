import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/organism/Header";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import styles from "./Dashboard.Styles";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Welcome to Your Dashboard</h1>

        <div className={styles.buttonGroup}>
          <button
            onClick={() => navigate("/video-idea")}
            className={styles.button}
          >
            <LightbulbIcon />
            Video Idea Generator
          </button>

          <button onClick={() => navigate("/upload")} className={styles.button}>
            <CloudUploadIcon />
            Video Upload
          </button>

          <button
            onClick={() => navigate("/history")}
            className={styles.button}
          >
            <DashboardCustomizeIcon />
            Work History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
