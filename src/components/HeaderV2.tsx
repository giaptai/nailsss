import { t } from "i18next";
import { Avatar } from "primereact/avatar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import NoAvatar from "../assets/images/empty/no-avatar.jpg";
import Loading from "../assets/images/loading_beautiful.gif";
import { formatCapitalize } from "../const";
import { ProfileState } from "../slices/profile.slice";
import HeaderDropdown from "./HeaderDropdown";
export default function HeaderV2() {
	const [showed, setShowed] = useState(false);
	const user = useAppSelector((state) => state.app.user);
	const profile = useAppSelector((state) => state.profile);
	const [AvatarView, setAvatarView] = useState(null);
	const myRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
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

	return (
		<div className="my-header-stick" style={{ border: "1px solid #F0F2F4" }}>
			<div className={`iq-top-navbar d-flex justify-content-between align-items-center px-3`}>
				<div className="d-flex align-items-center ">
					<p style={{ fontSize: "24px", fontWeight: "400" }} className="my-auto">
						<span style={{ textTransform: "capitalize" }}>
							{location.pathname === "/" ? "Dashboard" : location.pathname.replace("/", "")}
						</span>
					</p>
				</div>

				<div className="d-flex align-items-center ">
					{/* <div className="me-2">
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
					</div> */}
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
