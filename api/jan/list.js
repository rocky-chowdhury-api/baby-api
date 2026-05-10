const { connectDB, Reply, Teacher } = require("../../lib/db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await connectDB();
    const url = req.url || "";

    if (url.includes("/all")) {
      const teachers = await Teacher.find().sort({ count: -1 }).limit(100);
      const data = {};
      teachers.forEach(t => { data[t.userID] = t.count; });
      return res.status(200).json({ data });
    }

    const total = await Reply.countDocuments();
    const triggers = await Reply.find().select("trigger responses").limit(20);
    const list = triggers.map(t => `• ${t.trigger} (${t.responses.length} replies)`).join("\n");
    return res.status(200).json({ message: `📚 Total: ${total}\n\n${list}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
