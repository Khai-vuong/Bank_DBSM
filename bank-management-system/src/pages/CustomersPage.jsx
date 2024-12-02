/** @format */

import { useDataFetching } from "../hooks/useDataFetching";
import { Loader2 } from "lucide-react";
import AddCustomerModal from "../components/FormModalAddCustomer";
import { Search } from "lucide-react";
import useModal from "../hooks/useModal";
import { useState } from "react";

export function CustomersPage() {
	const { isShowing, toggle } = useModal();

	const [query, setQuery] = useState("");

	let {
		data: customers,
		loading,
		error,
	} = useDataFetching(`/api/customers?name=${query}`, isShowing);

	const handleSearch = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const query = formData.get("search");
		console.log("Searching for:", query);
		setQuery(query);
	};

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

	console.log("Customers:", customers);

	return (
		<>
			{isShowing ? (
				<AddCustomerModal
					isShowing={isShowing}
					toggle={toggle}
				/>
			) : null}
			<div className="p-6">
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-2xl font-bold mb-4">Customers</h2>
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1.5 rounded"
						onClick={toggle}>
						Add Customer
					</button>
				</div>
				<form
					onSubmit={handleSearch}
					className="w-full">
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
					<table className="min-w-full bg-white shadow-md mt-2">
						<thead>
							<tr>
								<th className="py-2 px-4 border-b text-left">Customer Code</th>
								<th className="py-2 px-4 border-b text-left">First Name</th>
								<th className="py-2 px-4 border-b text-left">Last Name</th>
								<th className="py-2 px-4 border-b text-left">Email</th>
							</tr>
						</thead>
						<tbody>
							{customers.map((customer) => (
								<tr
									key={customer.CustomerCode}
									className="hover:bg-gray-100 hover:cursor-pointer"
									onClick={() => {
										window.location.href = `/manager/customers/${customer.CustomerCode}`;
									}}>
									<td className="py-2 px-4 border-b">
										{customer.CustomerCode}
									</td>
									<td className="py-2 px-4 border-b">{customer.FirstName}</td>
									<td className="py-2 px-4 border-b">{customer.LastName}</td>
									<td className="py-2 px-4 border-b">{customer.Email}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No customers found.</p>
				)}
			</div>
		</>
	);
}
