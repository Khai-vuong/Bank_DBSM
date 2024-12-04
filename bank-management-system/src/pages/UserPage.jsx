/** @format */
import { useAuth } from "../hooks/auth/authContext.js";
export function UserPage() {
	const auth = useAuth();
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">Welcome, user!</h1>
				<p className="text-xl">This is your personal banking dashboard.</p>
			</div>
			<div>
				<button
					className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
					onClick={() => {
						if (confirm("Are you sure you want to logout?")) {
							auth.logOut();
						}
					}}>
					Logout
				</button>
			</div>
		</div>
	);
}
