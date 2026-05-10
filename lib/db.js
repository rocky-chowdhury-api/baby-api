const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
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
