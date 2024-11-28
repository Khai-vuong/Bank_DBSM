/** @format */

import { useState } from "react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { useDataSending } from "../hooks/useDataSending";

export default function FormModalAddCustomer({ isShowing, toggle }) {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		homeAddress: "",
		offAddress: "",
		phone: "",
	});

	const { response, loading, error, sendData } = useDataSending();

	const formValidation = () => {
		if (
			!form.firstName ||
			!form.lastName ||
			!form.email ||
			!form.homeAddress ||
			!form.offAddress ||
			!form.phone
		) {
			return false;
		}
		return true;
	};

	return (
		<Dialog
			open={isShowing || !loading || !error || !response}
			onClose={toggle}
			className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
						<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<form>
								<div className="space-y-12">
									<div className="border-b border-gray-900/10 pb-12">
										<h2 className="text-base/7 font-semibold text-gray-900">
											Personal Information
										</h2>
										<p className="mt-1 text-sm/6 text-gray-600">
											Use a permanent address where you can receive mail.
										</p>

										<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
											<div className="sm:col-span-3">
												<label
													htmlFor="first-name"
													className="block text-sm/6 font-medium text-gray-900">
													First name
												</label>
												<div className="mt-2">
													<input
														id="first-name"
														name="first-name"
														type="text"
														autoComplete="given-name"
														value={form.firstName}
														onChange={(e) =>
															setForm({ ...form, firstName: e.target.value })
														}
														required
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>

											<div className="sm:col-span-3">
												<label
													htmlFor="last-name"
													className="block text-sm/6 font-medium text-gray-900">
													Last name
												</label>
												<div className="mt-2">
													<input
														id="last-name"
														name="last-name"
														type="text"
														autoComplete="family-name"
														value={form.lastName}
														onChange={(e) =>
															setForm({ ...form, lastName: e.target.value })
														}
														required
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>

											<div className="sm:col-span-4">
												<label
													htmlFor="email"
													className="block text-sm/6 font-medium text-gray-900">
													Email address
												</label>
												<div className="mt-2">
													<input
														id="email"
														name="email"
														type="email"
														autoComplete="email"
														value={form.email}
														onChange={(e) =>
															setForm({ ...form, email: e.target.value })
														}
														required
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>

											<div className="sm:col-span-4">
												<label
													htmlFor="home-address"
													className="block text-sm/6 font-medium text-gray-900">
													Home address
												</label>
												<div className="mt-2">
													<input
														id="home-address"
														name="home-address"
														type="text"
														autoComplete="address-level1"
														value={form.homeAddress}
														onChange={(e) =>
															setForm({ ...form, homeAddress: e.target.value })
														}
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>

											<div className="sm:col-span-4">
												<label
													htmlFor="office-address"
													className="block text-sm/6 font-medium text-gray-900">
													Office address
												</label>
												<div className="mt-2">
													<input
														id="office-address"
														name="office-address"
														type="text"
														autoComplete="address-level2"
														value={form.offAddress}
														onChange={(e) =>
															setForm({ ...form, offAddress: e.target.value })
														}
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>

											<div className="sm:col-span-4">
												<label
													htmlFor="phone-number"
													className="block text-sm/6 font-medium text-gray-900">
													Phone number
												</label>
												<div className="mt-2">
													<input
														id="phone-number"
														name="phone-number"
														type="tel"
														autoComplete="tel"
														value={form.phone}
														onChange={(e) =>
															setForm({
																...form,
																phone: e.target.value.split(" ").join(""),
															})
														}
														required
														className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button
								type="button"
								onClick={() => {
									console.log(form);
									if (response) {
										toggle(false);
									} else if (formValidation()) {
										sendData("/api/customers", form);
									}
								}}
								className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
								Create Customer
							</button>
							<button
								type="button"
								data-autofocus
								onClick={() => toggle(false)}
								className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
								Cancel
							</button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
