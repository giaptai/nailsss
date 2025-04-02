import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import DynamicDialog, { DialogMode } from "../../../components/DynamicDialog";
import WtcButton from "../../../components/commons/WtcButton";
import WtcCard from "../../../components/commons/WtcCard";
import WtcInputChooseColor from "../../../components/commons/WtcInputChooseColor";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import { checkEmptyAndUndefined, checkEmptyAndUndefinedNumber, handleAddValue, PageTarget } from "../../../const";
import { MenuModel } from "../../../models/category/Menu.model";
import { ServiceModel } from "../../../models/category/Service.model";
import { RoleService } from "../../../services/Role.service";
import {
	addServicesMenu,
	deleteMenus,
	deleteServiceInMenu,
	resetActionStateMenu,
	restoreMenus,
	updateMenus,
	UpdatePosition,
	updateServiceEditState,
} from "../../../slices/menu.slice";
import { resetActionStateService, updatePosition, updateServices } from "../../../slices/service.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";
import ServicePosition from "./ServicePosition";

export default function MenuItem() {
	const Backend = isBrowser ? HTML5Backend : TouchBackend;
	const difref = React.useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const serviceState = useAppSelector((state) => state.service);
	const menuState = useAppSelector((state) => state.menu);
	const [values, setValues] = useState<string[]>([]);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [indexPosition, setIndexPosition] = useState<number | null>(null);
	const role = useAppSelector((state) => state.auth.role);
	const disabledServiceAdd = !RoleService.isAllowAction(role, PageTarget.service, "INS");
	const disabledServiceEdit =
		!RoleService.isAllowAction(role, PageTarget.service, "RES") &&
		!RoleService.isAllowAction(role, PageTarget.service, "DEL") &&
		!RoleService.isAllowAction(role, PageTarget.service, "UPD");

	const closeDialog = () => {
		setValues([]);
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikService.resetForm();
	};
	const formikService = useFormik<any>({
		initialValues: ServiceModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<ServiceModel> = {};
			if (dialogMode == "add") {
				if (checkEmptyAndUndefined(data.displayName) && values.includes("displayName")) {
					errors.displayName = "y";
				}
				if (checkEmptyAndUndefined(data.name) && values.includes("name")) {
					errors.name = "y";
				}
				if (checkEmptyAndUndefined(data.type) && values.includes("type")) {
					errors.type = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.storePrice) && values.includes("storePrice")) {
					errors.storePrice = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.employeePrice) && values.includes("employeePrice")) {
					errors.employeePrice = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.turn) && values.includes("turn")) {
					errors.turn = "y";
				}
			} else {
				if (!data.displayName) {
					errors.displayName = "y";
				}
				if (!data.name) {
					errors.name = "y";
				}
				// if (!data.menu) {
				//     errors.menuId = 'y'
				// }
				if (!data.type) {
					errors.type = "y";
				}
				if (!data.storePrice) {
					errors.storePrice = "y";
				}
				if (!data.employeePrice) {
					errors.employeePrice = "y";
				}
				if (!data.turn) {
					errors.turn = "y";
				}
				// if (!data.sortOrder) {
				//     errors.sortOrder = 'y'
				// }
			}
			return errors;
		},
		onSubmit: (data) => {
			console.log(data);
			if (dialogMode == "add") {
				const submitData = {
					name: data.name,
					displayName: data.displayName,
					storePrice: data.storePrice,
					employeePrice: data.employeePrice,
					menuId: menuState.item?._id,
					tax: data.tax == "YES" ? true : false,
					type: data.type,
					askForPrice: data.askForPrice == "YES" ? true : false,
					turn: data.turn,
					// sortOrder: data.sortOrder,
					position: indexPosition,
					note: data.note || null,
					color: data.color,
					isShowCheckin: data.isShowCheckin == "true" ? true : false,
				};
				dispatch(addServicesMenu(submitData));
				// const submitDataState = {
				// 	name: data.name,
				// 	displayName: data.displayName,
				// 	storePrice: data.storePrice,
				// 	employeePrice: data.employeePrice,
				// 	menuId: menuState.item?._id,
				// 	tax: data.tax,
				// 	type: data.type,
				// 	askForPrice: data.askForPrice,
				// 	turn: data.turn,
				// 	// sortOrder: data.sortOrder,
				// 	position: indexPosition,
				// 	note: data.note || null,
				// 	color: data.color,
				// 	isShowCheckin: data.isShowCheckin,
				// };
				// dispatch(addServiceMenu(submitDataState));
			} else if (dialogMode == "edit") {
				const submitData = {
					name: data.name,
					displayName: data.displayName,
					storePrice: data.storePrice,
					employeePrice: data.employeePrice,
					menuId: menuState.item?._id,
					tax: data.tax == "YES" ? true : false,
					type: data.type,
					askForPrice: data.askForPrice == "YES" ? true : false,
					turn: data.turn,
					// sortOrder: data.sortOrder,
					note: data.note || null,
					color: data.color,
					isShowCheckin: data.isShowCheckin == "true" ? true : false,
				};
				dispatch(updateServices({ _id: data._id, data: submitData }));
				const submitDataState = {
					askForPrice: data.askForPrice,
					color: data.color,
					displayName: data.displayName,
					employeePrice: data.employeePrice,
					isShowCheckin: data.isShowCheckin == "true" ? true : false,
					menuId: menuState.item?._id || "",
					menu: menuState.item,
					name: data.name,
					note: data.note || null,
					position: data.position || null,
					status: data.status,
					storePrice: data.storePrice,
					tax: data.tax,
					type: data.type,
					turn: data.turn,
					_id: data._id,
				};
				dispatch(updateServiceEditState({ _id: data._id, data: submitDataState }));
			}
			setValues([]);
		},
	});

	const formikMenu = useFormik<any>({
		initialValues: menuState.item,
		validate: (data) => {
			const errors: FormikErrors<MenuModel> = {};

			if (!data?.name) {
				errors.name = "y";
			}
			if (!data?.code) {
				errors.code = "y";
			}
			return errors;
		},
		onSubmit: (data) => {
			console.log(data);
			const submitData = {
				name: data.name,
				code: data.code,
				color: data.color,
			};
			dispatch(updateMenus({ _id: data._id, data: submitData }));
		},
	});
	const getServiceAtPorsition = (position: number) => {
		return menuState.ListServiceWithItem.find((item) => item.position == position);
	};
	const handleClickShowDetails = (index: number) => {
		if (!disabledServiceEdit) {
			formikService.setValues(getServiceAtPorsition(index + 1));
			setDialogMode("edit");
			setDialogVisible(true);
		}
	};
	const handleDeleteMenus = (id: string) => {
		dispatch(deleteMenus(id));
	};
	const handleRestoreMenus = (id: string) => {
		dispatch(restoreMenus(id));
	};
	const handleClickPositionService = (index: number) => {
		if (!disabledServiceAdd) {
			setDialogMode("add");
			setDialogVisible(true);
			setIndexPosition(index + 1);
		}
	};
	const handleDrop = useCallback((dragIndex: any, _hoverIndex: any, id: any) => {
		const submitData = {
			position: dragIndex + 1,
		};
		dispatch(updatePosition({ _id: id, data: submitData }));
		dispatch(UpdatePosition({ _id: id, position: dragIndex + 1 }));
	}, []);
	const handleSwap = useCallback((dragIndex: number, dragId: string, hoverIndex: number, hoverId: string) => {
		dispatch(updatePosition({ _id: dragId, data: { position: hoverIndex } }));
		dispatch(UpdatePosition({ _id: dragId, position: hoverIndex }));
		dispatch(updatePosition({ _id: hoverId, data: { position: dragIndex } }));
		dispatch(UpdatePosition({ _id: hoverId, position: dragIndex }));
	}, []);
	const handledeleteService = (id: string) => {
		dispatch(deleteServiceInMenu(id));
	};
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikService.values.name) ||
			checkEmptyAndUndefined(formikService.values.displayName) ||
			checkEmptyAndUndefined(formikService.values.displayName) ||
			// checkEmptyAndUndefined(formikService.values.menuId) ||
			!formikService.values.askForPrice ||
			!formikService.values.tax ||
			checkEmptyAndUndefinedNumber(formikService.values.storePrice) ||
			checkEmptyAndUndefinedNumber(formikService.values.employeePrice) ||
			checkEmptyAndUndefinedNumber(formikService.values.turn)
			// checkEmptyAndUndefinedNumber(formikService.values.sortOrder)
		)
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikService.values]);
	useEffect(() => {
		formikMenu.setValues(menuState.item);
	}, [menuState.item]);
	useEffect(() => {
		if (menuState.actionState) {
			switch (menuState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionStateMenu());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(menuState.actionState.error!));
					dispatch(resetActionStateMenu());
					break;
			}
		}
	}, [menuState.actionState]);
	useEffect(() => {
		if (serviceState.actionState) {
			switch (serviceState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionStateService());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(serviceState.actionState.error!));
					dispatch(resetActionStateService());
					break;
			}
		}
	}, [serviceState.actionState]);
	useEffect(() => {
		if (difref.current) {
			setHeight(difref.current.clientHeight / 4);
		}
	}, [difref.current]);
	return (
		<>
			<div className="p-2 wtc-bg-white rounded-4 h-100">
				<div className="row h-100">
					<div className="col-sm-9 h-100" style={{ height: screenSize.height - 200 }}>
						<div className="bg-white my-0 h-100">
							{
								<DndProvider backend={Backend}>
									<div ref={difref} className="row bg-white my-0 h-100">
										{Array.from({ length: 16 }).map((_, index) => {
											const service = getServiceAtPorsition(index + 1);
											return (
												<ServicePosition
													IsTax
													isLayoutOrder={false}
													height={height}
													isUSer={false}
													key={index}
													index={index}
													selected={null}
													onClick={() => handleClickPositionService(index)}
													onShowDetails={() => handleClickShowDetails(index)}
													service={service}
													moveCard={() => {}}
													onDrop={handleDrop}
													onSwap={handleSwap}
												/>
											);
										})}
									</div>
								</DndProvider>
							}
						</div>
						<div
							onKeyDown={(e) => {
								if (e.key === "Enter" && !checkSubmitEnter && !disableButtonSubmit) {
									formikService.handleSubmit();
									e.preventDefault();
								}
							}}
						>
							<DynamicDialog
								width={isMobile ? "90vw" : "75vw"}
								minHeight={"75vh"}
								visible={dialogVisible}
								mode={dialogMode}
								position={"center"}
								title={t("service")}
								okText={t("Submit")}
								cancelText={t("Cancel")}
								// onEnter={() =>
								//     formikService.handleSubmit()
								// }
								footer={
									<div className=" d-flex wtc-bg-white align-items-end justify-content-between">
										<div className="d-flex">
											{formikService.values._id && (
												<WtcRoleButton
													tabIndex={0}
													onFocus={() => setCheckSubmitEnter(true)}
													onBlur={() => setCheckSubmitEnter(false)}
													target="SERVICE"
													action="DEL"
													label={t("action.delete")}
													className="bg-danger text-white me-2"
													icon="ri-close-large-line"
													fontSize={16}
													minWidth={100}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															warningWithConfirm({
																title: t("do_you_delete"),
																text: "",
																confirmButtonText: t("Delete"),
																confirm: () =>
																	handledeleteService(formikService.values._id),
															});
															e.preventDefault();
														}
													}}
													onClick={() => {
														warningWithConfirm({
															title: t("do_you_delete"),
															text: "",
															confirmButtonText: t("Delete"),
															confirm: () =>
																handledeleteService(formikService.values._id),
														});
													}}
												/>
											)}
										</div>
										<div className="d-flex">
											<WtcButton
												tabIndex={0}
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
												label={t("Cancel")}
												className="bg-white text-blue me-2"
												borderColor="#283673"
												fontSize={16}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														closeDialog();
														e.preventDefault();
													}
												}}
												onClick={() => closeDialog()}
											/>
											{dialogMode == "add" && (
												<WtcRoleButton
													tabIndex={0}
													target="SERVICE"
													action="INS"
													disabled={
														(formikService &&
															formikService.errors &&
															Object.keys(formikService.errors).length > 0) ||
														disableButtonSubmit
													}
													label={t("action.INS")}
													icon="ri-add-fill"
													className="wtc-bg-primary text-white me-2"
													fontSize={16}
													onClick={() => formikService.handleSubmit()}
												/>
											)}
											{dialogMode == "edit" && (
												<WtcRoleButton
													tabIndex={0}
													target="SERVICE"
													action="UPD"
													disabled={
														(formikService &&
															formikService.errors &&
															Object.keys(formikService.errors).length > 0) ||
														disableButtonSubmit
													}
													label={t("action.UPD")}
													icon="ri-edit-line"
													className="wtc-bg-primary text-white me-2"
													fontSize={16}
													onClick={() => formikService.handleSubmit()}
												/>
											)}
										</div>
									</div>
								}
								draggable={false}
								resizeable={false}
								onClose={() => closeDialog()}
								body={
									<div className="pt-3">
										<div className="row">
											<div
												className="col-sm-6 mb-2"
												onClick={() => handleAddValue("displayName", values, setValues)}
											>
												<WtcRoleInputIconText
													action={dialogMode == "add" ? "INS" : "UPD"}
													code="displayName"
													target={PageTarget.service}
													placeHolder={t("itemdisplay20")}
													maxLength={20}
													focused
													required
													leadingIcon={"ri-service-line"}
													field="displayName"
													formik={formikService}
													value={formikService.values.displayName}
												/>
											</div>
											<div
												className="col-sm-6 mb-2"
												onClick={() => handleAddValue("name", values, setValues)}
											>
												<WtcRoleInputIconText
													action={dialogMode == "add" ? "INS" : "UPD"}
													code="itemName"
													target={PageTarget.service}
													placeHolder={t("itemname")}
													maxLength={20}
													required
													leadingIcon={"ri-service-line"}
													field="name"
													formik={formikService}
													value={formikService.values.name}
												/>
											</div>
											<div
												className="col-sm-3 mb-2"
												onClick={() => handleAddValue("storePrice", values, setValues)}
											>
												<WtcRoleInputIconNumber
													action={dialogMode == "add" ? "INS" : "UPD"}
													code="storePrice"
													target={PageTarget.service}
													placeHolder={t("storeprice")}
													required
													isCurr
													minFractionDigits={2}
													maxFractionDigits={2}
													maxValue={10000}
													leadingIcon={"ri-money-dollar-circle-line"}
													field="storePrice"
													formik={formikService}
													value={formikService.values.storePrice}
												/>
											</div>
											<div
												className="col-sm-3 mb-2"
												onClick={() => handleAddValue("employeePrice", values, setValues)}
											>
												<WtcRoleInputIconNumber
													action={dialogMode == "add" ? "INS" : "UPD"}
													code="employeePrice"
													target={PageTarget.service}
													placeHolder={t("emplyprice")}
													required
													isCurr
													maxValue={10000}
													minFractionDigits={2}
													maxFractionDigits={2}
													leadingIcon={"ri-money-dollar-circle-line"}
													field="employeePrice"
													formik={formikService}
													value={formikService.values.employeePrice}
												/>
											</div>
											{/* <div className="col-md-6 mb-2" onFocus={() => setCheckSubmitEnter(true)} onBlur={() => setCheckSubmitEnter(false)}>
                                        <WtcRoleDropdownIconText filtler target={PageTarget.service} code='menuId' action="UPD" disabled={false} required placeHolder={t('selectmenu')} leadingIcon={'ri-money-dollar-circle-line'}
                                            options={menuState.list.map((item: any) => { return { label: item.name, value: item._id } })}
                                            field="menuId" formik={formikService} value={formikService.values.menu._id} />
                                    </div> */}
											<div
												className="col-md-3 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.service}
													code="tax"
													action={dialogMode == "add" ? "INS" : "UPD"}
													disabled={false}
													required
													placeHolder={t("tax")}
													leadingIcon={"ri-tumblr-line"}
													options={[
														{ label: t("yes"), value: "YES" },
														{ label: t("no"), value: "NO" },
													]}
													field="tax"
													formik={formikService}
													value={formikService.values.tax}
												/>
											</div>
											<div
												className="col-md-3 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.service}
													code="turn"
													action={dialogMode == "add" ? "INS" : "UPD"}
													disabled={false}
													required
													placeHolder={t("turncount")}
													leadingIcon={"ri-tumblr-line"}
													options={[
														{ label: "0", value: "0" },
														{ label: "0.25", value: "0.25" },
														{ label: "0.5", value: "0.5" },
														{ label: "0.75", value: "0.75" },
														{ label: "1", value: "1" },
														{ label: "1.25", value: "1.25" },
														{ label: "1.5", value: "1.5" },
														{ label: "1.75", value: "1.75" },
														{ label: "2", value: "2" },
													]}
													field="turn"
													formik={formikService}
													value={formikService.values.turn}
												/>
											</div>
											<div
												className="col-md-3 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.service}
													code="type"
													action={dialogMode == "add" ? "INS" : "UPD"}
													disabled={false}
													required
													placeHolder={t("itemtype")}
													leadingIcon={"ri-money-dollar-circle-line"}
													options={[
														{ label: t("service"), value: "SERVICE" },
														{ label: t("sale"), value: "SALE" },
														{ label: t("other"), value: "OTHER" },
													]}
													field="type"
													formik={formikService}
													value={formikService.values.type}
												/>
											</div>
											<div
												className="col-md-3 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.service}
													code="askForPrice"
													action={dialogMode == "add" ? "INS" : "UPD"}
													disabled={false}
													required
													placeHolder={t("askforprice")}
													leadingIcon={"ri-question-mark"}
													options={[
														{ label: t("yes"), value: "YES" },
														{ label: t("no"), value: "NO" },
													]}
													field="askForPrice"
													formik={formikService}
													value={formikService.values.askForPrice}
												/>
											</div>
											<div className="col-md-3 mb-2">
												<WtcInputChooseColor
													action={dialogMode == "add" ? "INS" : "UPD"}
													target={PageTarget.service}
													leadingIcon="ri-palette-line"
													formik={formikService}
													value={formikService.values.color}
													field="color"
												/>
											</div>
											<div
												className="col-md-3 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.service}
													code="isShowCheckin"
													action={dialogMode == "add" ? "INS" : "UPD"}
													disabled={false}
													placeHolder={t("isShowCheckin")}
													leadingIcon={"ri-question-mark"}
													options={[
														{ label: t("yes"), value: "true" },
														{ label: t("no"), value: "false" },
													]}
													field="isShowCheckin"
													formik={formikService}
													value={formikService.values.isShowCheckin ? "true" : "false"}
												/>
											</div>
											<div className="col-md-12 mb-2">
												<WtcRoleInputIconText
													target={PageTarget.service}
													code="note"
													action={dialogMode == "add" ? "INS" : "UPD"}
													placeHolder={t("note")}
													leadingIcon={"ri-sticky-note-line"}
													field="note"
													formik={formikService}
													value={formikService.values.note}
												/>
											</div>
										</div>
									</div>
								}
								closeIcon
							/>
						</div>
					</div>
					<div
						className="col-sm-3 h-100"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !checkSubmitEnter) {
								formikMenu.handleSubmit();
								e.preventDefault();
							}
						}}
					>
						<WtcCard
							title={
								<div className="d-flex justify-content-between align-items-center">
									<div className="one-line-ellipsis">
										<i className="ri-file-list-line text-blue" style={{ fontSize: 26 }} />{" "}
										{t("menu")}{" "}
									</div>
								</div>
							}
							footer={
								<div className=" d-flex align-items-center justify-content-between w-100">
									<div className="d-flex w-100">
										{menuState.item?.status?.code == "ACTIVE" && (
											<WtcRoleButton
												tabIndex={0}
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														warningWithConfirm({
															title: t("do_you_delete"),
															text: "",
															confirmButtonText: t("Delete"),
															confirm: () => handleDeleteMenus(formikMenu.values._id),
														});
														e.preventDefault();
													}
												}}
												target={PageTarget.menu}
												action="DEL"
												label={t("action.delete")}
												className="bg-danger text-white me-2"
												icon="ri-close-large-line"
												fontSize={16}
												width="100%"
												onClick={() => {
													warningWithConfirm({
														title: t("do_you_delete"),
														text: "",
														confirmButtonText: t("Delete"),
														confirm: () => handleDeleteMenus(formikMenu.values._id),
													});
												}}
											/>
										)}
										{menuState.item?.status?.code == "INACTIVE" && (
											<WtcRoleButton
												tabIndex={0}
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
												target={PageTarget.menu}
												action="RES"
												label={t("action.restore")}
												className="bg-blue text-white me-2"
												icon="ri-loop-left-line"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														warningWithConfirm({
															title: t("do_you_restore"),
															text: "",
															confirmButtonText: t("Restore"),
															confirm: () => handleRestoreMenus(formikMenu.values._id),
														});
														e.preventDefault();
													}
												}}
												fontSize={16}
												width="100%"
												onClick={() => {
													warningWithConfirm({
														title: t("do_you_restore"),
														text: "",
														confirmButtonText: t("Restore"),
														confirm: () => handleRestoreMenus(formikMenu.values._id),
													});
												}}
											/>
										)}
									</div>
									<div className="d-flex w-100">
										{
											<WtcRoleButton
												tabIndex={0}
												target={PageTarget.menu}
												action="UPD"
												disabled={
													formikMenu &&
													formikMenu.errors &&
													Object.keys(formikMenu.errors).length > 0
												}
												label={t("action.UPD")}
												icon="ri-edit-line"
												className="wtc-bg-primary text-white ms-2"
												width="100%"
												fontSize={16}
												onClick={() => formikMenu.handleSubmit()}
											/>
										}
									</div>
								</div>
							}
							background="#EEF1F9"
							hideBorder={true}
							body={
								<>
									<div className="mt-2">
										<WtcRoleInputIconText
											target={PageTarget.menu}
											code="number"
											action="UPD"
											placeHolder={t("window.number")}
											readonly
											leadingIcon={"ri-barcode-line"}
											value={formikMenu.values?.code}
										/>
									</div>
									<div className="mt-2">
										<WtcRoleInputIconText
											target={PageTarget.menu}
											code="nameWindow"
											action="UPD"
											placeHolder={t("window.name")}
											leadingIcon={"ri-article-line"}
											field="name"
											formik={formikMenu}
											value={formikMenu.values?.name}
										/>
									</div>
									<div className="mt-2">
										{/* <WtcInputChooseColor formik={formikMenu} value={formikMenu.values.color} field="color" /> */}
										<WtcInputChooseColor
											action={"UPD"}
											target={PageTarget.menu}
											leadingIcon="ri-palette-line"
											formik={formikMenu}
											value={formikMenu.values.color}
											field="color"
										/>
									</div>
								</>
							}
							className="h-100"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
