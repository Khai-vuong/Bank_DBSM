/** @format */

import axios from "axios";
import { useDataFetching } from "../hooks/useDataFetching";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CustomersPage() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");

	let {
		data: customers,
		loading,
		error,
	} = useDataFetching(`/api/customers?name=${query}`);

	const handleSearch = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const query = formData.get("search");
		console.log("Searching for:", query);
		setQuery(query);
	};

	const handleDelete = (customerCode) => {
		if (confirm("Are you sure you want to delete this customer?")) {
			axios.delete(`/api/customers/${customerCode}`).then(() => {
				window.location.reload();
			});
		}
		console.log(`Delete customer with code: ${customerCode}`);
	};

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
					{error.message || "An error occurred while fetching customers."}
				</span>
			</div>
		);
	}

	console.log("Customers:", customers);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Customers</h2>
				<button
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
					onClick={() => navigate("/manager/customers/create")}>
					Add Customer
				</button>
			</div>
			<form
				onSubmit={handleSearch}
				className="w-full mb-4">
				<div className="relative">
					<input
						type="text"
						name="search"
						className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
						placeholder="Search..."
					/>
					<div className="absolute inset-y-0 left-0 flex items-center pl-3">
						<Search className="w-5 h-5 text-gray-400" />
					</div>
					<button
						type="submit"
						className="absolute inset-y-0 right-0 flex items-center pr-3">
						<span className="sr-only">Submit search</span>
						<Search className="w-5 h-5 text-gray-400 hover:text-gray-600" />
					</button>
				</div>
			</form>
			{customers && customers.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-3 px-4 text-left">Customer Code</th>
								<th className="py-3 px-4 text-left">First Name</th>
								<th className="py-3 px-4 text-left">Last Name</th>
								<th className="py-3 px-4 text-left">Email</th>
								<th className="py-3 px-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{customers.map((customer) => (
								<tr
									key={customer.CustomerCode}
									className="hover:bg-gray-50">
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/customers/${customer.CustomerCode}`)
										}>
										{customer.CustomerCode}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/customers/${customer.CustomerCode}`)
										}>
										{customer.FirstName}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/customers/${customer.CustomerCode}`)
										}>
										{customer.LastName}
									</td>
									<td
										className="py-3 px-4 border-b cursor-pointer"
										onClick={() =>
											navigate(`/manager/customers/${customer.CustomerCode}`)
										}>
										{customer.Email}
									</td>
									<td className="border-b">
										<button
											className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(customer.CustomerCode);
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
				<p>No customers found.</p>
			)}
		</div>
	);
}
