/** @format */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, XCircle } from "lucide-react";

export function CreateEmployeePage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [homeAddressNo, setHomeAddressNo] = useState("");
	const [homeAddressStreet, setHomeAddressStreet] = useState("");
	const [homeAddressDistrict, setHomeAddressDistrict] = useState("");
	const [homeAddressCity, setHomeAddressCity] = useState("");
	const [email, setEmail] = useState("");
	const [branchName, setBranchName] = useState("");
	const [phones, setPhones] = useState([""]);
	const [branches, setBranches] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchBranches();
	}, []);

	const fetchBranches = async () => {
		try {
			const response = await fetch("/api/branches");
			if (!response.ok) {
				throw new Error("Failed to fetch branches");
			}
			const data = await response.json();
			setBranches(data);
		} catch (err) {
			setError(err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		console.log(firstName);

		try {
			const response = await fetch("/api/employees", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					FirstName: firstName,
					LastName: lastName,
					BirthDate: birthDate,
					HomeAddressNo: homeAddressNo,
					HomeAddressStreet: homeAddressStreet,
					HomeAddressDistrict: homeAddressDistrict,
					HomeAddressCity: homeAddressCity,
					Email: email,
					BranchName: branchName,
					Phones: phones.filter((phone) => phone.trim() !== "").join(","),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to create customer");
			}

			//Employee created successfully
			navigate("/manager/employees");
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
				<div className="grid grid-cols-4 gap-4">
					<div className="col-span-2">
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
					<div className="col-span-2">
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
					<div className="col-span-1">
						<label
							htmlFor="birthDate"
							className="block text-sm font-medium text-gray-700">
							Birth Date
						</label>
						<input
							type="date"
							id="birthDate"
							value={birthDate}
							onChange={(e) => setBirthDate(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div className="col-span-3">
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
					<div className="col-span-1">
						<label
							htmlFor="homeAddressNo"
							className="block text-sm font-medium text-gray-700">
							Home Address No
						</label>
						<input
							type="text"
							id="homeAddressNo"
							value={homeAddressNo}
							onChange={(e) => setHomeAddressNo(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div className="col-span-1">
						<label
							htmlFor="homeAddressStreet"
							className="block text-sm font-medium text-gray-700">
							Home Address Street
						</label>
						<input
							type="text"
							id="homeAddressStreet"
							value={homeAddressStreet}
							onChange={(e) => setHomeAddressStreet(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div className="col-span-1">
						<label
							htmlFor="homeAddressDistrict"
							className="block text-sm font-medium text-gray-700">
							Home Address District
						</label>
						<input
							type="text"
							id="homeAddressDistrict"
							value={homeAddressDistrict}
							onChange={(e) => setHomeAddressDistrict(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div className="col-span-1">
						<label
							htmlFor="homeAddressCity"
							className="block text-sm font-medium text-gray-700">
							Home Address City
						</label>
						<input
							type="text"
							id="homeAddressCity"
							value={homeAddressCity}
							onChange={(e) => setHomeAddressCity(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>
					<div className="col-span-4">
						<label
							htmlFor="branchName"
							className="block text-sm font-medium text-gray-700">
							Branch Name
						</label>
						<select
							id="branchName"
							value={branchName}
							onChange={(e) => setBranchName(e.target.value)}
							required
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							<option value="">Select a branch</option>
							{branches.map((branch) => (
								<option
									key={branch.BranchName}
									value={branch.BranchName}>
									{branch.BranchName}
								</option>
							))}
						</select>
					</div>
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
				<div className="mt-6">
					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
						Create Customer
					</button>
				</div>
			</form>
		</div>
	);
}
