/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all branch phones
router.get("/branch-phones", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM BranchPhone");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all branch faxes
router.get("/branch-faxes", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM BranchFax");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all employee phones
router.get("/employee-phones", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM EmployeePhone");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Add a branch phone
router.post("/branch-phones", async (req, res) => {
	const { BranchName, PhoneNumber } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO BranchPhone (BranchName, PhoneNumber) VALUES (?, ?)",
			[BranchName, PhoneNumber],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Add a branch fax
router.post("/branch-faxes", async (req, res) => {
	const { BranchName, FaxNumber } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO BranchFax (BranchName, FaxNumber) VALUES (?, ?)",
			[BranchName, FaxNumber],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Add an employee phone
router.post("/employee-phones", async (req, res) => {
	const { EmployeeCode, PhoneNumber } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO EmployeePhone (EmployeeCode, PhoneNumber) VALUES (?, ?)",
			[EmployeeCode, PhoneNumber],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a branch phone
router.delete("/branch-phones/:branchName/:phoneNumber", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM BranchPhone WHERE BranchName = ? AND PhoneNumber = ?",
			[req.params.branchName, req.params.phoneNumber],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Branch phone not found" });
		}
		res.json({ message: "Branch phone deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a branch fax
router.delete("/branch-faxes/:branchName/:faxNumber", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM BranchFax WHERE BranchName = ? AND FaxNumber = ?",
			[req.params.branchName, req.params.faxNumber],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Branch fax not found" });
		}
		res.json({ message: "Branch fax deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete an employee phone
router.delete(
	"/employee-phones/:employeeCode/:phoneNumber",
	async (req, res) => {
		try {
			const [result] = await pool.query(
				"DELETE FROM EmployeePhone WHERE EmployeeCode = ? AND PhoneNumber = ?",
				[req.params.employeeCode, req.params.phoneNumber],
			);
			if (result.affectedRows === 0) {
				return res.status(404).json({ message: "Employee phone not found" });
			}
			res.json({ message: "Employee phone deleted successfully" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
);

export default router;
