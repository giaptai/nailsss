import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import NoAvatar from "../../../assets/images/empty/no-avatar.jpg";
import Loading from "../../../assets/images/loading_beautiful.gif";
import heart from "../../../assets/svg/heart.svg";
import email from "../../../assets/svg/mail.svg";
import iconUser from "../../../assets/svg/user-settings.svg";
import userRole from "../../../assets/svg/user.svg";
import WtcCard from "../../../components/commons/WtcCard";
import WtcInputChooseColor from "../../../components/commons/WtcInputChooseColor";
import WtcInputIconText from "../../../components/commons/WtcInputIconText";
import WtcInputPhone from "../../../components/commons/WtcInputPhone";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconState from "../../../components/commons/WtcRoleDropdownIconState";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import {
	checkEmptyAndUndefined,
	checkEmptyAndUndefinedNumber,
	formatPhoneNumberSubmitDatabase,
	PageTarget,
	states,
} from "../../../const";
import { WindowModel } from "../../../models/category/Window.model";
import { resetActionState, updateEmpl, updatePositionEmpl, updateRoleEmpl } from "../../../slices/profile.slice";
import { fetchRoles } from "../../../slices/role.slice";
import {
	deleteUser,
	fetchUsers,
	resetActionStateUser,
	resetPassUser,
	restoreUser,
	setProfileToUpdate,
	setRoleToUpdate,
	UserState,
} from "../../../slices/user.slice";
import { fetchWindow } from "../../../slices/window.slice";
import { completed, failed, processing, questionWithConfirm, warningWithConfirm } from "../../../utils/alert.util";
import Square from "../Window/Square";
export default function EditEmployee() {
	const dispatch = useAppDispatch();
	const userState = useAppSelector((state) => state.user);
	const profileState = useAppSelector((state) => state.profile);
	const [imageSrc, setImageSrc] = useState<string>(profileState.avatar);
	const [menuTab, setMenuTab] = useState("accountInfo");
	const roleState = useAppSelector((state) => state.role);
	const [disableButtonSubmitInfo, setdisableButtonSubmitInfo] = useState(true);
	const [disableButtonSubmitSett, setdisableButtonSubmitSett] = useState(true);
	const windows = useAppSelector((state) => state.window);
	const w = windows.list.filter((item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE");
	const [windowSelected, setwindowSelected] = useState(w[0]);
	const [activeItem, setActiveItem] = useState(windowSelected?.name);
	const [selected, setSelected] = useState<number | null>(null);
	const [indexClick, setindexClick] = useState<number | null>(null);
	const [buttonEditPosition, setbuttonEditPosition] = useState(false);
	const screenSize = useWindowSize();
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const formik = useFormik<any>({
		initialValues: userState.item?.profile || {},
		validate: (data) => {
			const errors: FormikErrors<any> = {};
			if (menuTab == "accountInfo") {
				if (checkEmptyAndUndefined(data.lastName)) {
					errors.lastName = "y";
				}
				if (checkEmptyAndUndefined(data.firstName)) {
					errors.firstName = "y";
				}
				if (checkEmptyAndUndefined(data.phone)) {
					errors.phone = "y";
				}
				if (checkEmptyAndUndefined(data.email)) {
					errors.email = "y";
				}
				if (checkEmptyAndUndefined(data.street1)) {
					errors.street1 = "y";
				}
				if (checkEmptyAndUndefined(data.city)) {
					errors.city = "y";
				}
				if (checkEmptyAndUndefined(data.state)) {
					errors.state = "y";
				}
				if (checkEmptyAndUndefined(data.zipcode)) {
					errors.zipcode = "y";
				}
			} else if (menuTab == "accountSetting") {
				if (checkEmptyAndUndefined(data.openDraw)) {
					errors["openDraw"] = "y";
				}
				if (checkEmptyAndUndefined(data.selfGiftCard)) {
					errors["selfGiftCard"] = "y";
				}
				if (checkEmptyAndUndefined(data.paymentType)) {
					errors["paymentType"] = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.paymentValue)) {
					errors["paymentValue"] = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.compensation)) {
					errors["compensation"] = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.checkAndBonus)) {
					errors["checkAndBonus"] = "y";
				}
				if (checkEmptyAndUndefinedNumber(data.check)) {
					errors["check"] = "y";
				}
			} else if (menuTab == "role") {
			}
			return errors;
		},
		onSubmit: (data) => {
			if (menuTab == "accountInfo") {
				const submitData = {
					firstName: data.firstName,
					lastName: data.lastName,
					middleName: data.middleName === "" ? null : data.middleName,
					phone: formatPhoneNumberSubmitDatabase(data.phone),
					street1: data?.street1,
					street2: data?.street2 || null,
					city: data?.city,
					state: data?.state,
					zipcode: data?.zipcode,
					email: data.email || null,
					gender: data.gender,
					emergencyContactName: data.emergencyContactName || null,
					emergencyContactPhone: formatPhoneNumberSubmitDatabase(data.emergencyContactPhone) || null,
				};
				dispatch(updateEmpl({ _id: data._id, data: submitData }));
				dispatch(setProfileToUpdate(formik.values));
			} else if (menuTab == "accountSetting") {
				const submitData = {
					openDraw: data.openDraw == "YES" ? true : false,
					selfGiftCard: data.selfGiftCard == "YES" ? true : false,
					middleName: data.middleName === "" ? null : data.middleName,
					paymentType: data.paymentType,
					paymentValue: data?.paymentValue,
					compensation: data?.compensation,
					checkAndBonus: data?.checkAndBonus,
					check: data?.check,
					color: data?.color,
				};
				dispatch(updateEmpl({ _id: data._id, data: submitData }));
				dispatch(setProfileToUpdate(formik.values));
			} else if (menuTab == "role") {
				const submitData = {
					roleID: data.roleId || userState.roleId,
				};
				dispatch(updateRoleEmpl({ idEmpl: userState.item?._id, data: submitData }));
				dispatch(setRoleToUpdate(data.roleId));
			}
		},
	});

	const handleClick = (index: number) => {
		if (index == indexClick) {
			setbuttonEditPosition(true);
			setindexClick(null);
		} else {
			setbuttonEditPosition(false);
			setindexClick(index);
		}

		setSelected((prevIndex) => (prevIndex !== index ? index : null));
	};
	const handleClickEditPosition = () => {
		if (indexClick != null)
			questionWithConfirm({
				title: t("confirm_select_position"),
				text: t("select_position") + "#" + (indexClick + 1),
				confirmButtonText: t("ok"),
				confirm: () => handleUpdatePosition(indexClick),
				close: () => setSelected(null),
			});
	};
	const handleItemClick = (item: any) => {
		setActiveItem(item.name);
		setwindowSelected(item);
		setSelected(null);
		setindexClick(null);
	};
	const handleUpdatePosition = (index: number) => {
		const submitData = {
			positionPoint: index + 1,
			positionWindow: windowSelected._id,
		};
		dispatch(updatePositionEmpl({ _id: userState.item?.profile._id, data: submitData }));
		setSelected(null);
	};
	//client
	const menuAccountList = [
		{
			key: "accountInfo",
			label: t("accinfo"),
			icon: "ri-user-line",
			command: () => {
				setMenuTab("accountInfo");
			},
		},
		{
			key: "accountSetting",
			label: t("accountSetting"),
			icon: "ri-lock-fill",
			command: () => {
				setMenuTab("accountSetting");
			},
		},
		{
			key: "role",
			label: t("role"),
			icon: "ri-user-heart-line",
			command: () => {
				setMenuTab("role");
			},
		},
		{
			key: "position",
			label: t("position"),
			icon: "ri-user-location-fill",
			command: () => {
				setMenuTab("position");
			},
		},
	];
	const getUserAtPosition = (position: number) => {
		return userState.list
			.filter((user) => user.profile.positionWindow?._id == windowSelected?._id)
			.find((user) => user.profile?.positionPoint === position);
	};
	function getImageSource(userstate: UserState) {
		if (userstate?.getAvtState?.status === "loading") {
			return Loading;
		} else if (userstate?.avatar && userstate.avatar !== "") {
			return userstate.avatar;
		} else {
			return NoAvatar;
		}
	}
	const handleDeleteEmployee = (id: string) => {
		dispatch(deleteUser(id));
	};
	const handleRestoreEmployee = (id: string) => {
		dispatch(restoreUser(id));
	};
	const handleResetPassword = (item_id: string) => {
		dispatch(resetPassUser(item_id));
	};
	useEffect(() => {
		if (menuTab == "accountInfo") {
			if (
				checkEmptyAndUndefined(formik.values.firstName) ||
				checkEmptyAndUndefined(formik.values.lastName) ||
				checkEmptyAndUndefined(formik.values.phone) ||
				checkEmptyAndUndefined(formik.values.email) ||
				checkEmptyAndUndefined(formik.values.street1) ||
				checkEmptyAndUndefined(formik.values.city) ||
				checkEmptyAndUndefined(formik.values.zipcode) ||
				checkEmptyAndUndefined(formik.values.state)
			)
				setdisableButtonSubmitInfo(true);
			else setdisableButtonSubmitInfo(false);
		} else if (menuTab == "accountSetting") {
			if (
				checkEmptyAndUndefined(formik.values.openDraw) ||
				checkEmptyAndUndefined(formik.values.selfGiftCard) ||
				checkEmptyAndUndefined(formik.values.paymentType) ||
				checkEmptyAndUndefinedNumber(formik.values.paymentValue) ||
				checkEmptyAndUndefinedNumber(formik.values.compensation) ||
				checkEmptyAndUndefinedNumber(formik.values.checkAndBonus) ||
				checkEmptyAndUndefinedNumber(formik.values.check)
			)
				setdisableButtonSubmitSett(true);
			else setdisableButtonSubmitSett(false);
		}
	}, [formik.values, menuTab]);
	useEffect(() => {
		dispatch(fetchWindow());
		dispatch(fetchRoles());
	}, []);
	useEffect(() => {
		if (indexClick == null) setbuttonEditPosition(true);
		else setbuttonEditPosition(false);
	}, [indexClick]);
	useEffect(() => {
		setImageSrc(getImageSource(userState));
	}, [userState]);
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(fetchRoles());
					dispatch(fetchUsers());
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(profileState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [profileState.actionState]);
	useEffect(() => {
		if (userState.actionState) {
			switch (userState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionStateUser());
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(userState.actionState.error!));
					dispatch(resetActionStateUser());
					break;
			}
		}
	}, [userState.actionState]);
	useEffect(() => {
		if (!windowSelected && w.length > 0) {
			setwindowSelected(w[0]);
			setActiveItem(w[0].name);
		}
	}, [windows]);
	return (
		<div className="row h-100">
			<div className="h-100 mb-3 col-md-3 my-profile-menu">
				<div className="col-md-12" style={{ marginTop: "12px" }}>
					<div
						className="d-flex flex-column bd-highlight mb-3 bg-white profile-menu-item pt-1 pb-1 px-2"
						style={{ textAlign: "center" }}
					>
						<div className="p-2 bd-highlight">
							<Avatar
								className="my-avatar-size"
								image={
									userState.getAvtState.status == "loading"
										? Loading
										: imageSrc
										? imageSrc
										: NoAvatar ?? NoAvatar
								}
								shape="square"
								size="xlarge"
							/>
						</div>
					</div>
				</div>
				<div className="scroll pb-2">
					<div className="w-100" style={{ overflowY: "auto", height: screenSize.height - 310 }}>
						{menuAccountList.map((m, i) => {
							return (
								<div
									className={`profile-menu-item d-flex pt-1 pb-1 px-2  ${
										menuTab === m.key ? "active" : ""
									}`}
									key={"profile-m-" + i}
									style={{ fontSize: 14, cursor: "pointer" }}
									onClick={m.command}
								>
									<div className="ms-2 me-2 fs-4">
										<i className={m.icon}></i>
									</div>
									<div className="flex-grow-1 fw-normal align-self-center">{m.label}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<div
				className="col-md-9 h-100"
				style={{ fontSize: 18 }}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !checkSubmitEnter) {
						e.preventDefault();
						formik.handleSubmit();
					}
				}}
			>
				{menuTab == "accountInfo" && (
					<div className="col-md-12 h-100">
						<WtcCard
							className="h-100"
							title={<div className="my-title-color">{t("accinfo")}</div>}
							tools={<></>}
							body={
								<div className="row">
									<div className="col-sm-12  mt-2">
										<WtcInputIconText
											placeHolder={t("username")}
											disabled
											maxLenght={20}
											field="username"
											formik={formik}
											value={userState.item?.username}
											leadingIconImage={iconUser}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="firstName"
											action="UPD"
											placeHolder={t("firstName")}
											maxLength={20}
											required
											field="firstName"
											formik={formik}
											leadingIconImage={iconUser}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="middleName"
											action="UPD"
											placeHolder={t("middleName")}
											maxLength={20}
											field="middleName"
											formik={formik}
											leadingIconImage={iconUser}
										/>
									</div>
									<div className="col-sm-12 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="lastName"
											action="UPD"
											placeHolder={t("lastName")}
											maxLength={20}
											required
											field="lastName"
											formik={formik}
											leadingIconImage={iconUser}
										/>
									</div>
									<div className="col-sm-12 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="street1"
											action="UPD"
											placeHolder={t("address") + " 1"}
											required
											leadingIcon={"ri-home-4-fill"}
											field="street1"
											formik={formik}
											value={formik.values?.street1}
										/>
									</div>
									<div className="col-sm-12 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="street2"
											action="UPD"
											placeHolder={t("address") + " 2"}
											leadingIcon={"ri-home-4-fill"}
											field="street2"
											formik={formik}
											value={formik.values?.street2}
										/>
									</div>
									<div className="col-sm-12 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="city"
											maxLength={30}
											action="UPD"
											placeHolder={t("city")}
											required
											leadingIcon={"ri-map-line"}
											field="city"
											formik={formik}
											value={formik.values?.city}
										/>
									</div>
									<div className="col-sm-3 mt-2">
										<WtcRoleDropdownIconState
											filtler
											target={PageTarget.employee}
											code="state"
											action="UPD"
											required
											disabled={false}
											placeHolder={t("state")}
											leadingIcon={"ri-pie-chart-line"}
											options={states}
											field="state"
											formik={formik}
											value={formik.values?.state}
										/>
									</div>
									<div className="col-sm-3 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											type="tel"
											code="zipcode"
											action="UPD"
											placeHolder={t("zipcode")}
											required
											mask="99999"
											slotChar="#####"
											leadingIcon={"ri-barcode-line"}
											field="zipcode"
											formik={formik}
											value={formik.values?.zipcode}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcInputPhone
											target={PageTarget.employee}
											code="zipcode"
											action="UPD"
											placeHolder={t("phone")}
											type="tel"
											required
											mask="(999)999-9999"
											slotChar="(###)###-####"
											leadingIcon={"ri-phone-line"}
											field="phone"
											formik={formik}
											value={formik.values.phone}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcRoleDropdownIconText
											target={PageTarget.employee}
											code="gender"
											action="UPD"
											options={[
												{ label: t("male"), value: "MALE" },
												{ label: t("female"), value: "FEMALE" },
												{ label: t("other"), value: "OTHER" },
											]}
											placeHolder={t("gender")}
											leadingIconImage={heart}
											value={formik.values.gender}
											disabled={false}
											formik={formik}
											field="gender"
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="email"
											action="UPD"
											placeHolder={t("email")}
											required
											field="email"
											formik={formik}
											leadingIconImage={email}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcRoleInputIconText
											target={PageTarget.employee}
											code="emergencyContactName"
											maxLength={30}
											action="UPD"
											placeHolder={t("emergencyname")}
											leadingIcon={"ri-contacts-book-2-line"}
											field="emergencyContactName"
											formik={formik}
											value={formik.values?.emergencyContactName}
										/>
									</div>
									<div className="col-sm-6 mt-2">
										<WtcInputPhone
											target={PageTarget.employee}
											code="emergencyContactName"
											action="UPD"
											placeHolder={t("emergencyphone")}
											type="tel"
											mask="(999)999-9999"
											slotChar="(###)###-####"
											leadingIcon={"ri-phone-line"}
											field="emergencyContactPhone"
											formik={formik}
											value={formik.values.emergencyContactPhone}
										/>
									</div>
								</div>
							}
							hideBorder={false}
							footer={
								<>
									<div className="d-flex wtc-bg-white align-items-center justify-content-between">
										{userState.item &&
											(userState?.item.status.code == "ACTIVE" ||
												userState?.item.status == "ACTIVE") && (
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
																confirm: () =>
																	handleDeleteEmployee(
																		userState.item ? userState.item._id : ""
																	),
															});
															e.preventDefault();
														}
													}}
													target={PageTarget.employee}
													action="DEL"
													label={t("action.delete")}
													className="bg-danger text-white me-2"
													icon="ri-close-large-line"
													height={45}
													fontSize={16}
													onClick={() => {
														warningWithConfirm({
															title: t("do_you_delete"),
															text: "",
															confirmButtonText: t("Delete"),
															confirm: () =>
																handleDeleteEmployee(
																	userState.item ? userState.item._id : ""
																),
														});
													}}
												/>
											)}
										{userState.item &&
											(userState?.item.status.code == "INACTIVE" ||
												userState?.item.status == "INACTIVE") && (
												<WtcRoleButton
													tabIndex={0}
													onFocus={() => setCheckSubmitEnter(true)}
													onBlur={() => setCheckSubmitEnter(false)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															warningWithConfirm({
																title: t("do_you_restore"),
																text: "",
																confirmButtonText: t("Restore"),
																confirm: () =>
																	handleRestoreEmployee(
																		userState.item ? userState.item._id : ""
																	),
															});
															e.preventDefault();
														}
													}}
													target={PageTarget.employee}
													action="RES"
													label={t("action.restore")}
													className="bg-blue text-white me-2"
													icon="ri-loop-left-line"
													height={45}
													fontSize={16}
													onClick={() => {
														warningWithConfirm({
															title: t("do_you_restore"),
															text: "",
															confirmButtonText: t("Restore"),
															confirm: () =>
																handleRestoreEmployee(
																	userState.item ? userState.item._id : ""
																),
														});
													}}
												/>
											)}
										<WtcRoleButton
											tabIndex={0}
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													{
														warningWithConfirm({
															title: t("do_you_reset_pass"),
															text: "",
															confirmButtonText: t("ok"),
															confirm: () =>
																handleResetPassword(
																	userState.item ? userState.item._id : ""
																),
														});
													}
													e.preventDefault();
												}
											}}
											target={PageTarget.employee}
											action="UPD"
											label={t("reset_password")}
											onClick={() =>
												warningWithConfirm({
													title: t("do_you_reset_pass"),
													text: "",
													confirmButtonText: t("ok"),
													confirm: () =>
														handleResetPassword(userState.item ? userState.item._id : ""),
												})
											}
											icon="ri-loop-left-line"
											height={45}
											fontSize={16}
											className="me-2 wtc-bg-primary text-white"
										/>
										<WtcRoleButton
											target={PageTarget.employee}
											action="UPD"
											tabIndex={0}
											disabled={disableButtonSubmitInfo}
											label={t("action.update")}
											icon="ri-edit-line"
											className="wtc-bg-primary text-white me-2"
											height={45}
											fontSize={16}
											onClick={formik.handleSubmit}
										/>
									</div>
								</>
							}
						/>
					</div>
				)}
				{menuTab == "accountSetting" && (
					<div
						className="h-100 col-md-12 "
						onKeyDown={(e) => {
							if (e.key === "Enter" && !checkSubmitEnter) {
								e.preventDefault();
								formik.handleSubmit();
							}
						}}
					>
						<WtcCard
							className="h-100"
							title={<div className="my-title-color">{t("accountSetting")}</div>}
							tools={<></>}
							footer={
								<>
									<WtcRoleButton
										disabled={disableButtonSubmitSett}
										tabIndex={0}
										label={t("action.update")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white"
										height={45}
										fontSize={16}
										target={PageTarget.employee}
										action="UPD"
										onClick={formik.handleSubmit}
									/>
								</>
							}
							body={
								<div className="row">
									<div className="col-sm-12 mt-2 row">
										<div
											className="col-md-6"
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
										>
											<WtcRoleDropdownIconText
												filtler
												target={PageTarget.employee}
												code="openDraw"
												action="UPD"
												disabled={false}
												required
												placeHolder={t("opendraw")}
												leadingIconImage={userRole}
												options={[
													{ label: t("yes"), value: "YES" },
													{ label: t("no"), value: "NO" },
												]}
												field="openDraw"
												formik={formik}
												value={formik.values?.openDraw}
											/>
										</div>
										<div
											className="col-md-6"
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
										>
											<WtcRoleDropdownIconText
												filtler
												target={PageTarget.employee}
												code="selfGiftCard"
												action="UPD"
												disabled={false}
												required
												placeHolder={t("sellgiftcard")}
												leadingIconImage={userRole}
												options={[
													{ label: t("yes"), value: "YES" },
													{ label: t("no"), value: "NO" },
												]}
												field="selfGiftCard"
												formik={formik}
												value={formik.values?.selfGiftCard}
											/>
										</div>
									</div>
									<div className="col-sm-12 mt-2 row">
										<div
											className="col-md-6"
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
										>
											<WtcRoleDropdownIconText
												filtler
												target={PageTarget.employee}
												code="paymentType"
												action="UPD"
												disabled={false}
												required
												placeHolder={t("paymenttype")}
												leadingIcon={"ri-money-dollar-circle-line"}
												options={[
													{ label: t("weekpay"), value: "WEEKPAY" },
													{ label: t("hourpay"), value: "HOURPAY" },
												]}
												field="paymentType"
												formik={formik}
												value={formik.values?.paymentType}
											/>
										</div>
										<div className="col-md-6">
											<WtcRoleInputIconNumber
												target={PageTarget.employee}
												code="paymentvalue"
												action="UPD"
												placeHolder={t("paymentvalue")}
												isCurr
												required
												maxValue={10000}
												leadingIcon={"ri-money-dollar-circle-line"}
												field="paymentValue"
												formik={formik}
												value={formik.values.paymentValue}
											/>
										</div>
									</div>
									<div className="col-sm-12 mt-2 row">
										<div className="col-md-6">
											<div className="col-md-12 mb-2">
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.employee}
													code="check"
													action="UPD"
													disabled={false}
													required
													placeHolder={t("check")}
													leadingIcon={"ri-money-dollar-circle-line"}
													options={[
														{ label: "5", value: "5" },
														{ label: "5.25", value: "5.25" },
														{ label: "5.5", value: "5.5" },
														{ label: "6", value: "6" },
														{ label: "6.5", value: "6.5" },
														{ label: "7", value: "7" },
														{ label: "7.5", value: "7.5" },
														{ label: "8", value: "8" },
													]}
													field="check"
													formik={formik}
													value={formik.values?.check.toString()}
												/>
											</div>
											<div
												className="col-md-12 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.employee}
													code="compensation"
													action="UPD"
													disabled={false}
													required
													placeHolder={t("compensation")}
													leadingIcon={"ri-money-dollar-circle-line"}
													options={[
														{ label: "5", value: "5" },
														{ label: "5.25", value: "5.25" },
														{ label: "5.5", value: "5.5" },
														{ label: "6", value: "6" },
														{ label: "6.5", value: "6.5" },
														{ label: "7", value: "7" },
														{ label: "7.5", value: "7.5" },
														{ label: "8", value: "8" },
													]}
													field="compensation"
													formik={formik}
													value={formik.values?.compensation?.toString()}
												/>
											</div>
										</div>

										<div
											className="col-md-6"
											onFocus={() => setCheckSubmitEnter(true)}
											onBlur={() => setCheckSubmitEnter(false)}
										>
											<div
												className="col-md-12 mb-2"
												onFocus={() => setCheckSubmitEnter(true)}
												onBlur={() => setCheckSubmitEnter(false)}
											>
												<WtcRoleDropdownIconText
													filtler
													target={PageTarget.employee}
													code="checkAndBonus"
													action="UPD"
													disabled={false}
													required
													placeHolder={t("checkandbonus")}
													leadingIcon={"ri-money-dollar-circle-line"}
													options={[
														{ label: "5", value: "5" },
														{ label: "5.25", value: "5.25" },
														{ label: "5.5", value: "5.5" },
														{ label: "6", value: "6" },
														{ label: "6.5", value: "6.5" },
														{ label: "7", value: "7" },
														{ label: "7.5", value: "7.5" },
														{ label: "8", value: "8" },
													]}
													field="checkAndBonus"
													formik={formik}
													value={formik.values?.checkAndBonus.toString()}
												/>
											</div>
											<WtcInputChooseColor
												action={"UPD"}
												target={PageTarget.employee}
												leadingIcon="ri-palette-line"
												formik={formik}
												value={formik.values.color}
												field="color"
											/>
										</div>
									</div>
								</div>
							}
							hideBorder={false}
						/>
					</div>
				)}
				{menuTab == "role" && (
					<div
						className="h-100 col-md-12"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !checkSubmitEnter) {
								e.preventDefault();
								formik.handleSubmit();
							}
						}}
					>
						<WtcCard
							className="h-100"
							title={<div className="my-title-color">{t("role")}</div>}
							tools={<></>}
							footer={
								<>
									<WtcRoleButton
										label={t("action.update")}
										tabIndex={0}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white"
										height={45}
										fontSize={16}
										target={PageTarget.employee}
										action="UPD"
										onClick={formik.handleSubmit}
									/>
								</>
							}
							body={
								<div className="row">
									<div
										className="col-sm-12 mt-2"
										onFocus={() => setCheckSubmitEnter(true)}
										onBlur={() => setCheckSubmitEnter(false)}
									>
										<WtcRoleDropdownIconText
											filtler
											target={PageTarget.employee}
											code="roleId"
											action="UPD"
											disabled={false}
											required
											placeHolder={t("role")}
											leadingIconImage={userRole}
											options={roleState.list
												.filter((item: any) => item.status?.code === "ACTIVE")
												.map((item: any) => {
													return { label: item.name, value: item._id };
												})}
											field="roleId"
											formik={formik}
											value={userState.item?.roleId}
										/>
									</div>
								</div>
							}
							hideBorder={false}
						/>
					</div>
				)}
				{menuTab == "position" && (
					<>
						<WtcCard
							className="h-100"
							classNameBody="flex-grow-1 px-2 pb-0 my-0"
							footer={
								<>
									<WtcRoleButton
										target={PageTarget.employee}
										action="UPD"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleClickEditPosition();
											}
										}}
										label={t("action.update")}
										disabled={buttonEditPosition}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white"
										height={45}
										fontSize={16}
										onClick={() => handleClickEditPosition()}
									/>
								</>
							}
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
															className={`fs-value rounded-circle d-inline-block text-center circle-rounded ${
																activeItem === item.name ? "my-active-index" : ""
															}`}
														>
															{index + 1}
														</span>
														&ensp;
														<span className="text-color-gray fs-title">{item.name}</span>
													</div>
												</div>
											);
										})}
								</div>
							}
							tools={<></>}
							body={
								<div className="row bg-white mt-2">
									{windows.list.filter(
										(item) => item.type == "EMPLOYEE" && item.status.code == "ACTIVE"
									).length > 0 ? (
										Array.from({ length: 20 }).map((_, index) => {
											const user = getUserAtPosition(index + 1);
											return (
												<Square
													height={(screenSize.height - 215) / 5}
													isUSer={user?._id == userState.item?._id}
													key={index}
													index={index}
													selected={selected}
													onClick={handleClick}
													user={user?.profile}
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
					</>
				)}
			</div>
		</div>
	);
}
