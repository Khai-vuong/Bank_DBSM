/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
	try {
		const sql = `
			SELECT e.*, ep.PhoneNumber
			FROM employee e
			JOIN employeephone ep
			ON e.EmployeeCode = ep.EmployeeCode
		`;

		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get serve employees
router.get("/serve", async (req, res) => {
	try {
		const sql = `
			SELECT 
					CustomerCode,
					CONCAT(c.FirstName, ' ', c.LastName) AS CustomerName,
					EmployeeCode,
					CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
					BranchName,
					ServeDate
			FROM customer c
			JOIN employee e
			ON ServeEmployeeCode = EmployeeCode
		`;
		console.log(1);
		const [rows] = await pool.query(sql);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single employee
router.get("/:code", async (req, res) => {
	try {
		const sql = `
			SELECT e.*, ep.PhoneNumber
			FROM employee e
			JOIN employeephone ep
			ON e.EmployeeCode = ep.EmployeeCode
			WHERE e.EmployeeCode = ?
		`;

		const [rows] = await pool.query(sql, [req.params.code]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new employee
router.post("/", async (req, res) => {
	const {
		FirstName,
		LastName,
		BirthDate,
		HomeAddressNo,
		HomeAddressStreet,
		HomeAddressDistrict,
		HomeAddressCity,
		Email,
		BranchName,
		Phones,
	} = req.body;
	try {
		const [result] = await pool.query(
			`SELECT AddNewEmployee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) AS EmployeeCode;`,
			[
				FirstName,
				LastName,
				HomeAddressNo,
				HomeAddressStreet,
				HomeAddressDistrict,
				HomeAddressCity,
				BirthDate,
				Email,
				BranchName,
				Phones,
			],
		);
		res.status(201).json({
			EmployeeCode: result[0].EmployeeCode,
			...req.body,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an employee
router.put("/:code", async (req, res) => {
	const {
		FirstName,
		LastName,
		HomeAddressNo,
		HomeAddressStreet,
		HomeAddressDistrict,
		HomeAddressCity,
		BirthDate,
		Email,
		BranchName,
	} = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Employee SET FirstName = ?, LastName = ?, BirthDate = ?, HomeAddressNo = ?, HomeAddressStreet = ?, HomeAddressDistrict = ?, HomeAddressCity = ?, Email = ?, BranchName = ? WHERE EmployeeCode = ?",
			[
				FirstName,
				LastName,
				HomeAddressNo,
				HomeAddressStreet,
				HomeAddressDistrict,
				HomeAddressCity,
				BirthDate,
				Email,
				BranchName,
				req.params.code,
			],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}
		res.json({ message: "Employee updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete an employee
router.delete("/:code", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM Employee WHERE EmployeeCode = ?",
			[req.params.code],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}
		res.json({ message: "Employee deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
