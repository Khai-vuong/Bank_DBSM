/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Employee");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single employee
router.get("/:code", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Employee WHERE EmployeeCode = ?",
			[req.params.code],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Employee not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new employee
router.post("/", async (req, res) => {
	const {
		EmployeeCode,
		FirstName,
		LastName,
		BirthDate,
		HomeAddressNo,
		HomeAddressStreet,
		HomeAddressDistrict,
		HomeAddressCity,
		Email,
		BranchName,
	} = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO Employee (EmployeeCode, FirstName, LastName, BirthDate, HomeAddressNo, HomeAddressStreet, HomeAddressDistrict, HomeAddressCity, Email, BranchName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				EmployeeCode,
				FirstName,
				LastName,
				BirthDate,
				HomeAddressNo,
				HomeAddressStreet,
				HomeAddressDistrict,
				HomeAddressCity,
				Email,
				BranchName,
			],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an employee
router.put("/:code", async (req, res) => {
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
	} = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Employee SET FirstName = ?, LastName = ?, BirthDate = ?, HomeAddressNo = ?, HomeAddressStreet = ?, HomeAddressDistrict = ?, HomeAddressCity = ?, Email = ?, BranchName = ? WHERE EmployeeCode = ?",
			[
				FirstName,
				LastName,
				BirthDate,
				HomeAddressNo,
				HomeAddressStreet,
				HomeAddressDistrict,
				HomeAddressCity,
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
