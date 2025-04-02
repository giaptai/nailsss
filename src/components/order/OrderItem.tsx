import { t } from "i18next";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { ServiceModel } from "../../models/category/Service.model";
import { UserModel } from "../../models/category/User.model";
import { EditServiceSelect } from "../../slices/service.slice";
import { fetchUsers, filterSearch, setCurrentPage, setCurrentRows } from "../../slices/user.slice";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import DynamicDialog from "../DynamicDialog";
import HeaderList from "../HeaderList";
import { itemListStyle, itemsLineSpacing } from "../Theme";
import IconButton from "../commons/IconButton";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcEmptyBox from "../commons/WtcEmptyBox";
import WtcItemCard from "../commons/WtcItemCard";
import LoadingIndicator from "../Loading";

type OrderItemProps = {
	data: any;
	index: number;
	reward?: boolean;
	readonly?: boolean;
	turn?: boolean;
	selected?: boolean;
	onClickRemove: VoidFunction;
	percentWidth?: string;
	updateData?: (newData: ServiceModel) => void;
	onClick?: (item: ServiceModel) => void;
	isOutSide?: boolean;
};
export default function OrderItem(props: OrderItemProps) {
	const discount = Number(props?.data?.discount);
	const [selectedEmployee, setselectedEmployee] = useState<UserModel>();
	const [EmployeeData, setEmployeeData] = useState<UserModel | undefined>(props.data?.employeeSelect);
	const userState = useAppSelector((state) => state.user);
	const fState = (userState.currentPage - 1) * userState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(userState.currentPage - 1);
	const [rows, setRows] = useState(userState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(userState.filtered.length / rows));
	const dispatch = useDispatch();
	const [dialogVisible, setdialogVisible] = useState(false);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const handleClickEmployee = (item: UserModel) => {
		setselectedEmployee(item);
	};
	const fetchListLocal = () => {
		dispatch(fetchUsers());
	};
	const handleSubmitSelectedEmployee = () => {
		if (props.updateData) {
			const data = { ...props.data };

			data.employeeSelect = selectedEmployee;
			setEmployeeData(selectedEmployee);
			props.updateData(data);
			if (props.isOutSide) {
				dispatch(EditServiceSelect(data));
			}
		}
		setdialogVisible(false);
	};
	const handleDeleteEmployee = () => {
		if (props.updateData) {
			const data = { ...props.data };
			data.employeeSelect = undefined;
			setEmployeeData(undefined);
			props.updateData(data);
			if (props.isOutSide) {
				dispatch(EditServiceSelect(data));
			}
		}
	};
	const handleClick = (_e: React.MouseEvent) => {
		if (props.onClick) {
			props.onClick(props.data);
		}
	};
	const menuitem = (item: any | undefined) => {
		return (
			<>
				{item ? (
					<div
						className="menu-item-2"
						style={{
							height: 57,
							borderRadius: 12,
							width: props.percentWidth || "100%",
							alignContent: "center",
						}}
					>
						<div className="col-sm-12">
							<div className="d-flex align-items-center p-1">
								<div className="d-flex align-items-center " onClick={() => {}}>
									<IconButton
										icon={"ri-group-line"}
										width={40}
										height={40}
										onClick={() => {}}
										actived={false}
										className="custom-primary-button fs-5 background-white"
									/>
									<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
										<div style={{}}>
											{item?.profile.firstName || ""} {item?.profile.lastName || ""}
										</div>
									</div>
								</div>
								<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
									{item?.label}
								</div>
								<WtcButton
									label={t("")}
									className="bg-danger text-white"
									icon="ri-close-line"
									width={60}
									borderRadius={16}
									height={40}
									fontSize={30}
									labelStyle={{ fontWeight: "bold" }}
									onClick={handleDeleteEmployee}
								/>
							</div>
						</div>
					</div>
				) : (
					<>
						<div
							className="menu-item-2"
							style={{ height: 57, borderRadius: 12, width: "100%", alignContent: "center" }}
						>
							<div className="col-sm-12">
								<div className="d-flex align-items-center p-1">
									<div className="d-flex align-items-center " onClick={() => {}}>
										<IconButton
											icon={"ri-group-line"}
											width={40}
											height={40}
											onClick={() => {}}
											actived={false}
											className="custom-primary-button fs-5 background-white"
										/>
										<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
											<div className="my-label-in-grid">#</div>
										</div>
									</div>
									<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
										{item?.label}
									</div>
									<WtcButton
										label={t("")}
										className="wtc-bg-primary text-white"
										icon="ri-add-line"
										width={60}
										borderRadius={16}
										height={40}
										fontSize={30}
										labelStyle={{ fontWeight: "bold" }}
										onClick={() => setdialogVisible(true)}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</>
		);
	};
	useEffect(() => {
		fetchListLocal();
		setEmployeeData(props.data?.employeeSelect);
	}, [props.data?.employeeSelect]);
	useEffect(() => {
		dispatch(filterSearch({ searchString: "", status: "ALL" }));
	}, [userState.list]);
	return (
		<div
			className={`w-100 mb-1 ${
				props.selected && "my-border-full"
			} my-border-left d-flex pb-2 pt-1 px-1 me-order-product ${
				props.data?.active && !props.readonly ? "active" : ""
			}`}
			style={{ fontSize: 18, cursor: "pointer" }}
		>
			<div className="w-100 flex-grow-1" onClick={props.readonly ? () => {} : () => {}}>
				<div className="d-flex w-100 align-items-center" onClick={handleClick}>
					<div className="flex-grow-1">
						<div className="two-line-ellipsis" style={{ fontWeight: 800, color: "#242B35" }}>
							{props.data?.displayName}
						</div>
						<div className="d-flex pt-1" style={{ fontSize: 16, fontWeight: 500 }}>
							<span className="me-1" style={{ color: "#5B6B86" }}>
								{props.data?.unit} x
							</span>
							{discount > 0 ? (
								<span className="fw-bold me-1">
									${" "}
									{toLocaleStringRefactor(
										toFixedRefactor(Number(props.data?.storePrice) * (1 - discount / 100), 2)
									)}
								</span>
							) : (
								<span className="fw-bold me-1">
									$ {toLocaleStringRefactor(toFixedRefactor(Number(props.data?.storePrice), 2))}
								</span>
							)}
							<span style={{ color: "#5B6B86" }}>/Units</span>
						</div>
						<div className="d-flex pt-1" style={{ fontSize: 16, fontWeight: 500 }}>
							{
								<span className="me-1">
									{t("tax")}&ensp;${toLocaleStringRefactor(toFixedRefactor(Number(10), 2))}
								</span>
							}
						</div>

						{discount > 0 && (
							<span className="text-secondary" style={{ fontSize: 14 }}>
								With a {discount}% discount
							</span>
						)}
					</div>
					<div className=" px-2" style={{ fontWeight: 600 }}>
						{props.readonly ? (
							<></>
						) : (
							<div className="align-self-center fs-5 d-inline">
								<div
									className="d-inline px-3"
									onClick={(e) => {
										e.stopPropagation();
										props.onClickRemove();
									}}
								>
									<i className="ri-delete-bin-5-line text-muted"></i>
								</div>
							</div>
						)}
						<div style={{ fontSize: 17 }} className={"primary-color"}>
							$
							{toLocaleStringRefactor(
								toFixedRefactor(Number(props.data?.storePrice * props.data?.unit), 2)
							)}
						</div>
					</div>
				</div>
				<div className="d-flex pt-1" style={{ fontSize: 16, fontWeight: 500 }}>
					{menuitem(EmployeeData)}
				</div>
				{props.turn && (
					<div className="ps-5">
						<div className="d-flex text-secondary fw-bold">
							<div className="flex-grow-1">Wait</div>
							<div></div>
							<div></div>
						</div>
						<div className="d-flex fw-bold">
							<div className="flex-grow-1">Assigned</div>
							<div>Mike</div>
							<div className="text-end" style={{ width: 100 }}>
								12:31pm
							</div>
						</div>
						<div className="d-flex text-success fw-bold">
							<div className="flex-grow-1">Started</div>
							<div>Henry</div>
							<div className="text-end" style={{ width: 100 }}>
								12:32pm
							</div>
						</div>
						<div className="d-flex text-secondary fw-bold">
							<div className="flex-grow-1">Done</div>
							<div>Hella</div>
							<div className="text-end" style={{ width: 100 }}>
								12:33pm
							</div>
						</div>
					</div>
				)}
			</div>

			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"95vh"}
				visible={dialogVisible}
				mode={"add"}
				position={"center"}
				title={t("Employees")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setdialogVisible(false)}
				body={
					<div
						className="my-background-order p-2"
						style={{ height: bodyHeight > 639 ? bodyHeight - 175 : bodyHeight - 168, overflow: "hidden" }}
					>
						<WtcCard
							isPaging={true}
							title={
								<HeaderList
									callback={fetchListLocal}
									target=""
									onSearchText={(text) =>
										dispatch(filterSearch({ searchString: text, status: "ALL" }))
									}
									hideAdd
									onAddNew={() => {}}
								/>
							}
							hideBorder={true}
							body={
								<div className="d-flex flex-column h-100">
									<div
										className="flex-grow-1 as"
										style={{
											maxHeight: screenSize.height - 370,
											overflowX: "hidden",
											overflowY: "auto",
										}}
									>
										{userState.fetchState.status == "loading" ? (
											<LoadingIndicator />
										) : !userState.filtered || userState?.filtered.length == 0 ? (
											<div className="w-100 h-100 d-flex flex-column justify-content-center">
												{" "}
												<WtcEmptyBox />
											</div>
										) : (
											userState?.filtered.map((item: UserModel, index: any) => {
												if (index >= first && index < first + rows)
													return (
														<div className="w-100" key={"customer-" + item._id}>
															<WtcItemCard
																target="ORDER"
																index={index}
																hideDeleteSwiper={true}
																slideButtons={[
																	<Button
																		type="button"
																		label={t("select")}
																		className="text-white wtc-bg-primary dialog-cancel-button"
																		icon="ri ri-check-line"
																		onClick={() => {}}
																	/>,
																]}
																verticalSpacing={itemsLineSpacing}
																selected={item._id === selectedEmployee?._id}
																onDbClick={() => {}}
																onClick={() => handleClickEmployee(item)}
																status={item.status?.value}
																onDelete={() => {}}
																onRestore={() => {}}
																body={
																	<div className="row align-items-center p-3">
																		<div className="col-sm-3">
																			<div
																				className="text-truncate"
																				style={itemListStyle}
																			>
																				{" "}
																				<i
																					id="fullname_empl"
																					className="my-grid-icon ri-user-line"
																				/>
																				{item.profile.lastName}{" "}
																				{item.profile.middleName}{" "}
																				{item.profile.firstName}
																			</div>
																			<Tooltip
																				position="bottom"
																				target="#fullname_empl"
																				content={t("fullname")}
																			/>
																		</div>
																		<div className="col-sm-4">
																			<div style={itemListStyle}>
																				<span>
																					<i
																						id="phone_empl"
																						className="my-grid-icon ri-phone-line"
																					/>{" "}
																				</span>
																				{item.profile.phone}
																			</div>
																			<Tooltip
																				position="bottom"
																				target="#phone_empl"
																				content={t("phone")}
																			/>
																		</div>
																		<div className="col-sm-5">
																			<div
																				className="text-truncate"
																				style={itemListStyle}
																			>
																				<span>
																					<i
																						id="address_empl"
																						className="my-grid-icon ri-home-3-line"
																					/>{" "}
																				</span>
																				{item.profile.street1 ?? "-"}
																			</div>
																			<Tooltip
																				position="bottom"
																				target="#address_empl"
																				content={t("address")}
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

									{userState.filtered?.length > 0 && (
										<div className="my-padding-top-paging">
											<Paginator
												first={first}
												rows={rows}
												totalRecords={userState?.filtered?.length}
												rowsPerPageOptions={[10, 20]}
												onPageChange={onPageChange}
											/>
										</div>
									)}
								</div>
							}
							className="h-100 "
						/>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							disabled={!selectedEmployee}
							label={t("select")}
							className="text-white wtc-bg-primary dialog-cancel-button"
							icon="ri ri-check-line"
							onClick={handleSubmitSelectedEmployee}
						/>
					</div>
				}
			/>
		</div>
	);
}
