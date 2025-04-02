import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import { MenuModel } from "../../models/category/Menu.model";
import { ServiceModel } from "../../models/category/Service.model";
import DynamicDialog from "../DynamicDialog";
import LoadingIndicator from "../Loading";
import WtcButton from "../commons/WtcButton";
import WtcCard from "../commons/WtcCard";
import WtcDropdownIconText from "../commons/WtcDropdownIconText";
import WtcEmptyBox from "../commons/WtcEmptyBox";

type PropsSellGiftCard = {
	onClose: VoidFunction;
	onSubmit: (service?: ServiceModel) => void;
};
export default function WtcOtherCharges(props: PropsSellGiftCard) {
	const menuState = useAppSelector((state) => state.menu);
	const [dialogVisible, setDialogVisible] = useState(true);
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const [keyboard, setKeyboard] = useState("");
	const [storePrice, setStorePrice] = useState<string>("0");
	const [employeePrice, setEmployeePrice] = useState<string>("0");
	console.log("🚀 ~ WtcOtherCharges ~ employeePrice:", employeePrice);
	const newListMenu = [...menuState.filteredActiveOrder];
	newListMenu.unshift({
		name: "Other Charges",
		_id: "",
		code: "#",
		color: "",
		status: {
			code: "ACTIVE",
			value: "ACTIVE",
		},
	});
	const closeDialog = async () => {
		setDialogVisible(false);
	};
	const handleKeyboardAction = (key: string) => {
		setKeyboard(key);
	};

	const formik = useFormik<any>({
		initialValues: ServiceModel.initialOtherCharges(),
		validateOnChange: false,
		validateOnBlur: false,
		validate: (data) => {
			const errors: FormikErrors<ServiceModel> = {};

			if (!data.displayName) {
				errors.displayName = "y";
			}
			if (!data.name) {
				errors.name = "y";
			}
			if (!data.tax) {
				errors.tax = "y";
			}
			if (!data.turn) {
				errors.turn = "y";
			}
			return errors;
		},
		onSubmit: (data) => {
			const service: ServiceModel = {
				_id: uuidv4(),
				displayName: data?.displayName || "",
				name: data?.displayName || "",
				storePrice: data?.storePrice || 0,
				employeePrice: Number(employeePrice) || 0,
				tax: data?.tax || 0,
				askForPrice: "NO",
				menu: MenuModel.initial(),
				menuId: "",
				turn: data?.turn || 0,
				sortOrder: 0,
				type: "SERVICE_OTHER_CHARGES",
				status: data.status,
				unit: 1,
				position: -1,
				totalPriceOrder: data?.storePrice,
				totalPriceEmployee: Number(employeePrice) || 0,
				color: data?.color || "",
				isShowCheckin: "NO",
				idOrder: "",
				note: "",
				employeeSelect: undefined,
			};
			try {
				props.onSubmit(service);
				closeDialog();
			} catch (error) {
				console.error("Error during onSubmit:", error);
			}
		},
	});

	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 300);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (keyboard !== "") {
			switch (keyboard) {
				case "BACK":
					if (storePrice.length === 1) {
						setStorePrice("0");
					} else {
						const value = storePrice.slice(0, -1);
						setStorePrice(value);
					}
					break;
				case ".":
					const existed = storePrice.includes(".");
					if (!existed) {
						const value = storePrice + ".";
						setStorePrice(value);
					}
					break;
				case "$15":
					setStorePrice("15");
					break;
				case "$10":
					setStorePrice("10");
					break;
				case "$20":
					setStorePrice("20");
					break;
				case "$25":
					setStorePrice("25");
					break;
				case "$30":
					setStorePrice("30");
					break;
				case "$35":
					setStorePrice("35");
					break;
				case "$40":
					setStorePrice("40");
					break;
				case "$45":
					setStorePrice("45");
					break;
				case "$50":
					setStorePrice("50");
					break;
				case "$100":
					setStorePrice("100");
					break;
				case "$150":
					setStorePrice("150");
					break;
				case "$200":
					setStorePrice("200");
					break;
				case "Clear":
					setStorePrice("0");
					break;
				default:
					const value = storePrice === "0" ? keyboard : storePrice + keyboard;
					const existedDot = value.toString().includes(".");
					if (existedDot) {
						const stringArr = storePrice.toString().split(".");
						const decimal = stringArr[1];
						if (decimal.toString().length < 2) {
							setStorePrice(value);
						}
					} else {
						setStorePrice(value);
					}
					break;
			}
		}

		setTimeout(() => {
			setKeyboard("");
		}, 100);
	}, [keyboard]);
	useEffect(() => {
		formik.setFieldValue("storePrice", Number(storePrice));
		setEmployeePrice(storePrice);
	}, [storePrice]);
	console.log("🚀 ~ useEffect ~ formik:", formik);
	return (
		<>
			<div
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
					}
				}}
			>
				<DynamicDialog
					width={isMobile ? "90vw" : "85vw"}
					// minHeight={"100vh"}
					height={screenSize.height - 130}
					visible={dialogVisible}
					mode={"add"}
					position={"center"}
					title={t("other_charges")}
					okText=""
					cancelText=""
					draggable={false}
					isBackgroundGray={true}
					resizeable={false}
					onClose={closeDialog}
					body={
						<div className="row h-100 w-100 py-1 ps-2">
							<div className="col-md-10 row h-100">
								<div className="col-md-4 h-100">
									<label htmlFor="currency-us">{t("storeprice")}</label>
									<br />
									<InputNumber
										inputId="currency-us"
										value={Number(storePrice)}
										onValueChange={(e) => setStorePrice(e.value?.toString() || "0")}
										mode="currency"
										currency="USD"
										locale="en-US"
										readOnly
										className="w-100"
										autoFocus={false}
									/>
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"1"}
												className={`w-100 ${
													keyboard === "1"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("1")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"2"}
												className={`w-100 ${
													keyboard === "2"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("2")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"3"}
												className={`w-100 ${
													keyboard === "3"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("3")}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"4"}
												className={`w-100 ${
													keyboard === "4"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("4")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"5"}
												className={`w-100 ${
													keyboard === "5"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("5")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"6"}
												className={`w-100 ${
													keyboard === "6"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("6")}
											/>
										</div>
									</div>
									<div className="row py-1">
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"7"}
												className={`w-100 ${
													keyboard === "7"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("7")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"8"}
												className={`w-100 ${
													keyboard === "8"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("8")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"9"}
												className={`w-100 ${
													keyboard === "9"
														? "text-white custom-primary-outline"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("9")}
											/>
										</div>
									</div>
									<div className="row ">
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"."}
												className={`w-100 ${
													keyboard === "."
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction(".")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={"0"}
												className={`w-100 ${
													keyboard === "0"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => handleKeyboardAction("0")}
											/>
										</div>
										<div className="col-sm-4 ps-0">
											<WtcButton
												label={""}
												icon="ri-delete-back-2-line"
												className={`w-100 ${
													keyboard === "BACK"
														? "text-white wtc-bg-primary"
														: "text-black wtc-bg-secondary-2"
												}`}
												fontSize={24}
												height={(screenSize.height - 350) / 4.1}
												onClick={() => setKeyboard("BACK")}
											/>
										</div>
									</div>
									{/* </div> */}
								</div>
								<div className="col-md-4 h-100">
									<div className="field col-12 md:col-3">
										<label htmlFor="horizontal">{t("emplyprice")}</label>
										<InputNumber
											inputId="horizontal"
											value={Number(employeePrice)}
											onValueChange={(e) => setEmployeePrice(e.value?.toString() || "0")}
											showButtons
											buttonLayout="horizontal"
											step={1}
											decrementButtonClassName="p-button-danger radius-left"
											incrementButtonClassName="my-custom-primary-outline-active radius-right"
											incrementButtonIcon="pi pi-plus"
											decrementButtonIcon="pi pi-minus"
											mode="currency"
											currency="USD"
											onInput={(e) => e.preventDefault()}
											onKeyDown={(e) => e.preventDefault()}
										/>
									</div>
									<div className="h-75">
										<div className="row py-1">
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$10"}
													className={`w-100 ${
														keyboard === "$10"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$10")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$15"}
													className={`w-100 ${
														keyboard === "$15"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$15")}
												/>
											</div>

											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$20"}
													className={`w-100 ${
														keyboard === "$20"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$20")}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$25"}
													className={`w-100 ${
														keyboard === "$25"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$25")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$30"}
													className={`w-100 ${
														keyboard === "$30"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$30")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$35"}
													className={`w-100 ${
														keyboard === "$35"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$35")}
												/>
											</div>
										</div>
										<div className="row py-1">
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$40"}
													className={`w-100 ${
														keyboard === "$40"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$40")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$45"}
													className={`w-100 ${
														keyboard === "$45"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$45")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$50"}
													className={`w-100 ${
														keyboard === "$50"
															? "text-white custom-primary-outline"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$50")}
												/>
											</div>
										</div>
										<div className="row ">
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$100"}
													className={`w-100 ${
														keyboard === "$100"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$100")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$150"}
													className={`w-100 ${
														keyboard === "$150"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => handleKeyboardAction("$150")}
												/>
											</div>
											<div className="col-sm-4 ps-0">
												<WtcButton
													label={"$200"}
													className={`w-100 ${
														keyboard === "$200"
															? "text-white wtc-bg-primary"
															: "text-black wtc-bg-secondary"
													}`}
													fontSize={24}
													height={(screenSize.height - 265) / 6}
													onClick={() => setKeyboard("$200")}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-4 h-100">
									<WtcDropdownIconText
										disabled={false}
										filtler
										required
										placeHolder={t("turncount")}
										leadingIcon={"ri-tumblr-line"}
										options={[
											{ label: "0", value: "0" },
											{ label: "0.25", value: "0.25" },
											{ label: "0.5", value: "0.5" },
											{ label: "0.75", value: "0.75" },
											{ label: "1", value: "1" },
											{ label: "1.25", value: "1.25" },
											{ label: "1.5", value: "1.5" },
											{ label: "1.75", value: "1.75" },
											{ label: "2", value: "2" },
										]}
										field="turn"
										formik={formik}
										value={formik.values.turn}
									/>
									<div className="mt-2">
										<WtcDropdownIconText
											filtler
											disabled={false}
											required
											placeHolder={t("tax")}
											leadingIcon={"ri-tumblr-line"}
											options={[
												{ label: t("yes"), value: "YES" },
												{ label: t("no"), value: "NO" },
											]}
											field="tax"
											formik={formik}
											value={formik.values.tax}
										/>
									</div>
								</div>
							</div>
							<div className="col-md-2 h-100">
								<WtcCard
									borderRadius={12}
									classNameBody="flex-grow-1 px-0 my-0 h-100"
									body={
										<div className={`d-flex flex-column h-100`}>
											<div
												className="p-2"
												style={{
													height: bodyHeight - 288,
													overflowY: "auto",
													overflowX: "hidden",
												}}
											>
												{menuState.fetchState.status == "loading" ? (
													<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
														<LoadingIndicator />
													</div>
												) : newListMenu.length > 0 ? (
													newListMenu.map((category) => {
														return (
															<div key={category._id} className="field-radiobutton mt-2">
																<RadioButton
																	inputId={category._id}
																	name="name"
																	value={category.name}
																	onChange={(e) =>
																		formik.setFieldValue("displayName", e.value)
																	}
																	checked={
																		formik.values.displayName === category.name
																	}
																/>
																<label htmlFor={category._id}>
																	&ensp;{category.name}
																</label>
															</div>
														);
													})
												) : (
													<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
														<WtcEmptyBox />
													</div>
												)}
											</div>
										</div>
									}
									className="h-100"
								/>
							</div>
						</div>
					}
					closeIcon
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
							<Button
								type="button"
								label={t("action.close")}
								className="me-3 bg-white text-blue dialog-cancel-button"
								onClick={closeDialog}
							/>
							<WtcButton
								label={t("action.add")}
								className="wtc-bg-primary text-white dialog-cancel-button"
								icon="ri ri-add-line"
								width={100}
								onClick={formik.handleSubmit}
								fontSize={18}
								borderRadius={11}
							/>
						</div>
					}
				/>
			</div>
		</>
	);
}
