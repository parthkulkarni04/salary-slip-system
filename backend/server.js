// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/salary-slip-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Salary Slip Schema
const salarySlipSchema = new mongoose.Schema({
  employeeNumber: { type: String, required: true },
  daysWorked: { type: Number, required: true },
  basicPay: { type: Number, required: true },
  gradePay: { type: Number, required: true },
  dearnessAllowance: { type: Number, required: true },
  dearnessPay: { type: Number, required: true },
  hra: { type: Number, required: true },
  specialPay: { type: Number, required: true },
  otherAllowance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SalarySlip = mongoose.model('SalarySlip', salarySlipSchema);

// Routes
// Get all salary slips
app.get('/api/salary-slips', async (req, res) => {
  try {
    const slips = await SalarySlip.find().sort({ createdAt: -1 });
    res.json(slips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new salary slip
app.post('/api/salary-slips', async (req, res) => {
  const slip = new SalarySlip(req.body);
  try {
    const newSlip = await slip.save();
    res.status(201).json(newSlip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update salary slip
app.put('/api/salary-slips/:id', async (req, res) => {
  try {
    const updatedSlip = await SalarySlip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSlip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete salary slip
app.delete('/api/salary-slips/:id', async (req, res) => {
  try {
    await SalarySlip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salary slip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5015;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});