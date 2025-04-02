import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import { DialogMode } from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderListV2";
import LoadingIndicator from "../../../components/Loading";
import StatusDropdown from "../../../components/commons/StatusDropdown";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import SidebarWindow from "../../../components/window/SidebarWindow";
import { checkEmptyAndUndefined, PageTarget } from "../../../const";
import { WindowModel } from "../../../models/category/Window.model";
import {
	addWindow,
	changeAction,
	fetchWindow,
	filterSearch,
	resetActionState,
	selectItem,
	setCurrentPage,
	setCurrentRows,
	setFiltered,
	updateWindow,
} from "../../../slices/window.slice";
import { showMessageToast } from "../../../utils/alert.util";
export default function Windows() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const windowState = useAppSelector((state) => state.window);
	const [values, setValues] = useState<string[]>([]);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (windowState.currentPage - 1) * windowState.currentRows;
	const [first, setFirst] = useState(fState);
	// const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [_page, setPage] = useState(windowState.currentPage - 1);
	const [rows, setRows] = useState(windowState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(windowState.filtered.length / rows));
	const [searchString, setSearchString] = useState("");
	const [status, setStatus] = useState("ALL");
	const op = useRef<any>(null);
	const toast = useRef<any>(null);
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
					errors.name = "Please fill in the required field.";
				}
				// if (checkEmptyAndUndefined(data.type) && values.includes("type")) {
				// 	errors.type = "y";
				// }
			} else {
				if (!data.name) {
					errors.name = "Please fill in the required field.";
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
		formikWindow.resetForm();
	};
	const openItem = (item: WindowModel) => {
		setDialogMode("edit");
		dispatch(selectItem(item));
		setDialogVisible(true);
		dispatch(changeAction("UPD"));
	};
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};

	// const handleRestoreWindow = (id: string) => {
	// 	dispatch(restoreWindow(id));
	// };
	// useEffect(() => {
	// 	if (checkEmptyAndUndefined(formikWindow.values.name) || checkEmptyAndUndefined(formikWindow.values.code))
	// 		setdisableButtonSubmit(true);
	// 	else setdisableButtonSubmit(false);
	// }, [formikWindow.values]);
	useEffect(() => {
		if (windowState.actionState) {
			switch (windowState.actionState.status!) {
				case "completed":
					showMessageToast(toast, "success", windowState.successMessage);
					dispatch(resetActionState());
					dispatch(fetchWindow());
					closeDialog();
					break;
				case "loading":
					// processing();
					break;
				case "failed":
					showMessageToast(toast, "error", t(windowState.actionState.error!));
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
	useEffect(() => {
		if (windowState.fetchState) {
			switch (windowState.fetchState.status!) {
				case "completed":
					dispatch(filterSearch({ searchString: searchString, status: status }));
					break;
			}
		}
	}, [windowState.fetchState]);
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);
	const onRowReorder = (e: any) => {
		dispatch(setFiltered(e.value));
	};

	const paginatorTemplate =
		"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown";
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<>
						<HeaderList
							callback={fetchListLocal}
							target={PageTarget.window}
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogMode("add");
								setDialogVisible(true);
								dispatch(changeAction("INS"));
								formikWindow.resetForm();
							}}
							isFilterStatus={true}
							status={status}
							setStatus={setStatus}
							onClickFilterStatus={(e) => {
								onClickFilterStatus(e);
							}}
							placeHolderSearch="Search window’s name or code"
							labelSearch="Search window"
							labelFilter="Window's status"
							titleButtonAdd={t("action.createWindow")}
						/>
						<OverlayPanel autoFocus ref={op} style={{ width: "300px" }}>
							<div className="row pb-2">
								<div className="form-group col-sm-12">
									<label htmlFor="status">{t("status")}</label>
									<StatusDropdown
										value={status}
										onChange={(e: DropdownChangeEvent) => {
											console.log(e.value);
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
							// style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
							style={{ maxHeight: screenSize.height, overflowX: "hidden", overflowY: "auto" }}
						>
							{windowState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!windowState.filtered || windowState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								<DataTable
									value={windowState?.filtered}
									showGridlines={true}
									paginator
									paginatorLeft
									rows={10}
									rowsPerPageOptions={[10, 25, 50]}
									tableStyle={{
										minWidth: "50rem",
										borderRadius: "0px",
									}}
									first={first}
									onPage={onPageChange}
									paginatorTemplate={paginatorTemplate}
									currentPageReportTemplate="Showing {first} to {last} items of {totalRecords}"
									className="datatable-custom px-2"
									reorderableRows
									onRowReorder={onRowReorder}
									scrollable
									scrollHeight="100%"
								>
									<Column
										rowReorder
										headerStyle={{
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										bodyStyle={{
											width: "100%",
											height: "73px",
											padding: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#212529",
											border: "1px solid red !important",
										}}
										className="border-0"
										rowReorderIcon={"ri-draggable"}
										header={<div style={{ height: "60px", width: "60px" }}></div>}
									></Column>
									<Column
										bodyStyle={{
											width: "60px",
											height: "60px",
											maxHeight: "60px",
											padding: 0,
										}}
										headerStyle={{
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(_, { rowIndex }) => (
											<p
												style={{
													fontSize: "16px",
													fontWeight: "400",
													color: "#3E4451",
													padding: "0px 12px",
													margin: "auto 0",
												}}
											>
												{rowIndex + 1}
											</p>
										)}
										header={"No."}
									></Column>
									<Column
										bodyStyle={{
											width: "533px",
											padding: "12px",
											maxHeight: "72px",
										}}
										headerStyle={{
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<p
												style={{
													fontSize: "16px",
													fontWeight: "400",
													color: "#3E4451",
													margin: "auto",
													paddingLeft: "12px",
												}}
											>
												{rowData.name}
											</p>
										)}
										header="Window's name"
									></Column>
									<Column
										headerStyle={{
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) =>
											rowData.status.value === "INACTIVE" ? (
												<div
													style={{
														minWidth: "144px",
														padding: "12px",
														maxHeight: "72px",
														margin: "auto",
													}}
												>
													<div className="w-100 h-100 d-flex justify-content-center align-items-center">
														<InputSwitch checked={false} />
													</div>
												</div>
											) : (
												<div
													style={{
														minWidth: "144px",
														padding: "12px",
														maxHeight: "72px",
														margin: "auto",
													}}
												>
													<div className="w-100 h-100 d-flex justify-content-center align-items-center">
														<InputSwitch checked={true} />
													</div>
												</div>
											)
										}
										header="Status"
									></Column>
									<Column
										bodyStyle={{
											width: "555px",
										}}
										headerStyle={{
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div
												style={{
													padding: "12px",
													maxHeight: "72px",
												}}
											>
												<p
													style={{
														fontSize: "16px",
														fontWeight: "400",
														color: "#3E4451",
														margin: "auto",
													}}
												>
													{rowData.code}
												</p>
											</div>
										)}
										header="Code"
									></Column>
									<Column
										headerStyle={{
											width: "104px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div
												className="d-flex justify-content-center"
												style={{ maxWidth: "104px" }}
											>
												<button
													className="bg-white"
													style={{
														border: "1px solid #DDDFE5",
														width: 75,
														height: 44,
														borderRadius: "4px",
													}}
													onClick={() => openItem(rowData)}
												>
													Details
												</button>
											</div>
										)}
										header="Action"
									></Column>
								</DataTable>
							)}
						</div>
					</div>
				}
				className="h-100"
			/>
			<SidebarWindow
				action={windowState.action}
				dialogVisible={dialogVisible}
				setDialogVisible={setDialogVisible}
				formik={formikWindow}
				closeDialog={closeDialog}
			/>
			<Toast ref={toast} position="top-center" />
		</>
	);
}
