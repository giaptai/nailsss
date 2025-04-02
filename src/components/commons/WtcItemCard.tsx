import { t } from "i18next";
import StatusItemList from "../StatusItemList";
import WtcRoleButton from "./WtcRoleButton";
import { warningWithConfirm } from "../../utils/alert.util";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { RoleService } from "../../services/Role.service";
import { useAppSelector } from "../../app/hooks";

type WtcItemCardProps = {
	body: JSX.Element;
	index: number;
	padding?: number;
	verticalSpacing?: number;
	selected?: boolean;
	onClick: () => void;
	onDbClick: () => void;
	filter?: boolean;
	onDelete?: () => void;
	onRestore?: () => void;
	status: string;
	hideStatusAction?: boolean;
	hideBorder?: boolean;
	hideSwiper?: boolean;
	hideDeleteSwiper?: boolean;
	slideButtons?: JSX.Element[];
	uniqueId?: string;
	target: string;
};
export default function WtcItemCard(props: WtcItemCardProps) {
	const isInActive = props.status == "INACTIVE";
	const authState = useAppSelector((state) => state.auth);
	const disabled = RoleService.isAllowAction(authState.role, props.target, "RES");
	const disabledDel = RoleService.isAllowAction(authState.role, props.target, "DEL");
	const buttons: any[] = [];
	if (isInActive && disabled && !props.hideDeleteSwiper) {
		buttons.push(
			<WtcRoleButton
				target={props.target}
				action="RES"
				label={t("action.restore")}
				className="bg-blue text-white"
				icon="ri-loop-left-line fs-value"
				fontSize={14}
				labelStyle={{ fontWeight: "bold" }}
				borderRadius={12}
				height={40}
				onClick={() => {
					warningWithConfirm({
						title: t("do_you_restore"),
						text: "",
						confirmButtonText: t("Restore"),
						confirm: () => {
							if (props.onRestore) props.onRestore();
						},
					});
				}}
			/>
		);
	} else if (!isInActive && disabledDel && !props.hideDeleteSwiper) {
		buttons.push(
			<WtcRoleButton
				target={props.target}
				action="DEL"
				label={t("action.delete")}
				className="bg-danger text-white"
				icon="ri-close-large-line fs-value"
				fontSize={14}
				labelStyle={{ fontWeight: "bold" }}
				borderRadius={12}
				height={40}
				onClick={() => {
					warningWithConfirm({
						title: t("do_you_delete"),
						text: "",
						confirmButtonText: t("Delete"),
						confirm: () => {
							if (props.onDelete) props.onDelete();
						},
					});
				}}
			/>
		);
	}
	if (props.slideButtons) {
		buttons.push(props.slideButtons);
	}
	const mainCard = (
		<div className={`w-100`} onDoubleClick={props.onDbClick}>
			{props.hideStatusAction ? (
				props.body
			) : (
				<div className="d-flex align-items-center">
					<div style={{ width: 60 }}>
						<StatusItemList inactive={isInActive} />
					</div>
					<div className="flex-grow-1" onClick={props.onClick}>
						{props.body}
					</div>
				</div>
			)}
		</div>
	);

	if (buttons) {
		return (
			<Swiper
				style={{
					...(!props.hideBorder ? { border: `1px solid ${props.selected ? "#3C54B0" : "#F1F3F6"}` } : {}),
					backgroundColor: props.index % 2 == 0 ? "#f1f1f138" : "FFF",
					borderRadius: 8,
					padding: props.padding ?? 5,
					cursor: "pointer",
					filter: props.filter ? "brightness(95%)" : undefined,
				}}
				slidesPerView={"auto"}
				spaceBetween={5}
				className="mySwiper"
			>
				<SwiperSlide>{mainCard}</SwiperSlide>
				{// hiển thị nút khi kéo sang trái 
				/* <SwiperSlide style={{ maxWidth: buttons.length * 150 }}>
					<div className="d-flex pt-1" style={{ gap: 5 }}>
						{buttons.map((btn, index) => (
							<div className={"ahiiih " + props.uniqueId + index.toString()} key={props.uniqueId + index.toString()}>
								{btn}
							</div>
						))}
					</div>
				</SwiperSlide> */}
			</Swiper>
		);
	} else {
		return mainCard;
	}
}
