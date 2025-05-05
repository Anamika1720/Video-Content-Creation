import React from "react";

const Spinner = ({
  text = "Loading...",
  spinnerColor = "#ffffff",
  overlayColor = "rgba(0, 0, 0, 0.4)",
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: overlayColor }}
    >
      {/* Spinner */}
      <div
        className="w-16 h-16 border-4 border-t-transparent border-solid rounded-full animate-spin mb-4"
        style={{
          borderColor: `${spinnerColor}`,
          borderTopColor: "transparent",
        }}
      />
      {/* Text */}
      <p className="text-white text-lg font-medium">{text}</p>
    </div>
  );
};

export default Spinner;
