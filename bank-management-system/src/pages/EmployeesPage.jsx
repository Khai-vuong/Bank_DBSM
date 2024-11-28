/** @format */

import { useDataFetching } from "../hooks/useDataFetching";
import { Loader2 } from "lucide-react";

export function EmployeesPage() {
	const { data: employees, loading, error } = useDataFetching("/api/employees");

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
					{error.message || "An error occurred while fetching employees."}
				</span>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Employees</h2>
			{employees && employees.length > 0 ? (
				<table className="min-w-full bg-white shadow-md">
					<thead>
						<tr>
							<th className="py-2 px-4 border-b text-left">Employee Code</th>
							<th className="py-2 px-4 border-b text-left">First Name</th>
							<th className="py-2 px-4 border-b text-left">Last Name</th>
							<th className="py-2 px-4 border-b text-left">Email</th>
							<th className="py-2 px-4 border-b text-left">Branch</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee) => (
							<tr key={employee.EmployeeCode} className="hover:bg-gray-100 hover:cursor-pointer">
								<td className="py-2 px-4 border-b">{employee.EmployeeCode}</td>
								<td className="py-2 px-4 border-b">{employee.FirstName}</td>
								<td className="py-2 px-4 border-b">{employee.LastName}</td>
								<td className="py-2 px-4 border-b">{employee.Email}</td>
								<td className="py-2 px-4 border-b">{employee.BranchName}</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No employees found.</p>
			)}
		</div>
	);
}
