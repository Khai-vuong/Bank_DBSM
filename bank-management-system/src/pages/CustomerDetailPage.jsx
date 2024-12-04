/** @format */

import { useParams, useNavigate } from "react-router";
import { useDataFetching } from "../hooks/useDataFetching.js";
import { useState, useCallback } from "react";
import { Pencil, X, Check } from "lucide-react";
import axios from "axios";
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

	const [editMode, setEditMode] = useState({});
	const [editedValues, setEditedValues] = useState({});

	const editableFields = [
		"FullName",
		"Email",
		"HomeAddress",
		"OfficeAddress",
		"PhoneNumberList",
	];

	const handleEdit = useCallback(
		(key) => {
			setEditMode((prev) => ({ ...prev, [key]: true }));
			setEditedValues((prev) => ({ ...prev, [key]: customer[key] }));
		},
		[customer],
	);

	const handleCancel = useCallback(
		(key) => {
			setEditMode((prev) => ({ ...prev, [key]: false }));
			setEditedValues((prev) => ({ ...prev, [key]: customer[key] }));
		},
		[customer],
	);

	const handleSave = useCallback(
		async (key) => {
			const newValue = editedValues[key];

			let data = {};

			Object.values(editableFields).forEach((field) => {
				data[field] = customer[field];
			});

			if (key === "FullName") {
				data.FirstName = newValue.split(" ")[0];
				data.LastName = newValue.split(" ")[1];
			}

			if (confirm("Are you sure you want to save these changes?")) {
				try {
					axios
						.put(`/api/customers/${params.code}`, {
							...data,
							[key]: newValue,
						})
						.then((response) => {
							console.log("customer updated successfully:", response.data);
						})
						.catch((error) => {
							console.error("There was an error updating the customer!", error);
						});

					navigate(0);
				} catch (error) {
					console.error("Error updating customer:", error);
					alert("Failed to update customer. Please try again.");
				}
			}
		},
		[editedValues, params.type, params.code, customer, editableFields],
	);

	const handleChange = useCallback((key, value) => {
		setEditedValues((prev) => ({ ...prev, [key]: value }));
	}, []);

	console.log(editedValues.FullName);

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

	const editGroupButton = (key, value) => {
		return (
			editableFields?.includes(key) && (
				<>
					{editMode[key] ? (
						<input
							type="text"
							value={editedValues[key]}
							onChange={(e) => handleChange(key, e.target.value)}
							className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					) : (
						<span>{value || "None"}</span>
					)}
					{!editMode[key] && (
						<button
							onClick={() => handleEdit(key)}
							className="ml-2 text-blue-600 hover:text-blue-800">
							<Pencil className="h-4 w-4" />
						</button>
					)}
					{editMode[key] && (
						<div className="ml-2 flex">
							<button
								onClick={() => handleSave(key)}
								className="text-green-600 hover:text-green-800 mr-2">
								<Check className="h-4 w-4" />
							</button>
							<button
								onClick={() => handleCancel(key)}
								className="text-red-600 hover:text-red-800">
								<X className="h-4 w-4" />
							</button>
						</div>
					)}
				</>
			)
		);
	};

	console.log(customer);

	return (
		<>
			{customer ? (
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">Customer Detail</h2>
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
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
										{editGroupButton("FullName", customer.FullName)}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Email address
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
										{editGroupButton("Email", customer.Email)}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Home address
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
										{editGroupButton("HomeAddress", customer.HomeAddress)}
									</dd>
								</div>
								<div className="px-4 py-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0">
									<dt className="text-sm/6 font-medium text-gray-900">
										Office address
									</dt>
									<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
										{editGroupButton("OfficeAddress", customer.OfficeAddress)}
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
									{customer.ServeEmployeeName ? (
										<>
											<dd
												className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0 hover:cursor-pointer hover:underline"
												onClick={() =>
													navigate(
														`/manager/employees/${customer.ServeEmployeeCode}`,
													)
												}>
												{customer.ServeEmployeeName}
											</dd>
											<dt className="text-sm/6 font-medium text-gray-900">
												From
											</dt>
											<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0">
												{formattedDate(customer.ServeDate)}
											</dd>
										</>
									) : (
										<dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-4 sm:mt-0">
											None
										</dd>
									)}
								</div>
							</dl>
						</div>
					</div>
				</div>
			) : (
				<p>No customers found.</p>
			)}
		</>
	);
}
