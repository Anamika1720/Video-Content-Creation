import React, { useEffect, useState } from "react";
import Header from "../../components/organism/Header";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ErrorIcon from "@mui/icons-material/Error";
import { toast } from "react-toastify";
import { getDocsData } from "../../services/firebase/firebase.service";
import {
  VIDEO_IDEA_COLLECTION,
  VIDEO_UPLOAD_COLLECTION,
} from "../../services/firebase/firebase.config";

import styles from "./WorkHistory.Styles";

const WorkHistory = () => {
  const [ideas, setIdeas] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [activeSection, setActiveSection] = useState("ideas");
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const list = await getDocsData(VIDEO_IDEA_COLLECTION);
        setIdeas(list);
      } catch {
        toast.error("Error fetching video ideas");
      } finally {
        setLoadingIdeas(false);
      }
    };

    const fetchUploads = async () => {
      try {
        const list = await getDocsData(VIDEO_UPLOAD_COLLECTION);
        setUploads(list);
      } catch {
        toast.error("Error fetching video uploads");
      } finally {
        setLoadingUploads(false);
      }
    };

    fetchIdeas();
    fetchUploads();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Published":
        return (
          <span className={styles.status.published}>
            <CheckCircleIcon fontSize="small" />
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className={styles.status.draft}>
            <HourglassBottomIcon fontSize="small" />
            {status}
          </span>
        );
      default:
        return (
          <span className={styles.status.error}>
            <ErrorIcon fontSize="small" />
            {status}
          </span>
        );
    }
  };

  const renderSection = (title, data, loading, icon) => (
    <div className={styles.sectionWrapper}>
      <h3 className={styles.sectionTitle}>
        {icon}
        {title}
      </h3>
      {loading ? (
        <p className={styles.loadingText}>Loading...</p>
      ) : data.length === 0 ? (
        <p className={styles.emptyText}>No {title.toLowerCase()} available.</p>
      ) : (
        <div className={styles.itemCard}>
          {data.map((item) => (
            <div key={item.id} className={styles.itemContainer}>
              <div className="flex-1">
                <h4 className={styles.itemTitle}>{item.title}</h4>
                <p className={styles.itemDescription}>
                  {expandedItems[item.id]
                    ? item.description
                    : `${item.description?.substring(0, 100)}...`}
                </p>
                {item.description?.length > 100 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={styles.readMoreButton}
                  >
                    {expandedItems[item.id] ? "Show Less" : "Read More"}
                  </button>
                )}
                {item.tags && <p className={styles.tags}>Tags: {item.tags}</p>}
              </div>
              <div className={styles.statusWrapper}>
                {renderStatus(item.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}> Work History</h2>

        <div className={styles.toggleButtonGroup}>
          <button
            className={styles.toggleButton(activeSection === "ideas")}
            onClick={() => setActiveSection("ideas")}
          >
            <LightbulbIcon fontSize="small" />
            Video Ideas
          </button>
          <button
            className={styles.toggleButton(activeSection === "uploads")}
            onClick={() => setActiveSection("uploads")}
          >
            <CloudUploadIcon fontSize="small" />
            Uploaded Videos
          </button>
        </div>

        {activeSection === "ideas"
          ? renderSection("Video Ideas", ideas, loadingIdeas, <LightbulbIcon />)
          : renderSection(
              "Uploaded Videos",
              uploads,
              loadingUploads,
              <CloudUploadIcon />
            )}
      </div>
    </>
  );
};

export default WorkHistory;
