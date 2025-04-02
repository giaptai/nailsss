import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { DropdownChangeEvent } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import useWindowSize from "../../../app/screen";
import emailIcon from "../../../assets/svg/mail.svg";
import userIcon from "../../../assets/svg/user.svg";
import DynamicDialog, { DialogMode } from "../../../components/DynamicDialog";
import HeaderList from "../../../components/HeaderListV2";
import LoadingIndicator from "../../../components/Loading";
import { itemListStyle } from "../../../components/Theme";
import StatusDropdown from "../../../components/commons/StatusDropdown";
import WtcButton from "../../../components/commons/WtcButton";
import WtcCard from "../../../components/commons/WtcCard";
import WtcEmptyBox from "../../../components/commons/WtcEmptyBox";
import WtcInputChooseColor from "../../../components/commons/WtcInputChooseColor";
import WtcItemCard from "../../../components/commons/WtcItemCard";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconState from "../../../components/commons/WtcRoleDropdownIconState";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import WtcTabs from "../../../components/commons/WtcTabs";
import {
	checkEmptyAndUndefined,
	checkEmptyAndUndefinedNumber,
	formatCapitalize,
	formatPhoneNumberSubmitDatabase,
	formatPhoneNumberViewUI,
	handleAddValue,
	PageTarget,
	states,
} from "../../../const";
import { UserModel } from "../../../models/category/User.model";
import { resetActionState as resetProfileActionState, updateProfile } from "../../../slices/profile.slice";
import { fetchRoles } from "../../../slices/role.slice";
import {
	addUser,
	deleteUser,
	fetchUsers,
	filterSearch,
	getAvatarEmployee,
	resetActionState,
	resetPassUser,
	restoreUser,
	selectItem,
	setCurrentPage,
	setCurrentRows,
	updateUserRole,
} from "../../../slices/user.slice";
import { completed, failed, processing, warningWithConfirm } from "../../../utils/alert.util";

