/** @format */

import { useState } from "react";
import axios from "axios";

export function useDataSending() {
	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const sendData = (url, data) => {
		setLoading(true);
		setError(null);

		axios
			.post(url, data)
			.then((response) => {
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				setResponse(response.data);
			})
			.catch((error) => {
				setError(
					error instanceof Error
						? error
						: new Error("An unknown error occurred"),
				);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { response, loading, error, sendData };
}
