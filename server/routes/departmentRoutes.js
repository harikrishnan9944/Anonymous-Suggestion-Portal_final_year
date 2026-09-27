const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('./authRoutes');
const memoryStore = require('../store/memoryStore');
const DepartmentModel = require('../models/Department');
const { getIsConnected } = require('../config/db');

// Get all departments
router.get('/', async (req, res) => {
  try {
    let items = [];
    if (getIsConnected()) {
      items = await DepartmentModel.find().sort({ name: 1 });
    }
    if (!items.length) {
      items = memoryStore.getDepartments();
    }
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching departments.' });
  }
});

// Add department
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, description, headName } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Department name required.' });

    let newDept = null;
    if (getIsConnected()) {
      newDept = await DepartmentModel.create({ name, description, headName });
    } else {
      newDept = memoryStore.addDepartment({ name, description, headName });
    }

    res.status(201).json({ success: true, data: newDept });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error adding department.' });
  }
});

// Update department
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, headName, active } = req.body;
    let updated = null;

    if (getIsConnected()) {
      updated = await DepartmentModel.findByIdAndUpdate(id, { name, description, headName, active }, { new: true });
    }
    if (!updated) {
      updated = memoryStore.updateDepartment(id, { name, description, headName, active });
    }

    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error updating department.' });
  }
});

// Delete department
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await DepartmentModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }
    if (!deleted) {
      deleted = memoryStore.deleteDepartment(id);
    }

    res.json({ success: true, message: 'Department deleted.' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error deleting department.' });
  }
});

module.exports = router;
