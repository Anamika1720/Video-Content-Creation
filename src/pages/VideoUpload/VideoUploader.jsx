import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const VideoUploader = ({ onSelect, onCancel }) => {
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      if (duration > 60) {
        toast.error("Please upload a video that is 60 seconds or less.");
        setVideoFile(null);
        onSelect(null);
      } else {
        setVideoFile(file);
        onSelect(file);
      }
    };

    video.src = URL.createObjectURL(file);
  };

  const handleCancel = () => {
    setVideoFile(null);
    onSelect(null);
    if (onCancel) onCancel();
  };

  return (
    <div className="mt-4">
      <label className="block font-semibold mb-2 text-gray-700">
        Upload Video
      </label>
      <div className="flex items-center gap-2">
        <CloudUploadIcon className="text-blue-500" />
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      {videoFile && (
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-green-700 font-medium">
            Selected: {videoFile.name}
          </p>
          <button
            onClick={handleCancel}
            className="text-red-600 text-sm font-semibold"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
