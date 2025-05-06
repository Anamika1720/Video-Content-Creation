import React, { useState, useEffect } from "react";
import FloatingInput, {
  FloatingSelect,
} from "../../components/InputFields/FloatingInput";
import { toast } from "react-toastify";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PublishIcon from "@mui/icons-material/Publish";
import { uploadToYouTube } from "../../services/youtube/youtube.service";
import { VIDEO_UPLOAD_COLLECTION } from "../../services/firebase/firebase.config";
import { addDocToFB } from "../../services/firebase/firebase.service";
import { initGoogleAPI } from "../../services/google/google.service";

const SocialMediaPublisher = ({
  videoFile,
  title,
  setTitle,
  description,
  setDescription,
  onPublishSuccess,
}) => {
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const setupGoogleAPI = async () => {
      try {
        const client = await initGoogleAPI(setAccessToken);
        setTokenClient(client);
      } catch (error) {
        console.error("Failed to initialize Google API", error);
      }
    };
    setupGoogleAPI();
  }, []);

  useEffect(() => {
    if (accessToken) {
      uploadVideo();
    }
  }, [accessToken]);

  const handleSocialPublish = () => {
    if (!title.trim() || !description.trim() || !videoFile) {
      setUploadError("Title, description, and video are required.");
      return;
    }

    setUploading(true);
    setUploadError("");

    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      setUploadError("Google token client not initialized.");
      setUploading(false);
    }
  };

  const uploadVideo = async () => {
    try {
      const { success, error } = await uploadToYouTube(
        accessToken,
        videoFile,
        title,
        description
      );

      if (!success) throw new Error(error);

      toast.success("🎉 YouTube upload successful!");

      const uploadRecord = {
        title: title.trim(),
        description: description.trim(),
        status: "Published",
        createdAt: new Date().toISOString(),
      };

      const saved = await addDocToFB(uploadRecord, VIDEO_UPLOAD_COLLECTION);
      if (saved) onPublishSuccess();
      else setUploadError("Upload succeeded but failed to save metadata.");
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload to YouTube.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-4 space-y-4">
      <FloatingSelect
        label="Platform"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        options={["YouTube Shorts"]}
      />

      <FloatingInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FloatingInput
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSocialPublish}
        className={`flex items-center gap-2 px-4 py-2 rounded text-white font-semibold 
          ${uploading ? "bg-gray-400" : "bg-red-600 hover:bg-red-500"}`}
        disabled={uploading}
      >
        <PublishIcon />
        {uploading ? "Uploading..." : `Publish to `}
        <YouTubeIcon className="text-white" fontSize="small" />
      </button>

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
    </div>
  );
};

export default SocialMediaPublisher;
