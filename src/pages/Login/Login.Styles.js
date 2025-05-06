const otpLoginStyles = {
  wrapper:
    "flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white",
  card: "bg-white p-8 rounded-xl shadow-xl w-full max-w-md",
  title: "text-2xl font-semibold text-center text-purple-800 mb-6",

  label: (isActive) =>
    `absolute left-10 text-sm text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none ${
      isActive
        ? "top-[-10px] text-xs text-purple-800"
        : "top-1/2 -translate-y-1/2"
    }`,

  icon: "absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500",

  input: (hasError) =>
    `w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-purple-300"
    }`,

  errorText: "mt-1 text-xs text-red-500",

  button:
    "w-full flex items-center justify-center gap-2 bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900 transition duration-300",

  recaptcha: "mt-4",

  successMessage: "mt-4 text-green-600 font-medium text-center",
};

export default otpLoginStyles;
