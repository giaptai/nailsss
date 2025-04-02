import { format } from "date-fns-tz";
import { ListServiceSelectedModel } from "./models/category/ListServiceSelected.model";
import { toFixedRefactor, toLocaleStringRefactor } from "./utils/string.ultil";
import { DiscountModel } from "./models/category/Discount.model";
import { RoleService } from "./services/Role.service";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// import useWindowSize from "./app/screen";
export const MAX_IMAGE_SIZE = 100 * 1024;
export type StatusDropdownProps = {
	value: string;
	onChange: any;
	isProcess?: boolean;
	radius?: number;
	width?: number;
	height?: number;
	arrStatus?: string[];
};
export type Status = {
	code: string;
	value: string;
};
export const StatusInitOpen = (): Status => {
	return { code: "OPEN", value: "OPEN" };
};
export const StatusInitWait = (): Status => {
	return { code: "WAITING", value: "WAITING" };
};
export const StatusInitInprocessing = (): Status => {
	return { code: "INPROCESSING", value: "INPROCESSING" };
};
export const StatusValueOrder = {
	open: "OPEN",
	waiting: "WAITING",
	done: "DONE",
	inprocessing: "INPROCESSING",
};
export const ActionButtonOrder = {
	agree: "AGREE",
	reject: "REJECT",
	done: "DONE",
};
export const ActionSocket = {
	create: "create",
	update: "update",
};
export const ActionOrder = {
	add: "ADD",
	edit: "EDIT",
	transfer: "TRANSFER",
	delete: "DELETE",
};
export const ActionBooking = {
	add: "ADD",
	edit: "EDIT",
	transfer: "TRANSFER",
	delete: "DELETE",
};
export const convertArrayToObject = (array: any) => {
	return array.reduce((acc: any, curr: any, index: number) => {
		acc[`${index}`] = curr;
		return acc;
	}, {});
};
export const getCurrentFormattedDate = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};
export const scaleImage = (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		const MAX_SIZE = 1024 * 1024; // 1MB
		const img = new Image();
		img.onload = () => {
			let width = img.width;
			let height = img.height;
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Cannot get canvas context"));
				return;
			}
			let quality = 1; // Chất lượng ban đầu
			const MAX_WIDTH = 800;
			const MAX_HEIGHT = 600;
			do {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
				canvas.width = width;
				canvas.height = height;
				ctx.clearRect(0, 0, width, height); // Xóa bản vẽ trước đó
				ctx.drawImage(img, 0, 0, width, height);
				const dataUrl = canvas.toDataURL("image/jpeg", quality);
				const dataSize = dataUrl.length * 0.75;
				if (dataSize > MAX_SIZE) {
					quality -= 0.1;
				} else {
					canvas.toBlob(
						(blob: Blob | null) => {
							if (blob) {
								resolve(new File([blob], file.name, { type: file.type }));
							} else {
								reject(new Error("Failed to convert canvas to blob"));
							}
						},
						file.type,
						quality
					);
					return;
				}
			} while (quality > 0);
			reject(new Error("Failed to scale image within 1MB"));
		};
		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};
		img.src = URL.createObjectURL(file);
	});
};
export const handleAddValue = (
	value: string,
	values: string[],
	setValues: React.Dispatch<React.SetStateAction<string[]>>
) => {
	if (!values.includes(value)) {
		setValues([...values, value]);
	}
};
export const checkEmptyAndUndefined = (value: string | undefined) => {
	if (value == "" || value == undefined || value.trim().length === 0) return true;
	else return false;
};
export const checkEmptyAndUndefinedNumber = (value: number | undefined) => {
	if (value == null || value == undefined) return true;
	else return false;
};
export const states = [
	{ label: "Alaska", value: "Alaska" },
	{ label: "Alabama", value: "Alabama" },
	{ label: "Arkansas", value: "Arkansas" },
	{ label: "Arizona", value: "Arizona" },
	{ label: "California", value: "California" },
	{ label: "Colorado", value: "Colorado" },
	{ label: "Connecticut", value: "Connecticut" },
	{ label: "District of Columbia", value: "District of Columbia" },
	{ label: "Delaware", value: "Delaware" },
	{ label: "Florida", value: "Florida" },
	{ label: "Georgia", value: "Georgia" },
	{ label: "Hawaii", value: "Hawaii" },
	{ label: "Iowa", value: "Iowa" },
	{ label: "Idaho", value: "Idaho" },
	{ label: "IL", value: "Illinois" },
	{ label: "Illinois", value: "Indiana" },
	{ label: "Kansas", value: "Kansas" },
	{ label: "Kentucky", value: "Kentucky" },
	{ label: "Louisiana", value: "Louisiana" },
	{ label: "Massachusetts", value: "Massachusetts" },
	{ label: "Maryland", value: "Maryland" },
	{ label: "Maine", value: "Maine" },
	{ label: "Michigan", value: "Michigan" },
	{ label: "Minnesota", value: "Minnesota" },
	{ label: "Missouri", value: "Missouri" },
	{ label: "Mississippi", value: "Mississippi" },
	{ label: "Montana", value: "Montana" },
	{ label: "North Carolina", value: "North Carolina" },
	{ label: "North Dakota", value: "North Dakota" },
	{ label: "Nebraska", value: "Nebraska" },
	{ label: "New Hampshire", value: "New Hampshire" },
	{ label: "New Jersey", value: "New Jersey" },
	{ label: "New Mexico", value: "New Mexico" },
	{ label: "Nevada", value: "Nevada" },
	{ label: "New York", value: "NewYork" },
	{ label: "Ohio", value: "Ohio" },
	{ label: "Oklahoma", value: "Oklahoma" },
	{ label: "Oregon", value: "Oregon" },
	{ label: "Pennsylvania", value: "Pennsylvania" },
	{ label: "Rhode Island", value: "Rhode Island" },
	{ label: "South Carolina", value: "South Carolina" },
	{ label: "South Dakota", value: "South Dakota" },
	{ label: "Tennessee", value: "Tennessee" },
	{ label: "Texas", value: "Texas" },
	{ label: "Utah", value: "Utah" },
	{ label: "Virginia", value: "Virginia" },
	{ label: "Vermont", value: "Vermont" },
	{ label: "Washington", value: "Washington" },
	{ label: "Wisconsin", value: "Wisconsin" },
	{ label: "West Virginia", value: "West Virginia" },
	{ label: "Wyoming", value: "Wyoming" },
];
export const window_employee_row = 4;
export const window_employee_column = 6;
export const window_pos_row = 4;
export const window_pos_column = 5;
export const formatDateBirthday = (birthdayISOString: any) => {
	const birthdayDate = new Date(birthdayISOString);
	const year = birthdayDate.getFullYear();
	const month = (birthdayDate.getMonth() + 1).toString().padStart(2, "0");
	const day = birthdayDate.getDate().toString().padStart(2, "0");
	return `${month}/${day}/${year}`;
};

