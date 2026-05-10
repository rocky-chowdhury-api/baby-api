const { connectDB, Reply, Teacher } = require("../../lib/db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();
    const { trigger, responses, userID } = req.body;
    if (!trigger || !responses) return res.status(400).json({ error: "trigger and responses required" });

    const cleanTrigger = trigger.toLowerCase().trim();
    const responseArray = responses.split(",").map(r => r.trim()).filter(Boolean);

    let existing = await Reply.findOne({ trigger: cleanTrigger });
    if (existing) {
      existing.responses.push(...responseArray);
      await existing.save();
    } else {
      existing = await Reply.create({ trigger: cleanTrigger, responses: responseArray, teacherID: userID });
    }

    await Teacher.findOneAndUpdate({ userID }, { $inc: { count: responseArray.length } }, { upsert: true });

    return res.status(200).json({ message: `✅ Added to "${cleanTrigger}"`, count: existing.responses.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
