/** @format */

import { PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateCustomerPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [homeAddress, setHomeAddress] = useState("");
	const [officeAddress, setOfficeAddress] = useState("");
	const [phones, setPhones] = useState([""]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch("/api/customers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					homeAddress,
					officeAddress,
					phone: phones.filter((phone) => phone.trim() !== "").join(","),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to create customer");
			}

			// Customer created successfully
			navigate("/manager/customers");
		} catch (err) {
			setError(err.message);
		}
	};

	const handleAddPhone = () => {
		setPhones([...phones, ""]);
	};

	const handleRemovePhone = (index) => {
		const newPhones = phones.filter((_, i) => i !== index);
		setPhones(newPhones);
	};

	const handlePhoneChange = (index, value) => {
		const newPhones = [...phones];
		newPhones[index] = value;
		setPhones(newPhones);
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Create New Customer</h2>
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert">
					<strong className="font-bold">Error!</strong>
					<span className="block sm:inline"> {error}</span>
				</div>
			)}
			<form
				onSubmit={handleSubmit}
				className="min-w-full bg-white shadow-md p-6">
				<div className="mb-4">
					<label
						htmlFor="firstName"
						className="block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						type="text"
						id="firstName"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="lastName"
						className="block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						type="text"
						id="lastName"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="homeAddress"
						className="block text-sm font-medium text-gray-700">
						Home Address
					</label>
					<input
						type="text"
						id="homeAddress"
						value={homeAddress}
						onChange={(e) => setHomeAddress(e.target.value)}
						required
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="officeAddress"
						className="block text-sm font-medium text-gray-700">
						Office Address
					</label>
					<input
						type="text"
						id="officeAddress"
						value={officeAddress}
						onChange={(e) => setOfficeAddress(e.target.value)}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					/>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700">
						Phone Numbers
					</label>
					{phones.map((phone, index) => (
						<div
							key={index}
							className="flex items-center mt-2">
							<input
								type="tel"
								value={phone}
								onChange={(e) => handlePhoneChange(index, e.target.value)}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter phone number"
							/>
							{index > 0 && (
								<button
									type="button"
									onClick={() => handleRemovePhone(index)}
									className="ml-2 text-red-600 hover:text-red-800">
									<XCircle size={20} />
								</button>
							)}
						</div>
					))}
					<button
						type="button"
						onClick={handleAddPhone}
						className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						<PlusCircle
							size={16}
							className="mr-1"
						/>
						Add Phone
					</button>
				</div>
				<button
					type="submit"
					className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
					Create Customer
				</button>
			</form>
		</div>
	);
}
