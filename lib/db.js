const mongoose = require("mongoose");

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
}

const replySchema = new mongoose.Schema({
  trigger: { type: String, required: true, unique: true, lowercase: true },
  responses: [String],
  teacherID: String,
});

const teacherSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  count: { type: Number, default: 0 },
});

const Reply = mongoose.models.Reply || mongoose.model("Reply", replySchema);
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

module.exports = { connectDB, Reply, Teacher };
