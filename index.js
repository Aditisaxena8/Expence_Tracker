const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors"); // Import CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(err));

// Define Schema and Model
const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: String,
  notes: String,
});
const Expense = mongoose.model("expensecollections", expenseSchema);

// Routes
app.post("/add-expense", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send("Expense added");
  } catch (error) {
    res.status(500).send("Error adding expense");
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const { category, date } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (date) filter.date = date;
    const expenses = await Expense.find(filter);
    res.json(expenses);
  } catch (error) {
    res.status(500).send("Error fetching expenses");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});