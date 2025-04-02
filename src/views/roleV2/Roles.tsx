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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import StatusDropdown from "../../components/commons/StatusDropdown";
import WtcCard from "../../components/commons/WtcCard";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import HeaderList from "../../components/HeaderListV2";
import LoadingIndicator from "../../components/Loading";
import SidebarRole from "../../components/role/SidebarRole";
import { RoleModel } from "../../models/category/Role.model";
import {
	addRole,
	changeAction,
	fetchRoles,
	filterSearch,
	resetActionState,
	selectItem,
	setCurrentPage,
	setCurrentRows,
} from "../../slices/role.slice";
import { showMessageToast } from "../../utils/alert.util";
import "./Role.css";
export default function Roles() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const toast = useRef<any>(null);
	const roleState = useAppSelector((state) => state.role);
	const [dialogVisible, setDialogVisible] = useState(false);
	const fState = (roleState.currentPage - 1) * roleState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(roleState.currentPage - 1);
	const [rows, setRows] = useState(roleState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(roleState.filtered.length / rows));
	const op = useRef<any>(null);
	const [searchString, setSearchString] = useState("");
	const [status, setStatus] = useState("ALL");
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const formikRole = useFormik<any>({
		initialValues: RoleModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<RoleModel> = {};
			if (!data.name) {
				errors.name = "Please fill in the required field.";
			}
			if (roleState.list.find((item) => item.name === data.name)) {
				errors.name = "This role name already exists. Please choose another name.";
			}
			return errors;
		},
		onSubmit: (data) => {
			console.log(data);
			const submitData = {
				name: data.name,
				note: data.note === "" ? null : data.note,
			};
			dispatch(addRole(submitData));
		},
	});
	const closeDialog = () => {
		setDialogVisible(false);
		formikRole.resetForm();
	};
	const openItem = (item: RoleModel) => {
		dispatch(selectItem(item));
		dispatch(changeAction("UPD"));
		// navigate("/role-item");
		setDialogVisible(true);
	};
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	// console.log("🚀 ~ useEffect ~ roleState:", roleState);
	useEffect(() => {
		if (roleState.actionState) {
			switch (roleState.actionState.status!) {
				case "completed":
					showMessageToast(toast, "success", roleState.successMessage);
					dispatch(resetActionState());
					dispatch(fetchRoles());
					closeDialog();
					break;
				case "loading":
					// processing();
					break;
				case "failed":
					showMessageToast(toast, "error", t(roleState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [roleState.actionState]);
	useEffect(() => {
		if (roleState.fetchState) {
			switch (roleState.fetchState.status!) {
				case "completed":
					dispatch(filterSearch({ searchString: searchString, status: status }));
					break;
			}
		}
	}, [roleState.fetchState]);
	const fetchListLocal = () => {
		dispatch(fetchRoles());
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(roleState.filtered.length / rows));
	}, [roleState.filtered]);
	useEffect(() => {
		if (!roleState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!roleState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [roleState.currentPage, roleState.currentRows]);
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);

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
							target="ROLE"
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogVisible(true);
								dispatch(changeAction("INS"));
								formikRole.resetForm();
							}}
							isFilterStatus={true}
							status={status}
							setStatus={setStatus}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
							placeHolderSearch="Search role’s name or code"
							labelSearch="Search employee"
							labelFilter="Role’s status"
							titleButtonAdd={t("action.createRole")}
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
					<div className="d-flex flex-column h-100 w-100 overflow-hidden">
						<div
							className="flex-grow-1"
							// style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
							style={{ maxHeight: screenSize.height, overflowX: "hidden", overflowY: "auto" }}
						>
							{roleState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!roleState.filtered || roleState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								<DataTable
									value={roleState?.filtered}
									showGridlines={true}
									paginator
									paginatorLeft
									rows={10}
									rowsPerPageOptions={[10, 25, 50]}
									tableStyle={{
										borderRadius: "0px",
										overflowX: "auto",
										maxWidth: "100%",
										height: "100%",
									}}
									first={first}
									onPage={onPageChange}
									paginatorTemplate={paginatorTemplate}
									currentPageReportTemplate="Showing {first} to {last} items of {totalRecords}"
									className="datatable-custom px-2"
									scrollable
									scrollHeight="100%"
								>
									<Column
										bodyStyle={{
											maxWidth: "60px",
											maxHeight: "60px",
										}}
										headerStyle={{
											width: "60px",
											height: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(_, { rowIndex }) => (
											<p
												style={{
													// width: "60px",
													// height: "60px",
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
										header={
											<div
												style={{
													maxWidth: "60px",
													maxHeight: "60px",
													width: "60px",
													height: "60px",
												}}
											/>
										}
									></Column>
									<Column
										bodyStyle={{
											width: "333px",
											height: "60px",
										}}
										headerStyle={{
											maxWidth: "333px",
											maxHeight: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div className="w-100 h-100 d-flex align-items-center">
												<p
													style={{
														fontSize: "16px",
														fontWeight: "400",
														color: "#3E4451",
														paddingLeft: "12px",
														margin: "auto 0",
													}}
												>
													{rowData.name}
												</p>
											</div>
										)}
										header="Role's name"
									></Column>
									<Column
										bodyStyle={{
											width: "144px",
											maxHeight: "60px",
										}}
										headerStyle={{
											maxWidth: "144px",
											maxHeight: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) =>
											rowData.status.value === "INACTIVE" ? (
												<div
													style={{
														width: "144px",
														height: "60px",
														padding: "12px",
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
											width: "180px",
											height: "60px",
										}}
										headerStyle={{
											maxWidth: "180px",
											maxHeight: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div className="w-100 h-100 d-flex align-items-center">
												<p
													style={{
														fontSize: "16px",
														fontWeight: "400",
														color: "#3E4451",
														margin: "auto 0",
														paddingLeft: "12px",
													}}
												>
													{rowData.code}
												</p>
											</div>
										)}
										header="Code"
									></Column>
									<Column
										bodyStyle={{
											width: "235px",
											height: "60px",
										}}
										headerStyle={{
											maxWidth: "235px",
											maxHeight: "60px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div className="w-100 h-100 d-flex align-items-center">
												<p
													style={{
														fontSize: "16px",
														fontWeight: "400",
														color: "#3E4451",
														paddingLeft: "12px",
														margin: "auto 0",
													}}
												>
													{rowData.note}
												</p>
											</div>
										)}
										header="Note"
									></Column>
									<Column
										headerStyle={{
											width: "104px",
											backgroundColor: "#F4F4F4",
										}}
										body={(rowData) => (
											<div
												className="d-flex justify-content-center w-100 h-100 p-2"
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
				className="h-100 gap-0"
			/>
			<SidebarRole
				action={roleState.action}
				dialogVisible={dialogVisible}
				setDialogVisible={setDialogVisible}
				formik={formikRole}
				closeDialog={closeDialog}
			/>
			<Toast ref={toast} position="top-center" />
		</>
	);
}
