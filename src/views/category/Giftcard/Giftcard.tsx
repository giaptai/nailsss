import { format } from "date-fns-tz";
import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Paginator } from "primereact/paginator";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import DynamicDialog, { DialogMode } from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderList";
import LoadingIndicator from "../../../components/Loading";
import WtcButton from "../../../components/commons/WtcButton";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import WtcInputPhone from "../../../components/commons/WtcInputPhone";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import WtcTabs from "../../../components/commons/WtcTabs";
import {
	checkEmptyAndUndefined,
	formatCapitalize,
	FormatMoneyNumber,
	formatPhoneNumberSubmitDatabase,
	formatPhoneNumberViewUI,
	handleAddValue,
	PageTarget,
} from "../../../const";
import { GiftcardModel } from "../../../models/category/Giftcard.model";
import {
	addGiftcard,
	deleteGiftcard,
	fetchDetailGiftcard,
	fetchGiftcard,
	filterSearch,
	resetActionState,
	resetFetchDetailState,
	restoreGiftcard,
	setCurrentPage,
	setCurrentRows,
	updateGiftcard,
} from "../../../slices/giftcard.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";
import WtcItemCard from "../../../components/commons/WtcItemCard";
import { itemListStyle } from "../../../components/Theme";
import { Tooltip } from "primereact/tooltip";
export default function Giftcard() {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const giftcardState = useAppSelector((state) => state.giftcard);
	const [selectedId, setSelectedId] = useState("");
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (giftcardState.currentPage - 1) * giftcardState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(giftcardState.currentPage - 1);
	const [rows, setRows] = useState(giftcardState.currentRows);
	const [_totalPages, setTotalPages] = useState(Math.ceil(giftcardState.filtered.length / rows));
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [values, setValues] = useState<string[]>([]);
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const [activeTabName, setActiveTabName] = useState<"detail" | "history">("detail");
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const storeSettingState = useAppSelector((state) => state.storeconfig);
	const getMaxValueAmountGifcard = (data: any): number => {
		const maxAmount = data.find((item: any) => item.key === "maxGiftcardAmount");
		return maxAmount ? Number(maxAmount.value) : 0;
	};
	const maxValueGiftCard = getMaxValueAmountGifcard(storeSettingState?.list || []);
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const formikGiftcard = useFormik<any>({
		initialValues: GiftcardModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<GiftcardModel> = {};
			if (dialogMode == "add") {
				if (checkEmptyAndUndefined(data.cardId) && values.includes("cardId")) {
					errors.cardId = "y";
				}
				if ((data.amount == null || data.amount == "" || data.amount == 0) && values.includes("amount")) {
					errors.amount = "y";
				}
				if (checkEmptyAndUndefined(data.phone) && values.includes("phone")) {
					errors.phone = "y";
				}
				if (checkEmptyAndUndefined(data.type) && values.includes("type")) {
					errors.type = "y";
				}
			} else {
				if (!data.cardId) {
					errors.cardId = "y";
				}
				if (!data.amount) {
					errors.amount = "y";
				}
				if (!data.phone) {
					errors.phone = "y";
				}
				if (!data.type) {
					errors.type = "y";
				}
			}
			return errors;
		},
		onSubmit: (data) => {
			const submitData = {
				cardId: data.cardId,
				amount: data.amount,
				firstName: data.firstName || null,
				lastName: data.lastName || null,
				phone: formatPhoneNumberSubmitDatabase(data.phone),
				zipcode: data.zipcode || null,
				note: data.note || null,
				type: "GIVE_STORE_CREDIT",
			};
			if (dialogMode == "add") {
				dispatch(addGiftcard(submitData));
			} else if (dialogMode == "edit") {
				dispatch(updateGiftcard({ _id: data._id, data: submitData }));
			}
			setValues([]);
		},
	});
	const handldeleteGiftCard = (id: string) => {
		dispatch(deleteGiftcard(id));
	};
	const handleRestoreGiftcard = (id: string) => {
		dispatch(restoreGiftcard(id));
	};
	const closeDialog = () => {
		setValues([]);
		setActiveTabName("detail");
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikGiftcard.resetForm();
		setSelectedId("");
	};
	const openItem = (item: GiftcardModel) => {
		setSelectedId(item._id);
		setDialogMode("edit");
		dispatch(fetchDetailGiftcard(item._id));
	};
	const giftCardItemView = (item: GiftcardModel, _id: any, index: number) => {
		return (
			<WtcItemCard
				target={PageTarget.giftcard}
				index={index}
				uniqueId={item._id}
				verticalSpacing={0}
				selected={item._id == selectedId}
				onDbClick={() => {}}
				onClick={() => {
					openItem(item);
				}}
				status={item?.status}
				body={
					<div className="row align-items-center p-2">
						<div className="col-sm-3">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								{item.cardId}
							</div>
						</div>
						<div className="col-sm-3">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								$ {FormatMoneyNumber(item.remaining)}
							</div>
						</div>
						<div className="col-sm-3">
							<div style={itemListStyle} className="my-grid-value">
								{" "}
								<i id="fullname_gift" className="my-grid-icon ri-user-line" />{" "}
								{formatCapitalize(item.firstName)} {formatCapitalize(item.lastName)}
							</div>
							<Tooltip position="bottom" target="#fullname_gift" content={t("fullname")} />
						</div>
						<div className="col-sm-3">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								<span>
									<i id="phone_empl" className="my-grid-icon ri-phone-line" />{" "}
								</span>
								{formatPhoneNumberViewUI(item.phone)}
							</div>
							<Tooltip position="bottom" target="#address_empl" content={t("phone")} />
						</div>
					</div>
				}
			/>
		);
	};
	// const menuitem = (item: GiftcardModel) => {
	// 	const isInActive = item.status.code === "INACTIVE";
	// 	return giftcardState.fetchDetailState.status == "loading" && item._id == selectedId ? (
	// 		<div className="d-flex align-items-center p-4 my-1 menu-item-2" style={{ height: 119 }}>
	// 			<LoadingIndicator />
	// 		</div>
	// 	) : (
	// 		<div
	// 			className="menu-item-2 my-1"
	// 			onClick={() => {
	// 				openItem(item);
	// 			}}
	// 		>
	// 			<div className="col-sm-12">
	// 				<div className="d-flex align-items-center p-1 my-1">
	// 					<div className="d-flex align-items-center">
	// 						<StatusItemList width={40} height={40} className="background-white" inactive={isInActive} />
	// 						<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
	// 							<div>{item.cardId}</div>
	// 							<div className="my-2 my-label-in-grid fs-value fw-bold wtc-text-primary">
	// 								$ {FormatMoneyNumber(item.remaining)}
	// 							</div>
	// 							<div className="my-2 one-line-ellipsis my-label-in-grid">
	// 								<i className="pi pi-user fs-icon"></i> {item.firstName || "#"}{" "}
	// 								{item.lastName || "#"}
	// 							</div>
	// 							<div className=" my-label-in-grid">
	// 								<i className="pi pi-phone fs-icon"></i> {formatPhoneNumberViewUI(item.phone) || "#"}
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<div className="flex-grow-1 ps-2 fw-bold" style={{ color: "#30363F" }}>
	// 						{""}
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// };

	const itemHistory = (item: any, index: number) => {
		return (
			<div
				key={item._id}
				className={`row mt-1 p-1`}
				style={{ backgroundColor: index % 2 == 0 ? "" : "#fff", borderRadius: 6 }}
			>
				<div className="col-md-2">{format(item?.transDate, "MM-dd-yyyy hh:mm a", { timeZone })}</div>
				<div className="col-md-3">
					{item?.customer?.firstName || "#" + " "} {item?.customer?.lastName || "#"}
				</div>
				<div className="col-md-3">$ {FormatMoneyNumber(item.amount)}</div>
				<div className="col-md-4">{item?.content || ""}</div>
			</div>
		);
	};

	const giftcardViewDetail = () => {
		const tabs = [t("detail"), t("history")];
		const contents = [
			<div className="pt-3 p-2">
				<div className="row">
					<div className="col-sm-12 mb-2" onClick={() => handleAddValue("cardId", values, setValues)}>
						<WtcRoleInputIconText
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="cardId"
							target={PageTarget.giftcard}
							placeHolder={t("giftcardId")}
							maxLength={50}
							focused
							required
							leadingIcon={"ri-gift-line"}
							field="cardId"
							formik={formikGiftcard}
							value={formikGiftcard.values.cardId}
							disabled={dialogMode === "edit"}
						/>
					</div>
					<div
						className="col-md-6 mb-2"
						onFocus={() => setCheckSubmitEnter(true)}
						onBlur={() => setCheckSubmitEnter(false)}
					>
						<WtcRoleDropdownIconText
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="type"
							target={PageTarget.giftcard}
							required
							filtler={false}
							placeHolder={t("typeofcard")}
							leadingIcon={"ri-gift-line"}
							options={[
								{ label: t("sellanewgift"), value: "SELL_A_NEW" },
								{ label: t("givestorecreditgift"), value: "GIVE_STORE_CREDIT" },
							]}
							field="type"
							formik={formikGiftcard}
							value={formikGiftcard.values.type}
							disabled={dialogMode === "edit"}
						/>
					</div>
					<div className="col-sm-6 mb-2" onClick={() => handleAddValue("amount", values, setValues)}>
						<WtcRoleInputIconNumber
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="amount"
							target={PageTarget.giftcard}
							isCurr
							minFractionDigits={2}
							maxFractionDigits={2}
							placeHolder={t("amount")}
							required
							maxValue={maxValueGiftCard || 0}
							leadingIcon={"ri-money-dollar-circle-line"}
							field="amount"
							formik={formikGiftcard}
							value={formikGiftcard.values.amount}
							disabled={dialogMode === "edit"}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="firstName"
							target={PageTarget.giftcard}
							placeHolder={t("firstName")}
							maxLength={20}
							leadingIcon={"ri-user-line"}
							field="firstName"
							formik={formikGiftcard}
							value={formikGiftcard.values.firstName}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="lastName"
							target={PageTarget.giftcard}
							placeHolder={t("lastName")}
							maxLength={20}
							leadingIcon={"ri-user-line"}
							field="lastName"
							formik={formikGiftcard}
							value={formikGiftcard.values.lastName}
						/>
					</div>
					<div className="col-sm-6" onClick={() => handleAddValue("phone", values, setValues)}>
						<WtcInputPhone
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="phone"
							target={PageTarget.giftcard}
							placeHolder={t("phone")}
							type="tel"
							required
							mask="(999)999-9999"
							slotChar="(###)###-####"
							leadingIcon={"ri-phone-line"}
							field="phone"
							formik={formikGiftcard}
							value={formikGiftcard.values.phone}
						/>
					</div>
					<div className="col-sm-6">
						<WtcRoleInputIconText
							target={PageTarget.giftcard}
							type="tel"
							code="zipcode"
							action="UPD"
							placeHolder={t("zipcode")}
							mask="99999"
							slotChar="#####"
							leadingIcon={"ri-barcode-line"}
							field="zipcode"
							formik={formikGiftcard}
							value={formikGiftcard.values.zipcode}
						/>
					</div>
					<div className="col-sm-12 mt-2" onClick={() => handleAddValue("note", values, setValues)}>
						<WtcRoleInputIconText
							action={dialogMode == "add" ? "INS" : "UPD"}
							code="note"
							target={PageTarget.giftcard}
							placeHolder={t("note")}
							leadingIcon={"ri-sticky-note-line"}
							field="note"
							formik={formikGiftcard}
							value={formikGiftcard.values.note}
						/>
					</div>
				</div>
			</div>,
			<div className="p-3">
				<div className="row">
					<div className="col-md-12 bg-white pe-1" style={{ borderRadius: 12 }}>
						{giftcardState.fetchState.status === "loading" ? (
							<LoadingIndicator />
						) : (
							<>
								<div className="row header-list-employee-turn">
									<div className="col-md-2">{t("time")}</div>
									<div className="col-md-2">{t("name_cus")}</div>
									<div className="col-md-2">{t("trans_amount")}</div>
									<div className="col-md-6">{t("content")}</div>
								</div>
								<div
									className="content-list-employee-turn row"
									style={{ maxHeight: screenSize.height - 372, overflowY: "auto" }}
								>
									{formikGiftcard.values.history && formikGiftcard.values?.history?.length > 0 ? (
										formikGiftcard.values?.history.map((item: any, index: number) => (
											<div key={item._id}>{itemHistory(item, index)}</div>
										))
									) : (
										<WtcEmptyBox />
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>,
		];
		return (
			<WtcTabs
				backgroundPanel="#f4f4f4"
				classNameTabs="pt-2"
				tabs={tabs}
				activeTab={activeTabName == "detail" ? 0 : 1}
				contents={contents}
				key={"tab" + activeTabName}
				onChangeTab={(index) => setActiveTabName(index == 0 ? "detail" : "history")}
			/>
		);
	};
	useEffect(() => {
		if (giftcardState.actionState) {
			switch (giftcardState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(fetchGiftcard());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(giftcardState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [giftcardState.actionState]);
	useEffect(() => {
		if (giftcardState.fetchDetailState) {
			switch (giftcardState.fetchDetailState.status!) {
				case "completed":
					formikGiftcard.setValues(giftcardState.item);
					dispatch(resetFetchDetailState());
					setDialogVisible(true);

					break;
				case "failed":
					failed(t(giftcardState.fetchDetailState.error!));
					dispatch(resetFetchDetailState());
					break;
			}
		}
	}, [giftcardState.fetchDetailState]);
	const fetchListLocal = () => {
		dispatch(fetchGiftcard());
	};
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikGiftcard.values.cardId) ||
			formikGiftcard.values.amount == "" ||
			formikGiftcard.values.amount == 0 ||
			formikGiftcard.values.amount == null ||
			checkEmptyAndUndefined(formikGiftcard.values.phone)
		)
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikGiftcard.values]);
	useEffect(() => {
		fetchListLocal();
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(giftcardState.filtered.length / rows));
	}, [giftcardState.filtered]);
	useEffect(() => {
		if (!giftcardState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!giftcardState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [giftcardState.currentPage, giftcardState.currentRows]);
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<HeaderList
						callback={fetchListLocal}
						target={PageTarget.giftcard}
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
							className="row"
							style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
						>
							{giftcardState.fetchState.status == "loading" ? (
								<div className="h-100 p-4">
									<LoadingIndicator />
								</div>
							) : (!giftcardState.filtered || giftcardState?.filtered.length) == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								giftcardState?.filtered.map((item: GiftcardModel, index: number) => {
									if (index >= first && index < first + rows)
										return (
											<div key={item._id || index}>{giftCardItemView(item, item._id, index)}</div>
										);
								})
							)}
						</div>
					</div>
				}
				className="h-100"
				classNameFooter="d-flex justify-content-center p-2"
				footer={
					<div>
						<Paginator
							first={first}
							rows={rows}
							totalRecords={giftcardState?.filtered?.length}
							rowsPerPageOptions={[10, 20]}
							onPageChange={onPageChange}
						/>
					</div>
				}
			/>
			<div
				onKeyDown={(e) => {
					if (e.key === "Enter" && !checkSubmitEnter && !disableButtonSubmit) {
						formikGiftcard.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "75vw"}
					minHeight={"45vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={t("giftcard")}
					okText={t("Submit")}
					cancelText={t("Cancel")}
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-between">
							<div className="d-flex">
								{formikGiftcard.values.status.code == "ACTIVE" && (
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
													confirm: () => handldeleteGiftCard(formikGiftcard.values._id),
												});
												e.preventDefault();
											}
										}}
										target={PageTarget.giftcard}
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
												confirm: () => handldeleteGiftCard(formikGiftcard.values._id),
											});
										}}
									/>
								)}
								{formikGiftcard.values.status.code == "INACTIVE" && (
									<WtcRoleButton
										tabIndex={0}
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
										target={PageTarget.giftcard}
										action="RES"
										label={t("action.restore")}
										className="bg-blue text-white me-2"
										icon="ri-loop-left-line"
										fontSize={16}
										minWidth={100}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												warningWithConfirm({
													title: t("do_you_restore"),
													text: "",
													confirmButtonText: t("Restore"),
													confirm: () => handleRestoreGiftcard(formikGiftcard.values._id),
												});

												e.preventDefault();
											}
										}}
										onClick={() => {
											warningWithConfirm({
												title: t("do_you_restore"),
												text: "",
												confirmButtonText: t("Restore"),
												confirm: () => handleRestoreGiftcard(formikGiftcard.values._id),
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
										target={PageTarget.giftcard}
										action="INS"
										disabled={
											(formikGiftcard &&
												formikGiftcard.errors &&
												Object.keys(formikGiftcard.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.INS")}
										icon="ri-add-fill"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikGiftcard.handleSubmit()}
									/>
								)}
								{dialogMode == "edit" && (
									<WtcRoleButton
										tabIndex={0}
										target={PageTarget.giftcard}
										action="UPD"
										disabled={
											(formikGiftcard &&
												formikGiftcard.errors &&
												Object.keys(formikGiftcard.errors).length > 0) ||
											disableButtonSubmit
										}
										label={t("action.UPD")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white me-2"
										fontSize={16}
										onClick={() => formikGiftcard.handleSubmit()}
									/>
								)}
							</div>
						</div>
					}
					draggable={false}
					resizeable={false}
					onClose={() => closeDialog()}
					body={
						dialogMode == "add" ? (
							<div className="pt-3">
								<div className="row">
									<div
										className="col-sm-12 mb-2"
										onClick={() => handleAddValue("cardId", values, setValues)}
									>
										<WtcRoleInputIconText
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="cardId"
											target={PageTarget.giftcard}
											placeHolder={t("giftcardId")}
											maxLength={50}
											focused
											required
											leadingIcon={"ri-gift-line"}
											field="cardId"
											formik={formikGiftcard}
											value={formikGiftcard.values.cardId}
										/>
									</div>
									<div
										className="col-md-6 mb-2"
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
									>
										<WtcRoleDropdownIconText
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="type"
											target={PageTarget.giftcard}
											required
											filtler={false}
											disabled={true}
											placeHolder={t("typeofcard")}
											leadingIcon={"ri-gift-line"}
											options={[
												{ label: t("sellanewgift"), value: "SELL_A_NEW" },
												{ label: t("givestorecreditgift"), value: "GIVE_STORE_CREDIT" },
											]}
											field="type"
											formik={formikGiftcard}
											value={"SELL_A_NEW"}
										/>
									</div>
									<div
										className="col-sm-6 mb-2"
										onClick={() => handleAddValue("amount", values, setValues)}
									>
										<WtcRoleInputIconNumber
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="amount"
											target={PageTarget.giftcard}
											isCurr
											minFractionDigits={2}
											maxFractionDigits={2}
											placeHolder={t("amount")}
											required
											maxValue={maxValueGiftCard || 0}
											leadingIcon={"ri-money-dollar-circle-line"}
											field="amount"
											formik={formikGiftcard}
											value={formikGiftcard.values.amount}
										/>
									</div>
									<div className="col-sm-6 mb-2">
										<WtcRoleInputIconText
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="firstName"
											target={PageTarget.giftcard}
											placeHolder={t("firstName")}
											maxLength={20}
											leadingIcon={"ri-user-line"}
											field="firstName"
											formik={formikGiftcard}
											value={formikGiftcard.values.firstName}
										/>
									</div>
									<div className="col-sm-6 mb-2">
										<WtcRoleInputIconText
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="lastName"
											target={PageTarget.giftcard}
											placeHolder={t("lastName")}
											maxLength={20}
											leadingIcon={"ri-user-line"}
											field="lastName"
											formik={formikGiftcard}
											value={formikGiftcard.values.lastName}
										/>
									</div>
									<div
										className="col-sm-6"
										onClick={() => handleAddValue("phone", values, setValues)}
									>
										<WtcInputPhone
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="phone"
											target={PageTarget.giftcard}
											placeHolder={t("phone")}
											type="tel"
											required
											mask="(999)999-9999"
											slotChar="(###)###-####"
											leadingIcon={"ri-phone-line"}
											field="phone"
											formik={formikGiftcard}
											value={formikGiftcard.values.phone}
										/>
									</div>
									<div className="col-sm-6">
										<WtcRoleInputIconText
											target={PageTarget.giftcard}
											type="tel"
											code="zipcode"
											action={dialogMode == "add" ? "INS" : "UPD"}
											placeHolder={t("zipcode")}
											mask="99999"
											slotChar="#####"
											leadingIcon={"ri-barcode-line"}
											field="zipcode"
											formik={formikGiftcard}
											value={formikGiftcard.values.zipcode}
										/>
									</div>
									<div
										className="col-sm-12 mt-2"
										onClick={() => handleAddValue("note", values, setValues)}
									>
										<WtcRoleInputIconText
											action={dialogMode == "add" ? "INS" : "UPD"}
											code="note"
											target={PageTarget.giftcard}
											placeHolder={t("note")}
											leadingIcon={"ri-sticky-note-line"}
											field="note"
											formik={formikGiftcard}
											value={formikGiftcard.values.note}
										/>
									</div>
								</div>
							</div>
						) : giftcardState.fetchDetailState.status == "loading" ? (
							<LoadingIndicator />
						) : !giftcardState.item ? (
							<div className="w-100 h-100 d-flex flex-column justify-content-center">
								{" "}
								<WtcEmptyBox />
							</div>
						) : (
							giftcardViewDetail()
						)
					}
					closeIcon
				/>
			</div>
		</>
	);
}
