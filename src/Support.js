import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const BASE_URL =
  "https://azeezolabode.pythonanywhere.com/support/messages/";

const Support = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ✅ WRAPPED IN useCallback (fixes build error)
  const fetchMessages = useCallback(async () => {
    try {
      setError("");

      let res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // token expired
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
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshAccessToken, logout]);

  // ✅ SAFE SINGLE MESSAGE FETCH
  const fetchSingleMessage = async (id) => {
    try {
      let res = await fetch(`${BASE_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        res = await fetch(`${BASE_URL}${id}/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!res.ok) return;

      const data = await res.json();
      setSelectedMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED DEPENDENCY WARNING
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SEND MESSAGE
  const handleSubmit = async (e) => {
    e.preventDefault();

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

  if (loading) return <p>Loading support messages...</p>;

  return (
    <div>
      <h2>Support Chat</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
        <button type="submit">Send</button>
      </form>

      <div>
        <h3>All Messages</h3>

        {!Array.isArray(messages) || messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg?.id}
              style={{ marginTop: "10px", cursor: "pointer" }}
              onClick={() => fetchSingleMessage(msg.id)}
            >
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

      {selectedMessage && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc" }}>
          <h3>Message Details</h3>

          <p><strong>Name:</strong> {selectedMessage?.name}</p>
          <p><strong>Message:</strong> {selectedMessage?.message}</p>

          {selectedMessage?.reply ? (
            <p style={{ color: "green" }}>
              <strong>Admin Reply:</strong> {selectedMessage.reply}
            </p>
          ) : (
            <p>No reply yet</p>
          )}

          <button onClick={() => setSelectedMessage(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Support;