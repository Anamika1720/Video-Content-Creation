import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Header from "../../components/organism/Header";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ErrorIcon from "@mui/icons-material/Error";

const ContentDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [activeSection, setActiveSection] = useState("ideas");
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "video-idea"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIdeas(list);
      } catch (e) {
        console.error("Error fetching video ideas:", e);
      } finally {
        setLoadingIdeas(false);
      }
    };

    const fetchUploads = async () => {
      try {
        const snapshot = await getDocs(collection(db, "video-upload"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUploads(list);
      } catch (e) {
        console.error("Error fetching video uploads:", e);
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
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-sm">
            <CheckCircleIcon fontSize="small" />
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-sm">
            <HourglassBottomIcon fontSize="small" />
            {status}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-sm">
            <ErrorIcon fontSize="small" />
            {status}
          </span>
        );
    }
  };

  const renderSection = (title, data, loading, icon) => (
    <div className="mb-10">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-800">
        {icon}
        {title}
      </h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} available.</p>
      ) : (
        <div className="bg-white border rounded-lg divide-y shadow-sm">
          {data.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-sm text-gray-600">
                  {expandedItems[item.id]
                    ? item.description
                    : `${item.description?.substring(0, 100)}...`}
                </p>
                {item.description?.length > 100 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-purple-700 text-sm mt-1 underline cursor-pointer"
                  >
                    {expandedItems[item.id] ? "Show Less" : "Read More"}
                  </button>
                )}
                {item.tags && (
                  <p className="text-xs mt-2 text-purple-600">
                    Tags: {item.tags}
                  </p>
                )}
              </div>
              <div className="ml-4">{renderStatus(item.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-900 mb-6">
          📊 Content Dashboard
        </h2>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-md transition ${
              activeSection === "ideas"
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSection("ideas")}
          >
            <LightbulbIcon fontSize="small" />
            Video Ideas
          </button>
          <button
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-md transition ${
              activeSection === "uploads"
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveSection("uploads")}
          >
            <CloudUploadIcon fontSize="small" />
            Uploaded Videos
          </button>
        </div>

        {/* Conditional Section Render */}
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

export default ContentDashboard;
