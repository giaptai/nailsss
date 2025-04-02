import { useState } from "react";
import Cookies from "js-cookie";

export const useCookie = (cookieName: string) => {
	const [cookieValue, setCookieValue] = useState<string | undefined>(() => Cookies.get(cookieName));
	const saveCookie = (value: string, expiresInDays: number = 1) => {
		Cookies.set(cookieName, value, { expires: expiresInDays });
		setCookieValue(value);
	};

	const getCookie = () => {
		return Cookies.get(cookieName);
	};

	const removeCookie = () => {
		Cookies.remove(cookieName);
		setCookieValue(undefined);
	};

	return {
		cookieValue,
		saveCookie,
		getCookie,
		removeCookie,
	};
};
