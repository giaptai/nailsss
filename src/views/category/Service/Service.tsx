import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Paginator } from "primereact/paginator";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import DynamicDialog, { DialogMode } from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderList";
import LoadingIndicator from "../../../components/Loading";
import { itemListStyle, itemsLineSpacing } from "../../../components/Theme";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import WtcInputIconText from "../../../components/commons/WtcInputIconText";
import WtcItemCard from "../../../components/commons/WtcItemCard";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import {
	checkEmptyAndUndefined,
	checkEmptyAndUndefinedNumber,
	FormatMoneyNumber,
	handleAddValue,
	PageTarget,
} from "../../../const";
import { ServiceModel } from "../../../models/category/Service.model";
import { fetchMenus } from "../../../slices/menu.slice";
import {
	addServices,
	deleteServices,
	fetchServices,
	filterSearch,
	resetActionState,
	restoreService,
	setCurrentPage,
	setCurrentRows,
	updateServices,
} from "../../../slices/service.slice";
import { completed, failed, processing } from "../../../utils/alert.util";
import { OverlayPanel } from "primereact/overlaypanel";
import StatusDropdown from "../../../components/commons/StatusDropdown";
import { DropdownChangeEvent } from "primereact/dropdown";
export default function Service() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const serviceState = useAppSelector((state) => state.service);
	const menuState = useAppSelector((state) => state.menu);
	const [selectedId, _setSelectedId] = useState("");
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (serviceState.currentPage - 1) * serviceState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(serviceState.currentPage - 1);
	const [rows, setRows] = useState(serviceState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(serviceState.filtered.length / rows));
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [values, setValues] = useState<string[]>([]);
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const op = useRef<any>(null);
	const [status, setStatus] = useState("ACTIVE");
	const [searchString, setSearchString] = useState("");
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
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
				if (checkEmptyAndUndefined(data.menu) && values.includes("menuId")) {
					errors.menuId = "y";
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
				// if (checkEmptyAndUndefinedNumber(data.sortOrder) && values.includes('sortOrder')) {
				//     errors.sortOrder = 'y'
				// }
			} else {
				if (!data.displayName) {
					errors.displayName = "y";
				}
				if (!data.name) {
					errors.name = "y";
				}
				if (!data.menu) {
					errors.menuId = "y";
				}
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
			const submitData = {
				name: data.name,
				displayName: data.displayName,
				storePrice: data.storePrice,
				employeePrice: data.employeePrice,
				menuId: data.menuId,
				tax: data.tax == "YES" ? true : false,
				type: data.type,
				askForPrice: data.askForPrice == "YES" ? true : false,
				turn: data.turn,
				// sortOrder: data.sortOrder,
				note: data.note || null,
			};
			if (dialogMode == "add") {
				dispatch(addServices(submitData));
			} else if (dialogMode == "edit") {
				dispatch(updateServices({ _id: data._id, data: submitData }));
			}
			setValues([]);
		},
	});
	const handledeleteService = (id: string) => {
		dispatch(deleteServices(id));
	};
	const handlerestoreService = (id: string) => {
		dispatch(restoreService(id));
	};

	const closeDialog = () => {
		setValues([]);
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikService.resetForm();
	};
	// const _selectItem = (item: ServiceModel) => {
	//     if (item._id == selectedId)
	//         openItem(item)
	//     else
	//         setSelectedId(item._id)
	// }
	const openItem = (item: ServiceModel) => {
		setDialogMode("edit");
		formikService.setValues(item);
		setDialogVisible(true);
		// dispatch(selectItem(item))
		// navigate('/role-item')
	};
	useEffect(() => {
		if (serviceState.actionState) {
			switch (serviceState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(fetchServices());
					dispatch(fetchMenus());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(serviceState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [serviceState.actionState]);
	const fetchListLocal = () => {
		dispatch(fetchServices());
		dispatch(fetchMenus());
	};
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikService.values.name) ||
			checkEmptyAndUndefined(formikService.values.displayName) ||
			checkEmptyAndUndefined(formikService.values.displayName) ||
			checkEmptyAndUndefined(formikService.values.menuId) ||
			checkEmptyAndUndefined(formikService.values.askForPrice) ||
			checkEmptyAndUndefined(formikService.values.tax) ||
			checkEmptyAndUndefinedNumber(formikService.values.storePrice) ||
			checkEmptyAndUndefinedNumber(formikService.values.employeePrice) ||
			checkEmptyAndUndefinedNumber(formikService.values.turn)
			// checkEmptyAndUndefinedNumber(formikService.values.sortOrder)
		)
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikService.values]);
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(serviceState.filtered.length / rows));
	}, [serviceState.filtered]);
	useEffect(() => {
		if (!serviceState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!serviceState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [serviceState.currentPage, serviceState.currentRows]);
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<>
						<HeaderList
							callback={fetchListLocal}
							target={PageTarget.service}
							hideAdd
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogMode("add");
								setDialogVisible(true);
							}}
							isFilterStatus={true}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
						/>
						<OverlayPanel autoFocus ref={op} style={{ width: "300px" }}>
							<div className="row pb-2">
								<div className="form-group col-sm-12">
									<label htmlFor="status">{t("status")}</label>
									<StatusDropdown
										value={status}
										onChange={(e: DropdownChangeEvent) => {
											setStatus(e.value);
										}}
									/>
								</div>
							</div>
						</OverlayPanel>
					</>
				}
				hideBorder={true}
				body={
					<div className="d-flex flex-column h-100">
						<div
							className="flex-grow-1"
							style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
						>
							{serviceState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!serviceState.filtered || serviceState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								<>
									{serviceState?.filtered.map((item: ServiceModel, index: number) => {
										if (index >= first && index < first + rows)
											return (
												<div className="w-100" key={"role-" + item._id}>
													<WtcItemCard
														hideSwiper
														hideDeleteSwiper
														target={PageTarget.service}
														index={index}
														verticalSpacing={itemsLineSpacing}
														selected={item._id === selectedId}
														onDbClick={() => {}}
														onClick={() => {
															openItem(item);
														}}
														status={item.status?.value}
														onDelete={() => handledeleteService(item._id)}
														onRestore={() => handlerestoreService(item._id)}
														body={
															<div className="row align-items-center p-2">
																<div className="col-sm-3">
																	<div
																		style={itemListStyle}
																		className="my-grid-value"
																	>
																		<span>
																			<div className="my-label-in-grid-service">
																				name
																			</div>
																			{item?.displayName}
																		</span>
																	</div>
																</div>
																<div className="col-sm-2">
																	<div
																		style={itemListStyle}
																		className="my-grid-value"
																	>
																		<div className="my-label-in-grid-service">
																			store price
																		</div>
																		$ {FormatMoneyNumber(item?.storePrice)}
																	</div>
																</div>
																<div className="col-sm-3">
																	<div
																		style={itemListStyle}
																		className="my-grid-value"
																	>
																		<div className="my-label-in-grid-service">
																			employee price
																		</div>
																		$ {FormatMoneyNumber(item?.employeePrice)}
																	</div>
																</div>
																<div className="col-sm-2">
																	<div
																		style={itemListStyle}
																		className="my-grid-value"
																	>
																		<div className="my-label-in-grid-service">
																			turn
																		</div>

																		{item?.turn}
																	</div>
																</div>
																<div className="col-sm-2">
																	<div
																		style={itemListStyle}
																		className="my-grid-value"
																	>
																		<div className="my-label-in-grid-service">
																			menu
																		</div>

																		{item.menu?.name ?? "-"}
																	</div>
																</div>
															</div>
														}
													/>
												</div>
											);
									})}
								</>
							)}
						</div>
						<div className="my-padding-top-paging">
							<Paginator
								first={first}
								rows={rows}
								totalRecords={serviceState?.filtered?.length}
								rowsPerPageOptions={[10, 20]}
								onPageChange={onPageChange}
							/>
							{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={serviceState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={serviceState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange} />} */}
						</div>
					</div>
				}
				className="h-100"
			/>
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
					minHeight={"60vh"}
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
						<></>
						// <div className=" d-flex wtc-bg-white align-items-center justify-content-between">
						// 	<div className="d-flex">
						// 		{formikService.values.status.code == "ACTIVE" && (
						// 			<WtcRoleButton
						// 				tabIndex={0}
						// 				onFocus={() => setCheckSubmitEnter(true)}
						// 				onBlur={() => setCheckSubmitEnter(false)}
						// 				target="SERVICE"
						// 				action="DEL"
						// 				label={t("action.delete")}
						// 				className="bg-danger text-white me-2"
						// 				icon="ri-close-large-line"
						// 				fontSize={16}
						// 				minWidth={100}
						// 				onKeyDown={(e) => {
						// 					if (e.key === "Enter") {
						// 						warningWithConfirm({
						// 							title: t("do_you_delete"),
						// 							text: "",
						// 							confirmButtonText: t("Delete"),
						// 							confirm: () => handledeleteService(formikService.values._id),
						// 						});
						// 						e.preventDefault();
						// 					}
						// 				}}
						// 				onClick={() => {
						// 					warningWithConfirm({
						// 						title: t("do_you_delete"),
						// 						text: "",
						// 						confirmButtonText: t("Delete"),
						// 						confirm: () => handledeleteService(formikService.values._id),
						// 					});
						// 				}}
						// 			/>
						// 		)}
						// 		{formikService.values.status.code == "INACTIVE" && (
						// 			<WtcRoleButton
						// 				tabIndex={0}
						// 				onFocus={() => setCheckSubmitEnter(true)}
						// 				onBlur={() => setCheckSubmitEnter(false)}
						// 				target="SERVICE"
						// 				action="RES"
						// 				label={t("action.restore")}
						// 				className="bg-blue text-white me-2"
						// 				icon="ri-loop-left-line"
						// 				fontSize={16}
						// 				minWidth={100}
						// 				onKeyDown={(e) => {
						// 					if (e.key === "Enter") {
						// 						warningWithConfirm({
						// 							title: t("do_you_restore"),
						// 							text: "",
						// 							confirmButtonText: t("Restore"),
						// 							confirm: () => handlerestoreService(formikService.values._id),
						// 						});
						// 						e.preventDefault();
						// 					}
						// 				}}
						// 				onClick={() => {
						// 					warningWithConfirm({
						// 						title: t("do_you_restore"),
						// 						text: "",
						// 						confirmButtonText: t("Restore"),
						// 						confirm: () => handlerestoreService(formikService.values._id),
						// 					});
						// 				}}
						// 			/>
						// 		)}
						// 	</div>
						// 	<div className="d-flex">
						// 		<WtcButton
						// 			tabIndex={0}
						// 			onFocus={() => setCheckSubmitEnter(true)}
						// 			onBlur={() => setCheckSubmitEnter(false)}
						// 			label={t("Cancel")}
						// 			className="bg-white text-blue me-2"
						// 			borderColor="#283673"
						// 			fontSize={16}
						// 			onKeyDown={(e) => {
						// 				if (e.key === "Enter") {
						// 					closeDialog();
						// 					e.preventDefault();
						// 				}
						// 			}}
						// 			onClick={() => closeDialog()}
						// 		/>
						// 		{dialogMode == "add" && (
						// 			<WtcRoleButton
						// 				tabIndex={0}
						// 				target="SERVICE"
						// 				action="INS"
						// 				disabled={
						// 					(formikService &&
						// 						formikService.errors &&
						// 						Object.keys(formikService.errors).length > 0) ||
						// 					disableButtonSubmit
						// 				}
						// 				label={t("action.INS")}
						// 				icon="ri-add-fill"
						// 				className="wtc-bg-primary text-white me-2"
						// 				fontSize={16}
						// 				onClick={() => formikService.handleSubmit()}
						// 			/>
						// 		)}
						// 		{dialogMode == "edit" && (
						// 			<WtcRoleButton
						// 				tabIndex={0}
						// 				target="SERVICE"
						// 				action="UPD"
						// 				disabled={
						// 					(formikService &&
						// 						formikService.errors &&
						// 						Object.keys(formikService.errors).length > 0) ||
						// 					disableButtonSubmit
						// 				}
						// 				label={t("action.UPD")}
						// 				icon="ri-edit-line"
						// 				className="wtc-bg-primary text-white me-2"
						// 				fontSize={16}
						// 				onClick={() => formikService.handleSubmit()}
						// 			/>
						// 		)}
						// 	</div>
						// </div>
					}
					isNoFooter={true}
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
									<WtcInputIconText
										disabled
										placeHolder={t("itemdisplay20")}
										maxLenght={20}
										focused
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
									<WtcInputIconText
										disabled
										placeHolder={t("description")}
										maxLenght={20}
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
									<WtcInputIconText
										disabled
										placeHolder={t("storeprice")}
										leadingIcon={"ri-money-dollar-circle-line"}
										// field="storePrice"
										formik={formikService}
										value={"$ " + formikService.values.storePrice}
									/>
									{/* <WtcInputIconNumber
										disabled
										placeHolder={t("storeprice")}
										isCurr
										minFractionDigits={2}
										maxFractionDigits={2}
										maxValue={10000}
										leadingIcon={"ri-money-dollar-circle-line"}
										field="storePrice"
										formik={formikService}
										value={formikService.values.storePrice}
									/> */}
								</div>
								<div
									className="col-sm-3 mb-2"
									onClick={() => handleAddValue("employeePrice", values, setValues)}
								>
									{/* <WtcInputIconNumber
										placeHolder={t("emplyprice")}
										isCurr
										maxValue={10000}
										minFractionDigits={2}
										maxFractionDigits={2}
										leadingIcon={"ri-money-dollar-circle-line"}
										field="employeePrice"
										formik={formikService}
										value={formikService.values.employeePrice}
									/> */}
									<WtcInputIconText
										disabled
										placeHolder={t("emplyprice")}
										leadingIcon={"ri-money-dollar-circle-line"}
										formik={formikService}
										value={"$ " + formikService.values.employeePrice}
									/>
								</div>
								<div
									className="col-md-6 mb-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcRoleDropdownIconText
										filtler
										target="USER"
										code="menuId"
										action="UPD"
										disabled
										placeHolder={t("selectmenu")}
										leadingIcon={"ri-money-dollar-circle-line"}
										options={menuState.list.map((item: any) => {
											return { label: item.name, value: item._id };
										})}
										field="menuId"
										formik={formikService}
										value={formikService.values.menu._id}
									/>
								</div>
								<div
									className="col-md-3 mb-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcRoleDropdownIconText
										filtler
										target="USER"
										code="tax"
										action="UPD"
										disabled
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
										target="USER"
										code="turn"
										action="UPD"
										disabled
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
									className="col-md-6 mb-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcRoleDropdownIconText
										filtler
										target="USER"
										code="type"
										action="UPD"
										disabled
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
									className="col-md-6 mb-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
								>
									<WtcRoleDropdownIconText
										filtler
										target="USER"
										code="askForPrice"
										action="UPD"
										disabled
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

								{/* <div className="col-md-6 mb-2">
                            <WtcInputIconNumber placeHolder={t("sortorder")} isCurr minFractionDigits={2} maxFractionDigits={2} required maxValue={10000} leadingIcon={'ri-money-dollar-circle-line'} field="sortOrder" formik={formikService} value={formikService.values.sortOrder} />
                        </div> */}
								<div className="col-sm-6 mb-2">
									<WtcInputIconText
										placeHolder={t("note")}
										leadingIcon={"ri-sticky-note-line"}
										field="note"
										disabled
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
		</>
	);
}
