const { connectDB, Reply } = require("../../lib/db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const { trigger, index } = req.body;
    const found = await Reply.findOne({ trigger: trigger.toLowerCase().trim() });
    if (!found) return res.status(404).json({ message: "❌ Trigger not found" });

    found.responses.splice(index, 1);
    if (found.responses.length === 0) {
      await Reply.deleteOne({ _id: found._id });
      return res.status(200).json({ message: `✅ "${trigger}" deleted` });
    }
    await found.save();
    return res.status(200).json({ message: `✅ Removed index ${index} from "${trigger}"` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
