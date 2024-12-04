/** @format */

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserPage } from "./pages/UserPage";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { LoginPage } from "./pages/LoginPage";
import AuthProvider from "./hooks/auth/AuthProvider.jsx";
import PrivateRoute from "./hooks/auth/PrivateRoute.jsx";

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route
						path="/login"
						element={<LoginPage />}
					/>
					<Route element={<PrivateRoute />}>
						<Route
							path="/manager/*"
							element={<ManagerDashboard />}
						/>
						<Route
							path="/user"
							element={<UserPage />}
						/>
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}
