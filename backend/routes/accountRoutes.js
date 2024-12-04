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

// Get all savings accounts
router.get("/savings", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, sac.*, CONCAT(c.FirstName, ' ', c.LastName) AS FullName, c.CustomerCode
			FROM account ac
			JOIN savingsaccount sac
			ON ac.AccountCode = sac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
		`;
		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single account
router.get("/savings/:number", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, ac.AccountType, sac.*, CONCAT(c.FirstName, ' ', c.LastName) AS FullName, c.CustomerCode
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
			SELECT ac.AccountNumber, ac.AccountType, cac.*, CONCAT(c.FirstName, ' ', c.LastName) AS FullName, c.CustomerCode
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

// Get all checking accounts
router.get("/checking", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, cac.*, c.*
			FROM account ac
			JOIN checkingaccount cac
			ON ac.AccountCode = cac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
		`;
		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single account
router.get("/loan/:number", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, ac.AccountType, lac.*, c.*
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

// Get all loan accounts
router.get("/loan", async (req, res) => {
	try {
		const sql = `
			SELECT ac.AccountNumber, lac.*, c.*
			FROM account ac
			JOIN loanaccount lac
			ON ac.AccountCode = lac.AccountCode
			JOIN customer c
			ON c.CustomerCode = ac.CustomerCode
		`;
		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new account
router.post("/", async (req, res) => {
	const { AccountNumber, CustomerCode, AccountType } = req.body;

	// Validate AccountType
	const validAccountTypes = ["Savings", "Checking", "Loan"];
	if (!validAccountTypes.includes(AccountType)) {
		return res.status(400).json({
			error: "Invalid AccountType. Must be Savings, Checking, or Loan.",
		});
	}

	try {
		const [result] = await pool.query(
			`SELECT AddNewAccount(?, ?, ?) AS AccountCode;`,
			[AccountNumber, CustomerCode, AccountType],
		);
		res.status(201).json({
			AccountCode: result[0].AccountCode,
			AccountNumber,
			CustomerCode,
			AccountType,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an account
router.put("/:code", async (req, res) => {
	const { CustomerCode } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Account SET CustomerCode = ? WHERE AccountCode = ?",
			[CustomerCode, req.params.code],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json({ message: "Account updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an account
router.put("/savings/:code", async (req, res) => {
	const { InterestRate, Balance } = req.body;
	try {
		const sql =
			"UPDATE savingsaccount SET InterestRate = ?, Balance = ? WHERE AccountCode = ?";
		const params = [InterestRate, Balance, req.params.code];
		const [result] = await pool.query(sql, params);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json({ message: "Account updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an account
router.put("/checking/:code", async (req, res) => {
	const { Balance } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE checkingaccount SET Balance = ? WHERE AccountCode = ?",
			[Balance, req.params.code],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.json({ message: "Account updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an account
router.put("/loan/:code", async (req, res) => {
	const { BalanceDue, InterestRate } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE loanaccount SET BalanceDue = ?, InterestRate = ? WHERE AccountCode = ?",
			[BalanceDue, InterestRate, req.params.code],
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
router.delete("/:code", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM Account WHERE AccountCode = ?",
			[req.params.code],
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
