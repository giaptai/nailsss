import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../../app/hooks";
import WtcButton from "../../../components/commons/WtcButton";
import WtcInputPhone from "../../../components/commons/WtcInputPhone";
import WtcRoleButton from "../../../components/commons/WtcRoleButton";
import WtcRoleDropdownIconText from "../../../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../../../components/commons/WtcRoleInputIconText";
import WtcRoleInputIconNumber from "../../../components/commons/WtcRoleInputNumber";
import DynamicDialog from "../../../components/DynamicDialog";
import {
	checkEmptyAndUndefined,
	formatPhoneNumberSubmitDatabase,
	handleAddValue,
	PageTarget,
	StatusInitInprocessing,
} from "../../../const";
import { GiftcardModel } from "../../../models/category/Giftcard.model";
import { ListServiceSelectedModel } from "../../../models/category/ListServiceSelected.model";
import { updateListGiftCard } from "../../../slices/newOder.slice";
type PropsSellGiftCard = {
	onClose: VoidFunction;
};
export default function WtcSellGiftcard(props: PropsSellGiftCard) {
	const dispatch = useDispatch();
	const userState = useAppSelector((state) => state.user);
	const Employee = userState.list.find((item) => item._id == "667652ba52dfa29d0434835e");
	const [disableButtonSubmit, setdisableButtonSubmit] = useState(true);
	const [dialogVisible, setDialogVisible] = useState(true);
	const [values, setValues] = useState<string[]>([]);
	const [checkSubmitEnter, setCheckSubmitEnter] = useState(false);
	const storeSettingState = useAppSelector((state) => state.storeconfig);
	const getMaxValueAmountGifcard = (data: any): number => {
		const maxAmount = data.find((item: any) => item.key === "maxGiftcardAmount");
		return maxAmount ? Number(maxAmount.value) : 0;
	};
	const maxValueGiftCard = getMaxValueAmountGifcard(storeSettingState?.list || []);
	const formikGiftcard = useFormik<any>({
		initialValues: GiftcardModel.initial(),
		validate: (data) => {
			const errors: FormikErrors<GiftcardModel> = {};
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
			return errors;
		},
		onSubmit: (data) => {
			console.log(data);
			const submitData: any = {
				cardId: data.cardId,
				amount: data.amount,
				firstName: data.firstName || undefined,
				lastName: data.lastName || undefined,
				phone: formatPhoneNumberSubmitDatabase(data.phone),
				zipcode: data.zipcode || undefined,
				note: data.note || undefined,
				type: data.type,
				_id: undefined,
				history: undefined,
				remaining: undefined,
				status: undefined,
			};
			// dispatch(addGiftcard(submitData))
			closeDialog();
			const valuesArray = [submitData];
			const newItem = new ListServiceSelectedModel(
				Employee,
				[],
				valuesArray,
				uuidv4(),
				undefined,
				0,
				0,
				StatusInitInprocessing(),
				undefined,
				undefined
			);
			dispatch(updateListGiftCard(newItem));
			setValues([]);
		},
	});
	const closeDialog = async () => {
		setValues([]);
		setDialogVisible(false);
		setCheckSubmitEnter(false);
		formikGiftcard.resetForm();
	};

	useEffect(() => {
		if (!dialogVisible) {
			setTimeout(() => {
				props.onClose();
			}, 1000);
		}
	}, [dialogVisible, props]);
	useEffect(() => {
		if (
			checkEmptyAndUndefined(formikGiftcard.values.cardId) ||
			formikGiftcard.values.amount == "" ||
			formikGiftcard.values.amount == 0 ||
			formikGiftcard.values.amount == null ||
			checkEmptyAndUndefined(formikGiftcard.values.phone) ||
			checkEmptyAndUndefined(formikGiftcard.values.type)
		)
			setdisableButtonSubmit(true);
		else setdisableButtonSubmit(false);
	}, [formikGiftcard.values]);
	useEffect(() => {
		formikGiftcard.setFieldValue("type", "GIVE_STORE_CREDIT");
	}, []);

	// useEffect(() => {
	//     if (giftcardState.actionState) {
	//         switch (giftcardState.actionState.status!) {
	//             case "completed":
	//                 completed()
	//                 dispatch(resetActionState())
	//                 closeDialog()
	//                 if (giftcardState.createSellSuccess) {
	//                     const valuesArray = [giftcardState.createSellSuccess];
	//                     const newItem = new ListServiceSelectedModel(
	//                         Employee,
	//                         [],
	//                         valuesArray,
	//                         uuidv4(),
	//                         undefined,
	//                         0,
	//                         0,
	//                         StatusInitInprocessing(),
	//                         undefined
	//                     );
	//                     dispatch(updateListGiftCard(newItem));
	//                 }
	//                 break;
	//             case "loading":
	//                 processing()
	//                 break;
	//             case "failed":
	//                 failed(t(giftcardState.actionState.error!))
	//                 dispatch(resetActionState())
	//                 break;
	//         }
	//     }

	// }, [giftcardState.actionState])

	return (
		<>
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
					mode={"add"}
					position={"center"}
					title={t("giftcard")}
					okText={t("Submit")}
					cancelText={t("Cancel")}
					footer={
						<div className=" d-flex wtc-bg-white align-items-center justify-content-end">
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
								{
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
								}
							</div>
						</div>
					}
					draggable={false}
					resizeable={false}
					onClose={() => closeDialog()}
					body={
						<div className="pt-3">
							<div className="row">
								<div
									className="col-sm-12 mb-2"
									onClick={() => handleAddValue("cardId", values, setValues)}
								>
									<WtcRoleInputIconText
										action={"INS"}
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
										action={"INS"}
										code="type"
										target={PageTarget.giftcard}
										required
										filtler={false}
										disabled={true}
										placeHolder={t("typeofcard")}
										leadingIcon={"ri-gift-line"}
										options={[{ label: t("givestorecreditgift"), value: "GIVE_STORE_CREDIT" }]}
										field="type"
										formik={formikGiftcard}
										value={"GIVE_STORE_CREDIT"}
									/>
								</div>
								<div
									className="col-sm-6 mb-2"
									onClick={() => handleAddValue("amount", values, setValues)}
								>
									<WtcRoleInputIconNumber
										action={"INS"}
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
										action={"INS"}
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
										action={"INS"}
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
										action={"INS"}
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
										action={"INS"}
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
										action={"INS"}
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
					}
					closeIcon
				/>
			</div>
		</>
	);
}
