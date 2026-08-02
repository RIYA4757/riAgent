"use client";

import { useState, useRef } from "react";
// import { Agent, OpenAIProvider } from "@/sdk";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(crypto.randomUUID());
  useState(() => crypto.randomUUID())
  async function askAgent() {
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          sessionId: sessionId.current,
          }),
      });

      const data = await response.json();

      setAnswer(data.output);
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto mt-20 p-6">
      <h1 className="text-4xl font-bold mb-6">
        RiAgent SDK Playground
      </h1>

      <textarea
        className="border w-full p-4 rounded"
        rows={6}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
      />

      <button
        onClick={askAgent}
        className="bg-black text-white px-5 py-3 rounded mt-4"
      >
        {loading ? "Thinking..." : "Run Agent"}
      </button>

      <div className="mt-8 border rounded p-4 whitespace-pre-wrap">
        {answer}
      </div>
    </main>
  );
}