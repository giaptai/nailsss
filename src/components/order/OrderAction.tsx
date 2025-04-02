import { useFormik } from "formik";
import { t } from "i18next";
import _ from "lodash";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emptyImage from "../../assets/images/empty/empty_box_1.svg";
import {
	CheckRoleWithAction,
	getNameDiscount,
	PageTarget,
	StatusInitInprocessing,
	StatusValueOrder,
} from "../../const";
import { DiscountModel } from "../../models/category/Discount.model";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { ServiceModel } from "../../models/category/Service.model";
import {
	calculatorDiscount,
	updateListDiscount,
	UpdateListServiceClick,
	updateSaveDrag,
	updatetempService,
} from "../../slices/newOder.slice";
import { selectCustomerOrder } from "../../slices/customer.slice";
import { removeSelectedService } from "../../slices/service.slice";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import WtcSellGiftcard from "../../views/category/Giftcard/WtcSellGiftCard";
import ServicePosition from "../../views/category/Menu/ServicePosition";
import DynamicDialog from "../DynamicDialog";
import EmptyBox from "../commons/EmptyBox";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import WtcInputIconText from "../commons/WtcInputIconText";
import WtcListEmployeeTip from "../commons/WtcListEmployeeTip";
import ServiceChangePrice from "./ServiceChangePrice";
import { failed, warning, warningWithConfirm } from "../../utils/alert.util";
import LoadingIndicator from "../Loading";
import WtcOtherCharges from "./WtcOtherCharges";
import WtcRoleButton from "../commons/WtcRoleButton";
export default function OrderAction() {
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const auth = useAppSelector((state) => state.auth);
	const menuState = useAppSelector((state) => state.menu);
	const newOderState = useAppSelector((state) => state.newOder);
	const bodyHeight = screenSize.height;
	const ref = useRef<any>(null);
	const refDialog = useRef<any>(null);
	const [selectedService, setSelectedService] = useState<ServiceModel[]>([]);
	const [listDiscount, setListDiscount] = useState<DiscountModel[]>([]);
	const [selected, setSelected] = useState<ListServiceSelectedModel[]>(newOderState.tempService || []);
	const [ListServiceTip, setListServiceTip] = useState<ListServiceSelectedModel[]>(newOderState.tempService || []);
	const serviceState = useAppSelector((state) => state.service);
	const [dialogVisibleService, setDialogVisibleService] = useState(false);
	const [isFirstEditPrice, setIsFirstEditPrice] = useState(true);
	const [modifyMode, setModifyMode] = useState<"quantity" | "discount" | "price" | "">("quantity");
	const [actionDialog, setActionDialog] = useState<"tip" | "discount" | undefined>(undefined);
	const [keyboard, setKeyboard] = useState("");
	const [valuePercent, setValuePercent] = useState("");
	const [moneyDiscount, setMoneyDiscount] = useState<string>("0");
	const [typeQuickKey, setTypeQuickKey] = useState<"dollar" | "percent">("dollar");
	const [byDiscount, setByDiscount] = useState<
		"storeDiscount" | "coupons" | "storeEmployees" | "Empl" | "storeEmployee"
	>("storeDiscount");
	const [typeDiscount, setTypeDiscount] = useState("");
	const [ServiceClick, setServiceClick] = useState<ServiceModel>();
	const [ServiceTip, setServiceTip] = useState<ListServiceSelectedModel>();
	const [dialogVisibleTip, setDialogVisibleTip] = useState(false);
	const [dialogVisibleDiscount, setDialogVisibleDiscount] = useState(false);
	const [dialogVisibleSellGiftCard, setDialogVisibleSellGiftCard] = useState(false);
	const [dialogVisibleOtherCharges, setDialogVisibleOtherCharges] = useState(false);
	const isServiceClickGiftCard = (newOderState.ListServiceClick?.ListGiftCard?.length || 0) > 0 || false;
	const formik = useFormik<any>({
		initialValues: { coupon: "" },
		validate: (_data) => {
			return undefined;
		},
		onSubmit: (_data) => {},
	});
	const changeModifyMode = (mode: "quantity" | "discount" | "price" | "") => {
		setModifyMode(mode);
	};
	const handleKeyboardAction = (key: string) => {
		setKeyboard(key);
	};
	const handleClickSwitch = (key: string) => {
		setKeyboard(key);
		if (typeQuickKey == "dollar") setTypeQuickKey("percent");
		else if (typeQuickKey == "percent") setTypeQuickKey("dollar");
	};
	const handleClickAskForPrice = (service: ServiceModel | undefined) => {
		if (service?.askForPrice == "YES") {
			setDialogVisibleService(true);
			setServiceClick({ ...service, unit: 0 });
		} else {
			handleClick(service);
		}
	};
	const handleClick = (service: ServiceModel | undefined) => {
		setDialogVisibleService(false);
		setIsFirstEditPrice(true);
		setSelected((prevSelected) => {
			if (newOderState.ListServiceClick && service) {
				if (newOderState.ListServiceClick.status.code == StatusValueOrder.done) {
					warning({ title: t("warning_ser_done"), onClose: () => {} });
					return prevSelected;
				} else {
					const existingEmployeeIndex = prevSelected.findIndex(
						(item) => item._id === newOderState.ListServiceClick?._id
					);
					if (existingEmployeeIndex === -1) {
						return prevSelected;
					}
					const updatedSelected = [...prevSelected];
					const existingEmployee = updatedSelected[existingEmployeeIndex];
					const updatedEmployee = {
						...existingEmployee,
						ListService: [...(existingEmployee.ListService || []), service],
					};
					updatedSelected[existingEmployeeIndex] = updatedEmployee;
					dispatch(UpdateListServiceClick(updatedEmployee));
					dispatch(updateSaveDrag(true));

					return updatedSelected;
				}
			} else {
				const existingEmployeeIndex = prevSelected.findIndex(
					(item) => item.Employee == undefined || item.Employee == null
				);
				if (existingEmployeeIndex != -1 && service) {
					const updatedSelected = [...prevSelected];
					const updateService = updatedSelected[existingEmployeeIndex];
					const updatedEmployee = {
						...updateService,
						ListService: [...(updateService.ListService || []), service],
					};
					updatedSelected[existingEmployeeIndex] = updatedEmployee;
					dispatch(UpdateListServiceClick(updatedEmployee));
					dispatch(updateSaveDrag(true));

					return updatedSelected;
				} else if (service) {
					const newListServiceSelectedModel = new ListServiceSelectedModel(
						undefined,
						[service],
						undefined,
						uuidv4(),
						undefined,
						0,
						0,
						StatusInitInprocessing(),
						undefined,
						undefined
					);
					dispatch(UpdateListServiceClick(newListServiceSelectedModel));
					dispatch(updateSaveDrag(true));

					return [...prevSelected, newListServiceSelectedModel];
				} else {
					return prevSelected;
				}
			}
		});
	};
	const handleCloseService = () => {
		setIsFirstEditPrice(true);
		setDialogVisibleService(false);
	};
	const getServiceAtPosition = (position: number) => {
		return menuState?.ListServiceWithOrder?.find((item) => item.position == position);
	};
	const menuItemService = (item: any) => {
		return (
			<div className="">
				<ServiceChangePrice
					data={ServiceClick}
					index={1}
					onClickRemove={() => {
						dispatch(removeSelectedService(item));
						setDialogVisibleService(false);
					}}
					updateData={updateData}
				/>
			</div>
		);
	};
	const updateData = (newData: ServiceModel) => {
		const index = selectedService.findIndex((item) => item._id === newData._id);
		if (index !== -1) {
			const updatedService = [...selectedService.slice(0, index), newData, ...selectedService.slice(index + 1)];
			setSelectedService(updatedService);
		}
	};
	const calculateTotalDiscount = (): number => {
		return newOderState.tempService.reduce((total, item) => total + (item.discount || 0), 0);
	};
	const handleClickSubmitDiscount = () => {
		if (
			Number(moneyDiscount) >
			newOderState.totalAmount +
				newOderState.tax +
				newOderState.tip -
				(newOderState.storeDiscount + calculateTotalDiscount())
		) {
			failed(t("error_discountLarge"));
		} else if (Number(moneyDiscount) > 0 || formik.values.coupon != "") {
			if (typeDiscount && typeDiscount != "") {
				const newDiscount = new DiscountModel(
					uuidv4(),
					byDiscount,
					typeDiscount,
					Number(moneyDiscount),
					true,
					valuePercent,
					byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
						? undefined
						: newOderState.ListServiceClick?.Employee,
					formik.values.coupon
				);
				setListDiscount((prevList) => [...prevList, newDiscount]);
			} else {
				if (typeQuickKey == "dollar") {
					const newDiscount = new DiscountModel(
						uuidv4(),
						byDiscount,
						typeDiscount,
						Number(moneyDiscount),
						false,
						"",
						byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
							? undefined
							: newOderState.ListServiceClick?.Employee,
						formik.values.coupon
					);
					setListDiscount((prevList) => [...prevList, newDiscount]);
				} else {
					const newDiscount = new DiscountModel(
						uuidv4(),
						byDiscount,
						typeDiscount,
						Number(moneyDiscount),
						true,
						valuePercent,
						byDiscount == "coupons" || byDiscount == "storeDiscount" || byDiscount == "storeEmployees"
							? undefined
							: newOderState.ListServiceClick?.Employee,
						formik.values.coupon
					);
					setListDiscount((prevList) => [...prevList, newDiscount]);
				}
			}
			setTypeDiscount("");
			setValuePercent("");
			setMoneyDiscount("0");
			handleCloseDialogDiscount();
			dispatch(updateSaveDrag(true));
		} else {
			failed(t("error_discount0"));
		}
	};

	const updateTip = (id: string, newTip: number) => {
		const updatedSelected = ListServiceTip.map((item) => {
			if (item._id === id) {
				const returnValue = { ...item, tip: newTip };
				setServiceTip(returnValue);
				return returnValue;
			}

			return item;
		});
		setListServiceTip(updatedSelected);
	};
	const RemoveAllTip = () => {
		warningWithConfirm({
			title: t("remove_all_tip"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
				const updatedSelected = ListServiceTip.map((item) => ({
					...item,
					tip: 0,
				}));
				setListServiceTip(updatedSelected);
				setSelected(updatedSelected);
			},
		});
	};
	const handleClickAddTip = () => {
		setDialogVisibleTip(true);
		setListServiceTip(newOderState.tempService);
		// setListServiceTip(
		// 	newOderState.tempService.filter((item) => item?.ListGiftCard == undefined || item.ListGiftCard.length == 0)
		// );
		setActionDialog("tip");
	};
	const handleClickSellGiftCard = () => {
		setDialogVisibleSellGiftCard(true);
		setListServiceTip(newOderState.tempService);
	};
	const handleClickOtherCharges = () => {
		setDialogVisibleOtherCharges(true);
	};
	const handleClickAddDiscount = () => {
		setDialogVisibleDiscount(true);
		setActionDialog("discount");
	};
	const handleCloseDialogTip = () => {
		setDialogVisibleTip(false);
		setActionDialog(undefined);
		setServiceTip(undefined);
	};
	const handleCloseDialogDiscount = () => {
		setDialogVisibleDiscount(false);
		setActionDialog(undefined);
		setByDiscount("coupons");
	};
	const handleCloseDialogSellGiftCard = () => {
		setDialogVisibleSellGiftCard(false);
	};
	const handleCloseDialogOtherCharges = () => {
		setDialogVisibleOtherCharges(false);
	};
	const handleSubmitTip = () => {
		setSelected(ListServiceTip);
		dispatch(updateSaveDrag(true));
		handleCloseDialogTip();
	};
	const handleRemoveDiscount = (id?: string) => {
		if (id) {
			warningWithConfirm({
				title: t("do_you_delete"),
				text: "",
				confirmButtonText: t("Delete"),
				confirm: () => {
					const temp: DiscountModel[] = listDiscount.filter((discount) => discount._id !== id);
					setListDiscount(temp);
					dispatch(updateListDiscount(temp));
					dispatch(calculatorDiscount(temp));
				},
			});
		} else if (id == undefined && listDiscount.length > 0) {
			warningWithConfirm({
				title: t("remove_all_discount"),
				text: "",
				confirmButtonText: t("Delete"),
				confirm: () => {
					setListDiscount([]);
					dispatch(updateListDiscount([]));
					dispatch(calculatorDiscount([]));
				},
			});
		}
	};

	const onChangeTypeDiscount = (e: any) => {
		setByDiscount(e.value);
	};
	const handleOnChangeDiscountType = (e: any) => {
		setValuePercent((e.value / 100).toString());
		setTypeDiscount(e.type);
		let isOnlyStaff = false;
		let totalMoneyOnlyStaff = 0;

		if (byDiscount === "storeEmployee" || byDiscount === "Empl") {
			isOnlyStaff = true;
			totalMoneyOnlyStaff = newOderState.ListServiceClick?.ListService
				? newOderState.ListServiceClick.ListService.reduce((total, service) => {
						return total + service.storePrice * service.unit;
				  }, 0)
				: 0;
			totalMoneyOnlyStaff = Number(totalMoneyOnlyStaff.toFixed(2));
		}

		if (isOnlyStaff) {
			setMoneyDiscount((totalMoneyOnlyStaff * (e.value / 100)).toFixed(2).toString());
		} else {
			setMoneyDiscount((newOderState.totalAmount * (e.value / 100)).toFixed(2).toString());
		}
	};

	useEffect(() => {
		dispatch(updateListDiscount(listDiscount));
		dispatch(calculatorDiscount(listDiscount));
	}, [listDiscount]);

	useEffect(() => {
		if (selectedService != serviceState.selectedService) setSelectedService(serviceState.selectedService);
	}, [serviceState.selectedService]);
	useEffect(() => {
		setServiceClick(serviceState.item);
	}, [serviceState.item]);
	useEffect(() => {
		dispatch(selectCustomerOrder(undefined));
	}, []);
	useEffect(() => {
		dispatch(updatetempService(selected));
	}, [selected]);
	useEffect(() => {
		setSelected(newOderState.tempService);
	}, [newOderState.tempService]);
	useEffect(() => {
		dispatch(calculatorDiscount(newOderState.ListDiscount));
	}, [newOderState.totalAll]);
	useEffect(() => {
		if (!_.isEqual(newOderState.ListDiscount, listDiscount)) {
			setListDiscount(newOderState.ListDiscount);
		}
	}, [newOderState.ListDiscount]);
	useEffect(() => {
		const updatedItem: ServiceModel | undefined = ServiceClick ? { ...ServiceClick } : undefined;
		if (updatedItem) {
			updatedItem.totalPriceOrder = Number(updatedItem.storePrice * updatedItem.unit);
			updatedItem.totalPriceEmployee = Number(updatedItem.employeePrice * updatedItem.unit);
			setServiceClick(updatedItem);
		}
	}, [ServiceClick?.unit, ServiceClick?.storePrice]);

	useEffect(() => {
		if (actionDialog === "tip") {
			if (keyboard !== "") {
				switch (keyboard) {
					case "BACK":
						if (ServiceTip) {
							const oldValue = ServiceTip?.tip.toString();
							if (oldValue && oldValue.length === 1) {
								updateTip(ServiceTip?._id, 0);
							} else {
								const value = oldValue.slice(0, -1);
								updateTip(ServiceTip?._id, Number(value));
							}
						}
						break;
					case ".":
						if (ServiceTip) {
							const oldValue = ServiceTip.tip.toString();
							const existed = oldValue.includes(".");
							if (!existed) {
								const value1 = oldValue + ".001";
								const par = parseFloat(value1);
								updateTip(ServiceTip?._id, par);
							}
						}
						break;
					case "$1":
						if (ServiceTip) updateTip(ServiceTip?._id, 1);
						break;
					case "$2":
						if (ServiceTip) updateTip(ServiceTip?._id, 2);
						break;
					case "$3":
						if (ServiceTip) updateTip(ServiceTip?._id, 3);
						break;
					case "$4":
						if (ServiceTip) updateTip(ServiceTip?._id, 4);
						break;
					case "$5":
						if (ServiceTip) updateTip(ServiceTip?._id, 5);
						break;
					case "$6":
						if (ServiceTip) updateTip(ServiceTip?._id, 6);
						break;
					case "$7":
						if (ServiceTip) updateTip(ServiceTip?._id, 7);
						break;
					case "$8":
						if (ServiceTip) updateTip(ServiceTip?._id, 8);
						break;
					case "$9":
						if (ServiceTip) updateTip(ServiceTip?._id, 9);
						break;
					case "$10":
						if (ServiceTip) updateTip(ServiceTip?._id, 10);
						break;
					case "$12":
						if (ServiceTip) updateTip(ServiceTip?._id, 12);
						break;
					case "$15":
						if (ServiceTip) updateTip(ServiceTip?._id, 15);
						break;
					default:
						const value = ServiceTip?.tip === 0 ? keyboard : ServiceTip?.tip + keyboard;
						const existedDot = value.toString().includes(".");
						if (ServiceTip) {
							if (existedDot) {
								const stringArr = value.toString().split(".");
								const temp = stringArr[1];
								const tempValue = stringArr[0];
								if (temp.includes("001")) {
									if (keyboard == "0") {
										updateTip(ServiceTip?._id, Number(tempValue + "." + "002"));
									} else updateTip(ServiceTip?._id, Number(tempValue + "." + keyboard));
								} else if (temp.includes("002")) {
									updateTip(ServiceTip?._id, Number(tempValue + ".0" + keyboard));
								} else {
									if (temp.toString().length <= 2) updateTip(ServiceTip?._id, Number(value));
								}
							} else {
								updateTip(ServiceTip?._id, Number(value));
							}
						}
						break;
				}
			}
		} else if (actionDialog == "discount") {
			let isOnlyStaff = false;
			let totalMoneyOnlyStaff = 0;
			if (byDiscount == "storeEmployee" || byDiscount == "Empl") {
				isOnlyStaff = true;
				totalMoneyOnlyStaff = newOderState.ListServiceClick?.ListService
					? newOderState.ListServiceClick.ListService.reduce((total, service) => {
							return total + service.storePrice * service.unit;
					  }, 0)
					: 0;
			}
			if (keyboard !== "" && keyboard !== "Switch") {
				switch (keyboard) {
					case "BACK":
						if (moneyDiscount.length === 1) {
							setMoneyDiscount("0");
						} else {
							const value = moneyDiscount.slice(0, -1);
							setMoneyDiscount(value);
						}
						break;
					case ".":
						const existed = moneyDiscount.includes(".");
						if (!existed) {
							const value = moneyDiscount + ".";
							setMoneyDiscount(value);
						}
						break;
					case "$1":
						setMoneyDiscount("1");
						break;
					case "$2":
						setMoneyDiscount("2");
						break;
					case "$3":
						setMoneyDiscount("3");
						break;
					case "$5":
						setMoneyDiscount("5");
						break;
					case "$10":
						setMoneyDiscount("10");
						break;
					case "$15":
						setMoneyDiscount("15");
						break;
					case "$20":
						setMoneyDiscount("20");
						break;
					case "$25":
						setMoneyDiscount("25");
						break;
					case "$50":
						setMoneyDiscount("50");
						break;
					case "1%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.01).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.01).toString());
						setValuePercent("0.01");
						break;
					case "5%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.05).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.05).toString());
						setValuePercent("0.05");
						break;
					case "10%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.1).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.1).toString());
						setValuePercent("0.1");
						break;
					case "15%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.15).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.15).toString());
						setValuePercent("0.15");
						break;
					case "20%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.2).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.2).toString());
						setValuePercent("0.2");
						break;
					case "25%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.25).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.25).toString());
						setValuePercent("0.25");
						break;
					case "30%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.3).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.3).toString());
						setValuePercent("0.3");
						break;
					case "50%":
						if (isOnlyStaff) setMoneyDiscount((totalMoneyOnlyStaff * 0.5).toString());
						else setMoneyDiscount((newOderState.totalAmount * 0.5).toString());
						setValuePercent("0.5");
						break;
					case "100%":
						setValuePercent("1");
						if (isOnlyStaff) setMoneyDiscount(totalMoneyOnlyStaff.toString());
						else setMoneyDiscount(newOderState.totalAmount.toString());
						setMoneyDiscount(newOderState.totalAmount.toString());
						break;
					case "Clear":
						setMoneyDiscount("0");
						break;
					default:
						const value = moneyDiscount === "0" ? keyboard : moneyDiscount + keyboard;
						const existedDot = value.toString().includes(".");
						if (existedDot) {
							const stringArr = moneyDiscount.toString().split(".");
							const decimal = stringArr[1];
							if (decimal.toString().length < 2) {
								setMoneyDiscount(value);
							}
						} else {
							setMoneyDiscount(value);
						}
						break;
				}
			}
		} else if (keyboard !== "") {
			let oldValue = "";
			const updatedItem = ServiceClick ? { ...ServiceClick } : undefined;
			switch (modifyMode) {
				case "discount":
					//oldValue = ServiceClick.discount
					break;
				case "quantity":
					oldValue = ServiceClick?.unit.toString() || "0";
					break;
				case "price":
					if (isFirstEditPrice) {
						oldValue = "0";
						setIsFirstEditPrice(false);
					} else {
						oldValue = ServiceClick?.storePrice?.toString() || "";
					}
					break;
				default:
					break;
			}
			switch (keyboard) {
				case "+/-":
					let newValue = Number(oldValue);
					newValue = newValue > 0 ? -newValue : Math.abs(newValue);
					if (modifyMode === "discount") {
						newValue = 0;
					}
					if (updatedItem) {
						if (modifyMode === "price") updatedItem.storePrice = newValue;
						if (modifyMode === "quantity") updatedItem.unit = newValue;
						setServiceClick(updatedItem);
					}
					break;
				case "BACK":
					if (oldValue.length === 1) {
						if (updatedItem) {
							if (modifyMode === "quantity") updatedItem.unit = 0;
							if (modifyMode === "price") updatedItem.storePrice = 0;
							setServiceClick(updatedItem);
						}
					} else {
						if (updatedItem) {
							const value = oldValue.toString().slice(0, -1);
							if (modifyMode === "quantity") updatedItem.unit = Number(value);
							if (modifyMode === "price") updatedItem.storePrice = Number(value);
							setServiceClick(updatedItem);
						}
					}
					break;
				case ".":
					if (updatedItem) {
						if (modifyMode === "price") {
							const existed = oldValue.includes(".");
							if (!existed) {
								const value1 = oldValue + ".001";
								const par = parseFloat(value1);
								updatedItem.storePrice = par;
								setServiceClick(updatedItem);
							}
						}
					}
					break;
				default:
					const value = oldValue === "0" ? keyboard : oldValue + keyboard;
					const existedDot = value.toString().includes(".");
					if (updatedItem) {
						if (existedDot) {
							const stringArr = oldValue.toString().split(".");
							const temp = stringArr[1];
							const tempValue = stringArr[0];
							if (temp == "001") {
								if (modifyMode === "price") updatedItem.storePrice = Number(tempValue + "." + keyboard);
								setServiceClick(updatedItem);
							} else if (temp.toString().length < 2) {
								if (modifyMode === "price") updatedItem.storePrice = Number(value);
								setServiceClick(updatedItem);
							}
						} else {
							if (modifyMode === "price") updatedItem.storePrice = Number(value);
							if (modifyMode === "quantity") updatedItem.unit = Number(value);
							setServiceClick(updatedItem);
						}
					}
					break;
			}
		}
		setTimeout(() => {
			setKeyboard("");
		}, 100);
	}, [keyboard]);

	return (
		<>
			<div
				className="my-background-order"
				style={{
					borderRadius: "12px",
					height: bodyHeight == 0 ? 506 : bodyHeight - 196,
				}}
			>
				<WtcCard
					borderRadius={12}
					className="h-100 py-0 px-0"
					classNameBody="flex-grow-1 px-1 my-1 "
					body={
						<div
							className="row bg-white my-0 h-100 ms-0 p-1"
							style={{ borderRadius: 12, marginRight: "-10px" }}
						>
							<DndProvider backend={HTML5Backend}>
								<div className="row bg-white my-0 h-100" style={{ borderRadius: 12 }}>
									{serviceState.fetchState.status == "loading" ? (
										<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
											<LoadingIndicator />
										</div>
									) : menuState.orderItem != undefined ? (
										Array.from({ length: 16 }).map((_, index) => {
											const service = getServiceAtPosition(index + 1);
											return (
												<ServicePosition
													isLayoutOrder
													NoIcon
													NoCenter
													IsTax
													height={(bodyHeight - 210) / 4}
													NoDrag
													isUSer={false}
													key={index}
													index={index}
													selected={null}
													onClick={() => handleClickAskForPrice(service)}
													onShowDetails={() => handleClickAskForPrice(service)}
													service={service}
													moveCard={() => {}}
													onDrop={() => {}}
													onSwap={() => {}}
													isDisabled={
														isServiceClickGiftCard ||
														!CheckRoleWithAction(
															auth,
															PageTarget.order,
															newOderState.actionOrder == "add" ? "INS" : "UPD"
														)
													}
												/>
											);
										})
									) : (
										<>
											<div className="h-100 d-flex flex-column justify-content-center">
												<EmptyBox
													description={<>{t("please_menu")}</>}
													image={emptyImage}
													disabled={false}
												/>
											</div>
										</>
									)}
								</div>
							</DndProvider>
						</div>
					}
				/>
			</div>
			<div className="row mt-1" style={{ height: 50 }}>
				<div className="col-sm-3 mt-1">
					<WtcRoleButton
						action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
						target={PageTarget.order}
						label={t("add_discount")}
						disabled={selected.length == 0 || isServiceClickGiftCard}
						className="fs-value w-100 text-white wtc-bg-primary"
						height={40}
						onClick={handleClickAddDiscount}
					/>
				</div>
				<div className="col-sm-3 mt-1">
					<WtcRoleButton
						action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
						target={PageTarget.order}
						label={t("add_tip")}
						disabled={selected.length == 0}
						className="fs-value w-100 text-white wtc-bg-primary"
						height={40}
						onClick={handleClickAddTip}
					/>
				</div>
				<div className="col-sm-3 mt-1">
					<WtcRoleButton
						action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
						target={PageTarget.order}
						label={t("sell_giftcard")}
						className=" w-100 text-white wtc-bg-primary fs-value"
						height={40}
						onClick={handleClickSellGiftCard}
					/>
				</div>
				<div className="col-sm-3 mt-1">
					<WtcRoleButton
						action={newOderState.actionOrder == "add" ? "INS" : "UPD"}
						target={PageTarget.order}
						label={t("other_charges")}
						className=" w-100 text-white wtc-bg-primary fs-value"
						height={40}
						onClick={handleClickOtherCharges}
					/>
				</div>
			</div>
			<div ref={refDialog}>
				<DynamicDialog
					width={isMobile ? "60vw" : "38vw"}
					// minHeight={"100vh"}
					height={screenSize.height}
					visible={dialogVisibleService}
					mode={"add"}
					position={"center"}
					title={t("service")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseService}
					body={
						<>
							<div className="d-flex flex-column justify-content-between h-100">
								<div className="d-flex flex-column rounded w-100 h-100">
									<div className="w-100 px-1" style={{ height: 120 }}>
										<div className="row h-100 ps-2 pe-2">
											<WtcCard
												classNameBody="flex-grow-1 px-1 my-1"
												className="h-100"
												body={
													<div className="row">
														<div className="col-sm-12">{menuItemService(ServiceClick)}</div>
													</div>
												}
											/>
										</div>
									</div>
									<div style={{ height: screenSize.height - 419 }}>
										<div className="flex-grow-1 w-100 h-100 flex-fill ps-2 pe-2 pt-2" ref={ref}>
											<div className="row py-2">
												<div className="col-sm-3">
													<WtcButton
														label={"1"}
														className={`w-100 ${
															keyboard === "1"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("1")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"2"}
														className={`w-100 ${
															keyboard === "2"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("2")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"3"}
														className={`w-100 ${
															keyboard === "3"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("3")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"Qty"}
														className={`w-100 ${
															modifyMode === "quantity"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => changeModifyMode("quantity")}
													/>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-3">
													<WtcButton
														label={"4"}
														className={`w-100 ${
															keyboard === "4"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("4")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"5"}
														className={`w-100 ${
															keyboard === "5"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("5")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"6"}
														className={`w-100 ${
															keyboard === "6"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("6")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														disabled
														label={"%Disc"}
														className={`w-100 ${
															modifyMode === "discount"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => changeModifyMode("discount")}
													/>
												</div>
											</div>
											<div className="row py-2">
												<div className="col-sm-3">
													<WtcButton
														label={"7"}
														className={`w-100 ${
															keyboard === "7"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("7")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"8"}
														className={`w-100 ${
															keyboard === "8"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("8")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"9"}
														className={`w-100 ${
															keyboard === "9"
																? "text-white custom-primary-outline"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("9")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"Price"}
														className={`w-100 ${
															modifyMode === "price"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => changeModifyMode("price")}
													/>
												</div>
											</div>
											<div className="row ">
												<div className="col-sm-3">
													<WtcButton
														disabled
														label={"+/-"}
														className={`w-100 ${
															keyboard === "+/-"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("+/-")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={"0"}
														className={`w-100 ${
															keyboard === "0"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction("0")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														disabled={modifyMode === "quantity"}
														label={"."}
														className={`w-100 ${
															keyboard === "."
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => handleKeyboardAction(".")}
													/>
												</div>
												<div className="col-sm-3">
													<WtcButton
														label={""}
														icon="ri-delete-back-2-line"
														className={`w-100 ${
															keyboard === "BACK"
																? "text-white wtc-bg-primary"
																: "text-black wtc-bg-secondary-2"
														}`}
														fontSize={24}
														height={(screenSize.height - 290) / 4.9}
														onClick={() => setKeyboard("BACK")}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseService}
							/>
							<Button
								type="button"
								disabled={ServiceClick?.unit == 0}
								label={t("action.add")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-add-line"
								onClick={() => handleClick(ServiceClick)}
							/>
						</div>
					}
				/>
			</div>
			<div ref={refDialog}>
				<DynamicDialog
					width={isMobile ? "90vw" : "85vw"}
					// minHeight={"100vh"}
					height={screenSize.height - 130}
					visible={dialogVisibleTip}
					mode={"add"}
					position={"center"}
					title={t("tip")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialogTip}
					body={
						<div className="row h-100 w-100 py-1 ps-2">
							<div className="col-md-4 " style={{ height: screenSize.height - 275 }}>
								<WtcCard
									classNameBody="flex-grow-1 px-1 my-0"
									className="h-100"
									body={
										<div className="row">
											<div className="col-sm-12 mt-1">
												{ListServiceTip.filter(
													(item) =>
														item.Employee != undefined &&
														!(item.ListGiftCard && item.ListGiftCard.length > 0)
												).map((item, index) => {
													return (
														<div key={index}>
															<WtcListEmployeeTip
																selected={
																	ServiceTip?.Employee?._id == item.Employee?._id
																}
																item={item}
																onClick={() => setServiceTip(item)}
															/>
														</div>
													);
												})}
											</div>
										</div>
									}
								/>
							</div>
							<div className="col-md-4 h-100">
								<div className="h-75">
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$1"}
												className={`w-100 ${
													keyboard === "$1"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$1")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$2"}
												className={`w-100 ${
													keyboard === "$2"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$2")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$3"}
												className={`w-100 ${
													keyboard === "$3"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$3")}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$4"}
												className={`w-100 ${
													keyboard === "$4"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$4")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$5"}
												className={`w-100 ${
													keyboard === "$5"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$5")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$6"}
												className={`w-100 ${
													keyboard === "$6"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$6")}
											/>
										</div>
									</div>
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$7"}
												className={`w-100 ${
													keyboard === "$7"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$7")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$8"}
												className={`w-100 ${
													keyboard === "$8"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$8")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$9"}
												className={`w-100 ${
													keyboard === "$9"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$9")}
											/>
										</div>
									</div>
									<div className="row ">
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$10"}
												className={`w-100 ${
													keyboard === "$10"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$10")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$12"}
												className={`w-100 ${
													keyboard === "$12"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => handleKeyboardAction("$12")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												disabled={!ServiceTip}
												label={"$15"}
												className={`w-100 ${
													keyboard === "$15"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 265) / 6}
												onClick={() => setKeyboard("$15")}
											/>
										</div>
									</div>
								</div>
								<div className="h-25 mt-1">
									<div className="row h-100">
										<div className="col-sm-12 mt-1 p-2 py-3 fw-bold">
											<div className="fs-5">
												{t("tips")}:&ensp;
												<span className="text-danger fs-5">
													${" "}
													{toLocaleStringRefactor(
														toFixedRefactor(
															ListServiceTip.reduce(
																(total, current) => total + current.tip || 0,
																0
															),
															2
														)
													)}
												</span>
											</div>
										</div>
										<div className="col-sm-12 mt-1 h-50">
											<WtcButton
												label={t("remove_alltip")}
												className=" w-100 text-white bg-danger"
												height={45}
												onClick={RemoveAllTip}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 h-100">
								<div className="row py-1">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"1"}
											className={`w-100 ${
												keyboard === "1"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("1")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"2"}
											className={`w-100 ${
												keyboard === "2"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("2")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"3"}
											className={`w-100 ${
												keyboard === "3"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("3")}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"4"}
											className={`w-100 ${
												keyboard === "4"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("4")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"5"}
											className={`w-100 ${
												keyboard === "5"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("5")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"6"}
											className={`w-100 ${
												keyboard === "6"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("6")}
										/>
									</div>
								</div>
								<div className="row py-1">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"7"}
											className={`w-100 ${
												keyboard === "7"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("7")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"8"}
											className={`w-100 ${
												keyboard === "8"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("8")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"9"}
											className={`w-100 ${
												keyboard === "9"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("9")}
										/>
									</div>
								</div>
								<div className="row ">
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"."}
											className={`w-100 ${
												keyboard === "."
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction(".")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={"0"}
											className={`w-100 ${
												keyboard === "0"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("0")}
										/>
									</div>
									<div className="col-sm-4 ps-0">
										<WtcButton
											disabled={!ServiceTip}
											label={""}
											icon="ri-delete-back-2-line"
											className={`w-100 ${
												keyboard === "BACK"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary-2"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => setKeyboard("BACK")}
										/>
									</div>
								</div>
								{/* </div> */}
							</div>
						</div>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseDialogTip}
							/>
							<Button
								type="button"
								label={t("add_tip")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-add-line"
								onClick={handleSubmitTip}
							/>
						</div>
					}
				/>
			</div>
			<div ref={refDialog}>
				<DynamicDialog
					width={isMobile ? "90vw" : "85vw"}
					// minHeight={"100vh"}
					height={screenSize.height - 130}
					visible={dialogVisibleDiscount}
					mode={"add"}
					position={"center"}
					title={t("discount")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={handleCloseDialogDiscount}
					body={
						<div className="row h-100 w-100 py-1">
							<div className="col-md-4 ps-3" style={{ height: screenSize.height - 265 }}>
								<WtcCard
									classNameBody="flex-grow-1 px-1 my-0"
									className="h-100"
									body={
										<>
											<div style={{ height: 257 }}>
												<WtcCard
													hideBorder={false}
													title={<span className="fs-title">Discount By</span>}
													classNameBody="flex-grow-1 px-1 my-0"
													className="h-100"
													body={
														<div className="row">
															<div className="col-sm-12">
																<div className="flex flex-wrap row">
																	<div className="col-sm-5">
																		<div className="flex align-items-center p-1">
																			<RadioButton
																				inputId="ingredient1"
																				name={t("coupons")}
																				value="coupons"
																				style={{
																					width: "30px",
																					height: "30px",
																					alignItems: "center",
																				}} // Set size here
																				onChange={(e) =>
																					onChangeTypeDiscount(e)
																				}
																				checked={byDiscount === "coupons"}
																			/>
																			<label
																				htmlFor="ingredient1"
																				className="fs-title"
																			>
																				&ensp;{t("coupons")}
																			</label>
																		</div>
																	</div>
																	<div className="col-sm-7">
																		<div className="flex align-items-center p-1">
																			<RadioButton
																				inputId="ingredient2"
																				name={t("store_discount")}
																				value="storeDiscount"
																				style={{
																					width: "30px",
																					height: "30px",
																					alignItems: "center",
																				}} // Set size here
																				onChange={(e) =>
																					onChangeTypeDiscount(e)
																				}
																				checked={byDiscount === "storeDiscount"}
																			/>
																			<label
																				htmlFor="ingredient2"
																				className="fs-title"
																			>
																				&ensp;{t("store_discount")}
																			</label>
																		</div>
																	</div>
																	{newOderState.ListServiceClick?.Employee ? (
																		<>
																			<div className="col-sm-5">
																				<div className="d-flex align-items-center p-1">
																					<RadioButton
																						inputId="ingredient3"
																						name={t("store_empl")}
																						value="Empl"
																						style={{
																							width: "30px",
																							height: "30px",
																							alignItems: "center",
																						}} // Set size here
																						onChange={(e) =>
																							onChangeTypeDiscount(e)
																						}
																						checked={byDiscount === "Empl"}
																					/>
																					<label
																						htmlFor="ingredient3"
																						className="fs-title ms-2"
																					>
																						{newOderState.ListServiceClick
																							.Employee.profile
																							.firstName +
																							" " +
																							newOderState
																								.ListServiceClick
																								.Employee.profile
																								.lastName}
																					</label>
																				</div>
																			</div>
																			<div className="col-sm-7">
																				<div className="d-flex align-items-center p-1">
																					<RadioButton
																						inputId="ingredient4"
																						name={t("store_empl")}
																						value="storeEmployee"
																						style={{
																							width: "30px",
																							height: "30px",
																							alignItems: "center",
																						}}
																						onChange={(e) =>
																							onChangeTypeDiscount(e)
																						}
																						checked={
																							byDiscount ===
																							"storeEmployee"
																						}
																					/>
																					<label
																						htmlFor="ingredient4"
																						className="fs-title ms-2"
																					>
																						{t("store")}/
																						{newOderState.ListServiceClick
																							.Employee.profile
																							.firstName +
																							" " +
																							newOderState
																								.ListServiceClick
																								.Employee.profile
																								.lastName}
																					</label>
																				</div>
																			</div>
																		</>
																	) : (
																		<div className="col-sm-12 ps-0">
																			<div className="flex align-items-center p-2">
																				<RadioButton
																					inputId="ingredient3"
																					name={t("store_empl")}
																					value="storeEmployees"
																					style={{
																						width: "30px",
																						height: "30px",
																						alignItems: "center",
																					}} // Set size here
																					onChange={(e) =>
																						onChangeTypeDiscount(e)
																					}
																					checked={
																						byDiscount === "storeEmployees"
																					}
																				/>
																				<label
																					htmlFor="ingredient3"
																					className="fs-title"
																				>
																					&ensp;{t("store_empl")}
																				</label>
																			</div>
																		</div>
																	)}
																</div>
															</div>
															<div className="col-md-6" style={{ height: 72 }}>
																<WtcInputIconText
																	placeHolder={t("coupons")}
																	formik={formik}
																	value={formik.values.coupon}
																	maxLenght={20}
																	field="coupon"
																/>
															</div>
															<div className="col-md-6" style={{ height: 72 }}>
																<WtcDropdownIconText
																	filtler={false}
																	disabled={false}
																	placeHolder={t("discount_type")}
																	options={[
																		{
																			label: t("NONE"),
																			value: { type: "", value: 0 },
																		},
																		{
																			label: t("FACEBOOK 15%"),
																			value: { type: "FACEBOOK", value: 15 },
																		},
																		{
																			label: t("ZALO 15%"),
																			value: { type: "ZALO", value: 15 },
																		},
																		{
																			label: t("SKYPE 20%"),
																			value: { type: "SKYPE", value: 20 },
																		},
																	]}
																	field="discountType"
																	formik={formik}
																	value={formik.values.discountType}
																	onChange={(e) => {
																		console.log("🚀 ~ OrderAction ~ value:", e);
																		handleOnChangeDiscountType(e);
																	}}
																/>
															</div>
														</div>
													}
												/>
											</div>
											<div className="" style={{ height: screenSize.height - 558 }}>
												<div className="h-100 pe-1" style={{ overflowY: "auto" }}>
													{listDiscount.map((item, index) => {
														return (
															<div key={index}>
																{item.IsPercent ? (
																	<>
																		<div
																			className={`col-sm-12 w-100 margin-bottom-1`}
																		>
																			<div
																				style={{
																					borderRadius: 11,
																					height: 45,
																					border: "1px solid transparent",
																				}}
																			>
																				<div
																					className={`d-flex w-100 p-1 h-100 index-key`}
																					style={{
																						background: "#FCFCFD",
																						borderRadius: 11,
																						height: "100%",
																						border: "1px solid #F1F3F6",
																					}}
																				>
																					<div
																						className="ms-2 h-100 flex-grow-1"
																						style={{
																							overflow: "hidden",
																							whiteSpace: "nowrap",
																							textOverflow: "ellipsis",
																						}}
																					>
																						<div className="d-flex">
																							<div className="label-name-service p-1 flex-grow-1">
																								{getNameDiscount(item)}{" "}
																								-{" "}
																								<span className="wtc-text-primary fw-bold">
																									{Number(
																										item.ValuePercent
																									) * 100}
																									%
																								</span>{" "}
																							</div>
																							<div
																								className="label-name-service flex-shrink-1 w-25"
																								style={{
																									textAlign: "end",
																								}}
																							>
																								{
																									<i
																										className="fw-normal ri-delete-bin-line text-muted fs-4 p-2"
																										onClick={() =>
																											handleRemoveDiscount(
																												item._id
																											)
																										}
																									></i>
																								}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</>
																) : (
																	<>
																		<div
																			className={`col-sm-12 w-100 margin-bottom-1`}
																		>
																			<div
																				style={{
																					borderRadius: 11,
																					height: 45,
																					border: "1px solid transparent",
																				}}
																			>
																				<div
																					className={`d-flex w-100 p-1 h-100 index-key`}
																					style={{
																						background: "#FCFCFD",
																						borderRadius: 11,
																						height: "100%",
																						border: "1px solid #F1F3F6",
																					}}
																				>
																					<div
																						className="ms-2 h-100 flex-grow-1"
																						style={{
																							overflow: "hidden",
																							whiteSpace: "nowrap",
																							textOverflow: "ellipsis",
																						}}
																					>
																						<div className="d-flex">
																							<div className="label-name-service p-1 flex-grow-1">
																								{getNameDiscount(item)}{" "}
																								-{" "}
																								<span className="wtc-text-primary fw-bold">
																									${" "}
																									{toLocaleStringRefactor(
																										toFixedRefactor(
																											item.TotalDisscount,
																											2
																										)
																									)}
																								</span>{" "}
																							</div>
																							<div
																								className="label-name-service flex-shrink-1 w-25"
																								style={{
																									textAlign: "end",
																								}}
																							>
																								{
																									<i
																										className="fw-normal ri-delete-bin-line text-muted fs-4 p-2"
																										onClick={() =>
																											handleRemoveDiscount(
																												item._id
																											)
																										}
																									></i>
																								}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</>
																)}
															</div>
														);
													})}
												</div>
											</div>
										</>
									}
								/>
							</div>
							<div className="col-md-4 h-100">
								{typeQuickKey == "dollar" ? (
									<div className="h-75">
										<div className="row pb-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$1"}
													className={`w-100 ${
														keyboard === "$1"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$1")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$2"}
													className={`w-100 ${
														keyboard === "$2"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$2")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$3"}
													className={`w-100 ${
														keyboard === "$3"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$3")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$5"}
													className={`w-100 ${
														keyboard === "$5"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$5")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$10"}
													className={`w-100 ${
														keyboard === "$10"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$10")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$15"}
													className={`w-100 ${
														keyboard === "$15"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$15")}
												/>
											</div>
										</div>
										<div className="row py-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$20"}
													className={`w-100 ${
														keyboard === "$20"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$20")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$25"}
													className={`w-100 ${
														keyboard === "$25"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$25")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"$50"}
													className={`w-100 ${
														keyboard === "$50"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("$50")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-6">
												<WtcButton
													label={"Switch to %"}
													className={`w-100 ${
														keyboard === "Switch"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleClickSwitch("Switch")}
												/>
											</div>
											<div className="col-sm-6">
												<WtcButton
													label={"Clear"}
													className={`w-100 ${
														keyboard === "Clear"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => setKeyboard("Clear")}
												/>
											</div>
										</div>
									</div>
								) : (
									<div className="h-75">
										<div className="row pb-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"1%"}
													className={`w-100 ${
														keyboard === "1%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("1%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"5%"}
													className={`w-100 ${
														keyboard === "5%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("5%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"10%"}
													className={`w-100 ${
														keyboard === "10%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("10%")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"15%"}
													className={`w-100 ${
														keyboard === "15%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("15%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"20%"}
													className={`w-100 ${
														keyboard === "20%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("20%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"25%"}
													className={`w-100 ${
														keyboard === "25%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("25%")}
												/>
											</div>
										</div>
										<div className="row py-2">
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"30%"}
													className={`w-100 ${
														keyboard === "30%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("30%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"50%"}
													className={`w-100 ${
														keyboard === "50%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("50%")}
												/>
											</div>
											<div className="col-sm-4">
												<WtcButton
													disabled={!true}
													label={"100%"}
													className={`w-100 ${
														keyboard === "100%"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleKeyboardAction("100%")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-6">
												<WtcButton
													label={"Switch to $"}
													className={`w-100 ${
														keyboard === "Switch"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => handleClickSwitch("Switch")}
												/>
											</div>
											<div className="col-sm-6">
												<WtcButton
													label={"Clear"}
													className={`w-100 ${
														keyboard === "$15"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 260) / 6}
													onClick={() => setKeyboard("Clear")}
												/>
											</div>
										</div>
									</div>
								)}

								<div className="h-25 mt-1">
									<div className="row h-100">
										<div className="col-sm-12 mt-1 p-2 py-2">
											<div className="fs-5">
												{t("discount")}:&ensp;
												<span className="text-danger fs-4 fw-bold">
													${" "}
													{toLocaleStringRefactor(toFixedRefactor(Number(moneyDiscount), 2))}
												</span>
											</div>
										</div>
										<div className="col-sm-12 mt-1 h-50">
											<WtcButton
												label={t("remove_alldis")}
												className=" w-100 text-white bg-danger"
												height={45}
												disabled={listDiscount.length == 0}
												onClick={() => handleRemoveDiscount(undefined)}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4 h-100">
								<div className="row pb-2">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"1"}
											className={`w-100 ${
												keyboard === "1"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("1")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"2"}
											className={`w-100 ${
												keyboard === "2"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("2")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"3"}
											className={`w-100 ${
												keyboard === "3"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("3")}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"4"}
											className={`w-100 ${
												keyboard === "4"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("4")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"5"}
											className={`w-100 ${
												keyboard === "5"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("5")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"6"}
											className={`w-100 ${
												keyboard === "6"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("6")}
										/>
									</div>
								</div>
								<div className="row py-2">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"7"}
											className={`w-100 ${
												keyboard === "7"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("7")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"8"}
											className={`w-100 ${
												keyboard === "8"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("8")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"9"}
											className={`w-100 ${
												keyboard === "9"
													? "text-white custom-primary-outline"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("9")}
										/>
									</div>
								</div>
								<div className="row ">
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"."}
											className={`w-100 ${
												keyboard === "."
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction(".")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={"0"}
											className={`w-100 ${
												keyboard === "0"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => handleKeyboardAction("0")}
										/>
									</div>
									<div className="col-sm-4">
										<WtcButton
											disabled={!true}
											label={""}
											icon="ri-delete-back-2-line"
											className={`w-100 ${
												keyboard === "BACK"
													? "text-white wtc-bg-primary"
													: "text-black wtc-bg-secondary-2"
											}`}
											fontSize={24}
											height={(screenSize.height - 280) / 4.1}
											onClick={() => setKeyboard("BACK")}
										/>
									</div>
								</div>
							</div>
						</div>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={handleCloseDialogDiscount}
								style={{ height: 40 }}
							/>
							<Button
								type="button"
								label={t("add_discount")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-add-line"
								onClick={handleClickSubmitDiscount}
								style={{ height: 40 }}
							/>
						</div>
					}
				/>
			</div>
			{dialogVisibleSellGiftCard && <WtcSellGiftcard onClose={handleCloseDialogSellGiftCard} />}
			{dialogVisibleOtherCharges && (
				<WtcOtherCharges onClose={handleCloseDialogOtherCharges} onSubmit={handleClickAskForPrice} />
			)}
		</>
	);
}
