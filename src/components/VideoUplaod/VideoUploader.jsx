import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VideoUploader = ({ onSelect }) => {
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    onSelect(file);
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
        <p className="mt-2 text-sm text-green-700 font-medium">
          🎥 Selected: {videoFile.name}
        </p>
      )}
    </div>
  );
};

export default VideoUploader;
