import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import FloatingInput, {
  FloatingSelect,
} from "../VideoIdeaGenerator/FloatingInput";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PublishIcon from "@mui/icons-material/Publish";
import { toast } from "react-toastify";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

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
    const loadGapiAndInit = async () => {
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
          ],
        });

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            gapi.client.setToken(tokenResponse);
            setAccessToken(tokenResponse.access_token);
          },
        });

        setTokenClient(client);
      });
    };

    loadGapiAndInit();
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
      const fileMetadata = {
        snippet: {
          title: title.trim(),
          description: description.trim(),
        },
        status: {
          privacyStatus: "public",
        },
      };

      const form = new FormData();
      form.append(
        "snippet",
        new Blob([JSON.stringify(fileMetadata)], {
          type: "application/json",
        })
      );
      form.append("video", videoFile);

      const res = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        }
      );

      const resultText = await res.text();
      if (!res.ok) throw new Error(resultText);

      toast.success("🎉 YouTube upload successful!");
      await addDoc(collection(db, "video-upload"), {
        title: title.trim(),
        description: description.trim(),
        status: "Published",
        createdAt: new Date().toISOString(),
      });
      onPublishSuccess();
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
