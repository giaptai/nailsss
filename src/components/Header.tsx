import { t } from "i18next";
import { Avatar } from "primereact/avatar";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import NoAvatar from "../assets/images/empty/no-avatar.jpg";
import Loading from "../assets/images/loading_beautiful.gif";
import { formatCapitalize } from "../const";
import { clearState } from "../slices/newOder.slice";
import { ProfileState } from "../slices/profile.slice";
import IconButton from "./commons/IconButton";
import HeaderDropdown from "./HeaderDropdown";
export default function Header() {
	const [showed, setShowed] = useState(false);
	const user = useAppSelector((state) => state.app.user);
	const profile = useAppSelector((state) => state.profile);
	const navigate = useNavigate();
	const [AvatarView, setAvatarView] = useState(null);
	const myRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const dispatch = useDispatch();
	const handleGoBack = (str: string) => {
		if (location.pathname == "/order" || location.pathname == "/payment" || location.pathname == "/refund") {
			dispatch(clearState());
		}
		if (str == "/") navigate("/");
		else navigate(-1);
	};
	const handleClickOutside = (e: any) => {
		if (!myRef.current!.contains(e.target)) {
			if (showed) {
				setShowed(false);
			}
		}
	};
	function getImageSource(profile: ProfileState) {
		if (profile?.getAvtState === "loading") {
			return Loading;
		} else if (profile?.avatar && profile.avatar !== "") {
			return profile.avatar;
		} else {
			return NoAvatar;
		}
	}
	useEffect(() => {
		setAvatarView(getImageSource(profile));
	}, [profile]);
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	});

	const name = user?.profile?.firstName + " " + user?.profile?.lastName || "###";
	const allowGoBack = !["/", "/*"].includes(window.location.pathname);
	return (
		<div className="my-header-stick">
			<div
				className={`iq-top-navbar d-flex justify-content-between align-items-center px-3`}
				style={{ borderBottom: "5px solid #273672" }}
			>
				<div className="d-flex align-items-center ">
					<IconButton
						tabIndex={1}
						icon={"ri-home-4-fill"}
						onClick={() => handleGoBack("/")}
						actived={false}
						className="custom-primary-button me-3"
						height={48}
						width={48}
					/>
					<IconButton
						tabIndex={2}
						icon={"ri-list-check"}
						onClick={() => navigate("/functions")}
						actived={false}
						className="custom-primary-button me-3"
						height={48}
						width={48}
					/>
					<IconButton
						tabIndex={2}
						icon={"ri-receipt-line"}
						onClick={() => navigate("/order-list")}
						actived={false}
						className="custom-primary-button me-3"
						height={48}
						width={48}
					/>
					{allowGoBack ? (
						<IconButton
							tabIndex={3}
							icon={"ri-arrow-go-back-line"}
							width={48}
							height={48}
							onClick={() => handleGoBack("")}
							actived={false}
							className="custom-primary-button me-3"
						/>
					) : (
						<div></div>
					)}
				</div>

				<div className="d-flex align-items-center ">
					<div className="me-2">
						<IconButton
							tabIndex={1}
							icon={"ri-settings-4-fill"}
							onClick={() => {
								navigate("/setting");
							}}
							actived={false}
							className="custom-primary-button"
							height={48}
							width={48}
						/>
					</div>
					<nav className="navbar navbar-expand-lg navbar-light p-0">
						<div className={showed ? "iq-show" : ""} ref={myRef}>
							<div onClick={() => setShowed(!showed)}>
								<div className="d-flex my-2" style={{ cursor: "pointer" }}>
									<Avatar image={AvatarView || ""} shape="circle" size="large" />
									<div className="d-flex align-self-center">
										<span className="mx-3">{formatCapitalize(name)}</span>
										<i className="ri-arrow-down-s-line"></i>
									</div>
								</div>
							</div>
							<HeaderDropdown
								title={t("hello") + ", " + name}
								bagde={0}
								status={"Trực tuyến"}
								isProfile={true}
								callback={() => setShowed(false)}
							/>
						</div>
					</nav>
				</div>
			</div>
		</div>
	);
}
