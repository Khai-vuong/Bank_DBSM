/** @format */

import { useParams, useNavigate } from "react-router";
import { useDataFetching } from "../hooks/useDataFetching.js";
import { Loader2 } from "lucide-react";

export function CustomerDetailPage() {
	const navigate = useNavigate();
	let params = useParams();
	console.log(params.code);
	const {
		data: customer,
		loading,
		error,
	} = useDataFetching(`/api/customers/${params.code}`);

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
					{error.message || "An error occurred while fetching customers."}
				</span>
			</div>
		);
	}

	const formattedDate = (isoDate) =>
		new Date(isoDate).toLocaleDateString("en-GB");

	console.log(customer);

	return (
		<>
			{customer && customer.length > 0 ? (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Customer Detail</h2>
					{customer.map((customer) => (
						<div
							key={customer.CustomerCode}
							className="bg-white shadow-md rounded-lg p-6 mb-4">
							<div className="px-4 sm:px-0">
								<h3 className="text-base/7 font-semibold text-gray-900">
									Customer Information
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
											{customer.FirstName || customer.LastName
												? customer.FirstName + " " + customer.LastName
												: "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											Email address
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
											{customer.Email || "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											Home address
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
											{customer.HomeAddress || "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											Office address
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
											{customer.OfficeAddress || "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											Phone numbers
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
											{customer.PhoneNumberList
												? customer.PhoneNumberList.map((phone) => (
														<p key={phone}>{phone}</p>
												  ))
												: "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900">
											Accounts
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0">
											{customer.AccountList
												? customer.AccountList.map((account) => (
														<div
															key={account.AccountNumber}
															className="shadow p-3 first:mt-0 mt-4 rounded hover:-translate-y-[4px] duration-300 hover:cursor-pointer"
															onClick={() =>
																navigate(
																	`/manager/accounts/${account.AccountType.toLowerCase()}/${
																		account.AccountCode
																	}`,
																)
															}>
															<p className="font-bold">
																Number: {account.AccountNumber}
															</p>
															<div className="ml-4 ">
																<p>Account Type: {account.AccountType}</p>
																{Object.keys(account.AccountInformation).map(
																	(key) => (
																		<p key={key}>
																			{key}: {account.AccountInformation[key]}
																		</p>
																	),
																)}
															</div>
														</div>
												  ))
												: "None"}
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
										<dt className="text-sm/6 font-medium text-gray-900 sm:col-span-1">
											Served by
										</dt>
										<dd
											className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0 hover:cursor-pointer hover:underline"
											onClick={() =>
												navigate(
													`/manager/employees/${customer.ServeEmployeeCode}`,
												)
											}>
											{customer.ServeEmployeeName || "None"}
										</dd>
										<dt className="text-sm/6 font-medium text-gray-900">
											From
										</dt>
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0">
											{formattedDate(customer.ServeDate) || "None"}
										</dd>
									</div>
								</dl>
							</div>
						</div>
					))}
				</div>
			) : (
				<p>No customers found.</p>
			)}
		</>
	);
}
