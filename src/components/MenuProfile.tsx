// import { t } from "i18next"
// import { useNavigate } from "react-router-dom"

// export default function MenuProfile(props: {menuTab: string}) {
//     const navigate = useNavigate()
//     const menuList = [
//         { key: 'general', label: t('accinfo'), icon: 'ri-user-line', command: () => { navigate('/profile') } },
//         {
//         key: 'changepassword', label: t('pass'), icon: 'ri-lock-fill', command: () => {navigate('/change-password')}
//         },

//     ]

//     return (
//         <>
//             <div className="w-100">
//                 {menuList.map((m, i) => {
//                     return <div className={`profile-menu-item d-flex pt-1 pb-1 px-2  ${props.menuTab === m.key ? 'active' : ''}`} key={"profile-m-" + i} style={{ fontSize: 14, cursor: "pointer" }} onClick={m.command}>
//                             <div className="ms-2 me-2 fs-4"><i className={m.icon}></i></div>
//                                 <div className="flex-grow-1 fw-normal align-self-center">{m.label}</div>
//                             </div>
//                             })}
//                         </div>
//         </>
//     )
// }
import { t } from "i18next";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import NoAvatar from "../assets/images/empty/no-avatar.jpg";
import { CheckRoleWithAction, MAX_IMAGE_SIZE, PageTarget, scaleImage } from "../const";
import { deleteAvatarProfile, updateAvatarProfile } from "../slices/profile.slice";
import { failed, warningWithConfirm } from "../utils/alert.util";
export default function MenuProfile(props: { menuTab: string }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const profileState = useAppSelector((state) => state.profile);
	const auth = useAppSelector((state) => state.auth);
	const [imageSrc, setImageSrc] = useState<string>(profileState.avatar);
	const [fileAvtUpload, setfileAvtUpload] = useState<File | null>(null);
	const [disabledUpload, setdisabledUpload] = useState(true);
	const menuList = [
		{
			key: "general",
			label: t("accinfo"),
			icon: "ri-user-line",
			command: () => {
				navigate("/profile");
			},
		},
		{
			key: "changepassword",
			label: t("chanepass"),
			icon: "ri-lock-fill",
			command: () => {
				navigate("/change-password");
			},
		},
	];
	const handleDeleteAvatar = () => {
		warningWithConfirm({
			title: t("do_you_delete_avatar"),
			text: "",
			confirmButtonText: t("Delete"),
			confirm: () => {
				dispatch(deleteAvatarProfile());
			},
		});
	};
	const handleChangeAvatarProfile = async (_img: string | undefined) => {
		if (_img) {
			await dispatch(updateAvatarProfile({ avatar: fileAvtUpload }));
			setdisabledUpload(true);
		}
	};
	const triggerFileInput = () => {
		const fileInput = document.getElementById("fileInput") as HTMLInputElement;
		fileInput.value = "";
		fileInput.click();
	};
	const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			//setdisabledUpload(false)
			setfileAvtUpload(file);
			if (!file.type.startsWith("image/")) {
				failed("Vui lòng chọn một tệp hình ảnh.");
				return;
			}
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				setImageSrc(e.target?.result as string);
			};
			reader.readAsDataURL(file);
			const fileSize = file.size;
			setdisabledUpload(false);
			if (fileSize > MAX_IMAGE_SIZE) {
				const scaledImageSrc = await scaleImage(file);
				setfileAvtUpload(scaledImageSrc);
			}
		}
	};
	useEffect(() => {
		setImageSrc(profileState.avatar);
	}, [profileState.avatar]);
	return (
		<>
			<div className="w-100">
				<div className="col-md-12" style={{ paddingTop: "6px" }}>
					<div
						className="d-flex bd-highlight mb-3 bg-white profile-menu-item pt-1 pb-1 px-2"
						style={{ textAlign: "left" }}
					>
						<div className="p-2 bd-highlight">
							<Avatar
								className="my-avatar-size"
								image={imageSrc ? imageSrc : NoAvatar ?? NoAvatar}
								shape="square"
								size="xlarge"
							/>
						</div>
						<div className=" bd-highlight">
							<div
								className="d-flex flex-column bd-highlight mb-3 bg-white profile-menu-item pt-1 pb-1"
								style={{ textAlign: "left" }}
							>
								<div
									className={`p-2 bd-highlight my-change-avatar ${
										!CheckRoleWithAction(auth, PageTarget.profile, "UPD") && "my-disabled-div"
									}`}
								>
									<span className="align-self-start my-text-color" onClick={triggerFileInput}>
										<i className="ri-image-line"></i>&ensp;{t("choseavatar")}
									</span>
									<input
										type="file"
										id="fileInput"
										style={{ display: "none" }}
										onChange={handleAvatarChange}
										accept="image/*"
									/>
								</div>
								<div className={`p-2 bd-highlight ${disabledUpload == true && "my-disabled-div"}`}>
									<span
										className="align-self-start my-change-avatar my-text-color"
										onClick={() => {
											handleChangeAvatarProfile(imageSrc);
										}}
									>
										<i className="ri-edit-line"></i>&ensp;{t("update.avt")}
									</span>
								</div>
								<div
									className={`p-2 bd-highlight my-remove-avatar ${
										!profileState.avatar && "my-disabled-div"
									}`}
								>
									<span className="text-danger" onClick={handleDeleteAvatar}>
										<i className="ri-close-large-line"></i>&ensp;{t("remove.avt")}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{menuList.map((m, i) => {
					return (
						<div
							className={`profile-menu-item d-flex pt-1 pb-1 px-2  ${
								props.menuTab === m.key ? "active" : ""
							}`}
							key={"profile-m-" + i}
							style={{ fontSize: 14, cursor: "pointer" }}
							onClick={m.command}
						>
							<div className="ms-2 me-2 fs-4">
								<i className={m.icon}></i>
							</div>
							<div className="flex-grow-1 fw-normal align-self-center">{m.label}</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
