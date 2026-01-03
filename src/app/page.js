"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function createPaste() {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create paste");
      return;
    }

    setResultUrl(data.url);
    setContent("");
    setTtl("");
    setViews("");
  }

  return (
    <main style={styles.container}>
      <h1>Pastebin Lite</h1>

      {/* HOW TO USE SECTION */}
      <section style={styles.card}>
        <h2>How to use this app</h2>
        <ol>
          <li>Enter the text you want to share.</li>
          <li>
            (Optional) Set <strong>TTL</strong> — time in seconds before the paste expires.
          </li>
          <li>
            (Optional) Set <strong>Max Views</strong> — number of times the paste can be viewed.
          </li>
          <li>Click <strong>Create Paste</strong>.</li>
          <li>Share the generated link.</li>
        </ol>
        <p style={styles.note}>
          ⚠️ Once the view limit is reached or TTL expires, the paste will no longer be accessible.
        </p>
      </section>

      {/* CREATE PASTE */}
      <section style={styles.card}>
        <h2>Create a Paste</h2>

        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.row}>
          <input
            type="number"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Max Views"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            style={styles.input}
          />
        </div>

        <button onClick={createPaste} style={styles.button}>
          Create Paste
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {resultUrl && (
          <p>
            ✅ Paste created:<br />
            <a href={resultUrl} target="_blank">{resultUrl}</a>
          </p>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },
  textarea: {
    width: "100%",
    height: "180px",
    padding: "10px",
    fontSize: "14px",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  note: {
    fontSize: "13px",
    color: "#555",
  },
};
