/** @format */

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
	Building2,
	Users,
	CreditCard,
	UserSquare2,
	StickyNote,
} from "lucide-react";

const menuItems = [
	{ title: "Branches", icon: Building2, url: "/manager/branches" },
	{ title: "Accounts", icon: CreditCard, url: "/manager/accounts" },
	{ title: "Customers", icon: Users, url: "/manager/customers" },
	{ title: "Employees", icon: UserSquare2, url: "/manager/employees" },
	{
		title: "Employees Serve",
		icon: StickyNote,
		url: "/manager/employees/serve",
	},
];

export function AppSidebar({ setAuth, setUser }) {
	return (
		<aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
			<nav className="flex flex-col h-full">
				<h1 className="text-2xl font-bold mb-6">Bank Management</h1>
				<ul>
					{menuItems.map((item) => (
						<li
							key={item.title}
							className="mb-2">
							<Link
								to={item.url}
								className="flex items-center p-2 rounded hover:bg-gray-700">
								<item.icon className="mr-2 h-5 w-5" />
								<span>{item.title}</span>
							</Link>
						</li>
					))}
				</ul>
				<button
					className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
					onClick={() => {
						if (confirm("Are you sure you want to logout?")) {
							setAuth(false);
							setUser(null);
						}
					}}>
					Logout
				</button>
			</nav>
		</aside>
	);
}

AppSidebar.propTypes = {
	setAuth: PropTypes.func.isRequired,
	setUser: PropTypes.func.isRequired,
};
