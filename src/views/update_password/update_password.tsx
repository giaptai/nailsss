import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import logo from "../../assets/images/logo.png";
import WtcButton from "../../components/commons/WtcButton";
import WtcPassword from "../../components/commons/WtcPassword";
import { activeAccount, resetActionStateChange } from "../../slices/auth.slice";
import { failed } from "../../utils/alert.util";
export default function UpdatePassword() {
	const dispatch = useAppDispatch();
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	const authState = useAppSelector((state) => state.auth);
	const navigate = useNavigate();
	const url = window.location.href;
	const urlObj = new URL(url);
	const token = urlObj.searchParams.get("token");
	const [password, setPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");
	const [errorLogin, seterrorLogin] = useState("");
	const [isLike, setIslike] = useState<boolean>();
	const [isUpdatePassword, setIsUpdatePassword] = useState(false);
	const handleActiveAccount = () => {
		if (confirmPassword !== "" && password !== "") {
			if (password.length < 8) failed(t("pass-lenght"));
			else {
				const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{3,}$/;
				const isMatch = regex.test(password);
				if (!isMatch) failed(t("pass-condition-character"));
				else {
					dispatch(activeAccount({ token: token, password: password, confirmPassword: confirmPassword }));
				}
			}
		}
	};

	const handleKeyPress = (e: any) => {
		if (e.key === "Enter" && password === confirmPassword) {
			e.preventDefault();
			handleActiveAccount();
		}
	};
	const hanldeChangeConfirmPassword = (e: any) => {
		setconfirmPassword(e);
		if (e == password) setIslike(true);
		else setIslike(false);
	};
	useEffect(() => {
		switch (authState.actionState.status) {
			case "completed":
				dispatch(resetActionStateChange());
				setIsUpdatePassword(true);
				break;
			case "loading":
				break;
			case "failed":
				const temp = authState.actionState?.message?.replace(/\"/g, "");
				seterrorLogin(t(temp || ""));
				setIsUpdatePassword(false);
				break;
		}
	}, [authState.actionState]);
	const hour = new Date().getHours();
	const shift =
		hour >= 4 && hour <= 11
			? t("login.welcome_morning")
			: hour >= 12 && hour <= 16
			? t("login.welcome_afternoon")
			: hour >= 17 && hour <= 20
			? t("login.welcome_evening")
			: "";
	return (
		<div className="h-100 w-100 " style={{ height: bodyHeight, overflowY: "auto" }}>
			<div className="h-100 w-100 position-absolute" style={{ top: 0, left: 0 }}>
				<div className="row wtc-login-row h-100 p-0">
					<div className="col-sm-12 h-100">
						<div
							className="h-100 w-100 d-flex flex-column justify-content-center"
							style={{ alignItems: "center" }}
						>
							<div style={{ width: "40%" }}>
								<div
									className="d-flex flex-column p-3"
									style={{ background: "#F6F7FF", borderRadius: 32, border: "1px solid #283673" }}
								>
									<img className="align-self-center" src={logo} />
									<div
										className="fw-bold wtc-text-primary align-self-center"
										style={{ fontSize: 35 }}
									>
										{shift}
									</div>
									{!isUpdatePassword ? (
										<>
											<div
												className="py-1 align-self-center"
												style={{ color: "#384252", fontWeight: 600, fontSize: 20 }}
											>
												{t("updatepassword_description")}
											</div>
											<div className="py-2">
												{errorLogin != "" && (
													<div className="mb-1">
														<p className="text-center text-danger">{errorLogin}</p>
													</div>
												)}
											</div>
											<WtcPassword
												onclick={() => seterrorLogin("")}
												placeHolder="login.password-placeholder"
												disabled={authState.actionState.status === "loading"}
												floatLabel
												value={password}
												onChange={function (value: string): void {
													setPassword(value);
												}}
											/>
											<div className="mb-3 mt-3"></div>
											<WtcPassword
												className={isLike == false ? "p-invalid" : ""}
												onclick={() => seterrorLogin("")}
												placeHolder="confirm_password"
												disabled={authState.actionState.status === "loading"}
												floatLabel
												value={confirmPassword}
												onChange={function (value: string): void {
													hanldeChangeConfirmPassword(value);
												}}
												onKeyDown={handleKeyPress}
											/>
											<div className="py-4"></div>
											<WtcButton
												disabled={!isLike}
												loading={authState.actionState.status === "loading"}
												className="wtc-bg-primary text-white"
												label={t("update_password")}
												height={88}
												fontSize={24}
												onClick={handleActiveAccount}
											/>
										</>
									) : (
										<>
											<div
												className="py-1 align-self-center"
												style={{ color: "#384252", fontWeight: 600, fontSize: 20 }}
											>
												{t("updatepassword_success")}
											</div>
											<div
												className="py-1 align-self-center"
												onClick={() => navigate("/")}
												style={{
													color: "#384252",
													fontWeight: 600,
													fontSize: 20,
													cursor: "pointer",
												}}
											>
												<u>{t("go_to_login")}</u>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-sm-6"></div>
			</div>
		</div>
	);
}
