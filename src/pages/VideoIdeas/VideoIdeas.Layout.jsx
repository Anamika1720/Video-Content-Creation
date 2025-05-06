import React, { useState } from "react";
import styles from "./VideoIdeas.Styles";
import {
  getVideoContentQuery,
  queryGroq,
} from "../../services/groq/groq.service";
import { addDocToFB } from "../../services/firebase/firebase.service";
import { VIDEO_IDEA_COLLECTION } from "../../services/firebase/firebase.config";
import FloatingInput, {
  FloatingSelect,
} from "../../components/InputFields/FloatingInput";
import Header from "../../components/organism/Header";

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
  const [errors] = useState({});
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
      const contentPayload = {
        totalLengthInMinutes: minutes + seconds / 60,
        topic,
        tone,
      };
      const content = getVideoContentQuery(contentPayload);

      const groqQueryPayload = {
        content,
      };
      const groqResponse = await queryGroq(groqQueryPayload);

      if (groqResponse.choices) {
        setIdeas(groqResponse.choices[0].message.content);
      } else {
        throw new Error(groqResponse.error?.message || "Error from Groq API");
      }
    } catch (err) {
      console.log("Error: ", err);
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
      const newRecord = {
        title: topic,
        description: editableIdea,
        tags: "",
        status: "Draft",
        createdAt: new Date().toISOString(),
      };

      await addDocToFB(newRecord, VIDEO_IDEA_COLLECTION);

      setIsPublished(true);
      setPreview("");
      setTopic("");
      setEditableIdea("");
    } catch (err) {
      console.log("Error: ", err);
      setError("Failed to save content. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper(ideas)}>
        <h2 className={styles.title}>Generate Video Ideas with AI</h2>

        <div className={styles.layout(ideas)}>
          {/* Input Section */}
          <div className={styles.inputSection(ideas)}>
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

            <button onClick={handleGenerate} className={styles.generateBtn}>
              {loading ? "Generating..." : "Generate Ideas"}
            </button>

            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          {/* Idea Preview Section */}
          {ideas && (
            <div className={styles.ideaSection}>
              {!preview ? (
                <>
                  <h3 className={styles.ideaHeading}>Generated Ideas:</h3>
                  <p className={styles.ideaContent}>{ideas}</p>
                  <div className="mt-2">
                    <button
                      onClick={handlePreview}
                      className={styles.previewBtn}
                    >
                      Preview Ideas
                    </button>
                  </div>
                </>
              ) : !isPublished ? (
                <div className="space-y-4">
                  <h3 className={styles.ideaHeading}>Edit & Preview Idea:</h3>
                  <textarea
                    className={styles.textarea}
                    value={editableIdea}
                    onChange={(e) => setEditableIdea(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handlePublish}
                      className={styles.publishBtn}
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => setPreview("")}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.publishedWrapper}>
                  <h3 className={styles.publishedTitle}>Published Idea:</h3>
                  <p className={styles.ideaContent}>{editableIdea}</p>
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
