/** @format */

import { useParams } from "react-router";
import { useDataFetching } from "../hooks/useDataFetching.js";
import { Loader2 } from "lucide-react";

export function AccountDetailPage() {
	let params = useParams();
	const {
		data: account,
		loading,
		error,
	} = useDataFetching(`/api/accounts/${params.type}/${params.number}`);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full p-6">
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
					{error.message || "An error occurred while fetching employees."}
				</span>
			</div>
		);
	}

	console.log(account);

	return (
		<>
			{account ? (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Account Detail</h2>
					<div
						key={account.employeeCode}
						className="bg-white shadow-md rounded-lg p-6 mb-4">
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
								{Object.entries(account[0]).map(([key, value]) => (
									<div
										key={key}
										className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											{key}
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
											{value || "None"}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			) : (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Employee Detail</h2>
					<p className="text-gray-600">No employee found.</p>
				</div>
			)}
		</>
	);
}
