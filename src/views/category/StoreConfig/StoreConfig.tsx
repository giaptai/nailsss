import { useFormik } from "formik";
import { t } from "i18next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import WtcCard from "../../../components/commons/WtcCard";
import WtcInputPhone from "../../../components/commons/WtcInputPhone";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import { CheckRoleWithAction, formatPhoneNumberSubmitDatabase, KeyStoreConfig, PageTarget } from "../../../const";
import {
	getStoreConfig,
	resetActionState,
	resetActionStateStoreconfig,
	resetFetchStateStoreconfig,
	updateStoreSetting,
} from "../../../slices/storeconfig.slice";
import { completed, failed, processing } from "../../../utils/alert.util";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
export default function StoreConfig() {
	const authState = useAppSelector((state) => state.auth);
	const dispatch = useDispatch();
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const initialValues: { [key: string]: any } = {};
	storeConfigState.list.forEach((item) => {
		if (item.key == KeyStoreConfig.isDeviceCreditCard) {
			initialValues[item.key] = item.value == true ? "YES" : "NO";
		} else initialValues[item.key] = item.value;
	});
	const formikStoreSetting = useFormik<any>({
		initialValues: initialValues || {},
		validate: (_data) => {},
		onSubmit: (data) => {
			if (formikStoreSetting.values?.taxRate > 10) {
				failed(t("error_maxTaxRate"));
				return;
			} else {
				const submitData = [];
				for (const [key, value] of Object.entries(data)) {
					if (value !== undefined && value !== null) {
						if (key === KeyStoreConfig.isDeviceCreditCard) {
							submitData.push({
								key: key,
								value: value === "YES" ? true : false,
								type: "STORE",
							});
						} else {
							submitData.push({
								key: key,
								value:
									key == KeyStoreConfig.phone
										? formatPhoneNumberSubmitDatabase(value.toString())
										: value,
								type: "STORE",
							});
						}
					}
				}
				dispatch(updateStoreSetting(submitData));
			}
		},
	});
	const formikBusinessInfo = useFormik<any>({
		initialValues: initialValues || {},
		validate: (_data) => {},
		onSubmit: (data) => {
			const submitData = [];
			for (const [key, value] of Object.entries(data)) {
				if (value !== undefined && value !== null) {
					if (key === KeyStoreConfig.isDeviceCreditCard) {
						submitData.push({
							key: key,
							value: value === "YES" ? true : false,
							type: "STORE",
						});
					} else {
						submitData.push({
							key: key,
							value:
								key == KeyStoreConfig.phone ? formatPhoneNumberSubmitDatabase(value.toString()) : value,
							type: "STORE",
						});
					}
				}
			}
			dispatch(updateStoreSetting(submitData));
		},
	});
	useEffect(() => {
		dispatch(getStoreConfig());
		dispatch(resetFetchStateStoreconfig());
		dispatch(resetActionStateStoreconfig());
	}, []);
	useEffect(() => {
		if (storeConfigState.actionState) {
			switch (storeConfigState.actionState.status!) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(getStoreConfig());
					break;
				case "loading":
					processing();
					break;
				case "failed":
					failed(t(storeConfigState.actionState.error!));
					dispatch(resetActionState());
					break;
			}
		}
	}, [storeConfigState.actionState]);
	return (
		<div className="row h-100">
			<div
				className="col-md-6 h-100"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						formikStoreSetting.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<WtcCard
					title={
						<div className="">
							<div className="d-flex justify-content-between align-items-center">
								<div className="one-line-ellipsis my-title-color">
									<i className="" style={{ fontSize: 26 }} /> {t("storesetting")}
								</div>
							</div>
						</div>
					}
					footer={
						CheckRoleWithAction(authState, PageTarget.storeconfig, "UPD") ? (
							<>
								<WtcRoleButton
									target={PageTarget.storeconfig}
									action="UPD"
									tabIndex={0}
									label={t("action.update")}
									icon="ri-edit-line"
									className="wtc-bg-primary text-white"
									height={45}
									minWidth={110}
									fontSize={16}
									onClick={() => formikStoreSetting.handleSubmit()}
								/>
							</>
						) : undefined
					}
					tools={<></>}
					body={
						<div className="row">
							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconNumber
									code={KeyStoreConfig.taxRate}
									target={PageTarget.storeconfig}
									action="UPD"
									focused
									maxValue={100}
									isPercent
									placeHolder={t("taxrate")}
									leadingIcon={"pi pi-cog"}
									field={KeyStoreConfig.taxRate}
									formik={formikStoreSetting}
									value={formikStoreSetting.values.taxrate}
								/>
							</div>
							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.taxName}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("taxname")}
									field={KeyStoreConfig.taxName}
									formik={formikStoreSetting}
									leadingIcon={"pi pi-cog"}
									value={formikStoreSetting.values.taxname}
								/>
							</div>

							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconNumber
									code={KeyStoreConfig.creditCardFeeAmount}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("creditcardfee")}
									isCurr
									minFractionDigits={2}
									maxFractionDigits={2}
									leadingIcon={"pi pi-cog"}
									field={KeyStoreConfig.creditCardFeeAmount}
									formik={formikStoreSetting}
									value={formikStoreSetting.values.creditcardamount}
								/>
							</div>

							{/* <div className="col-sm-6 mt-2">
								<WtcInputIconNumber
									placeHolder={t("creditcardfee")}
									isCurr
									minFractionDigits={2}
									maxFractionDigits={2}
									leadingIcon={"pi pi-cog"}
									field="creditCardFeeRate"
									formik={formikStoreSetting}
									value={formikStoreSetting.values.creditcardfee}
								/>
							</div> */}
							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconNumber
									code={KeyStoreConfig.tipOnCreditCard}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("tiponcreditcard")}
									maxValue={100}
									isPercent
									leadingIcon={"pi pi-cog"}
									field={KeyStoreConfig.tipOnCreditCard}
									formik={formikStoreSetting}
									value={formikStoreSetting.values.tiponcreditcard}
								/>
							</div>
							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconNumber
									code={KeyStoreConfig.maxGiftcardAmount}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("maxGiftcardAmount")}
									isCurr
									minFractionDigits={2}
									maxFractionDigits={2}
									leadingIcon={"pi pi-cog"}
									field={KeyStoreConfig.maxGiftcardAmount}
									formik={formikStoreSetting}
									value={formikStoreSetting.values.maxGiftcardAmount}
								/>
							</div>
							<div className="col-sm-6 mt-2">
								<WtcRoleDropdownIconText
									target={PageTarget.storeconfig}
									code={KeyStoreConfig.isDeviceCreditCard}
									action="UPD"
									disabled={false}
									placeHolder={t("conn_payment")}
									leadingIcon={"pi pi-cog"}
									options={[
										{ label: t("yes"), value: "YES" },
										{ label: t("no"), value: "NO" },
									]}
									field={KeyStoreConfig.isDeviceCreditCard}
									formik={formikStoreSetting}
									value={formikStoreSetting.values.isDeviceCreditCard}
								/>
							</div>
						</div>
					}
					hideBorder={false}
					className="h-100"
				/>
			</div>
			<div
				className="col-md-6 h-100"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						formikBusinessInfo.handleSubmit();
						e.preventDefault();
					}
				}}
			>
				<WtcCard
					title={
						<div className="">
							<div className="d-flex justify-content-between align-items-center">
								<div className="one-line-ellipsis my-title-color">
									<i className="" style={{ fontSize: 26 }} /> {t("businessinfo")}{" "}
								</div>
							</div>
						</div>
					}
					tools={<></>}
					footer={
						CheckRoleWithAction(authState, PageTarget.storeconfig, "UPD") ? (
							<>
								<WtcRoleButton
									target={PageTarget.storeconfig}
									action="UPD"
									tabIndex={0}
									label={t("action.update")}
									icon="ri-edit-line"
									className="wtc-bg-primary text-white"
									height={45}
									minWidth={110}
									fontSize={16}
									onClick={() => formikBusinessInfo.handleSubmit()}
								/>
							</>
						) : undefined
					}
					body={
						<div className="row">
							<div className="col-sm-12 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.name}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("businessname")}
									field="name"
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.name}
									leadingIcon={"ri-building-line"}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.street1}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("businessaddress") + " 1"}
									field={KeyStoreConfig.street1}
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.street1}
									leadingIcon={"ri-home-4-fill"}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.street2}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("businessaddress") + " 2"}
									field={KeyStoreConfig.street2}
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.street2}
									leadingIcon={"ri-home-4-fill"}
								/>
							</div>
							<div className="col-sm-6 mt-2">
								<WtcInputPhone
									code={KeyStoreConfig.phone}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("businessphone")}
									type="tel"
									mask="(999)999-9999"
									slotChar="(###)###-####"
									leadingIcon={"ri-phone-line"}
									field={KeyStoreConfig.phone}
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.phone}
								/>
							</div>
							<div className="col-sm-6 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.location}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("storelocation")}
									field={KeyStoreConfig.location}
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.location}
									leadingIcon={"ri-home-4-fill"}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<WtcRoleInputIconText
									code={KeyStoreConfig.posStationName}
									target={PageTarget.storeconfig}
									action="UPD"
									placeHolder={t("posstationname")}
									field={KeyStoreConfig.posStationName}
									formik={formikBusinessInfo}
									value={formikBusinessInfo.values.posStationName}
									leadingIcon={"ri-home-4-fill"}
								/>
							</div>
						</div>
					}
					hideBorder={false}
					className="h-100"
				/>
			</div>
		</div>
	);
}
