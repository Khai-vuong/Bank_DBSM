/** @format */

import { useParams } from "react-router";
import { useDataFetching } from "../hooks/useDataFetching.js";
import { Loader2 } from "lucide-react";

export function EmployeeDetailPage() {
	let params = useParams();
	const {
		data: employee,
		loading,
		error,
	} = useDataFetching(`/api/employees/${params.code}`);

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

	const employeeDetail = {
		...employee[0],
		PhoneNumber: employee.map((item) => item.PhoneNumber),
	};

	console.log(employeeDetail);

	const formattedDate = (isoDate) =>
		new Date(isoDate).toLocaleDateString("en-GB");

	return (
		<>
			{employee ? (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Employee Detail</h2>
					<div
						key={employeeDetail.employeeCode}
						className="bg-white shadow-md rounded-lg p-6 mb-4">
						<div className="px-4 sm:px-0">
							<h3 className="text-base/7 font-semibold text-gray-900">
								Employee Information
							</h3>
							<p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
								Personal details and banking information.
							</p>
						</div>
						<div className="mt-6 border-t border-gray-100">
							<dl className="divide-y divide-gray-100">
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Full name
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{employeeDetail.FirstName || employeeDetail.LastName
											? employeeDetail.FirstName + " " + employeeDetail.LastName
											: "None"}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Email address
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{employeeDetail.Email || "None"}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Birthdate
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{formattedDate(employeeDetail.BirthDate) || "None"}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Home address
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{employeeDetail.HomeAddressNo
											? `${employeeDetail.HomeAddressNo} ${employeeDetail.HomeAddressStreet}, ${employeeDetail.HomeAddressCity}, ${employeeDetail.HomeAddressDistrict}`
											: "None"}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Branch name
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{employeeDetail.BranchName || "None"}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Phone numbers
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
										{employeeDetail.PhoneNumber
											? employeeDetail.PhoneNumber.map((phone) => (
													<p key={phone}>{phone}</p>
											  ))
											: "None"}
									</dd>
								</div>
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
