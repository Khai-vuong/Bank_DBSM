/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

//get customer by name
router.get("/information", async (req, res) => {
	const { name } = req.query;

	let sql = `
		SELECT c.*, cpn.PhoneNumberList, a.AccountList
		FROM customer AS c
		LEFT JOIN (
			SELECT CustomerCode, JSON_ARRAYAGG(PhoneNumber) AS PhoneNumberList
			FROM customerphonenumber
			GROUP BY CustomerCode
		) AS cpn ON c.CustomerCode = cpn.CustomerCode
		LEFT JOIN (
			SELECT 
				acc.CustomerCode,
						JSON_ARRAYAGG(JSON_OBJECT(
								'AccountNumber', acc.AccountNumber,
								'AccountType', acc.AccountType,
								'AccountInformation', AccountInformation
						)) AS AccountList
			FROM account AS acc
			JOIN (
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'BalanceDue', BalanceDue,
						'InterestRate', InterestRate,
						'LoanTakeDate', LoanTakeDate
					) AS AccountInformation
				FROM loanaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'InterestRate', InterestRate
					) AS AccountInformation
				FROM savingsaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'OpenDate', OpenDate
					) AS AccountInformation
				FROM checkingaccount
			) AS acc_d
			ON acc.AccountNumber = acc_d.AccountNumber
				GROUP BY acc.CustomerCode
		) AS a ON c.CustomerCode = a.CustomerCode
		WHERE BINARY CONCAT(c.FirstName, ' ', c.LastName) LIKE ?;
  `;

	let params = [`%${name}%` || ""];

	try {
		const [rows] = await pool.query(sql, params);
		res.json(rows.map((row) => row));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//get customer by code
router.get("/information/:code", async (req, res) => {
	const { code } = req.params;

	let sql = `
		SELECT c.*, cpn.PhoneNumberList, a.AccountList
		FROM customer AS c
		LEFT JOIN (
			SELECT CustomerCode, JSON_ARRAYAGG(PhoneNumber) AS PhoneNumberList
			FROM customerphonenumber
			GROUP BY CustomerCode
		) AS cpn ON c.CustomerCode = cpn.CustomerCode
		LEFT JOIN (
			SELECT 
				acc.CustomerCode,
						JSON_ARRAYAGG(JSON_OBJECT(
								'AccountNumber', acc.AccountNumber,
								'AccountType', acc.AccountType,
								'AccountInformation', AccountInformation
						)) AS AccountList
			FROM account AS acc
			JOIN (
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'BalanceDue', BalanceDue,
						'InterestRate', InterestRate,
						'LoanTakeDate', LoanTakeDate
					) AS AccountInformation
				FROM loanaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'InterestRate', InterestRate
					) AS AccountInformation
				FROM savingsaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'OpenDate', OpenDate
					) AS AccountInformation
				FROM checkingaccount
			) AS acc_d
			ON acc.AccountNumber = acc_d.AccountNumber
				GROUP BY acc.CustomerCode
		) AS a ON c.CustomerCode = a.CustomerCode
		WHERE c.CustomerCode = ?;
  `;

	let params = [code];

	try {
		const [rows] = await pool.query(sql, params);
		res.json(rows.map((row) => row));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//get account information by customer code
router.get("/:customerCode/accounts", async (req, res) => {
	const { customerCode } = req.params;

	const query = `
		SELECT c.CustomerCode, a.AccountList
		FROM customer AS c
		LEFT JOIN (
			SELECT CustomerCode, JSON_ARRAYAGG(PhoneNumber) AS PhoneNumberList
			FROM customerphonenumber
			GROUP BY CustomerCode
		) AS cpn ON c.CustomerCode = cpn.CustomerCode
		LEFT JOIN (
			SELECT 
				acc.CustomerCode,
						JSON_ARRAYAGG(JSON_OBJECT(
								'AccountNumber', acc.AccountNumber,
								'AccountType', acc.AccountType,
								'AccountInformation', AccountInformation
						)) AS AccountList
			FROM account AS acc
			JOIN (
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'BalanceDue', BalanceDue,
						'InterestRate', InterestRate,
						'LoanTakeDate', LoanTakeDate
					) AS AccountInformation
				FROM loanaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'InterestRate', InterestRate
					) AS AccountInformation
				FROM savingsaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'OpenDate', OpenDate
					) AS AccountInformation
				FROM checkingaccount
			) AS acc_d
			ON acc.AccountNumber = acc_d.AccountNumber
				GROUP BY acc.CustomerCode
		) AS a ON c.CustomerCode = a.CustomerCode
		WHERE c.CustomerCode = ?
  `;
	const params = [customerCode];

	try {
		const [rows] = await pool.query(sql, params);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//get all customers information
router.get("/information/all", async (req, res) => {
	const sql = `
		SELECT c.CustomerCode, c.FirstName, c.LastName, cpn.PhoneNumberList, a.AccountList
		FROM customer AS c
		LEFT JOIN (
			SELECT CustomerCode, JSON_ARRAYAGG(PhoneNumber) AS PhoneNumberList
			FROM customerphonenumber
			GROUP BY CustomerCode
		) AS cpn ON c.CustomerCode = cpn.CustomerCode
		LEFT JOIN (
			SELECT 
				acc.CustomerCode,
						JSON_ARRAYAGG(JSON_OBJECT(
								'AccountNumber', acc.AccountNumber,
								'AccountType', acc.AccountType,
								'AccountInformation', AccountInformation
						)) AS AccountList
			FROM account AS acc
			JOIN (
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'BalanceDue', BalanceDue,
						'InterestRate', InterestRate,
						'LoanTakeDate', LoanTakeDate
					) AS AccountInformation
				FROM loanaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'InterestRate', InterestRate
					) AS AccountInformation
				FROM savingsaccount
				UNION
				SELECT
					AccountNumber,
					JSON_OBJECT(
						'Balance', Balance,
						'OpenDate', OpenDate
					) AS AccountInformation
				FROM checkingaccount
			) AS acc_d
			ON acc.AccountNumber = acc_d.AccountNumber
				GROUP BY acc.CustomerCode
		) AS a ON c.CustomerCode = a.CustomerCode
	`;

	try {
		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all customers
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Customer");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single customer
router.get("/:code", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Customer WHERE CustomerCode = ?",
			[req.params.code],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new customer
router.post("/", async (req, res) => {
	const {
		firstName,
		lastName,
		homeAddress,
		officeAddress,
		email,
		phone
	} = req.body;
	try {
		const [result] = await pool.query(
			"CALL AddCustomer (?, ?, ?, ?, ?, ?)",
			[
				firstName,
				lastName,
				homeAddress,
				officeAddress,
				email,
				phone
			],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a customer
router.put("/:code", async (req, res) => {
	const {
		FirstName,
		LastName,
		HomeAddress,
		OfficeAddress,
		Email,
		ServeEmployeeCode,
	} = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Customer SET FirstName = ?, LastName = ?, HomeAddress = ?, OfficeAddress = ?, Email = ?, ServeEmployeeCode = ? WHERE CustomerCode = ?",
			[
				FirstName,
				LastName,
				HomeAddress,
				OfficeAddress,
				Email,
				ServeEmployeeCode,
				req.params.code,
			],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json({ message: "Customer updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a customer
router.delete("/:code", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM Customer WHERE CustomerCode = ?",
			[req.params.code],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Customer not found" });
		}
		res.json({ message: "Customer deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
