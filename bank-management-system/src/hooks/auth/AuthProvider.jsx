/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	const navigate = useNavigate();
	const loginAction = (data) => {
		console.log(data);
		axios
			.post("/api/sites/login", data)
			.then((res) => {
				setUser(res.data);
				setToken(res.data.UserCode);
				console.log(res);
				localStorage.setItem("site", res.data.UserCode);
				if (res.data.Role === "Manager") {
					navigate("/manager");
				} else if (res.data.Role === "Customer") {
					navigate("/user");
				}
			})
			.catch((err) => {
				if (err) {
					alert("Username or password is incorrect.");
				}
			});
	};

	const logOut = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("site");
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ token, user, loginAction, logOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