export default function Employees() {
	const navigate = useNavigate();
	const screenSize = useWindowSize();
	const roleState = useAppSelector((state) => state.role);
	const userState = useAppSelector((state) => state.user);
	const profileState = useAppSelector((state) => state.profile);
	const dispatch = useAppDispatch();
	const [selectedId, _setSelectedId] = useState("");
	const [activeTabName, setActiveTabName] = useState<"info" | "role" | "setting">("info");
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogMode, setDialogMode] = useState<DialogMode>("view");
	const fState = (userState.currentPage - 1) * userState.currentRows;
	const [first, setFirst] = useState(fState);
	const [_page, setPage] = useState(userState.currentPage - 1);
	const [rows, setRows] = useState(userState.currentRows);
	const [values, setValues] = useState<string[]>([]);
	const [_totalPages, setTotalPages] = useState(Math.ceil(userState.filtered.length / rows));
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [status, setStatus] = useState("ACTIVE");
	const [searchString, setSearchString] = useState("");
	const op = useRef<any>(null);
	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
		dispatch(setCurrentRows(event.rows));
		setTotalPages(event.pageCount);
		setPage(event.page + 1);
		dispatch(setCurrentPage(event.page + 1));
	};
	const formikEmployee = useFormik<any>({
		initialValues: {
			"profile.firstName": "",
			"profile.lastName": "",
			"profile.phone": "",
			"profile.email": "",
			username: "",
			roleId: "",
			old_password: "",
			new_password: "",
			color: "#283673",
		},
		validate: (data) => {
			const errors: FormikErrors<Record<string, any>> = {};
			if (dialogMode == "add") {
				if (activeTabName == "info") {
					if (checkEmptyAndUndefined(data.profile?.firstName) && values.includes("firstName")) {
						errors["profile.firstName"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.lastName) && values.includes("lastName")) {
						errors["profile.lastName"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.phone) && values.includes("phone")) {
						errors["profile.phone"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.email) && values.includes("email")) {
						errors["profile.email"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.street1) && values.includes("address")) {
						errors["profile.address"] = "y";
					}
					if (checkEmptyAndUndefined(data.username) && values.includes("userName")) {
						errors.username = "y";
					}
				}
				if (activeTabName == "setting") {
					if (checkEmptyAndUndefined(data.profile?.openDraw) && values.includes("openDraw")) {
						errors["profile.openDraw"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.selfGiftCard) && values.includes("selfGiftCard")) {
						errors["profile.selfGiftCard"] = "y";
					}
					if (checkEmptyAndUndefined(data.profile?.paymentType) && values.includes("paymentType")) {
						errors["profile.paymentType"] = "y";
					}
					if (checkEmptyAndUndefinedNumber(data.profile?.paymentValue) && values.includes("paymentValue")) {
						errors["profile.paymentValue"] = "y";
					}
					if (checkEmptyAndUndefinedNumber(data.profile?.compensation) && values.includes("compensation")) {
						errors["profile.compensation"] = "y";
					}
					if (checkEmptyAndUndefinedNumber(data.profile?.checkAndBonus) && values.includes("checkAndBonus")) {
						errors["profile.checkAndBonus"] = "y";
					}
					if (checkEmptyAndUndefinedNumber(data.profile?.check) && values.includes("check")) {
						errors["profile.check"] = "y";
					}
				}
				if (!data.roleId) {
					errors.roleId = "y";
				}
			} else {
				if (checkEmptyAndUndefined(data.profile?.firstName)) {
					errors["profile.firstName"] = "y";
				}
				if (checkEmptyAndUndefined(data.profile?.lastName)) {
					errors["profile.lastName"] = "y";
				}
				if (checkEmptyAndUndefined(data.profile?.phone)) {
					errors["profile.phone"] = "y";
				}
				if (checkEmptyAndUndefined(data.profile?.email)) {
					errors["profile.email"] = "y";
				}
				if (checkEmptyAndUndefined(data.username)) {
					errors.username = "y";
				}

				if (!data.roleId) {
					errors.roleId = "y";
				}
			}
			console.log(errors);
			return errors;
		},
		onSubmit: (data) => {
			if (dialogMode == "add") {
				const profile = data?.profile;
				const submitData = {
					profile: {
						firstName: profile?.firstName,
						lastName: profile?.lastName,
						middleName: profile?.middleName === "" ? null : profile?.middleName,
						phone: formatPhoneNumberSubmitDatabase(profile?.phone),
						// "address": profile?.address,
						street1: profile?.street1,
						street2: profile?.street2 || null,
						city: profile?.city,
						state: profile?.state,
						zipcode: profile?.zipcode,
						email: profile?.email === "" ? null : profile?.email,
						gender: profile?.gender,
						emergencyContactName: profile?.emergencyContactName || null,
						emergencyContactPhone: formatPhoneNumberSubmitDatabase(profile?.emergencyContactPhone) || null,
						openDraw: profile?.openDraw == "YES" ? true : false,
						selfGiftCard: profile?.selfGiftCard == "YES" ? true : false,
						paymentType: profile?.paymentType,
						paymentValue: profile?.paymentValue,
						compensation: profile?.compensation,
						checkAndBonus: profile?.checkAndBonus,
						check: profile?.check,
						positionWindow: profile?.positionWindow,
						positionPoint: profile?.positionPoint,
						color: data.color,
					},
					username: data.username,
					password: "12345678",
					roleId: data.roleId,
				};
				dispatch(addUser(submitData));
			} else {
				switch (activeTabName) {
					case "info":
						{
							const profile = data?.profile;
							const submitData = {
								firstName: profile?.firstName,
								lastName: profile?.lastName,
								middleName: profile?.middleName === "" ? null : profile?.middleName,
								phone: formatPhoneNumberSubmitDatabase(profile?.phone),
								street1: profile?.street1,
								street2: profile?.street2 || null,
								city: profile?.city,
								state: profile?.state,
								zipcode: profile?.zipcode,
								email: profile?.email === "" ? null : profile?.email,
								gender: profile?.gender,
							};
							dispatch(updateProfile({ _id: data.profile._id, data: submitData }));
						}
						break;
					case "role":
						{
							//update user role
							dispatch(updateUserRole({ _id: data._id, roleId: data.roleId }));
						}
						break;
				}
			}
		},
	});
	useEffect(() => {
		if (activeTabName == "info") {
			if (
				formikEmployee.values.username == "" ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.firstName) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.lastName) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.phone) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.email) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.street1) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.city) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.zipcode) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.state)
			)
				setdisableButtonSubmit(true);
			else setdisableButtonSubmit(false);
		} else if (activeTabName == "setting") {
			if (
				checkEmptyAndUndefined(formikEmployee.values.profile?.openDraw) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.selfGiftCard) ||
				checkEmptyAndUndefined(formikEmployee.values.profile?.paymentType) ||
				checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.paymentValue) ||
				checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.compensation) ||
				checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.checkAndBonus) ||
				checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.check)
			)
				setdisableButtonSubmit(true);
			else setdisableButtonSubmit(false);
		}
	}, [formikEmployee.values]);
	const closeDialog = () => {
		setValues([]);
		setDialogVisible(false);
		setActiveTabName("info");

		formikEmployee.resetForm();
	};
	const employeeModelView = () => {
		const tabs = [t("employee_info"), t("emplsetting"), t("access_right")];
		const contents = [
			<div className="p-3">
				<div className="row">
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							disabled={dialogMode == "add" ? false : true}
							target={PageTarget.employee}
							focused
							code="username"
							maxLength={20}
							action="INS"
							placeHolder={t("username")}
							required
							leadingIconImage={userIcon}
							field="username"
							formik={formikEmployee}
							value={""}
							onClick={() => handleAddValue("userName", values, setValues)}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleDropdownIconText
							filtler
							target={PageTarget.employee}
							code="gender"
							action="INS"
							disabled={false}
							placeHolder={t("gender")}
							leadingIconImage={userIcon}
							options={[
								{ label: t("male"), value: "MALE" },
								{ label: t("female"), value: "FEMALE" },
								{ label: t("other"), value: "OTHER" },
							]}
							field="profile.gender"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.gender}
						/>
					</div>
					<div className="col-sm-12 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="firstName"
							action="INS"
							placeHolder={t("firstName")}
							required
							leadingIconImage={userIcon}
							field="profile.firstName"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.firstName}
							maxLength={20}
							onClick={() => handleAddValue("firstName", values, setValues)}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="middleName"
							action="INS"
							placeHolder={t("middleName")}
							leadingIconImage={userIcon}
							field="profile.middleName"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.middleName}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="lastName"
							action="INS"
							placeHolder={t("lastName")}
							maxLength={20}
							required
							leadingIconImage={userIcon}
							field="profile.lastName"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.lastName}
							onClick={() => handleAddValue("lastName", values, setValues)}
						/>
					</div>
					<div className="col-sm-12 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="street1"
							maxLength={50}
							action="INS"
							placeHolder={t("address") + " 1"}
							required
							leadingIcon={"ri-home-4-fill"}
							field="profile.street1"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.street1}
						/>
					</div>
					<div className="col-sm-12 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="street2"
							maxLength={50}
							action="INS"
							placeHolder={t("address") + " 2"}
							leadingIcon={"ri-home-4-fill"}
							field="profile.street2"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.street2}
						/>
					</div>
					<div className="col-sm-12 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							code="city"
							maxLength={50}
							action="INS"
							placeHolder={t("city")}
							required
							leadingIcon={"ri-map-line"}
							field="profile.city"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.city}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleDropdownIconState
							filtler
							target={PageTarget.employee}
							code="state"
							action="INS"
							required
							disabled={false}
							placeHolder={t("state")}
							leadingIcon={"ri-pie-chart-line"}
							options={states}
							field="profile.state"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.state}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							type="tel"
							code="zipcode"
							action="INS"
							placeHolder={t("zipcode")}
							required
							mask="99999"
							slotChar="#####"
							leadingIcon={"ri-barcode-line"}
							field="profile.zipcode"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.zipcode}
						/>
					</div>
					<div className="col-sm-6 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							type="tel"
							code="phone"
							action="INS"
							placeHolder={t("phone")}
							required
							mask="(999)999-9999"
							slotChar="(###)###-####"
							leadingIcon={"ri-phone-line"}
							field="profile.phone"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.phone}
							onClick={() => handleAddValue("phone", values, setValues)}
						/>
					</div>
					<div className="col-md-6 mb-2">
						<WtcRoleInputIconText
							target={PageTarget.employee}
							required
							type="email"
							code="email"
							action="INS"
							placeHolder="Email"
							leadingIconImage={emailIcon}
							field="profile.email"
							formik={formikEmployee}
							value={formikEmployee.values?.profile?.email}
							onClick={() => handleAddValue("email", values, setValues)}
						/>
					</div>
				</div>
			</div>,
			<div className="p-3">
				<div className="row">
					<div className="col-sm-12 mt-2 row">
						<div className="col-md-6" onClick={() => handleAddValue("openDraw", values, setValues)}>
							<WtcRoleDropdownIconText
								filtler
								target={PageTarget.employee}
								code="openDraw"
								action="INS"
								disabled={false}
								required
								placeHolder={t("opendraw")}
								leadingIconImage={userIcon}
								options={[
									{ label: t("yes"), value: "YES" },
									{ label: t("no"), value: "NO" },
								]}
								field="profile.openDraw"
								formik={formikEmployee}
								value={formikEmployee.values?.profile?.openDraw}
							/>
						</div>
						<div className="col-md-6" onClick={() => handleAddValue("selfGiftCard", values, setValues)}>
							<WtcRoleDropdownIconText
								filtler
								target={PageTarget.employee}
								code="selfGiftCard"
								action="INS"
								disabled={false}
								required
								placeHolder={t("sellgiftcard")}
								leadingIconImage={userIcon}
								options={[
									{ label: t("yes"), value: "YES" },
									{ label: t("no"), value: "NO" },
								]}
								field="profile.selfGiftCard"
								formik={formikEmployee}
								value={formikEmployee.values?.profile?.selfGiftCard}
							/>
						</div>
					</div>
					<div className="col-sm-12 mt-2 row">
						<div className="col-md-6" onClick={() => handleAddValue("paymentType", values, setValues)}>
							<WtcRoleDropdownIconText
								filtler
								target={PageTarget.employee}
								code="paymentType"
								action="INS"
								disabled={false}
								required
								placeHolder={t("paymenttype")}
								leadingIconImage={userIcon}
								options={[
									{ label: t("weekpay"), value: "WEEKPAY" },
									{ label: t("hourpay"), value: "HOURPAY" },
								]}
								field="profile.paymentType"
								formik={formikEmployee}
								value={formikEmployee.values?.profile?.paymentType}
							/>
						</div>
						<div className="col-md-6" onClick={() => handleAddValue("paymentValue", values, setValues)}>
							{/* <WtcInputIconNumber
								placeHolder={t("paymentvalue")}
								required
								maxValue={10000}
								leadingIcon={"ri-user-fill"}
								field="profile.paymentValue"
								formik={formikEmployee}
								value={formikEmployee.values?.profile?.paymentValue}
							/> */}
							<WtcRoleInputIconNumber
								action={dialogMode == "add" ? "INS" : "UPD"}
								code="amount"
								target={PageTarget.employee}
								isCurr
								minFractionDigits={2}
								maxFractionDigits={2}
								placeHolder={t("paymentvalue")}
								required
								maxValue={10000}
								leadingIcon={"ri-money-dollar-circle-line"}
								field="profile.paymentValue"
								formik={formikEmployee}
								value={formikEmployee.values?.profile?.paymentValue}
							/>
						</div>
					</div>
					<div className="col-sm-12 mt-2 row">
						<div className="col-md-6">
							<div
								className="col-md-12 mb-2"
								onClick={() => handleAddValue("compensation", values, setValues)}
							>
								<WtcRoleDropdownIconText
									filtler
									target={PageTarget.employee}
									code="compensation"
									action="INS"
									disabled={false}
									required
									placeHolder={t("compensation")}
									leadingIconImage={userIcon}
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
									field="profile.compensation"
									formik={formikEmployee}
									value={formikEmployee.values?.profile?.compensation}
								/>
							</div>
							<div
								className="col-md-12 mb-2"
								onClick={() => handleAddValue("checkAndBonus", values, setValues)}
							>
								<WtcRoleDropdownIconText
									filtler
									target={PageTarget.employee}
									code="checkAndBonus"
									action="INS"
									disabled={false}
									required
									placeHolder={t("checkandbonus")}
									leadingIconImage={userIcon}
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
									field="profile.checkAndBonus"
									formik={formikEmployee}
									value={formikEmployee.values?.profile?.checkAndBonus}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="col-md-12 mb-2" onClick={() => handleAddValue("check", values, setValues)}>
								<WtcRoleDropdownIconText
									filtler
									target={PageTarget.employee}
									code="check"
									action="INS"
									disabled={false}
									required
									placeHolder={t("check")}
									leadingIconImage={userIcon}
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
									field="profile.check"
									formik={formikEmployee}
									value={formikEmployee.values?.profile?.check}
								/>
							</div>
							<WtcInputChooseColor
								action={"INS"}
								target={PageTarget.employee}
								leadingIcon="ri-palette-line"
								formik={formikEmployee}
								value={formikEmployee.values.color}
								field="color"
							/>
						</div>
					</div>
				</div>
			</div>,
			<div className="p-3" onClick={() => handleAddValue("roleId", values, setValues)}>
				<WtcRoleDropdownIconText
					filtler
					target={PageTarget.employee}
					code="roleId"
					action="INS"
					disabled={false}
					required
					placeHolder={t("role")}
					leadingIconImage={userIcon}
					options={roleState.list
						.filter((item: any) => item.status?.code === "ACTIVE")
						.map((item: any) => {
							return { label: item.name, value: item._id };
						})}
					field="roleId"
					formik={formikEmployee}
					value={formikEmployee.values?.roleId}
				/>
			</div>,
		];
		return (
			<WtcTabs
				tabs={tabs}
				activeTab={activeTabName == "info" ? 0 : activeTabName == "setting" ? 1 : 2}
				contents={contents}
				key={"tab" + activeTabName}
				onChangeTab={(index) => setActiveTabName(index == 0 ? "info" : index == 1 ? "setting" : "role")}
			/>
		);
	};
	const openItem = (item: UserModel) => {
		dispatch(selectItem(item));
		dispatch(getAvatarEmployee(item?._id));
		navigate("/edit-employee");
	};
	const handleResetPassword = (item_id: string) => {
		dispatch(resetPassUser(item_id));
	};
	const userItemView = (item: UserModel, _id: any, index: number) => {
		return (
			<WtcItemCard
				target={PageTarget.employee}
				index={index}
				uniqueId={item._id}
				verticalSpacing={0}
				selected={item._id == selectedId}
				onDbClick={() => {}}
				onClick={() => {
					openItem(item);
				}}
				status={item?.status}
				onDelete={() => {
					handleDeleteEmployee(item._id);
				}}
				onRestore={() => {
					handleRestoreEmployee(item._id);
				}}
				body={
					<div className="row align-items-center p-2">
						<div className="col-sm-2">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								{item.username}
							</div>
						</div>
						<div className="col-sm-3">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								{" "}
								<i id="fullname_empl" className="my-grid-icon ri-user-line" />{" "}
								{formatCapitalize(item.profile.firstName)} {formatCapitalize(item.profile.middleName)}{" "}
								{formatCapitalize(item.profile.lastName)}
							</div>
							<Tooltip position="bottom" target="#fullname_empl" content={t("fullname")} />
						</div>
						<div className="col-sm-2">
							<div style={itemListStyle} className="my-grid-value">
								<span>
									<i id="phone_empl" className="my-grid-icon ri-phone-line" />{" "}
								</span>
								{formatPhoneNumberViewUI(item.profile.phone)}
							</div>
							<Tooltip position="bottom" target="#phone_empl" content={t("phone")} />
						</div>
						<div className="col-sm-3">
							<div className="text-truncate my-grid-value" style={itemListStyle}>
								<span>
									<i id="address_empl" className="my-grid-icon ri-user-location-line" />{" "}
								</span>
								{item.profile.street1 ?? "-"}
							</div>
							<Tooltip position="bottom" target="#address_empl" content={t("address")} />
						</div>
						<div className="col-sm-2">
							<div style={itemListStyle} className="my-grid-value">
								<span>
									<i id="role_profile" className="my-grid-icon ri-shield-keyhole-line" />{" "}
								</span>
								{roleState.list.find((it: any) => it._id == item.roleId)?.name ?? "-"}
							</div>
							<Tooltip position="bottom" target="#role_profile" content={t("role")} />
						</div>
					</div>
				}
				slideButtons={[
					<WtcRoleButton
						key={0}
						target={PageTarget.employee}
						action="UPD"
						label={t("reset_password")}
						onClick={() =>
							warningWithConfirm({
								title: t("do_you_reset_pass"),
								text: "",
								confirmButtonText: t("ok"),
								confirm: () => handleResetPassword(item._id),
							})
						}
						icon="ri-loop-left-line fs-value"
						fontSize={14}
						borderRadius={12}
						height={40}
						className="wtc-bg-primary text-white"
					/>,
				]}
			/>
		);
	};
	const handleDeleteEmployee = (id: string) => {
		dispatch(deleteUser(id));
	};
	const handleRestoreEmployee = (id: string) => {
		dispatch(restoreUser(id));
	};
	const onClickFilterStatus = (e: any) => {
		if (op.current) {
			op.current.toggle(e);
		}
	};
	const chekcRequiredTab = () => {
		if (
			checkEmptyAndUndefined(formikEmployee.values.profile?.firstName) ||
			checkEmptyAndUndefined(formikEmployee.values.username) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.lastName) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.phone) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.email) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.street1) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.city) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.zipcode) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.state)
		) {
			setdisableButtonSubmit(true);
			setActiveTabName("info");
			return false;
		} else if (
			checkEmptyAndUndefined(formikEmployee.values.profile?.openDraw) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.selfGiftCard) ||
			checkEmptyAndUndefined(formikEmployee.values.profile?.paymentType) ||
			checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.paymentValue) ||
			checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.compensation) ||
			checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.checkAndBonus) ||
			checkEmptyAndUndefinedNumber(formikEmployee.values.profile?.check)
		) {
			setdisableButtonSubmit(true);
			setActiveTabName("setting");
			return false;
		}
		if (checkEmptyAndUndefined(formikEmployee.values.roleId)) {
			setActiveTabName("role");
			return false;
		}
		return true;
	};
	useEffect(() => {
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, [status]);
	useEffect(() => {
		if (userState.actionState) {
			switch (userState.actionState.status!) {
				case "completed":
					fetchListLocal();
					completed();
					dispatch(resetActionState());
					dispatch(fetchUsers());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(userState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [userState.actionState]);
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetProfileActionState());
					dispatch(fetchUsers());
					closeDialog();
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(profileState.actionState.error!));
					dispatch(resetProfileActionState());
					break;
			}
		}
	}, [profileState.actionState]);
	const fetchListLocal = async () => {
		await dispatch(fetchUsers());
		dispatch(filterSearch({ searchString: searchString, status: status }));
	};
	useEffect(() => {
		fetchListLocal();
		dispatch(fetchRoles());
		dispatch(fetchUsers());
		dispatch(filterSearch({ searchString: searchString, status: status }));
	}, []);
	useEffect(() => {
		setTotalPages(Math.ceil(userState.filtered.length / rows));
	}, [userState.filtered]);
	useEffect(() => {
		if (!userState.currentPage) {
			dispatch(setCurrentPage(1));
			setPage(0);
		}
		if (!userState.currentRows) {
			dispatch(setCurrentRows(5));
			setRows(5);
		}
	}, [userState.currentPage, userState.currentRows]);
	return (
		<>
			<WtcCard
				isPaging={true}
				title={
					<>
						<HeaderList
							callback={fetchListLocal}
							target={PageTarget.employee}
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogMode("add");
								setDialogVisible(true);
							}}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
							placeHolderSearch="Search name"
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
							{userState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : userState?.filtered?.length == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								userState?.filtered?.map((item: any, index: any) => {
									if (index >= first && index < first + rows) {
										return <div key={item._id || index}>{userItemView(item, item._id, index)}</div>;
									}
								})
							)}
						</div>

						{userState.filtered?.length > 0 && (
							<div className="my-padding-top-paging">
								<Paginator
									first={first}
									rows={rows}
									totalRecords={userState.filtered?.length}
									rowsPerPageOptions={[10, 20]}
									onPageChange={onPageChange}
								/>
								{/* {isMobile ?
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={userState.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange}
                            template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
                            currentPageReportTemplate={` ${page}/${totalPages}`} /> :
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={userState.filtered?.length}
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            onPageChange={onPageChange} />} */}
							</div>
						)}
					</div>
				}
				className="h-100"
			/>
			<div
				className=""
				onKeyDown={(e) => {
					if (e.key === "Enter" && disableButtonSubmit == false) {
						// if (activeTabName == 'info' && formikEmployee.errors.roleId)
						// {
						//     setActiveTabName('role')
						// }
						// else
						if (chekcRequiredTab()) formikEmployee.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "75vw"}
					minHeight={"75vh"}
					visible={dialogVisible}
					mode={dialogMode}
					position={"center"}
					title={t("user")}
					okText=""
					cancelText="Hủy"
					onEnter={() => {
						formikEmployee.handleSubmit();
					}}
					draggable={false}
					resizeable={false}
					onClose={() => closeDialog()}
					body={employeeModelView()}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<WtcButton
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key == "Enter") {
										closeDialog();
										e.preventDefault();
									}
								}}
								label={t("action.close")}
								className="bg-white text-blue me-2"
								borderColor="#283673"
								fontSize={16}
								onClick={closeDialog}
							/>
							{dialogMode === "edit" && (
								<>
									{
										<WtcRoleButton
											target={PageTarget.employee}
											action="UPD"
											disabled={
												formikEmployee &&
												formikEmployee.errors &&
												Object.keys(formikEmployee.errors).length > 0
											}
											label={t("action.UPD")}
											icon="ri-edit-line"
											className="wtc-bg-primary text-white me-2"
											fontSize={16}
											onClick={() => formikEmployee.handleSubmit()}
										/>
									}
								</>
							)}
							{dialogMode === "add" && (
								<WtcRoleButton
									target={PageTarget.employee}
									tabIndex={0}
									action="INS"
									disabled={disableButtonSubmit}
									label={t("action.INS")}
									icon="ri-add-line"
									className="wtc-bg-primary text-white me-2"
									fontSize={16}
									onClick={() => {
										if (chekcRequiredTab()) formikEmployee.handleSubmit();
									}}
								/>
							)}
						</div>
					}
				/>
			</div>
		</>
	);
}
