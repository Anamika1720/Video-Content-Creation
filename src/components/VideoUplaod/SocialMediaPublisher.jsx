import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import FloatingInput, {
  FloatingSelect,
} from "../VideoIdeaGenerator/FloatingInput";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PublishIcon from "@mui/icons-material/Publish";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES;

const SocialMediaPublisher = ({
  videoFile,
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  onPublishSuccess,
}) => {
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({ clientId: CLIENT_ID, scope: SCOPES });
    });
  }, []);

  const handleSocialPublish = async () => {
    if (!title || !description || !videoFile) {
      setUploadError("Title, description, and video are required.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      await gapi.auth2.getAuthInstance().signIn();

      const fileMetadata = {
        snippet: {
          title,
          description,
          tags: tags.split(",").map((t) => t.trim()),
        },
        status: {
          privacyStatus: "public",
        },
      };

      const accessToken = gapi.auth.getToken().access_token;

      const form = new FormData();
      form.append(
        "snippet",
        new Blob([JSON.stringify(fileMetadata)], { type: "application/json" })
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

      alert("🎉 YouTube upload successful!");
      await addDoc(collection(db, "video-upload"), {
        title,
        description,
        tags,
        status: "Published",
        createdAt: new Date().toISOString(),
      });
      onPublishSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("❌ Failed to upload to YouTube.");
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
      <FloatingInput
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
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
