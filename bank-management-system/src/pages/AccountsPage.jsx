/** @format */

import { useDataFetching } from "../hooks/useDataFetching";
import { Loader2 } from "lucide-react";

export function AccountsPage() {
	const { data: accounts, loading, error } = useDataFetching("/api/accounts");

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<Loader2 className="h-8 w-8 animate-spin" />
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

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Accounts</h2>
			{accounts && accounts.length > 0 ? (
				<table className="min-w-full bg-white shadow-md">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b text-left">Account Number</th>
							<th className="py-2 px-4 border-b text-left">Customer Code</th>
							<th className="py-2 px-4 border-b text-left">Account Type</th>
						</tr>
					</thead>
					<tbody>
						{accounts.map((account) => (
							<tr
								key={account.AccountNumber}
								className="hover:bg-gray-100 hover:cursor-pointer"
								onClick={() =>
									(window.location.href = `/manager/accounts/${account.AccountType.toLowerCase()}/${
										account.AccountCode
									}`)
								}>
								<td className="py-2 px-4 border-b">{account.AccountNumber}</td>
								<td className="py-2 px-4 border-b">{account.CustomerCode}</td>
								<td className="py-2 px-4 border-b">{account.AccountType}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No accounts found.</p>
			)}
		</div>
	);
}
