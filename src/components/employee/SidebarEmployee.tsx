import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { Steps } from "primereact/steps";
import "./SidebarEmployee.css";
import { Accordion, AccordionTab } from "primereact/accordion";
import PhoneInput from "react-phone-input-2";
import { FormikProps } from "formik";
import { handleAddValue, PageTarget, states } from "../../const";
import { DialogMode } from "../DynamicDialog";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import WtcInputChooseColor from "../commons/WtcInputChooseColorV2";
import { EmployeeProps } from "../../views/category/EmployeesV2/Employees";
import { actions } from "../../types";
import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useState } from "react";
import { deleteUser, selectItem } from "../../slices/user.slice";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const SidebarEmployee = ({
	dialogVisible,
	formikEmployee,
	values,
	setValues,
	dialogMode,
	closeDialog,
	activeIndex,
	setActiveIndex,
	action,
}: {
	dialogVisible: boolean;
	setDialogVisible: (e: boolean) => void;
	formikEmployee: FormikProps<EmployeeProps>;
	values: string[];
	setValues: (e: any) => void;
	dialogMode: DialogMode;
	closeDialog: VoidFunction;
	activeIndex: number;
	setActiveIndex: (e: number) => void;
	action: actions;
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const roleState = useAppSelector((state) => state.role);
	const userState = useAppSelector((state) => state.user);
	const [isDisabled, setIsDisabled] = useState(true);
	const [visibleConfirm, setVisibleConfirm] = useState(false);
	const items = [
		{
			label: t("employee_info"),
		},
		{
			label: t("emplsetting"),
		},
	];
	const handleDeleteEmployee = (id: string) => {
		dispatch(deleteUser(id));
	};
	useEffect(() => {
		if (userState.item) {
			formikEmployee.setValues(userState.item);
		}
	}, [userState]);
	useEffect(() => {
		if (formikEmployee.values !== userState.item) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [formikEmployee.values, userState.item]);
	return (
		<>
			<Sidebar
				visible={dialogVisible}
				onHide={() => closeDialog()}
				position="right"
				style={{ width: "881px" }}
				header={
					<>
						<div className="d-flex justify-content-between align-items-center">
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "400",
								}}
							>
								{action === "INS" ? "Add new employee" : action === "UPD" ? "Employee details" : ""}
							</h2>
						</div>
					</>
				}
			>
				<div className="d-flex flex-column">
					<div className="w-100 bg-white px-3">
						{action === "INS" ? (
							<Steps
								model={items}
								activeIndex={activeIndex}
								color="#4180C5"
								style={{
									textDecoration: "none",
								}}
							/>
						) : (
							<></>
						)}
					</div>
					{action === "INS" && activeIndex === 0 ? (
						<div
							className="accordionSidebar px-3"
							style={{
								marginTop: "20px",
								marginBottom: "100px",
								backgroundColor: action === "INS" ? "white" : "#F4F4F4",
							}}
						>
							<Accordion
								activeIndex={[0, 1]}
								multiple
								style={{ display: "flex", flexDirection: "column", gap: "20px" }}
							>
								<AccordionTab header="CONTACT">
									<div className="row g-3">
										<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												First name
											</label>
											<input
												type="text"
												className="form-control"
												placeholder={t("firstName")}
												required
												value={formikEmployee.values?.profile?.firstName}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.firstName", e.target.value)
												}
												maxLength={20}
												onClick={() => handleAddValue("firstName", values, setValues)}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors.profile?.firstName && (
												<small className="p-error">
													{formikEmployee.errors.profile.firstName as string}
												</small>
											)}
										</div>
										<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												Middle name
											</label>
											<input
												type="text"
												className="form-control"
												placeholder={t("middleName")}
												required
												value={formikEmployee.values?.profile?.middleName}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.middleName", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
										</div>
										<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Last name
											</label>
											<input
												type="text"
												className="form-control"
												placeholder={t("lastName")}
												required
												value={formikEmployee.values?.profile?.lastName}
												maxLength={20}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.lastName", e.target.value)
												}
												onClick={() => handleAddValue("lastName", values, setValues)}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors.profile?.lastName && (
												<small className="p-error">
													{formikEmployee.errors.profile.lastName as string}
												</small>
											)}
										</div>
									</div>
									<div className="mt-3 d-flex flex-column" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
												*
											</span>
											Select gender
										</label>
										<Dropdown
											className="w-100"
											placeholder={t("gender")}
											options={[
												{ label: t("male"), value: "MALE" },
												{ label: t("female"), value: "FEMALE" },
												{ label: t("other"), value: "OTHER" },
											]}
											style={{
												border: "1px solid #CCCED5",
												borderRadius: "4px",
												padding: "6px",
												maxHeight: "60px",
											}}
											value={formikEmployee.values?.profile?.gender}
											onChange={(e) =>
												formikEmployee.setFieldValue("profile.gender", e.target.value)
											}
										/>
										{formikEmployee.errors.profile?.gender && (
											<small className="p-error">
												{formikEmployee.errors.profile.gender as string}
											</small>
										)}
									</div>

									<div className="row g-3 mt-2">
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Phone number
											</label>
											<div className="d-flex gap-2">
												<PhoneInput
													country={"us"}
													enableSearch
													disableSearchIcon
													containerStyle={{
														width: "100%",
														height: "60px",
													}}
													inputStyle={{
														width: "100%",
														height: "60px",
														paddingLeft: "100px",
													}}
													value={formikEmployee.values?.profile?.phone}
													onChange={(e) => formikEmployee.setFieldValue("profile.phone", e)}
													onClick={() => handleAddValue("phone", values, setValues)}
												/>
											</div>
											{formikEmployee.errors.profile?.phone && (
												<small className="p-error">
													{formikEmployee.errors.profile.phone as string}
												</small>
											)}
										</div>
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Email
											</label>
											<input
												type="email"
												className="form-control"
												placeholder="Email"
												required
												value={formikEmployee.values?.profile?.email}
												maxLength={20}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.email", e.target.value)
												}
												onClick={() => handleAddValue("email", values, setValues)}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors.profile?.email && (
												<small className="p-error">
													{formikEmployee.errors.profile.email as string}
												</small>
											)}
										</div>
									</div>

									<div className="row g-3 mt-2">
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Username
											</label>
											<input
												type="text"
												className="form-control"
												placeholder={t("username")}
												required
												value={formikEmployee.values?.username}
												maxLength={20}
												onChange={(e) =>
													formikEmployee.setFieldValue("username", e.target.value)
												}
												onClick={() => handleAddValue("username", values, setValues)}
												disabled={dialogMode == "add" ? false : true}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors?.username && (
												<small className="p-error">
													{formikEmployee.errors.username as string}
												</small>
											)}
										</div>
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Role
											</label>
											<Dropdown
												className="w-100"
												options={roleState.list
													.filter((item: any) => item.status?.code === "ACTIVE")
													.map((item: any) => {
														return { label: item.name, value: item._id };
													})}
												required
												placeholder={t("role")}
												value={formikEmployee.values?.roleId}
												onChange={(e) => formikEmployee.setFieldValue("roleId", e.target.value)}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors?.roleId && (
												<small className="p-error">
													{formikEmployee.errors.roleId as string}
												</small>
											)}
										</div>
									</div>
								</AccordionTab>
								<AccordionTab header="ADDRESS">
									<div className="mb-3">
										<div className="mb-3 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Address 1
											</label>
											<input
												type="text"
												placeholder={t("address") + " 1"}
												maxLength={50}
												className="form-control"
												value={formikEmployee.values?.profile?.street1}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.street1", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors.profile?.street1 && (
												<small className="p-error">
													{formikEmployee.errors.profile.street1 as string}
												</small>
											)}
										</div>
										<div className="mb-3 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												Address 2 (optional)
											</label>
											<input
												type="text"
												placeholder={t("address") + " 2"}
												maxLength={50}
												className="form-control"
												value={formikEmployee.values?.profile?.street2}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.street2", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
										</div>
										<div className="row g-3 mb-3">
											<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
												<label
													className="form-label"
													style={{
														fontSize: "16px",
														fontWeight: "600",
													}}
												>
													<span
														style={{
															color: "#FF3C32",
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														*
													</span>
													State
												</label>
												<Dropdown
													className="w-100"
													placeholder={t("state")}
													options={states}
													value={formikEmployee.values?.profile?.state}
													onChange={(e) =>
														formikEmployee.setFieldValue("profile.state", e.target.value)
													}
													style={{
														border: "1px solid #CCCED5",
														borderRadius: "4px",
														padding: "6px",
														height: "60px",
													}}
												/>
												{formikEmployee.errors.profile?.state && (
													<small className="p-error">
														{formikEmployee.errors.profile.state as string}
													</small>
												)}
											</div>
											<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
												<label
													className="form-label"
													style={{
														fontSize: "16px",
														fontWeight: "600",
													}}
												>
													<span
														style={{
															color: "#FF3C32",
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														*
													</span>
													City
												</label>
												<input
													type="text"
													placeholder={t("city")}
													maxLength={50}
													className="form-control"
													value={formikEmployee.values?.profile?.city}
													onChange={(e) =>
														formikEmployee.setFieldValue("profile.city", e.target.value)
													}
													style={{
														border: "1px solid #CCCED5",
														borderRadius: "4px",
														padding: "12px",
														height: "60px",
													}}
												/>
												{formikEmployee.errors.profile?.city && (
													<small className="p-error">
														{formikEmployee.errors.profile.city as string}
													</small>
												)}
											</div>
										</div>
										<div className="d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Zipcode
											</label>
											<input
												type="text"
												placeholder={t("zipcode")}
												className="form-control"
												value={formikEmployee.values?.profile?.zipcode}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.zipcode", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "12px",
													height: "60px",
												}}
											/>
											{formikEmployee.errors.profile?.zipcode && (
												<small className="p-error">
													{formikEmployee.errors.profile.zipcode as string}
												</small>
											)}
										</div>
									</div>
								</AccordionTab>
							</Accordion>
						</div>
					) : action === "INS" && activeIndex === 1 ? (
						<div
							className="accordionSidebar"
							style={{
								marginTop: "20px",
								paddingBottom: "70px",
							}}
						>
							<Accordion activeIndex={0} multiple>
								<AccordionTab header="EMPLOYEE SETTINGS">
									<div className="mb-3 row">
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Open draw <span>(No sale)</span>
											</label>
											<Dropdown
												className="w-100"
												placeholder={t("opendraw")}
												options={[
													{ label: t("yes"), value: "YES" },
													{ label: t("no"), value: "NO" },
												]}
												value={formikEmployee.values?.profile?.openDraw}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.openDraw", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
											/>
										</div>
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Sell gift card
											</label>
											<Dropdown
												className="w-100"
												placeholder={t("sellgiftcard")}
												options={[
													{ label: t("yes"), value: "YES" },
													{ label: t("no"), value: "NO" },
												]}
												value={formikEmployee.values?.profile?.selfGiftCard}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.selfGiftCard", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
											/>
										</div>
									</div>
									<div className="row mb-3">
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Payment type
											</label>
											<Dropdown
												className="w-100"
												placeholder={t("paymenttype")}
												options={[
													{ label: t("weekpay"), value: "WEEKPAY" },
													{ label: t("hourpay"), value: "HOURPAY" },
												]}
												value={formikEmployee.values?.profile?.paymentType}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.paymentType", e.target.value)
												}
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
											/>
										</div>
										<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Payment value
											</label>
											<div className="p-inputgroup">
												<span
													className="p-inputgroup-addon"
													style={{
														backgroundColor: "white",
													}}
												>
													$
												</span>
												<input
													type="number"
													className="form-control"
													placeholder={t("paymentvalue")}
													max={10000}
													style={{
														borderTop: "1px solid #CCCED5",
														borderBottom: "1px solid #CCCED5",
														borderLeft: "none",
														borderRight: "none",
														borderRadius: "0",
														padding: "12px",
														height: "60px",
														textAlign: "right",
														outline: "none",
													}}
													value={formikEmployee.values?.profile?.paymentValue}
													onChange={(e) =>
														formikEmployee.setFieldValue(
															"profile.paymentValue",
															e.target.value
														)
													}
												/>
												<span className="p-inputgroup-addon">USD</span>
											</div>
										</div>
									</div>
									<div className="d-flex flex-column mb-3" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
												*
											</span>
											Compensation
										</label>
										<Dropdown
											className="w-100"
											placeholder={t("compensation")}
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
											style={{
												border: "1px solid #CCCED5",
												borderRadius: "4px",
												padding: "6px",
												height: "60px",
											}}
											value={formikEmployee.values?.profile?.compensation}
											onChange={(e) =>
												formikEmployee.setFieldValue("profile.compensation", e.target.value)
											}
										/>
									</div>
									<div className="row mb-3">
										<div className="d-flex flex-column col-6" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Check
											</label>
											<Dropdown
												className="w-100"
												placeholder={t("check")}
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
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
												value={formikEmployee.values?.profile?.check}
												onChange={(e) =>
													formikEmployee.setFieldValue("profile.check", e.target.value)
												}
											/>
										</div>
										<div className="d-flex flex-column col-6" style={{ gap: "4px" }}>
											<label
												className="form-label"
												style={{
													fontSize: "16px",
													fontWeight: "600",
												}}
											>
												<span style={{ color: "#FF3C32", fontSize: "16px", fontWeight: "600" }}>
													*
												</span>
												Check and bonus
											</label>
											<Dropdown
												className="w-100"
												placeholder={t("checkandbonus")}
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
												style={{
													border: "1px solid #CCCED5",
													borderRadius: "4px",
													padding: "6px",
													height: "60px",
												}}
												value={formikEmployee.values?.profile?.checkAndBonus}
												onChange={(e) =>
													formikEmployee.setFieldValue(
														"profile.checkAndBonus",
														e.target.value
													)
												}
											/>
										</div>
									</div>
									<div className="d-flex flex-column" style={{ gap: "4px" }}>
										<label
											className="form-label"
											style={{
												fontSize: "16px",
												fontWeight: "600",
											}}
										>
											Color
										</label>
										<WtcInputChooseColor
											hiddenLabel
											action={"INS"}
											target={PageTarget.employee}
											formik={formikEmployee}
											value={formikEmployee.values.color || ""}
											field="color"
										/>
									</div>
								</AccordionTab>
							</Accordion>
						</div>
					) : action === "UPD" ? (
						<TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
							<TabPanel header="Information">
								<div
									className="accordionSidebar"
									style={{
										marginTop: "20px",
										marginBottom: "100px",
									}}
								>
									<Accordion
										activeIndex={[0, 1]}
										multiple
										style={{ display: "flex", flexDirection: "column", gap: "20px" }}
									>
										<AccordionTab header="CONTACT">
											<div className="row g-3">
												<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														First name
													</label>
													<input
														type="text"
														className="form-control"
														placeholder={t("firstName")}
														required
														value={formikEmployee.values?.profile?.firstName}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.firstName",
																e.target.value
															)
														}
														maxLength={20}
														onClick={() => handleAddValue("firstName", values, setValues)}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors.profile?.firstName && (
														<small className="p-error">
															{formikEmployee.errors.profile.firstName as string}
														</small>
													)}
												</div>
												<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														Middle name
													</label>
													<input
														type="text"
														className="form-control"
														placeholder={t("middleName")}
														required
														value={formikEmployee.values?.profile?.middleName}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.middleName",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
												</div>
												<div className="col-4 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Last name
													</label>
													<input
														type="text"
														className="form-control"
														placeholder={t("lastName")}
														required
														value={formikEmployee.values?.profile?.lastName}
														maxLength={20}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.lastName",
																e.target.value
															)
														}
														onClick={() => handleAddValue("lastName", values, setValues)}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors.profile?.lastName && (
														<small className="p-error">
															{formikEmployee.errors.profile.lastName as string}
														</small>
													)}
												</div>
											</div>
											<div className="mt-3 d-flex flex-column" style={{ gap: "4px" }}>
												<label
													className="form-label"
													style={{
														fontSize: "16px",
														fontWeight: "600",
													}}
												>
													<span
														style={{
															color: "#FF3C32",
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														*
													</span>
													Select gender
												</label>
												<Dropdown
													className="w-100"
													placeholder={t("gender")}
													options={[
														{ label: t("male"), value: "MALE" },
														{ label: t("female"), value: "FEMALE" },
														{ label: t("other"), value: "OTHER" },
													]}
													style={{
														border: "1px solid #CCCED5",
														borderRadius: "4px",
														padding: "6px",
														maxHeight: "60px",
													}}
													value={formikEmployee.values?.profile?.gender}
													onChange={(e) =>
														formikEmployee.setFieldValue("profile.gender", e.target.value)
													}
												/>
												{formikEmployee.errors.profile?.gender && (
													<small className="p-error">
														{formikEmployee.errors.profile.gender as string}
													</small>
												)}
											</div>

											<div className="row g-3 mt-2">
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Phone number
													</label>
													<div className="d-flex gap-2">
														<PhoneInput
															country={"us"}
															enableSearch
															disableSearchIcon
															containerStyle={{
																width: "100%",
																height: "60px",
															}}
															inputStyle={{
																width: "100%",
																height: "60px",
																paddingLeft: "100px",
															}}
															value={formikEmployee.values?.profile?.phone}
															onChange={(e) =>
																formikEmployee.setFieldValue("profile.phone", e)
															}
															onClick={() => handleAddValue("phone", values, setValues)}
														/>
													</div>
													{formikEmployee.errors.profile?.phone && (
														<small className="p-error">
															{formikEmployee.errors.profile.phone as string}
														</small>
													)}
												</div>
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Email
													</label>
													<input
														type="email"
														className="form-control"
														placeholder="Email"
														required
														value={formikEmployee.values?.profile?.email}
														maxLength={20}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.email",
																e.target.value
															)
														}
														onClick={() => handleAddValue("email", values, setValues)}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors.profile?.email && (
														<small className="p-error">
															{formikEmployee.errors.profile.email as string}
														</small>
													)}
												</div>
											</div>

											<div className="row g-3 mt-2">
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Username
													</label>
													<input
														type="text"
														className="form-control"
														placeholder={t("username")}
														required
														value={formikEmployee.values?.username}
														maxLength={20}
														onChange={(e) =>
															formikEmployee.setFieldValue("username", e.target.value)
														}
														onClick={() => handleAddValue("username", values, setValues)}
														disabled={dialogMode == "add" ? false : true}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors?.username && (
														<small className="p-error">
															{formikEmployee.errors.username as string}
														</small>
													)}
												</div>
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Role
													</label>
													<Dropdown
														className="w-100"
														options={roleState.list
															.filter((item: any) => item.status?.code === "ACTIVE")
															.map((item: any) => {
																return { label: item.name, value: item._id };
															})}
														required
														placeholder={t("role")}
														value={formikEmployee.values?.roleId}
														onChange={(e) =>
															formikEmployee.setFieldValue("roleId", e.target.value)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors?.roleId && (
														<small className="p-error">
															{formikEmployee.errors.roleId as string}
														</small>
													)}
												</div>
											</div>
										</AccordionTab>
										<AccordionTab header="ADDRESS">
											<div className="mb-3">
												<div className="mb-3 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Address 1
													</label>
													<input
														type="text"
														placeholder={t("address") + " 1"}
														maxLength={50}
														className="form-control"
														value={formikEmployee.values?.profile?.street1}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.street1",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors.profile?.street1 && (
														<small className="p-error">
															{formikEmployee.errors.profile.street1 as string}
														</small>
													)}
												</div>
												<div className="mb-3 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														Address 2 (optional)
													</label>
													<input
														type="text"
														placeholder={t("address") + " 2"}
														maxLength={50}
														className="form-control"
														value={formikEmployee.values?.profile?.street2}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.street2",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
												</div>
												<div className="row g-3 mb-3">
													<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
														<label
															className="form-label"
															style={{
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															<span
																style={{
																	color: "#FF3C32",
																	fontSize: "16px",
																	fontWeight: "600",
																}}
															>
																*
															</span>
															State
														</label>
														<Dropdown
															className="w-100"
															placeholder={t("state")}
															options={states}
															value={formikEmployee.values?.profile?.state}
															onChange={(e) =>
																formikEmployee.setFieldValue(
																	"profile.state",
																	e.target.value
																)
															}
															style={{
																border: "1px solid #CCCED5",
																borderRadius: "4px",
																padding: "6px",
																height: "60px",
															}}
														/>
														{formikEmployee.errors.profile?.state && (
															<small className="p-error">
																{formikEmployee.errors.profile.state as string}
															</small>
														)}
													</div>
													<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
														<label
															className="form-label"
															style={{
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															<span
																style={{
																	color: "#FF3C32",
																	fontSize: "16px",
																	fontWeight: "600",
																}}
															>
																*
															</span>
															City
														</label>
														<input
															type="text"
															placeholder={t("city")}
															maxLength={50}
															className="form-control"
															value={formikEmployee.values?.profile?.city}
															onChange={(e) =>
																formikEmployee.setFieldValue(
																	"profile.city",
																	e.target.value
																)
															}
															style={{
																border: "1px solid #CCCED5",
																borderRadius: "4px",
																padding: "12px",
																height: "60px",
															}}
														/>
														{formikEmployee.errors.profile?.city && (
															<small className="p-error">
																{formikEmployee.errors.profile.city as string}
															</small>
														)}
													</div>
												</div>
												<div className="d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Zipcode
													</label>
													<input
														type="text"
														placeholder={t("zipcode")}
														className="form-control"
														value={formikEmployee.values?.profile?.zipcode}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.zipcode",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "12px",
															height: "60px",
														}}
													/>
													{formikEmployee.errors.profile?.zipcode && (
														<small className="p-error">
															{formikEmployee.errors.profile.zipcode as string}
														</small>
													)}
												</div>
											</div>
										</AccordionTab>
									</Accordion>
								</div>
							</TabPanel>
							<TabPanel header="Setting">
								<div
									className="accordionSidebar"
									style={{
										marginTop: "20px",
										marginBottom: "100px",
									}}
								>
									<Accordion activeIndex={0} multiple>
										<AccordionTab header="EMPLOYEE SETTINGS">
											<div className="mb-3 row">
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Open draw <span>(No sale)</span>
													</label>
													<Dropdown
														className="w-100"
														placeholder={t("opendraw")}
														options={[
															{ label: t("yes"), value: "YES" },
															{ label: t("no"), value: "NO" },
														]}
														value={formikEmployee.values?.profile?.openDraw}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.openDraw",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
													/>
												</div>
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Sell gift card
													</label>
													<Dropdown
														className="w-100"
														placeholder={t("sellgiftcard")}
														options={[
															{ label: t("yes"), value: "YES" },
															{ label: t("no"), value: "NO" },
														]}
														value={formikEmployee.values?.profile?.selfGiftCard}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.selfGiftCard",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
													/>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Payment type
													</label>
													<Dropdown
														className="w-100"
														placeholder={t("paymenttype")}
														options={[
															{ label: t("weekpay"), value: "WEEKPAY" },
															{ label: t("hourpay"), value: "HOURPAY" },
														]}
														value={formikEmployee.values?.profile?.paymentType}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.paymentType",
																e.target.value
															)
														}
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
													/>
												</div>
												<div className="col-6 d-flex flex-column" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Payment value
													</label>
													<div className="p-inputgroup">
														<span
															className="p-inputgroup-addon"
															style={{
																backgroundColor: "white",
															}}
														>
															$
														</span>
														<input
															type="number"
															className="form-control"
															placeholder={t("paymentvalue")}
															max={10000}
															style={{
																borderTop: "1px solid #CCCED5",
																borderBottom: "1px solid #CCCED5",
																borderLeft: "none",
																borderRight: "none",
																borderRadius: "0",
																padding: "12px",
																height: "60px",
																textAlign: "right",
																outline: "none",
															}}
															value={formikEmployee.values?.profile?.paymentValue}
															onChange={(e) =>
																formikEmployee.setFieldValue(
																	"profile.paymentValue",
																	e.target.value
																)
															}
														/>
														<span className="p-inputgroup-addon">USD</span>
													</div>
												</div>
											</div>
											<div className="d-flex flex-column mb-3" style={{ gap: "4px" }}>
												<label
													className="form-label"
													style={{
														fontSize: "16px",
														fontWeight: "600",
													}}
												>
													<span
														style={{
															color: "#FF3C32",
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														*
													</span>
													Compensation
												</label>
												<Dropdown
													className="w-100"
													placeholder={t("compensation")}
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
													style={{
														border: "1px solid #CCCED5",
														borderRadius: "4px",
														padding: "6px",
														height: "60px",
													}}
													value={formikEmployee.values?.profile?.compensation}
													onChange={(e) =>
														formikEmployee.setFieldValue(
															"profile.compensation",
															e.target.value
														)
													}
												/>
											</div>
											<div className="row mb-3">
												<div className="d-flex flex-column col-6" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Check
													</label>
													<Dropdown
														className="w-100"
														placeholder={t("check")}
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
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
														value={formikEmployee.values?.profile?.check}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.check",
																e.target.value
															)
														}
													/>
												</div>
												<div className="d-flex flex-column col-6" style={{ gap: "4px" }}>
													<label
														className="form-label"
														style={{
															fontSize: "16px",
															fontWeight: "600",
														}}
													>
														<span
															style={{
																color: "#FF3C32",
																fontSize: "16px",
																fontWeight: "600",
															}}
														>
															*
														</span>
														Check and bonus
													</label>
													<Dropdown
														className="w-100"
														placeholder={t("checkandbonus")}
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
														style={{
															border: "1px solid #CCCED5",
															borderRadius: "4px",
															padding: "6px",
															height: "60px",
														}}
														value={formikEmployee.values?.profile?.checkAndBonus}
														onChange={(e) =>
															formikEmployee.setFieldValue(
																"profile.checkAndBonus",
																e.target.value
															)
														}
													/>
												</div>
											</div>
											<div className="d-flex flex-column" style={{ gap: "4px" }}>
												<label
													className="form-label"
													style={{
														fontSize: "16px",
														fontWeight: "600",
													}}
												>
													Color
												</label>
												<WtcInputChooseColor
													hiddenLabel
													action={"INS"}
													target={PageTarget.employee}
													formik={formikEmployee}
													value={formikEmployee.values.color || ""}
													field="color"
												/>
											</div>
										</AccordionTab>
									</Accordion>
								</div>
							</TabPanel>
						</TabView>
					) : (
						<></>
					)}
				</div>

				{action === "INS" && activeIndex === 0 ? (
					<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
						<div className="d-flex justify-content-end">
							<button
								onClick={() => {
									formikEmployee.validateForm().then((errors) => {
										if (Object.keys(errors).length === 0) {
											setActiveIndex(1);
										} else {
											console.log("Form has errors", errors);
										}
									});
								}}
								style={{
									padding: "16px 20px",
									backgroundColor: "#1160B7",
									border: "1px solid #8FAFF6",
									borderRadius: "8px",
									color: "white",
								}}
							>
								Next →
							</button>
						</div>
					</div>
				) : action === "INS" && activeIndex === 1 ? (
					<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
						<div className="d-flex justify-content-end gap-2">
							<button
								onClick={() => setActiveIndex(0)}
								style={{
									padding: "16px 20px",
									backgroundColor: "white",
									border: "1px solid #CCCED5",
									borderRadius: "8px",
									color: "#21242B",
								}}
							>
								← Back to previous
							</button>
							<button
								onClick={() => {
									formikEmployee.handleSubmit();
								}}
								style={{
									padding: "16px 20px",
									backgroundColor: "#1160B7",
									border: "1px solid #8FAFF6",
									borderRadius: "8px",
									color: "white",
								}}
							>
								Save
							</button>
						</div>
					</div>
				) : action === "UPD" ? (
					<div className="position-absolute bottom-0 end-0 p-3 bg-white border-top w-100">
						<div className="d-flex justify-content-end gap-2">
							<button
								onClick={() => {
									closeDialog();
									// warningWithConfirm({
									// 	title: t("do_you_delete"),
									// 	text: "",
									// 	confirmButtonText: t("Delete"),
									// 	confirm: () => handleDeleteEmployee(userState.item ? userState.item._id : ""),
									// });
									setVisibleConfirm(true);
								}}
								className="btn btn-outline-danger"
							>
								Delete
							</button>
							<button
								onClick={() => {
									dispatch(selectItem(formikEmployee.values));
									formikEmployee.handleSubmit();
								}}
								className="btn btn-outline-secondary py-2 px-4"
								style={{
									color: isDisabled ? "#9A9EA7" : "#FFFFFF",
									backgroundColor: isDisabled ? "#F0F2F4" : "#1160B7",
								}}
								disabled={isDisabled}
							>
								Save
							</button>
						</div>
					</div>
				) : (
					<></>
				)}
			</Sidebar>
			<Dialog
				header={<div style={{ padding: "10px 0" }}>Delete this information?</div>}
				visible={visibleConfirm}
				style={{ width: "664px" }}
				onHide={() => {
					if (!visibleConfirm) return;
					setVisibleConfirm(false);
				}}
				footer={
					<div
						className="d-flex align-items-center justify-content-end"
						style={{ padding: "10px 0", borderTop: "1px solid #F0F2F4" }}
					>
						<Button
							label="Cancel"
							onClick={() => setVisibleConfirm(false)}
							style={{
								border: "1px solid #CCCED5",
								color: "#21242B",
								backgroundColor: "white",
								borderRadius: "8px",
								marginRight: "16px",
							}}
						/>
						<Button
							label="Yes"
							className="btn btn-primary"
							style={{
								backgroundColor: "#1160B7",
								borderRadius: "8px",
							}}
							onClick={() => {
								setVisibleConfirm(false);
								handleDeleteEmployee(userState.item ? userState.item._id : "");
							}}
							autoFocus
						/>
					</div>
				}
			>
				<p
					style={{
						padding: "10px 0",
						fontWeight: "400",
						fontSize: "20px",
						lineHeight: "32px",
					}}
				>
					This action cannot be reverted. Are you sure to delete this employee's information?
				</p>
			</Dialog>
		</>
	);
};

export default SidebarEmployee;
