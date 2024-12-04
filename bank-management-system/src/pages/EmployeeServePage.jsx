/** @format */

import { useState, useEffect } from "react";
import { useDataFetching } from "../hooks/useDataFetching";
import { useNavigate } from "react-router-dom";

export function EmployeeServePage() {
	const { data, loading, error } = useDataFetching("/api/employees/serve");
	const [groupedData, setGroupedData] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (data) {
			const grouped = data.reduce((acc, item) => {
				if (!acc[item.EmployeeCode]) {
					acc[item.EmployeeCode] = {
						employeeName: item.EmployeeName,
						customers: [],
					};
				}
				acc[item.EmployeeCode].customers.push(item);
				return acc;
			}, {});
			setGroupedData(grouped);
		}
	}, [data]);

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	if (loading) {
		return (
			<div className="p-6">
				<h2 className="text-2xl font-bold mb-4">Employee Service Report</h2>
				<div className="flex justify-center items-center h-64">
					<p className="text-lg">Loading...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<h2 className="text-2xl font-bold mb-4">Employee Service Report</h2>
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
					role="alert">
					<strong className="font-bold">Error!</strong>
					<span className="block sm:inline">
						{" "}
						{error.message ||
							"An error occurred while fetching the employee service data."}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Employee Service Report</h2>
			{Object.entries(groupedData).map(([employeeCode, employeeData]) => (
				<div
					key={employeeCode}
					className="mb-6 bg-white shadow-md rounded-lg overflow-hidden">
					<div className="bg-gray-200 px-4 py-5 border-b border-gray-200 sm:px-6">
						<h3
							className="text-lg leading-6 font-medium text-gray-900 hover:underline cursor-pointer w-fit"
							onClick={() => {
								navigate(`/manager/employees/${employeeCode}`);
							}}>
							{employeeData.employeeName} ({employeeCode})
						</h3>
					</div>
					<div className="px-4 py-5 sm:p-6">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-50">
										<th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Customer Code
										</th>
										<th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Customer Name
										</th>
										<th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Branch Name
										</th>
										<th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Serve Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{employeeData.customers.map((customer) => (
										<tr
                      className="hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => {
                        navigate(`/manager/customers/${customer.CustomerCode}`);
                      }}
											key={`${employeeCode}-${customer.CustomerCode}-${customer.ServeDate}`}>
											<td className="border px-4 py-2 whitespace-nowrap">
												{customer.CustomerCode}
											</td>
											<td className="border px-4 py-2 whitespace-nowrap">
												{customer.CustomerName}
											</td>
											<td className="border px-4 py-2 whitespace-nowrap">
												{customer.BranchName}
											</td>
											<td className="border px-4 py-2 whitespace-nowrap">
												{formatDate(customer.ServeDate)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
