/** @format */

import { useDataFetching } from "../hooks/useDataFetching";
import { Loader2, Phone } from "lucide-react";

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

	function combineEmployees(data) {
		const result = {};

		data.forEach((employee) => {
			const { EmployeeCode, PhoneNumber, ...rest } = employee;

			if (!result[EmployeeCode]) {
				result[EmployeeCode] = { ...rest, EmployeeCode, PhoneNumbers: [] };
			}

			// Add the phone number if it's not already in the list
			if (!result[EmployeeCode].PhoneNumbers.includes(PhoneNumber)) {
				result[EmployeeCode].PhoneNumbers.push(PhoneNumber);
			}
		});

		// Convert the result object into an array
		return Object.values(result);
	}

	console.log(combineEmployees(employees));

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
						{combineEmployees(employees).map((employee) => (
							<tr
								key={employee.EmployeeCode}
								className="hover:bg-gray-100 hover:cursor-pointer"
								onClick={() => {
									window.location.href = `/manager/employees/${employee.EmployeeCode}`;
								}}>
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
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Employees</h2>
					<p className="text-gray-600">No employees found.</p>
				</div>
			)}
		</div>
	);
}
