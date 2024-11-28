/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM User");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single user
router.get("/:code", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM User WHERE UserCode = ?", [
			req.params.code,
		]);
		if (rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create a new user
router.post("/", async (req, res) => {
	const { UserCode, Username, PasswordHash, Role, CustomerCode } = req.body;
	try {
		const [result] = await pool.query(
			"INSERT INTO User (UserCode, Username, PasswordHash, Role, CustomerCode) VALUES (?, ?, ?, ?, ?)",
			[UserCode, Username, PasswordHash, Role, CustomerCode],
		);
		res.status(201).json({ id: result.insertId, ...req.body });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a user
router.put("/:code", async (req, res) => {
	const { Username, PasswordHash, Role, CustomerCode } = req.body;
	try {
		const [result] = await pool.query(
			"UPDATE User SET Username = ?, PasswordHash = ?, Role = ?, CustomerCode = ? WHERE UserCode = ?",
			[Username, PasswordHash, Role, CustomerCode, req.params.code],
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json({ message: "User updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a user
router.delete("/:code", async (req, res) => {
	try {
		const [result] = await pool.query("DELETE FROM User WHERE UserCode = ?", [
			req.params.code,
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
