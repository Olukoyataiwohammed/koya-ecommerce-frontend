import React, { useEffect, useState } from "react";

const BASE_URL =
  "https://azeezolabode.pythonanywhere.com/support/messages/";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 📥 SAFE FETCH ALL MESSAGES
  const fetchMessages = async () => {
    try {
      setError("");

      const res = await fetch(BASE_URL);

      if (!res.ok) {
        setMessages([]);
        setError("Failed to load messages");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // ✅ always ensure array
      setMessages(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error(err);
      setMessages([]);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // 📥 SAFE SINGLE MESSAGE
  const fetchSingleMessage = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}${id}/`);

      if (!res.ok) return;

      const data = await res.json();
      setSelectedMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✍️ INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 SAFE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Failed to send message");
        return;
      }

      setForm({ name: "", email: "", message: "" });
      fetchMessages();
    } catch (err) {
      console.error(err);
      setError("Network error while sending message");
    }
  };

  // ⏳ LOADING STATE
  if (loading) return <p>Loading support messages...</p>;

  return (
    <div>
      <h2>Support Chat</h2>

      {/* ⚠️ ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📝 FORM */}
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

      {/* 💬 MESSAGE LIST */}
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
              <p>
                <strong>You:</strong> {msg?.message}
              </p>

              {msg?.reply && (
                <p style={{ color: "green" }}>
                  <strong>Admin:</strong> {msg.reply}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🔍 SINGLE MESSAGE */}
      {selectedMessage && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc" }}>
          <h3>Message Details</h3>

          <p>
            <strong>Name:</strong> {selectedMessage?.name}
          </p>
          <p>
            <strong>Message:</strong> {selectedMessage?.message}
          </p>

          {selectedMessage?.reply ? (
            <p style={{ color: "green" }}>
              <strong>Admin Reply:</strong> {selectedMessage.reply}
            </p>
          ) : (
            <p>No reply yet</p>
          )}

          <button onClick={() => setSelectedMessage(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Support;