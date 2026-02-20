import { useState, useEffect } from 'react';

interface UseLocalStorageReturn<T> {
	value: T | null;
	setValue: (value: T | null) => void;
	removeValue: () => void;
}

export function useLocalStorage<T>(
	key: string,
	initialValue?: T,
): UseLocalStorageReturn<T> {
	const [value, setValue] = useState<T | null>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : (initialValue ?? null);
		} catch {
			return initialValue ?? null;
		}
	});

	useEffect(() => {
		try {
			if (value === null) {
				window.localStorage.removeItem(key);
			} else {
				window.localStorage.setItem(key, JSON.stringify(value));
			}
		} catch (error) {
			// Ignore write errors
		}
	}, [key, value]);

	const removeValue = () => setValue(null);

	return { value, setValue, removeValue };
}
