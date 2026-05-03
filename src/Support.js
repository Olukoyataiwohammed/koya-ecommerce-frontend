import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const BASE_URL =
  "https://azeezolabode.pythonanywhere.com/support/messages/";

const Support = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // -----------------------------
  // FETCH MESSAGES
  // -----------------------------
  const fetchMessages = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError("");

    try {
      let res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        res = await fetch(BASE_URL, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!res.ok) {
        setMessages([]);
        setError("Failed to load messages");
        return;
      }

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshAccessToken, logout]);

  // -----------------------------
  // LOAD ON LOGIN
  // -----------------------------
  useEffect(() => {
    if (!accessToken) return;

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [accessToken, fetchMessages]);

  // -----------------------------
  // FORM CHANGE
  // -----------------------------
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // -----------------------------
  // SUBMIT MESSAGE
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError("You must be logged in to send a message.");
      return;
    }

    try {
      let res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        res = await fetch(BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        setError("Failed to send message");
        return;
      }

      setForm({ name: "", email: "", message: "" });
      fetchMessages();
    } catch (err) {
      setError("Network error while sending message");
    }
  };

  // -----------------------------
  // 🚨 BLOCK UNLOGGED USERS
  // -----------------------------
  if (!accessToken) {
    return (
      <div>
        <h2>Support Chat</h2>
        <p style={{ color: "red" }}>
          You must be logged in to use support.
        </p>
      </div>
    );
  }

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) return <p>Loading support messages...</p>;

  return (
    <div>
      <h2>Support Chat</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          required
        />

        <button type="submit">Send</button>
      </form>

      {/* MESSAGES */}
      <div>
        <h3>All Messages</h3>

        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg?.id} style={{ marginTop: "10px" }}>
              <p><strong>You:</strong> {msg?.message}</p>

              {msg?.reply && (
                <p style={{ color: "green" }}>
                  <strong>Admin:</strong> {msg.reply}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Support;