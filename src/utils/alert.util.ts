import { t } from "i18next";
import Swal from "sweetalert2";
const processingDouble = () => {
	if (!Swal.isVisible()) {
		Swal.fire({
			title: "Processing",
			allowOutsideClick: false,
			allowEscapeKey: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});
	}
};
const processing = (text?: string) => {
	Swal.fire({
		title: text || "Processing",
		allowOutsideClick: false,
		allowEscapeKey: false,
		didOpen: () => {
			Swal.showLoading();
		},
	});
};
const failed = (text: string) => {
	const temp = text?.replace(/\"/g, "");
	if (temp !== "Invalid access token!") {
		Swal.fire({
			icon: "error",
			title: t("error.Oops..."),
			text: t(temp),
			timer: 15000,
		});
	}
};
const completed = () => {
	Swal.fire({
		icon: "success",
		showConfirmButton: false,
		title: t("success"),
		text: "",
		timer: 2000,
	});
};
const notification = (content: string) => {
	Swal.fire({
		position: "top-right",
		animation: true,
		icon: "success",
		title: content,
		timerProgressBar: true,
		showConfirmButton: false,
		toast: true,
		timer: 5000,
	});
};
interface warningAlertProps {
	title: string;
	onClose: VoidFunction;
}
const warning = (props: warningAlertProps) => {
	Swal.fire({
		icon: "warning",
		title: props.title ? props.title : "Unvalaiable feature!",
		text: "",
		timer: 3000,
		showConfirmButton: false,
	}).then((_result) => {
		props.onClose();
	});
};
interface confirmAlertProps {
	title: string;
	text: string;
	confirmButtonText: string;
	confirm: VoidFunction;
}
interface questionAlertProps {
	title: string;
	text: string;
	confirmButtonText: string;
	confirm: VoidFunction;
	close: VoidFunction;
}
const warningWithConfirm = (props: confirmAlertProps) => {
	Swal.fire({
		title: props.title,
		text: props.text,
		icon: "warning",
		showCancelButton: true,
		focusCancel: true,
		confirmButtonColor: "#283673",
		cancelButtonColor: "#d33",
		confirmButtonText: props.confirmButtonText,
		cancelButtonText: t("action.close"),
	}).then((result) => {
		if (result.isConfirmed) {
			props.confirm();
		}
	});
};
const questionWithConfirm = (props: questionAlertProps) => {
	Swal.fire({
		title: props.title,
		text: props.text,
		icon: "question",
		showCancelButton: true,
		focusConfirm: true,
		confirmButtonColor: "#283673",
		cancelButtonColor: "#c2c2c2",
		confirmButtonText: props.confirmButtonText,
		cancelButtonText: t("action.close"),
	}).then((result) => {
		if (result.isConfirmed) {
			props.confirm();
		} else {
			props.close();
		}
	});
};
const showMessageToast = (toast: any, type: string, message: string) => {
	toast.current.show({ severity: type, summary: t(type), detail: message, life: 5000 });
};
export {
	completed,
	failed,
	notification,
	processing,
	processingDouble,
	questionWithConfirm,
	showMessageToast,
	warning,
	warningWithConfirm,
};
