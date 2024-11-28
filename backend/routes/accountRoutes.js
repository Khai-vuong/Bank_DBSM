/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all accounts
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Account");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single account
router.get("/:number", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Account WHERE AccountNumber = ?",
			[req.params.number],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new account
router.post("/", async (req, res) => {
	const { AccountNumber, CustomerCode, AccountType } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO Account (AccountNumber, CustomerCode, AccountType) VALUES (?, ?, ?)",
			[AccountNumber, CustomerCode, AccountType],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an account
router.put("/:number", async (req, res) => {
	const { CustomerCode, AccountType } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Account SET CustomerCode = ?, AccountType = ? WHERE AccountNumber = ?",
			[CustomerCode, AccountType, req.params.number],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json({ message: "Account updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete an account
router.delete("/:number", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM Account WHERE AccountNumber = ?",
			[req.params.number],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json({ message: "Account deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
