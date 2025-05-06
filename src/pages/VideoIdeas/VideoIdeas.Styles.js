const videoIdeaStyles = {
  wrapper: (hasIdeas) => `p-6 ${hasIdeas ? "max-w-6xl" : "max-w-lg"} mx-auto`,

  title: "text-2xl font-bold mb-4",

  layout: (hasIdeas) =>
    `flex gap-6 transition-all duration-500 ${
      hasIdeas ? "flex-row" : "flex-col"
    }`,

  inputSection: (hasIdeas) => `${hasIdeas ? "w-1/3" : "w-full"} space-y-4`,

  ideaSection: "w-full bg-gray-50 p-4 border rounded shadow-md",

  generateBtn:
    "bg-purple-800 text-white text-base px-4 py-3 rounded-md transition duration-300 hover:bg-white hover:text-purple-800 hover:border-purple-800 border border-transparent cursor-pointer",

  errorText: "text-red-500 text-sm",

  ideaHeading: "text-lg font-semibold mb-2",
  ideaContent: "whitespace-pre-wrap",

  previewBtn: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500",

  textarea:
    "w-full p-2 border rounded resize-none min-h-[120px] text-sm text-gray-800",

  publishBtn: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500",
  cancelBtn: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400",

  publishedWrapper: "space-y-4 bg-green-50 p-4 rounded border",
  publishedTitle: "text-lg font-semibold",
};

export default videoIdeaStyles;
