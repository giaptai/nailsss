import { useEffect, useRef, useState } from "react";
import WtcCard from "../../components/commons/WtcCard";
import WtcEmptyBox from "../../components/commons/WtcEmptyBox";
import { Paginator } from "primereact/paginator";
import useWindowSize from "../../app/screen";
import DynamicDialog, { DialogMode } from "../../components/DynamicDialog";
import { FormikErrors, useFormik } from "formik";
import "react-tabs/style/react-tabs.css";
import { RoleModel } from "../../models/category/Role.model";
import WtcInputIconText from "../../components/commons/WtcInputIconText";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import {
	addRole,
	deleteRole,
	fetchRoles,
	filterSearch,
	resetActionState,
	restoreRole,
	selectItem,
	setCurrentPage,
	setCurrentRows,
} from "../../slices/role.slice";
import WtcItemCard from "../../components/commons/WtcItemCard";
import { itemListStyle, itemsLineSpacing } from "../../components/Theme";
import { completed, failed, processing } from "../../utils/alert.util";
import HeaderList from "../../components/HeaderList";
import { isMobile } from "react-device-detect";
import WtcRoleButton from "../../components/commons/WtcRoleButton";
import WtcButton from "../../components/commons/WtcButton";
import { Tooltip } from "primereact/tooltip";
import LoadingIndicator from "../../components/Loading";
import { OverlayPanel } from "primereact/overlaypanel";
import StatusDropdown from "../../components/commons/StatusDropdown";
import { DropdownChangeEvent } from "primereact/dropdown";
export default function Roles() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const roleState = useAppSelector((state) => state.role);
	const [selectedId, _setSelectedId] = useState("");
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (roleState.currentPage - 1) * roleState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(roleState.currentPage - 1);
	const [rows, setRows] = useState(roleState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(roleState.filtered.length / rows));
	const op = useRef<any>(null);
	const [searchString, setSearchString] = useState("");
	const [status, setStatus] = useState("ACTIVE");
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
				errors.name = "y";
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
		navigate("/role-item");
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
					completed();
					dispatch(resetActionState());
					dispatch(fetchRoles());

					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(roleState.actionState.error!));
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
							{roleState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : (!roleState.filtered || roleState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								roleState?.filtered.map((item: RoleModel, index: number) => {
									if (index >= first && index < first + rows)
										return (
											<div className="w-100" key={"role-" + item._id}>
												<WtcItemCard
													target="ROLE"
													index={index}
													verticalSpacing={itemsLineSpacing}
													selected={item._id === selectedId}
													onDbClick={() => {}}
													onClick={() => {
														openItem(item);
													}}
													status={item.status?.value}
													onDelete={() => {
														dispatch(deleteRole(item._id));
													}}
													onRestore={() => {
														dispatch(restoreRole(item._id));
													}}
													body={
														<div className="row align-items-center p-2">
															<div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	{item.name}
																</div>
															</div>
															<div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	<span>
																		<i
																			id="role_abilities"
																			className="my-grid-icon ri-shield-keyhole-line"
																		/>{" "}
																	</span>
																	{t("abilities")}({item.abilities.length})
																</div>
																<Tooltip
																	position="bottom"
																	target="#role_abilities"
																	content={t("Abilities")}
																/>
															</div>
															<div className="col-sm-4">
																<div style={itemListStyle} className="my-grid-value">
																	<span>
																		<i
																			id="note_role"
																			className="my-grid-icon ri-sticky-note-line"
																		/>{" "}
																	</span>
																	{item.note}
																</div>
																<Tooltip
																	position="bottom"
																	target="#note_role"
																	content={t("note")}
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
								totalRecords={roleState?.filtered?.length}
								rowsPerPageOptions={[10, 20]}
								onPageChange={onPageChange}
							/>
							{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={roleState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={roleState?.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange} />} */}
						</div>
					</div>
				}
				className="h-100"
			/>
			<DynamicDialog
				width={isMobile ? "90vw" : "75vw"}
				minHeight={"75vh"}
				visible={dialogVisible}
				mode={dialogMode}
				position={"center"}
				title={t("Role")}
				okText={t("Submit")}
				cancelText={t("Cancel")}
				onEnter={() => formikRole.handleSubmit()}
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<WtcButton
							tabIndex={0}
							label={t("Cancel")}
							className="bg-white text-blue me-2"
							borderColor="#283673"
							fontSize={16}
							onClick={() => closeDialog()}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									closeDialog();
								}
							}}
						/>
						<WtcRoleButton
							tabIndex={0}
							target="ROLE"
							action="INS"
							disabled={formikRole && formikRole.errors && Object.keys(formikRole.errors).length > 0}
							label={t("action.INS")}
							icon="ri-add-line"
							className="wtc-bg-primary text-white me-2"
							fontSize={16}
							onClick={() => formikRole.handleSubmit()}
						/>
					</div>
				}
				draggable={false}
				resizeable={false}
				onClose={() => closeDialog()}
				body={
					<div className="pt-3">
						<div className="row">
							<div className="col-sm-12 mb-2">
								<WtcInputIconText
									placeHolder={t("role.name")}
									focused
									required
									leadingIcon={"ri-shield-keyhole-line"}
									field="name"
									formik={formikRole}
									value={formikRole.values.name}
								/>
							</div>
							<div className="col-sm-12 mb-2">
								<WtcInputIconText
									placeHolder={t("note")}
									leadingIcon={"ri-sticky-note-line"}
									field="note"
									formik={formikRole}
									value={formikRole.values.note}
								/>
							</div>
						</div>
					</div>
				}
				closeIcon
			/>
		</>
	);
}
