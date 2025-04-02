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
import SidebarEmployee from "../../../components/employee/SidebarEmployee";
import {
	checkEmptyAndUndefined,
	checkEmptyAndUndefinedNumber,
	formatPhoneNumberSubmitDatabase,
	formatPhoneNumberViewUI,
	PageTarget,
} from "../../../const";
import { UserModel } from "../../../models/category/User.model";
import { WindowModel } from "../../../models/category/Window.model";
import { resetActionState as resetProfileActionState, updateProfile } from "../../../slices/profile.slice";
import { fetchRoles } from "../../../slices/role.slice";
import {
	addUser,
	changeAction,
	fetchUsers,
	filterSearch,
	getAvatarEmployee,
	resetActionState,
	selectItem,
	setCurrentPage,
	setCurrentRows,
	updateUserRole,
} from "../../../slices/user.slice";
import { failed, showMessageToast } from "../../../utils/alert.util";
export type EmployeeProps = {
	profile: {
		_id: string;
		firstName: string;
		middleName: string;
		lastName: string;
		phone: string;
		email: string;
		street1: string;
		street2: string;
		state: string;
		zipcode: string;
		gender: string;
		city: string;
		emergencyContactName: string;
		emergencyContactPhone: string;
		openDraw: string;
		selfGiftCard: string;
		paymentType: string;
		paymentValue: number;
		compensation: number;
		checkAndBonus: number;
		check: number;
		positionWindow: WindowModel;
		positionPoint: number;
	};
	_id: string;
	username: string;
	roleId: string;
	old_password?: string;
	new_password?: string;
	color?: string;
};
export default function Employees() {
	const screenSize = useWindowSize();
	const userState = useAppSelector((state) => state.user);
	const profileState = useAppSelector((state) => state.profile);
	const [activeIndex, setActiveIndex] = useState(0);
	const dispatch = useAppDispatch();
	const toast = useRef<any>(null);
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
	const [status, setStatus] = useState("ALL");
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
	const formikEmployee = useFormik<EmployeeProps>({
		initialValues: {
			profile: {
				_id: "",
				firstName: "",
				middleName: "",
				lastName: "",
				phone: "",
				email: "",
				street1: "",
				street2: "",
				state: "",
				zipcode: "",
				gender: "",
				city: "",
				emergencyContactName: "",
				emergencyContactPhone: "",
				openDraw: "",
				selfGiftCard: "",
				paymentType: "",
				paymentValue: 0,
				compensation: 0,
				checkAndBonus: 0,
				check: 0,
				positionWindow: WindowModel.initial(),
				positionPoint: 0,
			},
			_id: "",
			username: "",
			roleId: "",
			old_password: "",
			new_password: "",
			color: "#283673",
		},
		validate: (data) => {
			const errors: FormikErrors<EmployeeProps> = {};
			if (dialogMode === "add") {
				if (activeIndex === 0) {
					if (!data.profile.firstName) {
						errors.profile = {
							...errors.profile,
							firstName: t(`errFields`),
						};
					}
					if (!data.profile.lastName) {
						errors.profile = {
							...errors.profile,
							lastName: t(`errFields`),
						};
					}
					if (!data.profile.gender) {
						errors.profile = {
							...errors.profile,
							gender: t(`errFields`),
						};
					}
					if (!data.profile.phone) {
						errors.profile = {
							...errors.profile,
							phone: t(`errFields`),
						};
					}
					if (!data.profile.email) {
						errors.profile = {
							...errors.profile,
							email: t(`errFields`),
						};
					}
					if (!data.username) {
						errors.username = t(`errFields`);
					}
					if (!data.roleId) {
						errors.roleId = t(`errFields`);
					}
					if (!data.profile.street1) {
						errors.profile = {
							...errors.profile,
							street1: t(`errFields`),
						};
					}
					if (!data.profile.state) {
						errors.profile = {
							...errors.profile,
							state: t(`errFields`),
						};
					}
					if (!data.profile.zipcode) {
						errors.profile = {
							...errors.profile,
							zipcode: t(`errFields`),
						};
					}
				}
			}
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
						positionWindow: profile?.positionWindow ? profile?.positionWindow : undefined,
						positionPoint: profile?.positionPoint ? profile?.positionPoint : undefined,
						color: data.color,
					},
					username: data.username,
					password: "12345678",
					roleId: data.roleId,
				};
				dispatch(addUser(submitData));
				setDialogVisible(false);
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
							dispatch(updateUserRole({ _id: data?._id, roleId: data.roleId }));
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
		setActiveIndex(0);
		formikEmployee.resetForm();
	};
	// const _employeeModelView = () => {
	// 	const tabs = [t("employee_info"), t("emplsetting"), t("access_right")];
	// 	const contents = [
	// 		<div className="p-3">
	// 			<div className="row">
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						disabled={dialogMode == "add" ? false : true}
	// 						target={PageTarget.employee}
	// 						focused
	// 						code="username"
	// 						maxLength={20}
	// 						action="INS"
	// 						placeHolder={t("username")}
	// 						required
	// 						leadingIconImage={userIcon}
	// 						field="username"
	// 						formik={formikEmployee}
	// 						value={""}
	// 						onClick={() => handleAddValue("userName", values, setValues)}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleDropdownIconText
	// 						filtler
	// 						target={PageTarget.employee}
	// 						code="gender"
	// 						action="INS"
	// 						disabled={false}
	// 						placeHolder={t("gender")}
	// 						leadingIconImage={userIcon}
	// 						options={[
	// 							{ label: t("male"), value: "MALE" },
	// 							{ label: t("female"), value: "FEMALE" },
	// 							{ label: t("other"), value: "OTHER" },
	// 						]}
	// 						field="profile.gender"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.gender}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-12 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="firstName"
	// 						action="INS"
	// 						placeHolder={t("firstName")}
	// 						required
	// 						leadingIconImage={userIcon}
	// 						field="profile.firstName"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.firstName}
	// 						maxLength={20}
	// 						onClick={() => handleAddValue("firstName", values, setValues)}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="middleName"
	// 						action="INS"
	// 						placeHolder={t("middleName")}
	// 						leadingIconImage={userIcon}
	// 						field="profile.middleName"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.middleName}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="lastName"
	// 						action="INS"
	// 						placeHolder={t("lastName")}
	// 						maxLength={20}
	// 						required
	// 						leadingIconImage={userIcon}
	// 						field="profile.lastName"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.lastName}
	// 						onClick={() => handleAddValue("lastName", values, setValues)}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-12 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="street1"
	// 						maxLength={50}
	// 						action="INS"
	// 						placeHolder={t("address") + " 1"}
	// 						required
	// 						leadingIcon={"ri-home-4-fill"}
	// 						field="profile.street1"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.street1}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-12 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="street2"
	// 						maxLength={50}
	// 						action="INS"
	// 						placeHolder={t("address") + " 2"}
	// 						leadingIcon={"ri-home-4-fill"}
	// 						field="profile.street2"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.street2}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-12 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						code="city"
	// 						maxLength={50}
	// 						action="INS"
	// 						placeHolder={t("city")}
	// 						required
	// 						leadingIcon={"ri-map-line"}
	// 						field="profile.city"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.city}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleDropdownIconState
	// 						filtler
	// 						target={PageTarget.employee}
	// 						code="state"
	// 						action="INS"
	// 						required
	// 						disabled={false}
	// 						placeHolder={t("state")}
	// 						leadingIcon={"ri-pie-chart-line"}
	// 						options={states}
	// 						field="profile.state"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.state}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						type="tel"
	// 						code="zipcode"
	// 						action="INS"
	// 						placeHolder={t("zipcode")}
	// 						required
	// 						mask="99999"
	// 						slotChar="#####"
	// 						leadingIcon={"ri-barcode-line"}
	// 						field="profile.zipcode"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.zipcode}
	// 					/>
	// 				</div>
	// 				<div className="col-sm-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						type="tel"
	// 						code="phone"
	// 						action="INS"
	// 						placeHolder={t("phone")}
	// 						required
	// 						mask="(999)999-9999"
	// 						slotChar="(###)###-####"
	// 						leadingIcon={"ri-phone-line"}
	// 						field="profile.phone"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.phone}
	// 						onClick={() => handleAddValue("phone", values, setValues)}
	// 					/>
	// 				</div>
	// 				<div className="col-md-6 mb-2">
	// 					<WtcRoleInputIconText
	// 						target={PageTarget.employee}
	// 						required
	// 						type="email"
	// 						code="email"
	// 						action="INS"
	// 						placeHolder="Email"
	// 						leadingIconImage={emailIcon}
	// 						field="profile.email"
	// 						formik={formikEmployee}
	// 						value={formikEmployee.values?.profile?.email}
	// 						onClick={() => handleAddValue("email", values, setValues)}
	// 					/>
	// 				</div>
	// 			</div>
	// 		</div>,
	// 		<div className="p-3">
	// 			<div className="row">
	// 				<div className="col-sm-12 mt-2 row">
	// 					<div className="col-md-6" onClick={() => handleAddValue("openDraw", values, setValues)}>
	// 						<WtcRoleDropdownIconText
	// 							filtler
	// 							target={PageTarget.employee}
	// 							code="openDraw"
	// 							action="INS"
	// 							disabled={false}
	// 							required
	// 							placeHolder={t("opendraw")}
	// 							leadingIconImage={userIcon}
	// 							options={[
	// 								{ label: t("yes"), value: "YES" },
	// 								{ label: t("no"), value: "NO" },
	// 							]}
	// 							field="profile.openDraw"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values?.profile?.openDraw}
	// 						/>
	// 					</div>
	// 					<div className="col-md-6" onClick={() => handleAddValue("selfGiftCard", values, setValues)}>
	// 						<WtcRoleDropdownIconText
	// 							filtler
	// 							target={PageTarget.employee}
	// 							code="selfGiftCard"
	// 							action="INS"
	// 							disabled={false}
	// 							required
	// 							placeHolder={t("sellgiftcard")}
	// 							leadingIconImage={userIcon}
	// 							options={[
	// 								{ label: t("yes"), value: "YES" },
	// 								{ label: t("no"), value: "NO" },
	// 							]}
	// 							field="profile.selfGiftCard"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values?.profile?.selfGiftCard}
	// 						/>
	// 					</div>
	// 				</div>
	// 				<div className="col-sm-12 mt-2 row">
	// 					<div className="col-md-6" onClick={() => handleAddValue("paymentType", values, setValues)}>
	// 						<WtcRoleDropdownIconText
	// 							filtler
	// 							target={PageTarget.employee}
	// 							code="paymentType"
	// 							action="INS"
	// 							disabled={false}
	// 							required
	// 							placeHolder={t("paymenttype")}
	// 							leadingIconImage={userIcon}
	// 							options={[
	// 								{ label: t("weekpay"), value: "WEEKPAY" },
	// 								{ label: t("hourpay"), value: "HOURPAY" },
	// 							]}
	// 							field="profile.paymentType"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values?.profile?.paymentType}
	// 						/>
	// 					</div>
	// 					<div className="col-md-6" onClick={() => handleAddValue("paymentValue", values, setValues)}>
	// 						{/* <WtcInputIconNumber
	// 							placeHolder={t("paymentvalue")}
	// 							required
	// 							maxValue={10000}
	// 							leadingIcon={"ri-user-fill"}
	// 							field="profile.paymentValue"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values?.profile?.paymentValue}
	// 						/> */}
	// 						<WtcRoleInputIconNumber
	// 							action={dialogMode == "add" ? "INS" : "UPD"}
	// 							code="amount"
	// 							target={PageTarget.employee}
	// 							isCurr
	// 							minFractionDigits={2}
	// 							maxFractionDigits={2}
	// 							placeHolder={t("paymentvalue")}
	// 							required
	// 							maxValue={10000}
	// 							leadingIcon={"ri-money-dollar-circle-line"}
	// 							field="profile.paymentValue"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values?.profile?.paymentValue}
	// 						/>
	// 					</div>
	// 				</div>
	// 				<div className="col-sm-12 mt-2 row">
	// 					<div className="col-md-6">
	// 						<div
	// 							className="col-md-12 mb-2"
	// 							onClick={() => handleAddValue("compensation", values, setValues)}
	// 						>
	// 							<WtcRoleDropdownIconText
	// 								filtler
	// 								target={PageTarget.employee}
	// 								code="compensation"
	// 								action="INS"
	// 								disabled={false}
	// 								required
	// 								placeHolder={t("compensation")}
	// 								leadingIconImage={userIcon}
	// 								options={[
	// 									{ label: "5", value: "5" },
	// 									{ label: "5.25", value: "5.25" },
	// 									{ label: "5.5", value: "5.5" },
	// 									{ label: "6", value: "6" },
	// 									{ label: "6.5", value: "6.5" },
	// 									{ label: "7", value: "7" },
	// 									{ label: "7.5", value: "7.5" },
	// 									{ label: "8", value: "8" },
	// 								]}
	// 								field="profile.compensation"
	// 								formik={formikEmployee}
	// 								value={formikEmployee.values?.profile?.compensation}
	// 							/>
	// 						</div>
	// 						<div
	// 							className="col-md-12 mb-2"
	// 							onClick={() => handleAddValue("checkAndBonus", values, setValues)}
	// 						>
	// 							<WtcRoleDropdownIconText
	// 								filtler
	// 								target={PageTarget.employee}
	// 								code="checkAndBonus"
	// 								action="INS"
	// 								disabled={false}
	// 								required
	// 								placeHolder={t("checkandbonus")}
	// 								leadingIconImage={userIcon}
	// 								options={[
	// 									{ label: "5", value: "5" },
	// 									{ label: "5.25", value: "5.25" },
	// 									{ label: "5.5", value: "5.5" },
	// 									{ label: "6", value: "6" },
	// 									{ label: "6.5", value: "6.5" },
	// 									{ label: "7", value: "7" },
	// 									{ label: "7.5", value: "7.5" },
	// 									{ label: "8", value: "8" },
	// 								]}
	// 								field="profile.checkAndBonus"
	// 								formik={formikEmployee}
	// 								value={formikEmployee.values?.profile?.checkAndBonus}
	// 							/>
	// 						</div>
	// 					</div>
	// 					<div className="col-md-6">
	// 						<div className="col-md-12 mb-2" onClick={() => handleAddValue("check", values, setValues)}>
	// 							<WtcRoleDropdownIconText
	// 								filtler
	// 								target={PageTarget.employee}
	// 								code="check"
	// 								action="INS"
	// 								disabled={false}
	// 								required
	// 								placeHolder={t("check")}
	// 								leadingIconImage={userIcon}
	// 								options={[
	// 									{ label: "5", value: "5" },
	// 									{ label: "5.25", value: "5.25" },
	// 									{ label: "5.5", value: "5.5" },
	// 									{ label: "6", value: "6" },
	// 									{ label: "6.5", value: "6.5" },
	// 									{ label: "7", value: "7" },
	// 									{ label: "7.5", value: "7.5" },
	// 									{ label: "8", value: "8" },
	// 								]}
	// 								field="profile.check"
	// 								formik={formikEmployee}
	// 								value={formikEmployee.values?.profile?.check}
	// 							/>
	// 						</div>
	// 						<WtcInputChooseColor
	// 							action={"INS"}
	// 							target={PageTarget.employee}
	// 							leadingIcon="ri-palette-line"
	// 							formik={formikEmployee}
	// 							value={formikEmployee.values.color || ""}
	// 							field="color"
	// 						/>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>,
	// 		<div className="p-3" onClick={() => handleAddValue("roleId", values, setValues)}>
	// 			<WtcRoleDropdownIconText
	// 				filtler
	// 				target={PageTarget.employee}
	// 				code="roleId"
	// 				action="INS"
	// 				disabled={false}
	// 				required
	// 				placeHolder={t("role")}
	// 				leadingIconImage={userIcon}
	// 				options={roleState.list
	// 					.filter((item: any) => item.status?.code === "ACTIVE")
	// 					.map((item: any) => {
	// 						return { label: item.name, value: item._id };
	// 					})}
	// 				field="roleId"
	// 				formik={formikEmployee}
	// 				value={formikEmployee.values?.roleId}
	// 			/>
	// 		</div>,
	// 	];
	// 	return (
	// 		<WtcTabs
	// 			tabs={tabs}
	// 			activeTab={activeTabName == "info" ? 0 : activeTabName == "setting" ? 1 : 2}
	// 			contents={contents}
	// 			key={"tab" + activeTabName}
	// 			onChangeTab={(index) => setActiveTabName(index == 0 ? "info" : index == 1 ? "setting" : "role")}
	// 		/>
	// 	);
	// };
	const openItem = (item: UserModel) => {
		dispatch(selectItem(item));
		dispatch(getAvatarEmployee(item?._id));
		dispatch(changeAction("UPD"));
		setDialogVisible(true);
	};
	// const handleResetPassword = (item_id: string) => {
	// 	dispatch(resetPassUser(item_id));
	// };
	const paginatorTemplate =
		"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown";
	// const userItemView = (item: UserModel, _id: any, index: number) => {
	// 	return (
	// 		<WtcItemCard
	// 			target={PageTarget.employee}
	// 			index={index}
	// 			uniqueId={item._id}
	// 			verticalSpacing={0}
	// 			selected={item._id == selectedId}
	// 			onDbClick={() => {}}
	// 			onClick={() => {
	// 				openItem(item);
	// 			}}
	// 			status={item?.status}
	// 			onDelete={() => {
	// 				handleDeleteEmployee(item._id);
	// 			}}
	// 			onRestore={() => {
	// 				handleRestoreEmployee(item._id);
	// 			}}
	// 			body={
	// 				<>
	// 					<div className="row align-items-center p-2">
	// 						<div className="col-sm-2">
	// 							<div className="text-truncate my-grid-value" style={itemListStyle}>
	// 								{item.username}
	// 							</div>
	// 						</div>
	// 						<div className="col-sm-3">
	// 							<div className="text-truncate my-grid-value" style={itemListStyle}>
	// 								{" "}
	// 								<i id="fullname_empl" className="my-grid-icon ri-user-line" />{" "}
	// 								{formatCapitalize(item.profile.firstName)}{" "}
	// 								{formatCapitalize(item.profile.middleName)}{" "}
	// 								{formatCapitalize(item.profile.lastName)}
	// 							</div>
	// 							<Tooltip position="bottom" target="#fullname_empl" content={t("fullname")} />
	// 						</div>
	// 						<div className="col-sm-2">
	// 							<div style={itemListStyle} className="my-grid-value">
	// 								<span>
	// 									<i id="phone_empl" className="my-grid-icon ri-phone-line" />{" "}
	// 								</span>
	// 								{formatPhoneNumberViewUI(item.profile.phone)}
	// 							</div>
	// 							<Tooltip position="bottom" target="#phone_empl" content={t("phone")} />
	// 						</div>
	// 						<div className="col-sm-3">
	// 							<div className="text-truncate my-grid-value" style={itemListStyle}>
	// 								<span>
	// 									<i id="address_empl" className="my-grid-icon ri-user-location-line" />{" "}
	// 								</span>
	// 								{item.profile.street1 ?? "-"}
	// 							</div>
	// 							<Tooltip position="bottom" target="#address_empl" content={t("address")} />
	// 						</div>
	// 						<div className="col-sm-2">
	// 							<div style={itemListStyle} className="my-grid-value">
	// 								<span>
	// 									<i id="role_profile" className="my-grid-icon ri-shield-keyhole-line" />{" "}
	// 								</span>
	// 								{roleState.list.find((it: any) => it._id == item.roleId)?.name ?? "-"}
	// 							</div>
	// 							<Tooltip position="bottom" target="#role_profile" content={t("role")} />
	// 						</div>
	// 					</div>
	// 				</>
	// 			}
	// 			slideButtons={[
	// 				<WtcRoleButton
	// 					key={0}
	// 					target={PageTarget.employee}
	// 					action="UPD"
	// 					label={t("reset_password")}
	// 					onClick={() =>
	// 						warningWithConfirm({
	// 							title: t("do_you_reset_pass"),
	// 							text: "",
	// 							confirmButtonText: t("ok"),
	// 							confirm: () => handleResetPassword(item._id),
	// 						})
	// 					}
	// 					icon="ri-loop-left-line fs-value"
	// 					fontSize={14}
	// 					borderRadius={12}
	// 					height={40}
	// 					className="wtc-bg-primary text-white"
	// 				/>,
	// 			]}
	// 		/>
	// 	);
	// };
	// const handleDeleteEmployee = (id: string) => {
	// 	dispatch(deleteUser(id));
	// };
	// const handleRestoreEmployee = (id: string) => {
	// 	dispatch(restoreUser(id));
	// };
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
		if (userState.actionState) {
			switch (userState.actionState.status!) {
				case "completed":
					fetchListLocal();
					// completed();
					showMessageToast(toast, "success", userState.successMessage);
					dispatch(resetActionState());
					dispatch(fetchUsers());
					// closeDialog();
					break;
				case "loading":
					// processing();
					break;
				case "failed":
					showMessageToast(toast, "error", t(userState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [userState.actionState]);
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status!) {
				case "completed":
					// completed();
					showMessageToast(toast, "success", userState.successMessage);
					dispatch(resetProfileActionState());
					dispatch(fetchUsers());
					// closeDialog();
					break;
				case "loading":
					// processing();
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
							target={PageTarget.employee}
							onSearchText={(text) => {
								setSearchString(text);
								dispatch(filterSearch({ searchString: text, status: status }));
							}}
							onAddNew={() => {
								setDialogMode("add");
								dispatch(selectItem({}));
								formikEmployee.resetForm();
								setDialogVisible(true);
								dispatch(changeAction("INS"));
							}}
							onClickFilterStatus={(e) => onClickFilterStatus(e)}
							placeHolderSearch="Search name"
							isFilterStatus={true}
							status={status}
							setStatus={setStatus}
							labelSearch="Search employee"
							labelFilter="Employee’s status"
							titleButtonAdd={t("action.createEmployee")}
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
							// style={{ maxHeight: screenSize.height - 220, overflowX: "hidden", overflowY: "auto" }}
							style={{ maxHeight: screenSize.height, overflowX: "hidden", overflowY: "auto" }}
						>
							{userState.fetchState.status == "loading" ? (
								<LoadingIndicator />
							) : userState?.filtered?.length == 0 ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center">
									{" "}
									<WtcEmptyBox />
								</div>
							) : (
								<>
									<DataTable
										value={userState?.filtered}
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
										scrollable
										scrollHeight="100%"
									>
										<Column
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
											header=""
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div
													style={{
														minWidth: "60px",
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
														{rowData.username}
													</p>
												</div>
											)}
											header="Username"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) =>
												rowData.status === "INACTIVE" ? (
													<div
														style={{
															minWidth: "60px",
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
															minWidth: "60px",
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
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{" "}
														{rowData.profile.firstName || ""}{" "}
														{rowData.profile.middleName || ""}{" "}
														{rowData.profile.lastName || ""}{" "}
													</p>
												</div>
											)}
											header="Name"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{formatPhoneNumberViewUI(rowData.profile.phone)}
													</p>
												</div>
											)}
											header="Phone"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{rowData.profile.street1}
													</p>
												</div>
											)}
											header="Address"
										></Column>
										<Column
											headerStyle={{
												backgroundColor: "#F4F4F4",
											}}
											body={(rowData) => (
												<div style={{ minWidth: "60px", padding: "12px", maxHeight: "72px" }}>
													<p
														style={{
															fontSize: "16px",
															fontWeight: "400",
															color: "#3E4451",
															margin: "auto",
														}}
													>
														{rowData.role}
													</p>
												</div>
											)}
											header="Role"
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
								</>
							)}
						</div>
					</div>
				}
				className="h-100"
			/>
			<div
				className=""
				onKeyDown={(e) => {
					if (e.key === "Enter" && disableButtonSubmit == false) {
						if (chekcRequiredTab()) formikEmployee.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<SidebarEmployee
					action={userState.action}
					dialogVisible={dialogVisible}
					setDialogVisible={setDialogVisible}
					formikEmployee={formikEmployee}
					values={values}
					setValues={setValues}
					dialogMode={dialogMode}
					closeDialog={closeDialog}
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
				/>
				{/* <DynamicDialog
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
				/> */}
			</div>
			<Toast ref={toast} position="top-center" />
		</>
	);
}
