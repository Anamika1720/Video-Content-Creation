const workHistoryStyles = {
  container: "p-6 max-w-5xl mx-auto",
  heading: "text-3xl font-bold text-purple-900 mb-6",

  toggleButtonGroup: "flex gap-4 mb-6",
  toggleButton: (active) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-md transition ${
      active
        ? "bg-purple-700 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`,

  sectionWrapper: "mb-10",
  sectionTitle:
    "text-xl font-bold mb-4 flex items-center gap-2 text-purple-800",
  statusWrapper: "ml-4",

  loadingText: "text-gray-500",
  emptyText: "text-gray-500",

  itemCard: "bg-white border rounded-lg divide-y shadow-sm",
  itemContainer: "p-4 flex justify-between items-start",
  itemTitle: "font-semibold text-lg",
  itemDescription: "text-sm text-gray-600",
  readMoreButton: "text-purple-700 text-sm mt-1 underline cursor-pointer",
  tags: "text-xs mt-2 text-purple-600",

  status: {
    published:
      "flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-sm",
    draft:
      "flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-sm",
    error:
      "flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-sm",
  },
};

export default workHistoryStyles;
