export const uploadToYouTube = async (
  accessToken,
  videoFile,
  title,
  description
) => {
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

    return { success: true, response: resultText };
  } catch (err) {
    console.error("YouTube Upload Error:", err);
    return { success: false, error: err.message || "Upload failed." };
  }
};
