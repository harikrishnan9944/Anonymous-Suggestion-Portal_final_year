const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#4f46e5' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

let CategoryModel;
try {
  CategoryModel = mongoose.model('Category');
} catch (e) {
  CategoryModel = mongoose.model('Category', categorySchema);
}

module.exports = CategoryModel;
