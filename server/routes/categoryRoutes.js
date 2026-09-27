const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('./authRoutes');
const memoryStore = require('../store/memoryStore');
const CategoryModel = require('../models/Category');
const { getIsConnected } = require('../config/db');

// Get all categories
router.get('/', async (req, res) => {
  try {
    let items = [];
    if (getIsConnected()) {
      items = await CategoryModel.find().sort({ name: 1 });
    }
    if (!items.length) {
      items = memoryStore.getCategories();
    }
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching categories.' });
  }
});

// Add category
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name required.' });

    let newCat = null;
    if (getIsConnected()) {
      newCat = await CategoryModel.create({ name, description, color });
    } else {
      newCat = memoryStore.addCategory({ name, description, color });
    }

    res.status(201).json({ success: true, data: newCat });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error adding category.' });
  }
});

// Update category
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, active } = req.body;
    let updated = null;

    if (getIsConnected()) {
      updated = await CategoryModel.findByIdAndUpdate(id, { name, description, color, active }, { new: true });
    }
    if (!updated) {
      updated = memoryStore.updateCategory(id, { name, description, color, active });
    }

    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error updating category.' });
  }
});

// Delete category
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (getIsConnected()) {
      const res = await CategoryModel.findByIdAndDelete(id);
      if (res) deleted = true;
    }
    if (!deleted) {
      deleted = memoryStore.deleteCategory(id);
    }

    res.json({ success: true, message: 'Category deleted.' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error deleting category.' });
  }
});

module.exports = router;
