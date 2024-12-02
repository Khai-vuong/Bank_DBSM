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
router.get("/savings/:number", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, sac.*, c.*
			FROM account ac
			JOIN savingsaccount sac
			ON ac.AccountCode = sac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
			WHERE ac.AccountCode = ?
		`;

		const [rows] = await pool.query(sql, [req.params.number]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single account
router.get("/checking/:code", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, cac.*, c.*
			FROM account ac
			JOIN checkingaccount cac
			ON ac.AccountCode = cac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
			WHERE ac.AccountCode = ?
		`;

		const [rows] = await pool.query(sql, [req.params.code]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single account
router.get("/loan/:number", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, lac.*, c.*
			FROM account ac
			JOIN loanaccount lac
			ON ac.AccountCode = lac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
			WHERE ac.AccountCode = ?
		`;

		const [rows] = await pool.query(sql, [req.params.number]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json(rows);
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
