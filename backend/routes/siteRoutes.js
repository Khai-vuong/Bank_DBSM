/** @format */

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

//Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const [rows] = await pool.query(
			"SELECT UserCode, Username, Role, CustomerCode FROM User WHERE Username = ? AND PasswordHash = ?",
			[username, password],
		);
		if (rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
