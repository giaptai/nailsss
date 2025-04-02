import { t } from "i18next";

export type httpErrorType = {
	statusCode: any;
	message: string;
};
const getErrorMessages = (): Record<string, string> => ({
	"Phone already exists!": t("Phone already exists!"),
	"Invalid email": t("Invalid email"),
	"Request failed with status code 422": t("Request failed with status code 422"),
});
// export const parseHttpError = (rejectPayload: any) => {
// 	debugger;
// 	const errorObj = Object(rejectPayload);
// 	//console.log("parse Error",errorObj)
// 	const err_code = errorObj.statusCode === undefined ? 500 : errorObj.statusCode;
// 	const err_message = errorObj.message ?? "Network Error";
// 	let error: httpErrorType = { statusCode: err_code, message: err_message };
// 	return error;
// };
export const parseHttpErrorResponse = (rejectPayload: any) => {
	const errorObj = Object(rejectPayload?.response?.data);
	const errCode = errorObj.status ?? 500;
	const errMessage = errorObj.message ?? "Network Error";
	const errorMessages = getErrorMessages();
	const userFriendlyMessage = errorMessages[errMessage] || errMessage;
	const error: httpErrorType = {
		statusCode: errCode,
		message: userFriendlyMessage,
	};

	return error;
};
export const parseHttpError = (rejectPayload: any) => {
	const errorObj = Object(rejectPayload?.response?.data);
	const errCode = errorObj.status ?? 500;
	const errMessage = errorObj.message ?? "Network Error";
	const errorMessages = getErrorMessages();
	const userFriendlyMessage = errorMessages[errMessage] || errMessage;
	const error: httpErrorType = {
		statusCode: errCode,
		message: userFriendlyMessage,
	};

	return error;
};
