import { t } from "i18next";
import _ from "lodash";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import taxicon from "../../assets/svg/ico_tax.svg";
import {
	ActionButtonOrder,
	ActionOrder,
	formatCapitalize,
	PageTarget,
	Status,
	StatusInitInprocessing,
	StatusValueOrder,
} from "../../const";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { ServiceModel } from "../../models/category/Service.model";
import { UserModel } from "../../models/category/User.model";
import { WindowModel } from "../../models/category/Window.model";
import {
	calculatorDiscount,
	deleteAServiceInListservice,
	EditOrder,
	updateIsTransfer,
	updateItemTransfer,
	updateListDiscount,
	UpdateListServiceClick,
	updateSaveDrag,
	updatetempService,
} from "../../slices/newOder.slice";
import { failed, questionWithConfirm, warningWithConfirm } from "../../utils/alert.util";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import Square from "../../views/category/Window/Square";
import ActionOrderDropdown from "../ActionOrderDropdown";
import DynamicDialog from "../DynamicDialog";
import WtcCard from "./WtcCard";
import WtcInfoItem from "./WtcInfoItem";
import WtcRoleButton from "./WtcRoleButton";
type SelectedServiceEmployeeProps = ListServiceSelectedModel & {
	isView?: boolean;
	isRefund?: boolean;
	status: Status;
	handleDelete?: (id: string) => void;
	handleDeleteEmployee?: (id: string) => void;
};
export default function SelectedServiceEmployee(props: SelectedServiceEmployeeProps) {
	const TotalMoneyListService =
		props?.ListService && props.ListService.reduce((acc, service) => acc + service.totalPriceOrder, 0);
	const TotalMoneyListGiftCard = props.ListGiftCard
		? props.ListGiftCard.reduce((acc, service) => acc + service.amount, 0)
		: 0;
	const fontStyle1 = { fontSize: 18, fontWeight: 700, color: "#384252", textOverflow: "clip" };
	const windows = useAppSelector((state) => state.window);
	const dispatch = useDispatch();
	const newOderState = useAppSelector((state) => state.newOder);
	const [dialogVisibleEmpl, setDialogVisibleEmpl] = useState(false);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const myRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<ListServiceSelectedModel[]>(newOderState.tempService || []);
	const userState = useAppSelector((state) => state.user);
	const [selectedEmployee, setSelectedEmployee] = useState<UserModel>();
	const [ListChangeEmployee, setListChangeEmployee] = useState<ListServiceSelectedModel | undefined>();
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [windowSelected, setWindowSelected] = useState(w[0]);
	const [activeItem, setActiveItem] = useState(windowSelected?.name);
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
	const [showed, setShowed] = useState(false);
	const [isTransfer, setIsTransfer] = useState(false);
	const handleItemClick = (item: any) => {
		setActiveItem(item.name);
		setWindowSelected(item);
		setSelectedNumber(null);
		setSelectedEmployee(undefined);
	};
	const handleClickEmployee = (item: UserModel | undefined) => {
		setSelectedEmployee(item);
	};
	const handleClick = (_id: string) => {
		if (newOderState.ListServiceClick?._id == _id) {
			dispatch(UpdateListServiceClick(undefined));
		} else {
			const item = newOderState.tempService.find((p) => p._id == _id);
			// if (!(item?.ListGiftCard && item?.ListGiftCard?.length > 0))
			dispatch(UpdateListServiceClick(item));
		}
	};
	const handleClickIndex = (index: number) => {
		setSelectedNumber(index);
	};
	const handleDeleteListService = (_id: string) => {
		if (props.handleDelete) props.handleDelete(_id);
	};
	const handleDeleteEmployee = (_id: string) => {
		if (props.handleDeleteEmployee) props.handleDeleteEmployee(_id);
	};
	const handleDeleteService = (idlist: string, idservice: string, storeprice: number) => {
		dispatch(deleteAServiceInListservice({ idlist, idservice, storeprice }));
		dispatch(updateSaveDrag(true));
	};
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id && user.status == "ACTIVE")
			.find((user) => user.profile?.positionPoint === position);
	};
	const handleClickSelect = (employee: UserModel | undefined) => {
		handleClickChangeEmployee(employee);
		const updatedListDiscount = newOderState.ListDiscount.map((i) => {
			if (i.Employee?._id === ListChangeEmployee?.Employee?._id) {
				return {
					...i,
					Employee: employee,
				};
			}
			return i;
		});
		dispatch(updateListDiscount(updatedListDiscount));
		// dispatch(calculatorDiscount(newOderState.ListDiscount));
	};
	const handleClickDoneTask = () => {
		questionWithConfirm({
			title: t("ques_done"),
			text: "",
			confirmButtonText: t("status_done"),
			confirm: () => {
				const data = {
					details: [
						{
							action: ActionButtonOrder.done,
							payload: {
								_id: props?.OrderDetailId,
								employeeId: props?.Employee?._id,
							},
						},
					],
				};
				dispatch(EditOrder({ id: newOderState._id, data: data }));
			},
			close: () => {},
		});
	};
	const isEmployeeDone = (employeeId: string, list: ListServiceSelectedModel[]) => {
		return list.some((item) => item.Employee?._id === employeeId && item.status?.code === "DONE");
	};
	const handleClickChangeEmployee = (employees: UserModel | undefined) => {
		if (isTransfer && isEmployeeDone(employees?._id || "", selected)) {
			failed(t("err_transfer_done"));
			return;
		}
		let employeeExists = false;
		let existingItem: ListServiceSelectedModel | undefined;
		// Tìm đối tượng đã tồn tại trong mảng selected
		selected.forEach((item) => {
			if (item.Employee?._id === employees?._id) {
				employeeExists = true;
				existingItem = item;
				return;
			}
		});
		if (employeeExists && existingItem) {
			if (ListChangeEmployee) {
				const existingServices = existingItem?.ListService || [];
				const newServices = ListChangeEmployee.ListService;
				const mergedServices = [...existingServices, ...(newServices || [])].reduce(
					(acc: ServiceModel[], service) => {
						acc.push(service);
						return acc;
					},
					[]
				);
				const updatedTip = (existingItem?.tip || 0) + ListChangeEmployee.tip;
				const updatedItem = new ListServiceSelectedModel(
					employees,
					mergedServices,
					[],
					existingItem?._id || "",
					existingItem?.code,
					updatedTip,
					existingItem?.discount,
					StatusInitInprocessing(),
					existingItem?.OrderDetailId,
					undefined
				);
				setSelected((prevSelected) => {
					// Xóa mục cũ với ListChangeEmployee và cập nhật danh sách mới
					return prevSelected
						.filter((item) => item._id !== ListChangeEmployee._id)
						.map((item) => (item._id === existingItem?._id ? updatedItem : item));
				});
				dispatch(UpdateListServiceClick(updatedItem));
				if (isTransfer) {
					const detail = {
						action: ActionOrder.transfer,
						payload: {
							_id: existingItem._id,
							employeeId: employees?._id,
							oldId: ListChangeEmployee?.OrderDetailId,
						},
					};
					dispatch(updateItemTransfer(detail));
					dispatch(updateIsTransfer(true));
				}
				setDialogVisibleEmpl(false);
				setListChangeEmployee(undefined);
			}
		} else {
			if (ListChangeEmployee) {
				const updatedItem = new ListServiceSelectedModel(
					employees,
					ListChangeEmployee.ListService,
					ListChangeEmployee.ListGiftCard,
					ListChangeEmployee._id,
					undefined,
					ListChangeEmployee.tip,
					ListChangeEmployee.discount,
					ListChangeEmployee.status,
					ListChangeEmployee.OrderDetailId,
					undefined
				);
				setSelected((prevSelected) => {
					return prevSelected.map((item) => (item._id === ListChangeEmployee._id ? updatedItem : item));
				});
				dispatch(UpdateListServiceClick(updatedItem));
				setDialogVisibleEmpl(false);
				setListChangeEmployee(undefined);
			}
		}
	};
	const handleClickOutside = (e: any) => {
		if (!myRef.current?.contains(e.target)) {
			if (showed) {
				setShowed(false);
			}
		}
	};
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	});
	useEffect(() => {
		if (!_.isEqual(newOderState.tempService, selected)) {
			setSelected(newOderState.tempService);
		}
	}, [newOderState.tempService]);
	useEffect(() => {
		if (!_.isEqual(newOderState.tempService, selected)) {
			dispatch(updatetempService(selected));
		}
		dispatch(calculatorDiscount(newOderState.ListDiscount));
	}, [selected]);
	useEffect(() => {
		if (!windowSelected && w.length > 0) {
			setWindowSelected(w[0]);
			setActiveItem(w[0].name);
		}
	}, [windows]);
	useEffect(() => {
		if (newOderState.actionUpdateEmployee) {
			switch (newOderState.actionUpdateEmployee.status!) {
				case "completed":
					handleClickChangeEmployee(selectedEmployee);
					setSelectedEmployee(undefined);
					break;
			}
		}
	}, [newOderState.actionUpdateEmployee]);
	return (
		<>
			<div
				className={`wtc-bg-white item-shadow mb-2 mt-1 d-flex flex-column align-propss-center justify-content-between ${
					props._id === newOderState.ListServiceClick?._id ? "border-active" : ""
				}`}
				style={{ cursor: "pointer", borderRadius: "12px" }}
				onClick={() => {
					if (!props.isView) handleClick(props._id);
				}}
			>
				<div className="d-flex align-items-center p-0 pt-0 px-2 justify-content-between w-100">
					<span style={fontStyle1} className="d-flex align-items-center flex-grow-1 overflow-hidden">
						{!props.isView && props?.status?.code === StatusValueOrder.inprocessing ? (
							<i
								className="ri-delete-bin-line text-danger fw-normal fs-4"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteListService(props._id);
								}}
							></i>
						) : props.isRefund ? (
							<i
								className="ri-delete-bin-line text-danger fw-normal fs-4"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteListService(props._id);
								}}
							></i>
						) : (
							<>
								{props?.status?.code === StatusValueOrder.done && !props.isView && (
									<i className="ri-check-line text-success fw-bold fs-5"></i>
								)}
							</>
						)}
						&ensp;<span className="fs-name-empl fw-normal">{t("staff")}&ensp;</span>
						<span className="fs-value text-truncate" style={{ maxWidth: "90%" }}>
							{!props?.Employee ? (
								"#"
							) : (
								<>
									{`${formatCapitalize(props.Employee?.profile.firstName || "")} ${formatCapitalize(
										props.Employee?.profile.middleName || ""
									)} ${formatCapitalize(props.Employee?.profile.lastName || "")}`}
									&ensp;
									{!props.OrderDetailId && (
										<i
											className="ri-user-unfollow-line text-danger"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteEmployee(props._id);
											}}
										></i>
									)}
								</>
							)}
						</span>
						&ensp;
						{props.isRefund && (
							<>
								<i
									className="ri-edit-line fw-normal fs-4"
									onClick={() => {
										setListChangeEmployee(props);
										setDialogVisibleEmpl(true);
									}}
								></i>
							</>
						)}
					</span>
					<div style={fontStyle1}>
						<span className="wtc-text-primary fs-value" style={{ whiteSpace: "nowrap" }}>
							${" "}
							{toLocaleStringRefactor(
								toFixedRefactor(Number(TotalMoneyListService || 0 + TotalMoneyListGiftCard), 2)
							)}
						</span>
					</div>
				</div>

				<div className="row w-100 m-0 p-0 mb-1">
					{props?.ListService &&
						props.ListService.map((serviceProps, index) => (
							<div className={`col-sm-12 w-100 margin-bottom-1`} key={index}>
								<div style={{ borderRadius: 11, height: 33, border: "1px solid transparent" }}>
									<div
										className={`d-flex w-100 h-100 index-key`}
										style={{
											background: "#FCFCFD",
											borderRadius: 11,
											height: "100%",
											border: "1px solid #F1F3F6",
										}}
									>
										<div
											className="ms-0 h-100 flex-grow-1"
											style={{
												overflow: "hidden",
												whiteSpace: "nowrap",
												textOverflow: "ellipsis",
											}}
										>
											<div className="d-flex">
												<div className="label-name-service p-1 flex-grow-1">
													{serviceProps.tax == "YES" && (
														<>
															<img id="IsTax" className="size-svg-order" src={taxicon} />
															<Tooltip
																style={{ fontSize: 10 }}
																position="mouse"
																target="#IsTax"
																content={t("isTaxService")}
															/>
														</>
													)}{" "}
													{serviceProps.displayName} -{" "}
													<span className="wtc-text-primary fw-bold">
														${" "}
														{toLocaleStringRefactor(
															toFixedRefactor(serviceProps.totalPriceOrder, 2)
														)}
													</span>{" "}
												</div>
												<div
													className="label-name-service flex-shrink-1 w-25"
													style={{ textAlign: "end" }}
												>
													{!props.isView && !(props?.status?.code == "DONE") && (
														<i
															className="fw-normal ri-delete-bin-line text-muted fs-4 p-2"
															onClick={(e) => {
																e.stopPropagation();
																warningWithConfirm({
																	title: t("do_you_delete"),
																	text: "",
																	confirmButtonText: t("Delete"),
																	confirm: () => {
																		handleDeleteService(
																			props._id,
																			serviceProps._id,
																			serviceProps.storePrice
																		);
																	},
																});
															}}
														></i>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					{Array.isArray(props.ListGiftCard) &&
						props.ListGiftCard.map((serviceProps, index) => (
							<div className={`col-sm-12 w-100 margin-bottom-1`} key={index}>
								<div style={{ borderRadius: 11, height: 33, border: "1px solid transparent" }}>
									<div
										className={`d-flex w-100 h-100 index-key`}
										style={{
											background: "#FCFCFD",
											borderRadius: 11,
											height: "100%",
											border: "1px solid #F1F3F6",
										}}
									>
										<div
											className="ms-0 h-100 flex-grow-1"
											style={{
												overflow: "hidden",
												whiteSpace: "nowrap",
												textOverflow: "ellipsis",
											}}
										>
											<div className="d-flex">
												<div className="label-name-service p-1 flex-grow-1">
													{t("giftcard")} - {serviceProps.cardId} -{" "}
													<span className="wtc-text-primary fw-bold">
														${" "}
														{toLocaleStringRefactor(
															toFixedRefactor(serviceProps.amount, 2)
														)}
													</span>{" "}
												</div>
												<div
													className="label-name-service flex-shrink-1 w-25"
													style={{ textAlign: "end" }}
												>
													{!props.isView && (
														<i
															className="fw-normal ri-delete-bin-line text-muted fs-5 p-2"
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteService(
																	props._id,
																	serviceProps._id,
																	serviceProps.amount
																);
															}}
														></i>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					{!props.isView &&
					props.Employee &&
					props?.status?.code == StatusValueOrder.inprocessing &&
					props.OrderDetailId ? (
						<div className="row pe-0" style={{ marginBottom: 0 }}>
							{!(Array.isArray(props.ListGiftCard) && props.ListGiftCard.length > 0) && (
								<>
									<div className="col-md-5 pe-0">
										<WtcInfoItem
											title={t("tip")}
											value={toLocaleStringRefactor(toFixedRefactor(props.tip, 2))}
										/>
									</div>
									<div className="col-md-6">
										<WtcInfoItem
											title={t("discount")}
											value={toLocaleStringRefactor(toFixedRefactor(props.discount, 2))}
										/>
									</div>
								</>
							)}
							<div className="col-md-1 right-content" style={{ placeItems: "center" }}>
								<nav className="navbar navbar-expand-lg navbar-light p-0">
									<div className={showed ? "iq-show" : ""} ref={myRef}>
										<div
											onClick={(e) => {
												e.stopPropagation();
												setShowed(!showed);
											}}
										>
											<WtcRoleButton
												action="UPD"
												minWidth={20}
												target={PageTarget.order}
												label={""}
												icon="ri-more-2-fill"
												width={"20px"}
												borderRadius={6}
												height={29}
												fontSize={16}
												className="text-white wtc-bg-primary mt-more-action"
												onClick={() => {}}
											/>
										</div>
										<ActionOrderDropdown
											status={props?.status || ""}
											isProfile={true}
											callback={() => setShowed(false)}
											OrderDetailId={props.OrderDetailId}
											onClickTransfer={() => {
												setIsTransfer(true);
												setDialogVisibleEmpl(true);
												setShowed(false);
												setListChangeEmployee(props);
											}}
											onClickDone={handleClickDoneTask}
										/>
									</div>
								</nav>
							</div>
						</div>
					) : (
						<>
							{!(Array.isArray(props.ListGiftCard) && props.ListGiftCard.length > 0) && (
								<>
									<div className="col-md-6 pe-0">
										<WtcInfoItem
											title={t("tip")}
											value={toLocaleStringRefactor(toFixedRefactor(props.tip, 2))}
										/>
									</div>
									<div className="col-md-6">
										<WtcInfoItem
											title={t("discount")}
											value={toLocaleStringRefactor(toFixedRefactor(props.discount, 2))}
										/>
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>
			<DynamicDialog
				width={isMobile ? "90vw" : "85vw"}
				minHeight={"85vh"}
				visible={dialogVisibleEmpl}
				mode={"add"}
				position={"center"}
				title={t("Employees")}
				okText=""
				cancelText="Hủy"
				draggable={false}
				isBackgroundGray={true}
				resizeable={false}
				onClose={() => setDialogVisibleEmpl(false)}
				// status={formikStore.values.status.code}
				body={
					<div className="my-background-order p-0" style={{ height: bodyHeight - 200, overflow: "hidden" }}>
						<WtcCard
							className="h-100"
							borderRadius={12}
							classNameBody="flex-grow-1 px-1 h-100"
							title={
								<div className="row bg-white boxContainer" style={{ textAlign: "center" }}>
									{windows.list
										.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE")
										.map((item: WindowModel, index) => {
											return (
												<div key={index} className="col boxItem">
													<div
														tabIndex={index + 1}
														key={item.code}
														onClick={() => handleItemClick(item)}
														className={`col clickable ${
															activeItem === item.name ? "my-active-title" : ""
														}`}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleItemClick(item);
															}
														}}
													>
														<span
															className={` rounded-circle d-inline-block text-center circle-rounded ${
																activeItem === item.name ? "my-active-index" : ""
															}`}
														>
															{index + 1}
														</span>
														&ensp;<span className="text-color-gray">{item.name}</span>
													</div>
												</div>
											);
										})}
								</div>
							}
							tools={<></>}
							body={
								<div className="row bg-white" style={{ height: screenSize.height - 259 }}>
									{windows.list.filter(
										(item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
									).length > 0 ? (
										Array.from({ length: 20 }).map((_, index) => {
											const user = getUserAtPosition(index + 1);
											return (
												<Square
													heightIcon={60}
													widthIcon={60}
													height={(screenSize.height - 165) / 6}
													isUSer={false}
													key={index}
													index={index}
													selected={selectedNumber}
													onClick={() => {}}
													onClickEmployee={() => handleClickIndex(index)}
													user={user?.profile}
													employee={user}
													onClickSelectEmpl={() => handleClickEmployee(user)}
												/>
											);
										})
									) : (
										<div className="text-center">{t("windows_empty")}</div>
									)}
								</div>
							}
							hideBorder={true}
						/>
					</div>
				}
				closeIcon
				footer={
					<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
						<Button
							type="button"
							disabled={
								!selectedEmployee ||
								selectedEmployee._id == newOderState.ListServiceClick?.Employee?._id
							}
							label={t("select")}
							className="text-white wtc-bg-primary dialog-cancel-button"
							icon="ri ri-check-line"
							onClick={() => handleClickSelect(selectedEmployee)}
						/>
					</div>
				}
			/>
		</>
	);
}
