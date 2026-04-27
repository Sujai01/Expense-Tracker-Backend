const express = require("express");
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel // Match the controller name
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Professional tip: use '/' for the base routes and define actions in the controller
router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/download", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);

module.exports = router;