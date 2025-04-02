import { t } from "i18next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import MenuProfile from "../components/MenuProfile";
import WtcCard from "../components/commons/WtcCard";
import WtcRoleButton from "../components/commons/WtcRoleButton";
import WtcRolePassword from "../components/commons/WtcRolePassword";
import { CheckRoleWithAction, PageTarget } from "../const";
import { changePassword, resetActionStateChange } from "../slices/auth.slice";
import { completed, failed, processing } from "../utils/alert.util";
export default function ChangePassword() {
	const dispatch = useAppDispatch();
	const auth = useAppSelector((state) => state.auth);
	const [Opassword, setOPassword] = useState("");
	const [Npassword, setNPassword] = useState("");
	const [CFpassword, setCFPassword] = useState("");

	const handleChangePassword = () => {
		if (Opassword !== "" && Npassword !== "" && CFpassword !== "") {
			if (Npassword !== CFpassword) failed(t("Np-Cp-Unlike"));
			else {
				if (Npassword.length < 8) failed(t("Np-lenght"));
				else {
					const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{3,}$/;
					const isMatch = regex.test(Npassword);
					if (!isMatch) failed(t("pass-condition-character"));
					else {
						dispatch(
							changePassword({
								oldPassword: Opassword,
								newPassword: Npassword,
								confirmPassword: CFpassword,
							})
						);
					}
				}
			}
		} else failed(t("data-empty"));
	};

	// const handleKeyPress = (e: any) => {
	//     if (e.key === 'Enter') {
	//         // handleLogin()
	//     }
	// }
	useEffect(() => {
		if (auth.actionState) {
			switch (auth.actionState.status) {
				case "completed":
					completed();
					dispatch(resetActionStateChange());
					break;
				case "loading":
					processing();
					break;
				case "failed":
					if (auth.actionState?.message == "Invalid password!") {
						failed(t("auth.actionState.invalid-passold"));
						dispatch(resetActionStateChange());
						break;
					}
					failed(t(auth.actionState.message!));
					dispatch(resetActionStateChange());
					break;
			}
		}
	}, [auth.actionState]);
	return (
		<div className="row h-100">
			<div className="col-md-3 my-profile-menu">
				<MenuProfile menuTab={"changepassword"} />
			</div>
			<div className="col-md-9 h-100" style={{ fontSize: 18 }}>
				<WtcCard
					title={<div className="my-title-color">{t("chanepass")}</div>}
					tools={<></>}
					body={
						<>
							<div className="note">
								<span className="fw-bold text-danger">{t("note_pass")}:</span>
								<span className="fw-bold">&nbsp;{t("pass-condition")}</span>
								<ul className="ms-4 fw-normal">
									<li className="">{t("pass-condition-lenght")}</li>
									<li>{t("pass-condition-character")}</li>
									<li>{t("pass-condition-old")}</li>
								</ul>
							</div>
							<div className="row">
								<div className="col-md-6 mt-2">
									<div className=" my-margin-top">
										<WtcRolePassword
											action="UPD"
											target={PageTarget.profile}
											placeHolder="old-password-placeholder"
											floatLabel
											value={Opassword}
											onChange={function (value: string): void {
												setOPassword(value);
											}}
										/>
									</div>
									<div className=" my-margin-top">
										<WtcRolePassword
											action="UPD"
											target={PageTarget.profile}
											placeHolder="new-password-placeholder"
											floatLabel
											value={Npassword}
											onChange={function (value: string): void {
												setNPassword(value);
											}}
										/>
									</div>
									<div className=" my-margin-top">
										<WtcRolePassword
											action="UPD"
											target={PageTarget.profile}
											placeHolder="confirm-password-placeholder"
											floatLabel
											value={CFpassword}
											onChange={function (value: string): void {
												setCFPassword(value);
											}}
										/>
									</div>
								</div>
							</div>
						</>
					}
					hideBorder={false}
					className="h-100"
					footer={
						CheckRoleWithAction(auth, PageTarget.profile, "UPD") ? (
							<>
								<WtcRoleButton
									action="UPD"
									target={PageTarget.profile}
									label={t("chanepass")}
									icon="ri-edit-line"
									className="wtc-bg-primary text-white"
									height={45}
									fontSize={16}
									onClick={handleChangePassword}
								/>
							</>
						) : undefined
					}
				/>
			</div>
		</div>
	);
}
