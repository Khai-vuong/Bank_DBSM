/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all branches
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Branch");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single branch
router.get("/:name", async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Branch WHERE BranchName = ?",
			[req.params.name],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "Branch not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new branch
router.post("/", async (req, res) => {
	const {
		BranchName,
		AddressNo,
		AddressStreet,
		AddressDistrict,
		AddressCity,
		AddressRegion,
		Email,
		ManagerCode,
	} = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO Branch (BranchName, AddressNo, AddressStreet, AddressDistrict, AddressCity, AddressRegion, Email, ManagerCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				BranchName,
				AddressNo,
				AddressStreet,
				AddressDistrict,
				AddressCity,
				AddressRegion,
				Email,
				ManagerCode,
			],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a branch
router.put("/:name", async (req, res) => {
	const {
		AddressNo,
		AddressStreet,
		AddressDistrict,
		AddressCity,
		AddressRegion,
		Email,
		ManagerCode,
	} = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE Branch SET AddressNo = ?, AddressStreet = ?, AddressDistrict = ?, AddressCity = ?, AddressRegion = ?, Email = ?, ManagerCode = ? WHERE BranchName = ?",
			[
				AddressNo,
				AddressStreet,
				AddressDistrict,
				AddressCity,
				AddressRegion,
				Email,
				ManagerCode,
				req.params.name,
			],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Branch not found" });
		}
		res.json({ message: "Branch updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a branch
router.delete("/:name", async (req, res) => {
	try {
		const [result] = await pool.query(
			"DELETE FROM Branch WHERE BranchName = ?",
			[req.params.name],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Branch not found" });
		}
		res.json({ message: "Branch deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
