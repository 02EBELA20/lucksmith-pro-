"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE as string, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("Message sent!");
        form.reset();
      } else {
        setStatus("Error sending message");
      }
    } catch {
      setStatus("Error sending message");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className="w-full border border-gray-400 p-2 rounded text-black placeholder-gray-500 bg-white"
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className="w-full border border-gray-400 p-2 rounded text-black placeholder-gray-500 bg-white"
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        className="w-full border border-gray-400 p-2 rounded text-black placeholder-gray-500 bg-white"
      ></textarea>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow">
        Send
      </button>
      {status && <p className="text-sm">{status}</p>}
    </form>
  );
}
