const { connectDB, Reply } = require("../../lib/db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const { oldTrigger, newResponse } = req.body;
    const found = await Reply.findOne({ trigger: oldTrigger.toLowerCase().trim() });
    if (!found) return res.status(404).json({ message: "❌ Trigger not found" });

    found.responses = [newResponse];
    await found.save();
    return res.status(200).json({ message: `✅ Edited "${oldTrigger}" → "${newResponse}"` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
