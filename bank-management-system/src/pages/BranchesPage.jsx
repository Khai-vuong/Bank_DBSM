/** @format */

import { useDataFetching } from "../hooks/useDataFetching";
import { Loader2 } from "lucide-react";

export function BranchesPage() {
	const { data: branches, loading, error } = useDataFetching("/api/branches");

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
					{error.message || "An error occurred while fetching branches."}
				</span>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Branches</h2>
			{branches && branches.length > 0 ? (
				<table className="min-w-full bg-white shadow-md">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b text-left">Branch Name</th>
							<th className="py-2 px-4 border-b text-left">Address</th>
							<th className="py-2 px-4 border-b text-left">City</th>
							<th className="py-2 px-4 border-b text-left">Email</th>
						</tr>
					</thead>
					<tbody>
						{branches.map((branch) => (
							<tr key={branch.BranchName} className="hover:bg-gray-100 hover:cursor-pointer">
								<td className="py-2 px-4 border-b">{branch.BranchName}</td>
								<td className="py-2 px-4 border-b">{`${branch.AddressNo} ${branch.AddressStreet}`}</td>
								<td className="py-2 px-4 border-b">{branch.AddressCity}</td>
								<td className="py-2 px-4 border-b">{branch.Email}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No branches found.</p>
			)}
		</div>
	);
}
