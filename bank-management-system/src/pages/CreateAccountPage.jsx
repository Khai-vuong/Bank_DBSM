/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateAccountPage() {
	const [accountNumber, setAccountNumber] = useState("");
	const [customerCode, setCustomerCode] = useState("");
	const [accountType, setAccountType] = useState("Savings");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch("/api/accounts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					AccountNumber: accountNumber,
					CustomerCode: customerCode,
					AccountType: accountType,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to create account");
			}

			// Account created successfully
			navigate("/manager/accounts");
		} catch (err) {
			if (err.message.includes("Duplicate")) {
				setError("Account number already exists!!");
			} else if (err.message.includes("Invalid")) {
				setError("Invalid AccountType. Must be Savings, Checking, or Loan.");
			} else if (err.message.includes("Cannot add or update a child row")) {
				setError("Customer code does not exist");
			} else {
				setError(err.message);
			}
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Create New Account</h2>
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert">
					<strong className="font-bold">Error!</strong>
					<span className="block sm:inline"> {error}</span>
				</div>
			)}
			<form
				onSubmit={handleSubmit}
				className="max-w-md mx-auto">
				<div className="mb-4">
					<label
						htmlFor="accountNumber"
						className="block text-sm font-medium text-gray-700">
						Account Number
					</label>
					<input
						type="text"
						id="accountNumber"
						value={accountNumber}
						onChange={(e) => setAccountNumber(e.target.value)}
						required
						className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="customerCode"
						className="block text-sm font-medium text-gray-700">
						Customer Code
					</label>
					<input
						type="text"
						id="customerCode"
						value={customerCode}
						onChange={(e) => setCustomerCode(e.target.value)}
						required
						className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="accountType"
						className="block text-sm font-medium text-gray-700">
						Account Type
					</label>
					<select
						id="accountType"
						value={accountType}
						onChange={(e) => setAccountType(e.target.value)}
						required
						className="mt-1 h-10 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
						<option value="Savings">Savings</option>
						<option value="Checking">Checking</option>
						<option value="Loan">Loan</option>
					</select>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
					Create Account
				</button>
			</form>
		</div>
	);
}
