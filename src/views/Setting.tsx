import { t } from "i18next";
import { useEffect } from "react";
import { getI18n } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import icon from "../assets/svg/user-settings.svg";
import WtcCard from "../components/commons/WtcCard";
import WtcDropdownIconText from "../components/commons/WtcDropdownIconText";
import { setLanguage } from "../slices/app.slice";
import { changeInfoProfile, resetActionState } from "../slices/profile.slice";
import { completed, failed, processing } from "../utils/alert.util";
import { RoleService } from "../services/Role.service";
import { PageTarget } from "../const";
export default function Setting() {
	const lang = useAppSelector((state) => state.app.user.profile?.language || "en");
	const profileState = useAppSelector((state) => state.profile);
	const role = useAppSelector((state) => state.auth.role);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (profileState.actionState) {
			switch (profileState.actionState.status) {
				case "completed":
					completed();
					dispatch(resetActionState());
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
		RoleService.isShowSettingLang(role, PageTarget.lang) && (
			<div className="w-50" style={{ height: 100 }}>
				<WtcCard
					title={<>{t("setting")}</>}
					body={
						<>
							<WtcDropdownIconText
								options={[
									{ label: t("english"), value: "en" },
									{ label: t("vietnamese"), value: "vi" },
								]}
								placeHolder={t("language")}
								leadingIconImage={icon}
								value={lang}
								disabled={false}
								onChange={(value) => {
									getI18n().changeLanguage(value);
									// localStorage.setItem(import.meta.env.VITE_APP_storageLangKey, value)
									dispatch(setLanguage(value));
									const submitData = {
										language: value,
									};
									dispatch(changeInfoProfile({ data: submitData }));
								}}
							/>
						</>
					}
					hideBorder={true}
				/>
			</div>
		)
	);
}
