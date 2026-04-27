import React, { useEffect, useState } from "react";

const BASE_URL =
  "https://koya-e-commerce-backend-production.up.railway.app/support/messages/";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // 📥 Fetch all messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // 📥 Fetch single message (NEW FEATURE)
  const fetchSingleMessage = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}${id}/`);
      const data = await res.json();
      setSelectedMessage(data);
    } catch (err) {
      console.error("Error fetching single message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✍️ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📤 Send message
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setForm({ name: "", email: "", message: "" });
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <h2>Support Chat</h2>

      {/* 📝 FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>

      {/* 💬 MESSAGE LIST */}
      <div>
        <h3>All Messages</h3>

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ marginTop: "10px", cursor: "pointer" }}
            onClick={() => fetchSingleMessage(msg.id)}
          >
            <p>
              <strong>You:</strong> {msg.message}
            </p>

            {msg.reply && (
              <p style={{ color: "green" }}>
                <strong>Admin:</strong> {msg.reply}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 🔍 SINGLE MESSAGE VIEW */}
      {selectedMessage && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc" }}>
          <h3>Message Details</h3>

          <p>
            <strong>Name:</strong> {selectedMessage.name}
          </p>
          <p>
            <strong>Message:</strong> {selectedMessage.message}
          </p>

          {selectedMessage.reply ? (
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