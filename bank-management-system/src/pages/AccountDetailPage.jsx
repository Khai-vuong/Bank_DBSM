/** @format */

import { useNavigate, useParams } from "react-router";
import { useDataFetching } from "../hooks/useDataFetching.js";
import { useState, useCallback } from "react";
import { Pencil, X, Check } from "lucide-react";
import axios from "axios";

export function AccountDetailPage() {
	const navigate = useNavigate();
	let params = useParams();
	const {
		data: account,
		loading,
		error,
	} = useDataFetching(`/api/accounts/${params.type}/${params.code}`);

	const [editMode, setEditMode] = useState({});
	const [editedValues, setEditedValues] = useState({});

	const editableFields = {
		Checking: ["Balance"],
		Savings: ["Balance", "InterestRate"],
		Loan: ["BalanceDue", "InterestRate"],
	};

	const handleEdit = useCallback(
		(key) => {
			setEditMode((prev) => ({ ...prev, [key]: true }));
			setEditedValues((prev) => ({ ...prev, [key]: account[0][key] }));
		},
		[account],
	);

	const handleCancel = useCallback(
		(key) => {
			setEditMode((prev) => ({ ...prev, [key]: false }));
			setEditedValues((prev) => ({ ...prev, [key]: account[0][key] }));
		},
		[account],
	);

	const handleSave = useCallback(
		async (key) => {
			const newValue = editedValues[key];
			if (newValue === "" || isNaN(newValue)) {
				alert("Please enter a valid number");
				return;
			}

			let data = {};

			Object.values(editableFields[AccountType]).forEach((field) => {
				data[field] = account[0][field];
			});

			try {
				axios
					.put(`/api/accounts/${params.type}/${params.code}`, {
						...data,
						[key]: newValue,
					})
					.then((response) => {
						console.log("Account updated successfully:", response.data);
					})
					.catch((error) => {
						console.error("There was an error updating the account!", error);
					});

				window.location.reload();
			} catch (error) {
				console.error("Error updating account:", error);
				alert("Failed to update account. Please try again.");
			}
		},
		[editedValues, params.type, params.code, account, editableFields],
	);

	const handleChange = useCallback((key, value) => {
		setEditedValues((prev) => ({ ...prev, [key]: value }));
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full p-6">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
				role="alert">
				<strong className="font-bold">Error!</strong>
				<span className="block sm:inline">
					{" "}
					{error.message || "An error occurred while fetching account details."}
				</span>
			</div>
		);
	}

	const { CustomerCode, AccountType, ...accountInfo } = account[0];

	console.log(editedValues);

	return (
		<>
			{account ? (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Account Detail</h2>
					<div className="bg-white shadow-md rounded-lg p-6 mb-4">
						<div className="px-4 sm:px-0">
							<h3 className="text-base/7 font-semibold text-gray-900">
								Account Information
							</h3>
							<p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
								Account details and banking information.
							</p>
						</div>
						<div className="mt-6 border-t border-gray-100">
							<dl className="divide-y divide-gray-100">
								{Object.entries(accountInfo).map(([key, value]) => (
									<div
										key={key}
										className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											{key}
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
											{editMode[key] ? (
												<input
													type="number"
													step={key.includes("Rate") ? "0.01" : "0.01"}
													value={editedValues[key]}
													onChange={(e) => handleChange(key, e.target.value)}
													className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
												/>
											) : (
												<span
													className={
														key === "FullName"
															? "hover:cursor-pointer hover:underline"
															: ""
													}
													onClick={() => {
														if (key === "FullName") {
															navigate(`/manager/customers/${CustomerCode}`);
														}
													}}>
													{typeof value === "number"
														? value.toFixed(2)
														: value || "None"}
												</span>
											)}
											{editableFields[AccountType]?.includes(key) && (
												<>
													{!editMode[key] && (
														<button
															onClick={() => handleEdit(key)}
															className="ml-2 text-blue-600 hover:text-blue-800">
															<Pencil className="h-4 w-4" />
														</button>
													)}
													{editMode[key] && (
														<div className="ml-2 flex">
															<button
																onClick={() => handleSave(key)}
																className="text-green-600 hover:text-green-800 mr-2">
																<Check className="h-4 w-4" />
															</button>
															<button
																onClick={() => handleCancel(key)}
																className="text-red-600 hover:text-red-800">
																<X className="h-4 w-4" />
															</button>
														</div>
													)}
												</>
											)}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			) : (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Account Detail</h2>
					<p className="text-gray-600">No account found.</p>
				</div>
			)}
		</>
	);
}
