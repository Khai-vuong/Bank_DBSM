/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../hooks/useDataFetching";
import axios from "axios";

export function AccountsPage() {
	const { data: accounts, loading, error } = useDataFetching("/api/accounts");
	const navigate = useNavigate();
	const [deleteMode, setDeleteMode] = useState(false);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
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
					{error.message || "An error occurred while fetching accounts."}
				</span>
			</div>
		);
	}

	const toggleDeleteMode = () => {
		setDeleteMode(!deleteMode);
	};

	const handleDelete = (accountCode) => {
		if (confirm("Are you sure you want to delete this account?")) {
			axios.delete(`/api/accounts/${accountCode}`).then(() => {
				window.location.reload();
			});
		}
		console.log(`Delete account with code: ${accountCode}`);
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Accounts</h2>
				<div>
					<button
						className={`mr-2 px-4 py-2 rounded ${
							deleteMode
								? "bg-red-500 hover:bg-red-600"
								: "bg-yellow-500 hover:bg-yellow-600"
						} text-white`}
						onClick={toggleDeleteMode}>
						{deleteMode ? "Cancel Delete" : "Delete Mode"}
					</button>
					{!deleteMode && (
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
							onClick={() => navigate("/manager/accounts/create")}>
							Add Account
						</button>
					)}
				</div>
			</div>
			{accounts && accounts.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-3 px-4 text-left">Account Code</th>
								<th className="py-3 px-4 text-left">Account Number</th>
								<th className="py-3 px-4 text-left">Customer Code</th>
								<th className="py-3 px-4 text-left">Account Type</th>
								{deleteMode && <th className="py-3 px-4">Action</th>}
							</tr>
						</thead>
						<tbody>
							{accounts.map((account) => (
								<tr
									key={account.AccountNumber}
									className={`hover:bg-gray-50 ${
										deleteMode ? "" : "hover:cursor-pointer"
									}`}
									onClick={
										deleteMode
											? undefined
											: () =>
													(window.location.href = `/manager/accounts/${account.AccountType.toLowerCase()}/${
														account.AccountCode
													}`)
									}>
									<td className="py-3 px-4 border-b">{account.AccountCode}</td>
									<td className="py-3 px-4 border-b">
										{account.AccountNumber}
									</td>
									<td className="py-3 px-4 border-b">{account.CustomerCode}</td>
									<td className="py-3 px-4 border-b">{account.AccountType}</td>
									{deleteMode && (
										<td className=" border-b text-center">
											<button
												className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(account.AccountCode);
												}}>
												Delete
											</button>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p>No accounts found.</p>
			)}
		</div>
	);
}
