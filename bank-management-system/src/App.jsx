/** @format */

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { UserPage } from "./pages/UserPage";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { LoginPage } from "./pages/LoginPage";
import { useState } from "react";

export default function App() {
	const [user, setUser] = useState({});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	// For simplicity, we'll use a dummy authentication state

	return (
		<Router>
			<Routes>
				<Route
					path="/login"
					element={
						<LoginPage
							setAuth={setIsAuthenticated}
							setUser={setUser}
							user={user}
						/>
					}
				/>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							user.Role === "Manager" ? (
								<Navigate
									to="/manager"
									replace
								/>
							) : (
								<Navigate
									to="/user"
									replace
								/>
							)
						) : (
							<Navigate
								to="/login"
								replace
							/>
						)
					}
				/>
				<Route
					path="/user"
					element={
						isAuthenticated && user.Role === "Customer" ? (
							<UserPage
								setAuth={setIsAuthenticated}
								setUser={setUser}
								user={user}
							/>
						) : (
							<Navigate
								to="/login"
								replace
							/>
						)
					}
				/>
				<Route
					path="/manager/*"
					element={
						isAuthenticated && user.Role === "Manager" ? (
							<ManagerDashboard
								setAuth={setIsAuthenticated}
								setUser={setUser}
								user={user}
							/>
						) : (
							<Navigate
								to="/login"
								replace
							/>
						)
					}
				/>
			</Routes>
		</Router>
	);
}
