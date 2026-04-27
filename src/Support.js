import React, { useEffect, useState } from "react";

const API_URL = "https://koya-e-commerce-backend-production.up.railway.app/support/messages/";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  
  const fetchMessages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // 🔄 Auto refresh every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Send message
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setForm({ name: "", email: "", message: "" });

      fetchMessages(); // refresh messages
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <h2>Support Chat</h2>

      {/* 📝 Form */}
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

      {/* 💬 Messages */}
      <div>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginTop: "10px" }}>
            <p><strong>You:</strong> {msg.message}</p>

            {msg.reply && (
              <p style={{ color: "green" }}>
                <strong>Admin:</strong> {msg.reply}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;