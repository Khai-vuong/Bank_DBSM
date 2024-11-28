/** @format */

import { Route, Routes } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { BranchesPage } from "./BranchesPage";
import { AccountsPage } from "./AccountsPage";
import { CustomersPage } from "./CustomersPage";
import { CustomerDetailPage } from "./CustomerDetailPage";
import { EmployeesPage } from "./EmployeesPage";

export function ManagerDashboard() {
	return (
		<div className="flex h-screen bg-gray-100">
			<AppSidebar />
			<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
				<Routes>
					<Route
						path="branches"
						element={<BranchesPage />}
					/>
					<Route
						path="accounts"
						element={<AccountsPage />}
					/>
					<Route
						path="customers"
						element={<CustomersPage />}
					/>
					<Route
						path="customers/:code"
						element={<CustomerDetailPage />}
					/>
					<Route
						path="employees"
						element={<EmployeesPage />}
					/>
				</Routes>
			</main>
		</div>
	);
}
