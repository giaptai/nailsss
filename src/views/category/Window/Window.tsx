import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Paginator } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
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
import WtcItemCard from "../../../components/commons/WtcItemCard";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import { checkEmptyAndUndefined, handleAddValue, PageTarget } from "../../../const";
import { WindowModel } from "../../../models/category/Window.model";
import {
	addWindow,
	deleteWindow,
	fetchWindow,
	filterSearch,
	resetActionState,
	restoreWindow,
	setCurrentPage,
	setCurrentRows,
	updateWindow,
} from "../../../slices/window.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";
export default function Windows() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const windowState = useAppSelector((state) => state.window);
	const [selectedId, _setSelectedId] = useState("");
	const [values, setValues] = useState<string[]>([]);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (windowState.currentPage - 1) * windowState.currentRows;
	const [first, setFirst] = useState(fState);
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [_page, setPage] = useState(windowState.currentPage - 1);
	const [rows, setRows] = useState(windowState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(windowState.filtered.length / rows));
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const formikWindow = useFormik<any>({
		initialValues: WindowModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<WindowModel> = {};
			if (dialogMode == "add") {
				if (checkEmptyAndUndefined(data.name) && values.includes("name")) {
					errors.name = "y";
				}
				if (checkEmptyAndUndefined(data.code) && values.includes("code")) {
					errors.code = "y";
				}
				// if (checkEmptyAndUndefined(data.type) && values.includes("type")) {
				// 	errors.type = "y";
				// }
			} else {
				if (!data.name) {
					errors.name = "y";
				}
				if (!data.code) {
					errors.code = "y";
				}
				// if (!data.type) {
				// 	errors.type = "y";
				// }
			}
			return errors;
		},
		onSubmit: (data) => {
			console.log(data);
			const submitData = {
				name: data.name,
				code: data.code,
				type: "EMPLOYEE",
			};
			if (dialogMode == "add") {
				dispatch(addWindow(submitData));
			} else if (dialogMode == "edit") {
				dispatch(updateWindow({ _id: data._id, data: submitData }));
			}
			setValues([]);
		},
	});

	const closeDialog = () => {
		setValues([]);
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikWindow.resetForm();
	};
	const openItem = (item: WindowModel) => {
		setDialogMode("edit");
		formikWindow.setValues(item);
		setDialogVisible(true);
	};
	const handledeleteWindow = (id: string) => {
		dispatch(deleteWindow(id));
	};
	const handleRestoreWindow = (id: string) => {
		dispatch(restoreWindow(id));
	};
	useEffect(() => {
		if (checkEmptyAndUndefined(formikWindow.values.name) || checkEmptyAndUndefined(formikWindow.values.code))
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikWindow.values]);
	useEffect(() => {
		if (windowState.actionState) {
			switch (windowState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(fetchWindow());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(windowState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [windowState.actionState]);
	const fetchListLocal = () => {
		dispatch(fetchWindow());
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(windowState.filtered.length / rows));
	}, [windowState.filtered]);
	useEffect(() => {
		if (!windowState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!windowState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [windowState.currentPage, windowState.currentRows]);
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<HeaderList
						callback={fetchListLocal}
						target={PageTarget.window}
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
							{windowState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!windowState.filtered || windowState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								windowState?.filtered.map((item: WindowModel, index: number) => {
									if (index >= first && index < first + rows)
										return (
											<div className="w-100" key={"role-" + item._id}>
												<WtcItemCard
													target={PageTarget.window}
													index={index}
													verticalSpacing={itemsLineSpacing}
													selected={item._id === selectedId}
													onDbClick={() => {}}
													onClick={() => {
														openItem(item);
													}}
													status={item.status?.value}
													onDelete={() => handledeleteWindow(item._id)}
													onRestore={() => handleRestoreWindow(item._id)}
													body={
														<div className="row align-items-center p-2">
															<div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	{item.code}
																</div>
															</div>
															<div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	<span>
																		<i
																			id="name_window"
																			className="my-grid-icon ri-article-line"
																		/>
																		&ensp;{item.name}{" "}
																	</span>
																</div>
																<Tooltip
																	position="bottom"
																	target="#name_window"
																	content={t("name")}
																/>
															</div>
															{/* <div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	<span>
																		<i
																			id="type_window"
																			className="my-grid-icon ri-computer-line"
																		/>
																		&ensp;{item.type}
																	</span>
																</div>
																<Tooltip
																	position="bottom"
																	target="#type_window"
																	content={t("window.type")}
																/>
															</div> */}
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
								totalRecords={windowState?.filtered?.length}
								rowsPerPageOptions={[10, 20]}
								onPageChange={onPageChange}
							/>
							{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={windowState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={windowState?.filtered?.length}
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
						formikWindow.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "42vw"}
					minHeight={"46vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={"Window"}
					okText={t("Submit")}
					cancelText={t("Cancel")}
					// onEnter={() =>
					//     formikWindow.handleSubmit()
					// }
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-between">
							<div className="d-flex">
								{formikWindow.values.status.code == "ACTIVE" && (
									<WtcRoleButton
										target={PageTarget.window}
										tabIndex={0}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												warningWithConfirm({
													title: t("do_you_delete"),
													text: "",
													confirmButtonText: t("Delete"),
													confirm: () => handledeleteWindow(formikWindow.values._id),
												});
												e.preventDefault();
											}
										}}
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
												confirm: () => handledeleteWindow(formikWindow.values._id),
											});
										}}
									/>
								)}
								{formikWindow.values.status.code == "INACTIVE" && (
									<WtcRoleButton
										target={PageTarget.window}
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
												confirm: () => handleRestoreWindow(formikWindow.values._id),
											});
										}}
										tabIndex={0}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												warningWithConfirm({
													title: t("do_you_restore"),
													text: "",
													confirmButtonText: t("Restore"),
													confirm: () => handleRestoreWindow(formikWindow.values._id),
												});
												e.preventDefault();
											}
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
										target={PageTarget.window}
										action="INS"
										disabled={
											(formikWindow &&
												formikWindow.errors &&
												Object.keys(formikWindow.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.INS")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikWindow.handleSubmit()}
									/>
								)}
								{dialogMode == "edit" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.window}
										action="UPD"
										disabled={
											(formikWindow &&
												formikWindow.errors &&
												Object.keys(formikWindow.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.UPD")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikWindow.handleSubmit()}
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
										code="namewindow"
										target={PageTarget.window}
										placeHolder={t("window.name")}
										focused
										required
										maxLength={50}
										leadingIcon={"ri-article-line"}
										field="name"
										formik={formikWindow}
										value={formikWindow.values.name}
									/>
								</div>
								<div
									className="col-sm-12 mb-2"
									onClick={() => handleAddValue("code", values, setValues)}
								>
									<WtcRoleInputIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="number"
										target={PageTarget.window}
										type="number"
										placeHolder={t("window.number")}
										maxLength={3}
										required
										leadingIcon={"ri-barcode-line"}
										field="code"
										formik={formikWindow}
										value={formikWindow.values.code}
									/>
								</div>
								{/* <div
									className="col-sm-12 mb-2"
									onFocus={() => setCheckSubmitEnter(true)}
									onBlur={() => setCheckSubmitEnter(false)}
									onClick={() => handleAddValue("type", values, setValues)}
								>
									<WtcRoleDropdownIconText
										action={dialogMode == "add" ? "INS" : "UPD"}
										code="type"
										target={PageTarget.window}
										required
										options={[
											{ label: "Employee", value: "EMPLOYEE" },
											{ label: "POS", value: "POS" },
										]}
										placeHolder={t("window.type")}
										leadingIcon={"ri-computer-line"}
										value={formikWindow.values?.type}
										disabled={false}
										formik={formikWindow}
										field="type"
									/>
								</div> */}
							</div>
						</div>
					}
					closeIcon
				/>
			</div>
		</>
	);
}
