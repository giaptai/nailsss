import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { t } from "i18next";
import { setLogined, setUser } from "../slices/app.slice";
import { setRole } from "../slices/auth.slice";
type HeaderDropdownProps = {
	title: string;
	bagde: number;
	status: string;
	isProfile: boolean;
	callback: () => void;
};
export default function HeaderDropdown(props: HeaderDropdownProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const userStorageKey = import.meta.env.VITE_APP_storageUserKey;
	const refreshTokenStorageKey = import.meta.env.VITE_APP_storageRefreshTokenKey;
	const accessTokenStorageKey = import.meta.env.VITE_APP_storageAccessTokenKey;
	const storeCode = import.meta.env.VITE_APP_storageOrderStoreCode;
	const handleLogout = () => {
		localStorage.removeItem(userStorageKey);
		localStorage.removeItem(refreshTokenStorageKey);
		localStorage.removeItem(accessTokenStorageKey);
		navigate("/" + localStorage.getItem(storeCode));
		dispatch(setLogined(false));
		dispatch(setUser(false));
		dispatch(setRole(undefined));
	};
	return (
		<div className="iq-sub-dropdown">
			<div className="iq-card shadow-none m-0">
				<div className="iq-card-body p-0 ">
					<div className="wtc-bg-primary p-3">
						<h5 className="mb-0 text-white">{props.title}</h5>
					</div>
					{props.isProfile ? (
						<div className="px-3 mb-3">
							<button
								type="button"
								className="btn custom-primary-outline w-100 my-3"
								onClick={() => {
									props.callback();
									navigate("/profile");
								}}
							>
								{t("my_profile")} <i className="ri-user-fill ml-2"></i>
							</button>
							<button type="button" className="btn btn-outline-danger w-100" onClick={handleLogout}>
								{t("Log out")} <i className="ri-login-box-line ml-2"></i>
							</button>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
