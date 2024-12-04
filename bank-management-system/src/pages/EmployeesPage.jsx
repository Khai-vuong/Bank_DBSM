/** @format */

import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../hooks/useDataFetching";
import { Trash2 } from "lucide-react";
import axios from "axios";

export function EmployeesPage() {
	const { data: employees, loading, error } = useDataFetching("/api/employees");
	const navigate = useNavigate();

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

	const handleDelete = (employeeCode) => {
		if (confirm("Are you sure you want to delete this employee?")) {
			axios.delete(`/api/employees/${employeeCode}`).then(() => {
				window.location.reload();
			});
		}
		console.log(`Delete employee with code: ${employeeCode}`);
	};

	const combinedEmployees = combineEmployees(employees);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Employees</h2>
				<button
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					onClick={() => navigate("/manager/employees/create")}>
					Add Employee
				</button>
			</div>
			{combinedEmployees && combinedEmployees.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-3 px-4 text-left">Employee Code</th>
								<th className="py-3 px-4 text-left">First Name</th>
								<th className="py-3 px-4 text-left">Last Name</th>
								<th className="py-3 px-4 text-left">Email</th>
								<th className="py-3 px-4 text-left">Branch</th>
								<th className="py-3 px-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{combinedEmployees.map((employee) => (
								<tr
									key={employee.EmployeeCode}
									className="hover:bg-gray-50">
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/employees/${employee.EmployeeCode}`)
										}>
										{employee.EmployeeCode}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/employees/${employee.EmployeeCode}`)
										}>
										{employee.FirstName}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/employees/${employee.EmployeeCode}`)
										}>
										{employee.LastName}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/employees/${employee.EmployeeCode}`)
										}>
										{employee.Email}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/employees/${employee.EmployeeCode}`)
										}>
										{employee.BranchName}
									</td>
									<td className="border-b">
										<button
											className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(employee.EmployeeCode);
											}}>
											<Trash2 className="w-4 h-4 mr-1" />
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-gray-600">No employees found.</p>
			)}
		</div>
	);
}
