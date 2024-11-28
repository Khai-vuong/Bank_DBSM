/** @format */

import { Search } from "lucide-react";

function SearchBar({ placeholder = "Search...", onSearch }) {
	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const query = formData.get("search");
		onSearch(query);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full">
			<div className="relative">
				<input
					type="text"
					name="search"
					className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
					placeholder={placeholder}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pl-3">
					<Search className="w-5 h-5 text-gray-400" />
				</div>
				<button
					type="submit"
					className="absolute inset-y-0 right-0 flex items-center pr-3">
					<span className="sr-only">Submit search</span>
					<Search className="w-5 h-5 text-gray-400 hover:text-gray-600" />
				</button>
			</div>
		</form>
	);
}

export default SearchBar;
