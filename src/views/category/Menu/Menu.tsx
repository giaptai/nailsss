import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Paginator } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import DynamicDialog, { DialogMode } from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderList";
import LoadingIndicator from "../../../components/Loading";
import { itemListStyle, itemsLineSpacing } from "../../../components/Theme";
import WtcButton from "../../../components/commons/WtcButton";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import WtcInputChooseColor from "../../../components/commons/WtcInputChooseColor";
import WtcItemCard from "../../../components/commons/WtcItemCard";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import { checkEmptyAndUndefined, handleAddValue, PageTarget } from "../../../const";
import { MenuModel } from "../../../models/category/Menu.model";
import {
	addMenus,
	deleteMenus,
	fetchMenus,
	filterSearch,
	resetActionState,
	restoreMenus,
	selectItem,
	setCurrentPage,
	setCurrentRows,
	setListServiceWithItem,
	updateMenus,
} from "../../../slices/menu.slice";
import { fetchServices } from "../../../slices/service.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";
export default function Menu() {
	const screenSize = useWindowSize();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const menuState = useAppSelector((state) => state.menu);
	const serviceState = useAppSelector((state) => state.service);
	const [selectedId, _setSelectedId] = useState("");
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const fState = (menuState.currentPage - 1) * menuState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(menuState.currentPage - 1);
	const [rows, setRows] = useState(menuState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(menuState.filtered.length / rows));
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [values, setValues] = useState<string[]>([]);
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};

	const formikMenu = useFormik<any>({
		initialValues: MenuModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<MenuModel> = {};
			if (dialogMode == "add") {
				if (checkEmptyAndUndefined(data.name) && values.includes("name")) {
					errors.name = "y";
				}
				if (checkEmptyAndUndefined(data.code) && values.includes("code")) {
					errors.code = "y";
				}
			} else {
				if (!data.name) {
					errors.name = "y";
				}
				if (!data.code) {
					errors.code = "y";
				}
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
			if (dialogMode == "add") {
				dispatch(addMenus(submitData));
			} else if (dialogMode == "edit") {
				dispatch(updateMenus({ _id: data._id, data: submitData }));
			}
			setValues([]);
		},
	});
	const closeDialog = () => {
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikMenu.resetForm();
	};
	// const _selectItem = (item: MenuModel) => {
	//     if (item._id == selectedId)
	//         openItem(item)
	//     else
	//         setSelectedId(item._id)
	// }
	const openItem = (item: MenuModel) => {
		// setDialogMode('edit'); formikMenu.setValues(item); setDialogVisible(true)
		dispatch(selectItem(item));
		navigate("/menu-item");
		const ListServiceOfMenu = serviceState.list.filter((s) => s.menuId == item._id);
		dispatch(setListServiceWithItem(ListServiceOfMenu));
	};
	useEffect(() => {
		if (menuState.actionState) {
			switch (menuState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(fetchMenus());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(menuState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [menuState.actionState]);
	const fetchListLocal = () => {
		dispatch(fetchMenus());
	};
	const handleDeleteMenus = (id: string) => {
		dispatch(deleteMenus(id));
	};
	const handleRestoreMenus = (id: string) => {
		dispatch(restoreMenus(id));
	};
	useEffect(() => {
		if (checkEmptyAndUndefined(formikMenu.values.name) || checkEmptyAndUndefined(formikMenu.values.code))
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikMenu.values]);
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(menuState.filtered.length / rows));
	}, [menuState.filtered]);
	useEffect(() => {
		if (!menuState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!menuState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [menuState.currentPage, menuState.currentRows]);
	useEffect(() => {
		dispatch(fetchServices());
		dispatch(resetActionState());
	}, []);
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<HeaderList
						callback={fetchListLocal}
						target={PageTarget.menu}
						onSearchText={(text) => dispatch(filterSearch(text))}
						onAddNew={() => {
							setDialogMode("add");
							setDialogVisible(true);
						}}
					/>
				}
				hideBorder={true}
				body={
					<div className="d-flex flex-column h-100">
						<div
							className="flex-grow-1"
							style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
						>
							{menuState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!menuState.filtered || menuState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								menuState?.filtered.map((item: MenuModel, index: number) => {
									if (index >= first && index < first + rows)
										return (
											<div className="w-100" key={"role-" + item._id}>
												<WtcItemCard
													target={PageTarget.menu}
													index={index}
													verticalSpacing={itemsLineSpacing}
													selected={item._id === selectedId}
													onDbClick={() => {}}
													onClick={() => {
														openItem(item);
													}}
													status={item.status?.value}
													onDelete={() => handleDeleteMenus(item._id)}
													onRestore={() => handleRestoreMenus(item._id)}
													body={
														<div className="row align-items-center p-2">
															<div className="col-sm-6">
																<div style={itemListStyle} className="my-grid-value">
																	{item.code}
																</div>
															</div>
															<div className="col-sm-6">
																<div style={itemListStyle} className="my-grid-value">
																	<span>
																		<i
																			id="name_menu"
																			className="my-grid-icon ri-article-line"
																		/>
																		&ensp;{item.name}
																	</span>
																</div>
																<Tooltip
																	position="bottom"
																	target="#name_menu"
																	content={t("name")}
																/>
															</div>
														</div>
													}
												/>
											</div>
										);
								})
							)}
						</div>
						<div className="my-padding-top-paging">
							<Paginator
								first={first}
								rows={rows}
								totalRecords={menuState?.filtered?.length}
								rowsPerPageOptions={[10, 20]}
								onPageChange={onPageChange}
							/>
							{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={menuState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={menuState?.filtered?.length}
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
						formikMenu.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "42vw"}
					minHeight={"37vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={"Menu"}
					okText={t("Submit")}
					cancelText={t("Cancel")}
					// onEnter={() =>
					//     formikMenu.handleSubmit()
					// }
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-between">
							<div className="d-flex">
								{formikMenu.values.status.code == "ACTIVE" && (
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
										minWidth={100}
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
								{formikMenu.values.status.code == "INACTIVE" && (
									<WtcRoleButton
										tabIndex={0}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										target={PageTarget.menu}
										action="RES"
										label={t("action.restore")}
										className="bg-blue text-white me-2"
										icon="ri-loop-left-line"
										fontSize={16}
										minWidth={100}
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
							<div className="d-flex">
								<WtcButton
									label={t("Cancel")}
									tabIndex={0}
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
									className="bg-white text-blue me-2"
									borderColor="#283673"
									fontSize={16}
									onClick={() => closeDialog()}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											closeDialog();
											e.preventDefault();
										}
									}}
								/>
								{dialogMode == "add" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.menu}
										action="INS"
										disabled={
											(formikMenu &&
												formikMenu.errors &&
												Object.keys(formikMenu.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.INS")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikMenu.handleSubmit()}
									/>
								)}
								{dialogMode == "edit" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.menu}
										action="UPD"
										disabled={
											(formikMenu &&
												formikMenu.errors &&
												Object.keys(formikMenu.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.UPD")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikMenu.handleSubmit()}
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
									className="col-sm-12 mb-2"
									onClick={() => handleAddValue("name", values, setValues)}
								>
									<WtcRoleInputIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="namemenu"
										target={PageTarget.menu}
										placeHolder={t("window.name")}
										maxLength={50}
										focused
										required
										leadingIcon={"ri-article-line"}
										field="name"
										formik={formikMenu}
										value={formikMenu.values.name}
									/>
								</div>
								<div
									className="col-sm-12 mb-2"
									onClick={() => handleAddValue("code", values, setValues)}
								>
									<WtcRoleInputIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="number"
										target={PageTarget.menu}
										placeHolder={t("window.number")}
										type="number"
										maxLength={3}
										required
										leadingIcon={"ri-barcode-line"}
										field="code"
										formik={formikMenu}
										value={formikMenu.values.code}
									/>
								</div>
								<div className="col-sm-12 mb-2">
									<WtcInputChooseColor
										action={"INS"}
										target={PageTarget.menu}
										leadingIcon="ri-palette-line"
										formik={formikMenu}
										value={formikMenu.values.color}
										field="color"
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
