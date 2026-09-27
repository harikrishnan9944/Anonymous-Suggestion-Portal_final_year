const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

let UserModel;
try {
  UserModel = mongoose.model('User');
} catch (e) {
  UserModel = mongoose.model('User', userSchema);
}

module.exports = UserModel;
