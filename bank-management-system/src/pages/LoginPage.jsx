/** @format */

import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function LoginPage({ setAuth, setUser, user }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleLogin = (e) => {
		e.preventDefault();
		axios
			.post("/api/sites/login", { username, password })
			.then((response) => {
				if (response.data) {
					setAuth(true);
					setUser(JSON.parse(response.data.info));
					setUsername("");
					setPassword("");
					console.log(username);
					navigate("/");
				}
			})
			.catch((error) => {
				alert(error);
			});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-4">Login</h2>
				<form
					onSubmit={handleLogin}
					className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

LoginPage.propTypes = {
	setAuth: PropTypes.func.isRequired,
	setUser: PropTypes.func.isRequired,
};