export const convertToISOString = (dateString: any) => {
	const [month, day, year] = dateString.split("/");
	const isoString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	return isoString;
};
export const convertISOToDateString = (isoString: any) => {
	const date = new Date(isoString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear().toString();
	return `${month}/${day}/${year}`;
};

export const convertISOToDateStringEditBirthday = (isoString: any) => {
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
};
export const isISOString = (str: string) => {
	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
	return isoRegex.test(str);
};
export const getNowDay = () => {
	const currentDate = new Date();
	return (
		(currentDate.getDate() < 10 ? "0" : "") +
		currentDate.getDate() +
		"/" +
		(currentDate.getMonth() + 1 < 10 ? "0" : "") +
		(currentDate.getMonth() + 1) +
		"/" +
		currentDate.getFullYear()
	);
};
export const CalDiscountListService = (data: ListServiceSelectedModel[]) => {
	return data.reduce((total, item) => total + (item.discount || 0), 0);
};
export function endOfDay(date: Date): Date {
	const end = new Date(date);
	end.setHours(23, 59, 59, 999);
	return end;
}
export function startOfDay(date: Date): Date {
	const end = new Date(date);
	end.setHours(0, 0, 0);
	return end;
}
export const MethodPayment = {
	CREDITCARD: "CREDIT_CARD",
	CASH: "CASH",
	GIFTCARD: "GIFT_CARD",
};
export const formatPhoneNumberViewUI = (phone: string): string => {
	const cleaned = ("" + phone).replace(/\D/g, "");
	const phonePattern = /^\(\d{3}\)\d{3}-\d{4}$/;
	if (phonePattern.test(phone)) {
		return phone;
	}

	if (cleaned.length === 10) {
		return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
	}
	return phone;
};
export const formatHidePhoneNumber = (phone: string): string => {
	const cleaned = ("" + phone).replace(/\D/g, "");
	if (cleaned.length >= 4) {
		return "***" + cleaned.replace(/.(?=.{4})/g, "");
	}

	return phone;
};

export const formatPhoneNumberSubmitDatabase = (phone: string): string => {
	const cleaned = ("" + phone).replace(/\D/g, "");
	return cleaned;
};
// "Fri Oct 04 2024 15:54:02 GMT+0700 (Indochina Time)" to Output: 2024-10-04
export const convertToYYYYMMDD = (dateString: string): string => {
	const date = new Date(dateString);

	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	return `${year}-${month}-${day}`;
};

//format money to string
export const FormatMoneyNumber = (input: number | string, valueFormat?: number) => {
	return toLocaleStringRefactor(toFixedRefactor(Number(input), valueFormat ?? 2));
};
export const FormatNumberSubmitData = (input: number | string, valueFormat?: number) => {
	return toFixedRefactor(Number(input), valueFormat ?? 2);
};
export const FormatMoneyToNumber = (input: number | string, valueFormat?: number) => {
	return toFixedRefactor(Number(input), valueFormat ?? 2);
};
//10-30-2024
export const formatDateTimeMMddYYYY = (date: Date | string) => {
	if (date) return format(date, "MM-dd-yyyy", { timeZone });
	else return "";
};
export const formatDateTimeYYYYMMdd = (date: Date | string) => {
	if (date) return format(date, "yyyy-MM-dd HH:mm", { timeZone });
	else return "";
};
//10-30-2024 10:20 am
export const formatDateTimeMMddYYYYHHmm = (date: Date | string) => {
	if (date) return format(date, "MM-dd-yyyy hh:mm a", { timeZone });
	else return "";
};
export const formatDateTimeMMddYYHHmm = (date: Date | string) => {
	if (date) return format(date, "MM-dd-yy hh:mm", { timeZone });
	else return "";
};
export const formatDateTimeYYYYMMDD = (date: Date | string) => {
	if (date) return format(date, "yyyy-MM-dd", { timeZone });
	else return "";
};
export type PaymentEmployeeModel = {
	from: string;
	to: string;
	employeeId: string;
};
export const PageTarget = {
	dashboard: "DASHBOARD",
	employee: "USER",
	role: "ROLE",
	profile: "PROFILE",
	ability: "ABILITY",
	customer: "CUSTOMER",
	service: "SERVICE",
	window: "WINDOW",
	giftcard: "GIFTCARD",
	menu: "MENU",
	storeconfig: "CONFIG",
	order: "ORDER",
	booking: "BOOKING",
	lang: "LANG",
	language: "LANGUAGE",
	orderdetail: "ORDERDETAIL",
	turn: "TURN",
	payment: "PAYMENT",
	checkin: "CHECKIN",
	report: "REPORT",
	store: "STORE",
	payroll: "PAYROLL",
};
export const getNameDiscount = (discount: DiscountModel): string => {
	switch (discount.DiscountBy) {
		case "storeDiscount":
			return "Store Discount";
		case "coupons":
			return "Coupons";
		case "Empl":
			return discount.Employee?.profile.firstName || "" + discount.Employee?.profile.lastName || "";
		case "storeEmployee":
			return "Store / " + discount.Employee?.profile.firstName || "" + discount.Employee?.profile.lastName || "";
		case "storeEmployees":
			return "Store/Employees";
		default:
			return "###";
	}
};
export const typeFilter = ["ALL", "PAID", "NOT_PAID"];
export const phoneGuestCustomer = "0000000000";
export const KeyStoreConfig = {
	name: "name",
	street1: "street1",
	street2: "street2",
	phone: "phone",
	location: "location",
	posStationName: "posStationName",
	taxRate: "taxRate",
	taxName: "taxName",
	maxGiftcardAmount: "maxGiftcardAmount",
	creditCardFeeAmount: "creditCardFeeAmount",
	creditCardFeeRate: "creditCardFeeRate",
	tipOnCreditCard: "tipOnCreditCard",
	isDeviceCreditCard: "isDeviceCreditCard",
};
export const formatCapitalize = (input: string) => {
	if (input)
		return input
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	else return input;
};
//Check Role
export const CheckRoleWithAction = (authState: any, target: string, action: string) => {
	return RoleService.isAllowAction(authState.role, target, action); //return true if allow
};
export const isCurrentTimeGreaterThanExpiration = (accessTokenExpiration: number): boolean => {
	const currentTimestamp = Math.floor(Date.now() / 1000);
	// So sánh => true nếu thời gian hiện tại lớn hơn
	return currentTimestamp > accessTokenExpiration;
};
export const getValueStoreConfig = (data: any, key: string) => {
	const item = data.find((item: any) => item.key === key);
	return item ? item.value : undefined;
};
