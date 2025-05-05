import React, { useState } from "react";
import VideoUploader from "./VideoUploader";
import SocialMediaPublisher from "./SocialMediaPublisher";
import Header from "../organism/Header";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const VideoUploadPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileSelect = (file) => {
    setVideoFile(file);
    setIsPublished(false);
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <VideoLibraryIcon className="text-blue-600" />
          Upload and Publish Video
        </div>

        <VideoUploader onSelect={handleFileSelect} />

        {videoFile && !isPublished && (
          <>
            <VideoPreview videoFile={videoFile} />
            <SocialMediaPublisher
              videoFile={videoFile}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              onPublishSuccess={() => setIsPublished(true)}
            />
          </>
        )}

        {isPublished && (
          <p className="text-green-600 font-semibold mt-4">
            Video successfully published!
          </p>
        )}
      </div>
    </>
  );
};

const VideoPreview = React.memo(({ videoFile }) => {
  return (
    <video
      controls
      src={URL.createObjectURL(videoFile)}
      className="w-full rounded border mt-4 shadow"
    />
  );
});

export default VideoUploadPage;
