import React, { useState } from "react";
import FloatingInput, { FloatingSelect } from "./FloatingInput";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Header from "../organism/Header";

const VideoIdeaGenerator = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Informative");
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [ideas, setIdeas] = useState("");
  const [topicActive, setTopicActive] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const [minutesActive, setMinutesActive] = useState(false);
  const [secondsActive, setSecondsActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editableIdea, setEditableIdea] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      setError("Please enter a topic.");
      return;
    }

    setError("");
    setIdeas("");
    setPreview("");
    setLoading(true);

    try {
      const totalLengthInMinutes = minutes + seconds / 60;
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "user",
                content: `Give me 1 short and concise video content idea for the topic "${topic}" in a "${tone}" tone, around ${totalLengthInMinutes} minutes long.`,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      if (data.choices) {
        setIdeas(data.choices[0].message.content);
      } else {
        throw new Error(data.error?.message || "Error from Groq API");
      }
    } catch (err) {
      setError("Failed to fetch ideas.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreview(ideas);
    setEditableIdea(ideas);
  };

  const handlePublish = async () => {
    try {
      await addDoc(collection(db, "video-idea"), {
        title: topic,
        description: editableIdea,
        tags: "",
        status: "Draft",
        createdAt: new Date().toISOString(),
      });
      setIsPublished(true);
      setPreview("");
      setTopic("");
      setEditableIdea("");
    } catch (error) {
      setError("Failed to save content. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className={`p-6 ${ideas ? "max-w-6xl" : "max-w-lg"} mx-auto`}>
        <h2 className="text-2xl font-bold mb-4">
          Generate Video Ideas with AI
        </h2>

        <div
          className={`flex gap-6 transition-all duration-500 ${
            ideas ? "flex-row" : "flex-col"
          }`}
        >
          {/* Input Section */}
          <div className={`${ideas ? "w-1/3" : "w-full"} space-y-4`}>
            <FloatingInput
              label="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setTopicActive(true)}
              onBlur={() => setTopicActive(topic !== "")}
              active={topicActive}
              error={errors.topic}
            />

            <FloatingSelect
              label="Select tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              onFocus={() => setToneActive(true)}
              onBlur={() => setToneActive(tone !== "")}
              active={toneActive}
              options={["Informative", "Humorous", "Inspirational"]}
              error={errors.tone}
            />

            <div className="flex gap-4">
              <div className="w-1/2">
                <FloatingInput
                  label="Minutes"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  onFocus={() => setMinutesActive(true)}
                  onBlur={() => setMinutesActive(minutes !== "")}
                  active={minutesActive}
                  error={errors.minutes}
                />
              </div>
              <div className="w-1/2">
                <FloatingInput
                  label="Seconds"
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  onFocus={() => setSecondsActive(true)}
                  onBlur={() => setSecondsActive(seconds !== "")}
                  active={secondsActive}
                  error={errors.seconds}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className=" bg-purple-800 text-white text-base px-4 py-3 rounded-md transition duration-300 hover:bg-white hover:text-purple-800 hover:border-purple-800 border border-transparent cursor-pointer"
            >
              {loading ? "Generating..." : "Generate Ideas"}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Idea Preview Section */}
          {ideas && (
            <div className="w-full bg-gray-50 p-4 border rounded shadow-md">
              {!preview ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Generated Ideas:
                  </h3>
                  <p className="whitespace-pre-wrap">{ideas}</p>
                  <div className="mt-2">
                    <button
                      onClick={handlePreview}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                      Preview Ideas
                    </button>
                  </div>
                </>
              ) : !isPublished ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Edit & Preview Idea:
                  </h3>
                  <textarea
                    className="w-full p-2 border rounded resize-none min-h-[120px]"
                    value={editableIdea}
                    onChange={(e) => setEditableIdea(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handlePublish}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => setPreview("")}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-green-50 p-4 rounded border">
                  <h3 className="text-lg font-semibold">Published Idea:</h3>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {editableIdea}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoIdeaGenerator;
