const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  headName: { type: String, default: 'Head of Department' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

let DepartmentModel;
try {
  DepartmentModel = mongoose.model('Department');
} catch (e) {
  DepartmentModel = mongoose.model('Department', departmentSchema);
}

module.exports = DepartmentModel;
