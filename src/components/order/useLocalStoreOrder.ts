import { useEffect, useState } from "react";

export const useLocalStoreOrder = () => {
	const [checkInStateList, setCheckInStateList] = useState<any[]>([]);

	useEffect(() => {
		const storedList = localStorage.getItem(import.meta.env.VITE_APP_storageOrderTrash);
		setCheckInStateList(storedList ? JSON.parse(storedList) : []);
	}, []);

	const addCheckInState = (newCheckInState: any) => {
		const storedList = localStorage.getItem(import.meta.env.VITE_APP_storageOrderTrash);
		try {
			const parsedList = storedList ? JSON.parse(storedList) : [];
			if (Array.isArray(parsedList)) {
				const index = parsedList.findIndex((item: any) => item._idSave === newCheckInState._idSave);
				let updatedList;
				if (index !== -1) {
					parsedList[index] = newCheckInState;
					updatedList = [...parsedList];
				} else {
					updatedList = [...parsedList, newCheckInState];
				}
				setCheckInStateList(updatedList);
				localStorage.setItem(import.meta.env.VITE_APP_storageOrderTrash, JSON.stringify(updatedList));
			} else {
				localStorage.setItem(import.meta.env.VITE_APP_storageOrderTrash, JSON.stringify([newCheckInState]));
			}
		} catch (error) {
			console.error("Error parsing stored list:", error);
			localStorage.setItem(import.meta.env.VITE_APP_storageOrderTrash, JSON.stringify([newCheckInState]));
		}
	};

	const removeCheckInState = (idToRemove: string) => {
		const updatedList = checkInStateList.filter((item) => item._idSave !== idToRemove);
		setCheckInStateList(updatedList);
		localStorage.setItem(import.meta.env.VITE_APP_storageOrderTrash, JSON.stringify(updatedList));
	};

	return {
		checkInStateList,
		addCheckInState,
		removeCheckInState,
		clearCheckInStateList: () => {
			setCheckInStateList([]);
			localStorage.removeItem(import.meta.env.VITE_APP_storageOrderTrash);
		},
	};
};
