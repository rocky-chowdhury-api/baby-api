const { connectDB, Reply } = require("../../lib/db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await connectDB();
    const userMessage = req.query.userMessage || "";
    const searchText = userMessage.replace(/^msg\s*/i, "").toLowerCase().trim();
    if (!searchText) return res.status(400).json({ error: "Search text required" });

    const found = await Reply.findOne({ trigger: searchText });
    if (!found || found.responses.length === 0) {
      return res.status(404).json({ message: "❌ Not found: " + searchText });
    }

    const list = found.responses.map((r, i) => `${i}: ${r}`).join("\n");
    return res.status(200).json({ message: `📋 "${searchText}":\n${list}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
