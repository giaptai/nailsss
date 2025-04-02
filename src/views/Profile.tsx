import { FormikErrors, useFormik } from "formik";
import { t } from "i18next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import heart from "../assets/svg/heart.svg";
import email from "../assets/svg/mail.svg";
import iconUser from "../assets/svg/user-settings.svg";
import MenuProfile from "../components/MenuProfile";
import WtcCard from "../components/commons/WtcCard";
import WtcInputIconText from "../components/commons/WtcInputIconText";
import WtcInputPhone from "../components/commons/WtcInputPhone";
import WtcRoleButton from "../components/commons/WtcRoleButton";
import WtcRoleDropdownIconState from "../components/commons/WtcRoleDropdownIconState";
import WtcRoleDropdownIconText from "../components/commons/WtcRoleDropdownIconText";
import WtcRoleInputIconText from "../components/commons/WtcRoleInputIconText";
import {
	checkEmptyAndUndefined,
	CheckRoleWithAction,
	formatPhoneNumberSubmitDatabase,
	PageTarget,
	states,
} from "../const";
import { setProfile } from "../slices/app.slice";
import { changeInfoProfile, resetActionState } from "../slices/profile.slice";
import { completed, failed, processing } from "../utils/alert.util";
export default function Profile() {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.app.user);
	const authState = useAppSelector((state) => state.auth);
	const profileState = useAppSelector((state) => state.profile);
	const formik = useFormik<any>({
		initialValues: user?.profile ?? {},
		validate: (data) => {
			const errors: FormikErrors<any> = {};
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
			return errors;
		},
		onSubmit: (data) => {
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
				email: data.email === "" ? null : data.email,
				gender: data.gender,
			};
			console.log({ _id: data._id, data: submitData });
			dispatch(changeInfoProfile({ data: submitData }));
		},
	});
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status) {
				case "completed":
					completed();
					dispatch(resetActionState());
					dispatch(setProfile(formik.values));
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
	return (
		<div className="row h-100">
			<div className="col-md-3 my-profile-menu">
				<MenuProfile menuTab={"general"} />
			</div>
			<div className="col-md-9 h-100" style={{ fontSize: 18 }}>
				<div className="col-md-12 h-100">
					<WtcCard
						className="h-100"
						title={<div className="my-title-color">{t("accinfo")}</div>}
						tools={<></>}
						classNameBody="flex-grow-1 px-1 pb-2 mb-2"
						body={
							<div className="row mt-3">
								<div className="col-sm-12">
									<WtcInputIconText
										disabled
										placeHolder={t("username")}
										required
										field="username"
										value={user.username}
										formik={formik}
										leadingIconImage={iconUser}
									/>
								</div>

								<div className="col-sm-6 mt-2">
									<WtcRoleInputIconText
										target={PageTarget.profile}
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
										target={PageTarget.profile}
										code="firstName"
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
										target={PageTarget.profile}
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
										target={PageTarget.profile}
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
										target={PageTarget.profile}
										code="city"
										maxLength={30}
										action="UPD"
										placeHolder={t("city")}
										required
										leadingIcon={"ri-map-fill"}
										field="city"
										formik={formik}
										value={formik.values?.city}
									/>
								</div>
								<div className="col-sm-3 mt-2">
									<WtcRoleDropdownIconState
										filtler
										target={PageTarget.profile}
										code="state"
										action="UPD"
										required
										disabled={false}
										placeHolder={t("state")}
										leadingIcon={"ri-pie-chart-fill"}
										options={states}
										field="state"
										formik={formik}
										value={formik.values?.state}
									/>
								</div>
								<div className="col-sm-3 mt-2">
									<WtcRoleInputIconText
										target={PageTarget.profile}
										type="number"
										code="zipcode"
										action="UPD"
										placeHolder={t("zipcode")}
										required
										mask="99999"
										slotChar="#####"
										leadingIcon={"ri-barcode-fill"}
										field="zipcode"
										formik={formik}
										value={formik.values?.zipcode}
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<WtcInputPhone
										target={PageTarget.profile}
										code="zipcode"
										action="UPD"
										placeHolder={t("phone")}
										type="tel"
										required
										mask="(999)999-9999"
										slotChar="(###)###-####"
										leadingIcon={"ri-phone-fill"}
										field="phone"
										formik={formik}
										value={formik.values.phone}
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<WtcRoleDropdownIconText
										target={PageTarget.profile}
										code="gender"
										action="UPD"
										options={[
											{ label: t("male"), value: "MALE" },
											{ label: t("female"), value: "FEMALE" },
											{ label: t("other"), value: "OTHER" },
										]}
										placeHolder={t("gender")}
										leadingIconImage={heart}
										value={user?.data?.profile?.gender}
										disabled={false}
										formik={formik}
										field="gender"
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<WtcRoleInputIconText
										target={PageTarget.profile}
										code="email"
										action="UPD"
										placeHolder={t("email")}
										type="email"
										required
										field="email"
										formik={formik}
										leadingIconImage={email}
									/>
								</div>
							</div>
						}
						hideBorder={false}
						footer={
							CheckRoleWithAction(authState, PageTarget.profile, "UPD") ? (
								<>
									<WtcRoleButton
										target={PageTarget.profile}
										action="UPD"
										label={t("action.update")}
										icon="ri-edit-line"
										className="wtc-bg-primary text-white"
										height={45}
										fontSize={16}
										onClick={formik.handleSubmit}
									/>
								</>
							) : undefined
						}
					/>
				</div>
			</div>
		</div>
	);
}
