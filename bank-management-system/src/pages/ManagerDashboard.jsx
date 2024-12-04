/** @format */

import { Navigate, Route, Routes } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { BranchesPage } from "./BranchesPage";
import { AccountsPage } from "./AccountsPage";
import { AccountDetailPage } from "./AccountDetailPage";
import { CustomersPage } from "./CustomersPage";
import { CustomerDetailPage } from "./CustomerDetailPage";
import { EmployeesPage } from "./EmployeesPage";
import { EmployeeDetailPage } from "./EmployeeDetailPage";
import { CreateAccountPage } from "./CreateAccountPage";
import { CreateCustomerPage } from "./CreateCustomerPage";
import { CreateEmployeePage } from "./CreateEmployeePage";
import { EmployeeServePage } from "./EmployeeServePage";

export function ManagerDashboard() {
	return (
		<div className="flex h-screen bg-gray-100">
			<AppSidebar />
			<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
				<Routes>
					<Route
						path="/"
						element={
							<Navigate
								to="branches"
								replace
							/>
						}
					/>
					<Route
						path="branches"
						element={<BranchesPage />}
					/>
					<Route
						path="accounts"
						element={<AccountsPage />}
					/>
					<Route
						path="accounts/:type/:code"
						element={<AccountDetailPage />}
					/>
					<Route
						path="accounts/create"
						element={<CreateAccountPage />}
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
						path="customers/create"
						element={<CreateCustomerPage />}
					/>
					<Route
						path="employees"
						element={<EmployeesPage />}
					/>
					<Route
						path="employees/:code"
						element={<EmployeeDetailPage />}
					/>
					<Route
						path="employees/create"
						element={<CreateEmployeePage />}
					/>
					<Route
						path="employees/serve"
						element={<EmployeeServePage />}
					/>
				</Routes>
			</main>
		</div>
	);
}
