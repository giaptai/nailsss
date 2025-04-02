import { t } from "i18next";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import loginImg from "../assets/images/login.jpg";
import logo from "../assets/images/logo.png";
import WtcButton from "../components/commons/WtcButton";
import WtcInputText from "../components/commons/WtcInputText";
import WtcPassword from "../components/commons/WtcPassword";
import { HttpService } from "../services/http/HttpService";
import { setLogined, setRefreshToken, setUser } from "../slices/app.slice";
import { getDbname, login, resetActionStateChange, resetLoginState } from "../slices/auth.slice";
import { fetchAvatarStream } from "../slices/profile.slice";
import {
	getStoreConfig,
	resetActionStateStoreconfig,
	resetFetchStateStoreconfig,
	updateStoreSetting,
} from "../slices/storeconfig.slice";
import { showMessageToast } from "../utils/alert.util";

export default function Login() {
	const dispatch = useAppDispatch();
	const authState = useAppSelector((state) => state.auth);
	const requiredKeys = ["location", "name", "phone", "posStationName", "street1", "street2"];
	const storeconfigState = useAppSelector((state) => state.storeconfig);
	const navigate = useNavigate();
	const toast = useRef<any>(null);
	const param = useParams();
	const userStorageKey = import.meta.env.VITE_APP_storageUserKey;
	const dbNameStore = import.meta.env.VITE_APP_dbNameKey;
	const storeCode = import.meta.env.VITE_APP_storageOrderStoreCode;
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [errorLogin, seterrorLogin] = useState("");
	const handleLogin = () => {
		if (userName !== "" && password !== "") {
			localStorage.setItem(userStorageKey, userName);
			try {
				dispatch(login({ username: userName, password: password, dbName: authState.BusinessInfo?.dbName }));
				// dispatch(login({ username: userName, password: password, dbName: "SPA-CLIENT-LOCAL" }));
				// navigate("/");
			} catch (error) {
				console.log(error);
			}
		} else {
			seterrorLogin(t("invalid_account"));
		}
	};
	const handleKeyPress = (e: any) => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};
	useEffect(() => {
		if (param.storeCode) {
			localStorage.setItem(storeCode, param.storeCode);
			dispatch(getDbname(param.storeCode ? { storeCode: param.storeCode } : {}));
		}
	}, []);
	useEffect(() => {
		if (authState.BusinessInfo?.dbName != "") localStorage.setItem(dbNameStore, authState.BusinessInfo?.dbName);
	}, [authState.BusinessInfo?.dbName]);
	useEffect(() => {
		switch (authState.actionState.status) {
			case "completed":
				dispatch(resetActionStateChange());
				break;
			case "loading":
				break;
			case "failed":
				showMessageToast(toast, "error", t(authState.actionState.message!));
				dispatch(resetActionStateChange());
				break;
		}
	}, [authState]);

	useEffect(() => {
		const loginStatus = async () => {
			switch (authState.loginState.status) {
				case "completed":
					//console.log(authState.tokens);
					HttpService.setRefreshToken(authState.tokens.refreshToken);
					dispatch(setRefreshToken(authState.tokens.refreshToken));
					dispatch(resetLoginState());
					dispatch(setLogined(true));
					dispatch(setUser(authState.user));
					dispatch(fetchAvatarStream());
					navigate("/");

					// navigate("/*");
					await dispatch(getStoreConfig());
					// dispatch(createCode({}));
					dispatch(resetFetchStateStoreconfig());
					dispatch(resetActionStateStoreconfig());
					if (!storeconfigState.list.some((item) => requiredKeys.includes(item.key))) {
						const submitData = [];
						for (const [key, value] of Object.entries(authState.BusinessInfo)) {
							if (key != "dbName" && key != "email" && key != "zipcode" && key != "state")
								if (value !== undefined && value !== null) {
									submitData.push({
										key: key == "city" ? "location" : key,
										value: value,
										type: "STORE",
									});
								}
						}
						await dispatch(updateStoreSetting(submitData));

						dispatch(getStoreConfig());
						dispatch(resetActionStateStoreconfig());
						dispatch(resetFetchStateStoreconfig());
					}
					break;
				case "failed":
					const temp = authState.loginState?.error?.replace(/\"/g, "");
					console.log(authState.loginState);
					seterrorLogin(t(temp || ""));
					dispatch(resetLoginState());
					break;
			}
		};
		loginStatus();
	}, [authState.loginState]);

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
		<>
			<div className="h-100 w-100 ">
				<div className="h-100 w-100">
					<div className="row wtc-login-row h-100 p-0">
						<div
							className="col-sm-3 p-0 wtc-bg-primary"
							style={{ borderTopRightRadius: 48, borderBottomRightRadius: 48 }}
						></div>
						<div className="col-sm-9 h-100 px-2 py-5">
							<img
								className="w-100 h-100"
								src={loginImg}
								style={{ objectFit: "cover", borderRadius: 32 }}
							/>
						</div>
					</div>
				</div>
				<div className="h-100 w-100 position-absolute" style={{ top: 0, left: 0 }}>
					<div className="row wtc-login-row h-100 p-0">
						<div className="col-sm-6 h-100">
							<div className="h-100 w-100 d-flex flex-column justify-content-center">
								<div className="row w-100">
									<div className="col-sm-2"></div>
									<div className="col-sm-8">
										<div
											className="d-flex flex-column p-3"
											style={{ background: "#F6F7FF", borderRadius: 32 }}
										>
											<img className="align-self-center" src={logo} />
											<div
												className="fw-bold wtc-text-primary align-self-center"
												style={{ fontSize: 35 }}
											>
												{shift}
											</div>
											<div
												className="py-1 align-self-center"
												style={{ color: "#384252", fontWeight: 600, fontSize: 20 }}
											>
												{t("login.description")}
											</div>
											<div className="py-2">
												{errorLogin != "" && (
													<div className="mb-1">
														<p className="text-center text-danger">{errorLogin}</p>
													</div>
												)}
											</div>
											<WtcInputText
												auTofocus={true}
												onKeyDown={handleKeyPress}
												onClick={() => {
													seterrorLogin("");
												}}
												floatLabel
												disabled={authState.loginState.status === "loading"}
												height={70}
												value={userName}
												fontSize={20}
												border="1px solid #DADFF2"
												padding="20px 16px 20px 48px"
												leadingIcon="ri-mail-fill wtc-text-primary"
												placeHolder={t("login.username-placeholder")}
												onChange={function (value: string): void {
													setUserName(value);
												}}
											/>
											<div className="py-3"></div>
											<WtcPassword
												onclick={() => seterrorLogin("")}
												placeHolder="login.password-placeholder"
												disabled={authState.loginState.status === "loading"}
												floatLabel
												value={password}
												onChange={function (value: string): void {
													setPassword(value);
												}}
												onKeyDown={handleKeyPress}
											/>
											<div className="py-4"></div>
											<WtcButton
												loading={authState.loginState.status === "loading"}
												className="wtc-bg-primary text-white"
												label={t("login.signin")}
												height={88}
												fontSize={24}
												onClick={handleLogin}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Toast ref={toast} position="top-center" />
		</>
	);
}
