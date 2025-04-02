import { t } from "i18next";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import IconButton from "../../../components/commons/IconButton";
import WtcHeaderColor from "../../../components/commons/WtcHeaderColor";
import { ServiceModel } from "../../../models/category/Service.model";
import { toFixedRefactor, toLocaleStringRefactor } from "../../../utils/string.ultil";
import { RoleService } from "../../../services/Role.service";
import { useAppSelector } from "../../../app/hooks";
type PropsWindow = {
	index: number;
	selected: number | null;
	onClick: (index: number) => void;
	onShowDetails: (index: number) => void;
	service?: ServiceModel;
	isUSer: boolean;
	height?: number;
	moveCard: (dragIndex: number, hoverIndex: number) => void;
	onDrop: (dragIndex: number, hoverIndex: number, id: string) => void;
	onSwap: (dragIndex: number, dragId: string, hoverIndex: number, hoverId: string) => void;
	NoDrag?: boolean;
	NoIcon?: boolean;
	NoCenter?: boolean;
	IsTax?: boolean;
	isLayoutOrder?: boolean;
	isDisabled?: boolean;
};

const ItemType = "SERVICE_POSITION";

export default function ServicePosition(props: PropsWindow) {
	const role = useAppSelector((state) => state.auth.role);
	const disabled = !RoleService.isAllowAction(role, "SERVICE", "UPD");
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const { index, moveCard, onDrop, service, onSwap, NoDrag } = props;
	const ref = React.useRef<HTMLDivElement>(null);
	const dragRef = React.useRef<HTMLDivElement>(null);
	const getTaxRate = (data: any): number => {
		const taxRateInfo = data.find((item: any) => item.key === "taxRate");
		return taxRateInfo ? Number(taxRateInfo.value) : 0;
	};
	const [, drop] = useDrop({
		accept: ItemType,
		hover(item: { index: number; service: ServiceModel }) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex) {
				return;
			}
			moveCard(dragIndex, hoverIndex);
			item.index = hoverIndex;
		},
		drop(item: { index: number; service: ServiceModel }) {
			if (!service) {
				onDrop(item.index, index, item.service._id);
			} else {
				onSwap(item.service.position, item.service._id, service.position, service._id);
			}
		},
	});

	const [{ isDragging }, drag, _preview] = useDrag({
		type: ItemType,
		item: { index, service },
		canDrag: () => !!service && !NoDrag,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	if (!NoDrag) {
		drag(drop(ref));
		drag(dragRef);
	} else {
		drop(ref);
	}

	const handleClick = () => {
		if (!props.isDisabled) {
			if (!props.service) {
				props.onClick(props.index);
			} else {
				props.onShowDetails(props.index);
			}
		}
	};

	return (
		<div ref={ref} className={`col-sm-3 px-0 ${isDragging ? "opacity-50" : ""}`} style={{ height: props.height }}>
			{props.isLayoutOrder ? (
				<>
					<div
						className={`h-100 w-100 ${props.isUSer ? "my-user-focus p-1" : ""} ${
							props.selected === props.index ? "" : ""
						}`}
						style={{
							borderRadius: 11,
							height: 100,
							border:
								props.selected === props.index ? "1px solid rgb(165 165 165)" : "1px solid transparent",
						}}
					>
						<div
							tabIndex={0}
							className={`h-100 w-100 index-key ${props.selected === props.index ? "" : ""} ${
								props.service
									? props.isDisabled
										? "disabled-opacity my-click-selected"
										: "my-click-selected clickable"
									: ""
							}`}
							style={{ background: "#eef1fa", borderRadius: 11, height: "100%" }}
							onClick={handleClick}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleClick();
								}
							}}
						>
							<div className="askforprice">
								{props.service ? (
									props.service.askForPrice == "YES" && (
										<i
											style={{ color: "rgb(255, 202, 100)" }}
											className="ri-arrow-up-circle-line fs-4 text-success"
										></i>
									)
								) : (
									<></>
								)}
							</div>
							{props.service && (
								<WtcHeaderColor
									className="header-color-absolute"
									width={30}
									color={props.service.color || "#283673"}
								/>
							)}
							<div
								className={`${props.NoCenter ? "" : "align-self-center"} w-100`}
								style={{
									height: "90%",
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
								}}
							>
								<div className="row bd-highlight h-100 m-0 p-0">
									{props.service && (
										<div
											className="d-flex"
											style={{
												height: "70%",
												borderBottom: "1px solid #eee",
												alignItems: "center",
											}}
										>
											<div className="col-md-12 mt-3 mb-2">
												<div
													className="fs-value"
													style={{ textWrap: "wrap", textAlign: "center" }}
												>
													{props.service && `${props.service.displayName}`}
												</div>
											</div>
										</div>
									)}
									<div
										className="row m-0 mt-1 p-0"
										style={{ height: "20%", alignContent: "center", textAlign: "center" }}
									>
										<div className="col-md-6 mt-1">
											<span className="fs-value">
												{props.service &&
													`$ ${toLocaleStringRefactor(
														toFixedRefactor(props.service.storePrice, 2)
													)}`}
											</span>
										</div>
										<div
											className="col-md-6 fs-value"
											style={{ textAlign: "center", borderLeft: "1px solid rgb(238, 238, 238)" }}
										>
											{props.service && t("tax")}{" "}
											{props?.service ? (
												props?.service.tax === "YES" ? (
													<i className="ri-checkbox-circle-line text-success fs-5"></i>
												) : (
													<i className="ri-close-circle-line fs-5 text-danger"></i>
												)
											) : (
												<></>
											)}
										</div>
									</div>
									{/* <div className=" bd-highlight">{props.service && `${props.service.displayName}`}</div>
                <div className=" bd-highlight"><span>Price</span>{props.service && `${props.service.employeePrice} $`}</div>
                <div className=" bd-highlight"><span>Tax</span>{props.IsTax && props.service && `10%`}</div> */}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<div
					className={`h-100 ${props.isUSer ? "my-user-focus p-1" : ""} ${
						props.selected === props.index ? "" : ""
					}`}
					style={{
						borderRadius: 11,
						height: 100,
						border: props.selected === props.index ? "1px solid rgb(165 165 165)" : "1px solid transparent",
					}}
				>
					<div
						tabIndex={0}
						className={`d-flex w-100 p-3 index-key ${props.selected === props.index ? "" : ""} ${
							props.service ? "my-click-selected" : ""
						}`}
						style={{ background: "#eef1fa", borderRadius: 11, height: "100%" }}
						onClick={handleClick}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleClick();
							}
						}}
					>
						<div className="align-self-center">
							{!props.NoIcon && (
								<IconButton
									icon={"ri-service-line fs-icon-action"}
									width={
										(props.height && (props.height * 0.65 > 50 ? 50 : props.height * 0.65)) || 50
									}
									height={
										(props.height && (props.height * 0.65 > 50 ? 50 : props.height * 0.65)) || 50
									}
									onClick={() => {}}
									actived={false}
									className="me-1 custom-primary-button"
								/>
							)}
							<div className="number">#{props.index + 1}</div>

							{props.service && (
								<div className="headercolor fs-3">
									<WtcHeaderColor width={30} color={props.service.color || "#283673"} />
								</div>
							)}
							{props.service && !NoDrag && !disabled && (
								<div className="dragger fs-3" ref={dragRef}>
									<i className="ri-drag-move-line"></i>
								</div>
							)}
						</div>
						<div
							className={`${props.NoCenter ? "" : "align-self-center"}`}
							style={{ overflow: "hidden", whiteSpace: "", textOverflow: "ellipsis" }}
						>
							<div className="d-flex flex-column bd-highlight">
								<div className=" bd-highlight">{props.service && `${props.service.displayName}`}</div>
								{props.service && (
									<div className=" bd-highlight">
										<span>Price&ensp;</span>
										{`$ ${props.service.storePrice}`}
									</div>
								)}
								{props.IsTax && props.service && props.service.tax == "YES" && (
									<div className=" bd-highlight">
										<span>Tax&ensp;</span>
										{getTaxRate(storeConfigState.list)}%
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
