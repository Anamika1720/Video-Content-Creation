import React from "react";

const FloatingInput = ({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  active,
  type = "text",
  error,
}) => {
  return (
    <div
      className="relative w-full"
      style={{ marginBottom: error ? "40px" : "20px" }}
    >
      <label
        className={`absolute left-3 text-[14px] text-[#777] bg-white px-1 transition-all pointer-events-none
          ${
            active || value
              ? "top-[-10px] text-xs text-purple-800"
              : "top-1/2 -translate-y-1/2 opacity-70"
          }
        `}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full h-[45px] px-3 py-2 rounded-md text-sm border
          ${error ? "border-red-500" : "border-[#ccc]"}
          focus:border-purple-800 focus:shadow-[0_0_5px_rgba(106,27,154,0.5)]`}
      />
      {error && (
        <p className="absolute bottom-[-18px] left-0 text-red-500 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;

export const FloatingSelect = ({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  active,
  options = [],
  error,
}) => {
  return (
    <div
      className="relative w-full"
      style={{ marginBottom: error ? "40px" : "20px" }}
    >
      <label
        className={`absolute left-3 text-[14px] text-[#777] bg-white px-1 transition-all pointer-events-none
          ${
            active || value
              ? "top-[-10px] text-xs text-purple-800"
              : "top-1/2 -translate-y-1/2 opacity-70"
          }
        `}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full h-[45px] px-3 py-2 rounded-md text-sm border bg-white
          ${error ? "border-red-500" : "border-[#ccc]"}
          focus:border-purple-800 focus:shadow-[0_0_5px_rgba(106,27,154,0.5)]`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="absolute bottom-[-18px] left-0 text-red-500 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};
