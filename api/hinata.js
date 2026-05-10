const { connectDB, Reply } = require("../lib/db");

const fallbackReplies = [
  "হুম বলো 🥺", "কি হয়েছে? 😊", "আমি শুনছি 🌸",
  "বুঝলাম না একটু বলবে? 🤔", "হ্যাঁ বলো baby 💕",
  "okay okay 😄", "সত্যিই? 😮", "আচ্ছা 🙂",
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const cleanText = text.toLowerCase().trim();
    const found = await Reply.findOne({ trigger: cleanText });

    if (found && found.responses.length > 0) {
      const reply = found.responses[Math.floor(Math.random() * found.responses.length)];
      return res.status(200).json({ message: reply });
    }

    const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res.status(200).json({ message: fallback });

  } catch (err) {
    return res.status(500).json({ message: "error baby🥹" });
  }
};
