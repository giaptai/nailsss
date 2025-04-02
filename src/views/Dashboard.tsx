import { t } from "i18next";
import IconButton from "../components/commons/IconButton";
import WtcCard from "../components/commons/WtcCard";
// import WtcButton from "../components/commons/WtcButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { RoleService } from "../services/Role.service";
import useWindowSize from "../app/screen";
import { PageTarget } from "../const";

export default function Dashboard() {
	const navigate = useNavigate();
	const screenSize = useWindowSize();
	const role = useAppSelector((state) => state.auth.role);
	//console.log("Dash role",role)
	const items: any[] = [
		{
			label: t("Employees"),
			icon: "ri-user-line",
			visible: RoleService.isAllowMenu(role, PageTarget.employee),
			command: () => {
				navigate("/employees");
			},
		},
		{
			label: t("Customers"),
			icon: "ri-group-3-line",
			visible: RoleService.isAllowMenu(role, PageTarget.customer),
			command: () => {
				navigate("/customers");
			},
		},
		{
			label: t("Roles"),
			icon: "ri-shield-keyhole-line",
			visible: RoleService.isAllowMenu(role, PageTarget.role),
			command: () => {
				navigate("/roles");
			},
		},
		{
			label: t("window"),
			icon: "ri-window-line",
			visible: RoleService.isAllowMenu(role, PageTarget.window),
			command: () => {
				navigate("/window");
			},
		},
		{
			label: t("Services"),
			icon: "ri-service-line",
			visible: RoleService.isAllowMenu(role, PageTarget.service),
			command: () => {
				navigate("/service");
			},
		},
		{
			label: t("giftcards"),
			icon: "ri-gift-line",
			visible: RoleService.isAllowMenu(role, PageTarget.giftcard),
			command: () => {
				navigate("/giftcard");
			},
		},
		{
			label: t("menu"),
			icon: "ri-menu-line",
			visible: RoleService.isAllowMenu(role, PageTarget.menu),
			command: () => {
				navigate("/menu");
			},
		},
		{
			label: t("storeconfig"),
			icon: "ri-settings-2-line",
			visible: RoleService.isAllowMenu(role, PageTarget.storeconfig),
			command: () => {
				navigate("/storeconfig");
			},
		},
		// {
		// 	label: t("turn"),
		// 	icon: "ri-text-wrap",
		// 	visible: RoleService.isAllowMenu(role, "TURN"),
		// 	command: () => {
		// 		navigate("/turn");
		// 	},
		// },
		{
			label: t("position"),
			icon: "ri-user-location-line",
			visible: RoleService.isAllowMenu(role, "POSITION"),
			command: () => {
				navigate("/position-list");
			},
		},
		{
			label: t("order"),
			icon: "ri-receipt-line",
			visible: RoleService.isAllowMenu(role, PageTarget.order),
			command: () => {
				navigate("/order");
			},
		},
		{
			label: t("orderlist"),
			icon: "ri-receipt-line",
			visible: RoleService.isAllowMenu(role, PageTarget.order),
			command: () => {
				navigate("/order-list");
			},
		},
		{
			label: t("pay_rolls"),
			icon: "pi pi-dollar fw-bold fs-4",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => {
				navigate("/payrolls");
			},
		},
		{
			label: t("statement"),
			icon: "ri-file-chart-line fw-bold fs-4",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => {
				navigate("/statement");
			},
		},
		{
			label: t("transactions"),
			icon: "ri-file-chart-line fw-bold fs-4",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => {
				navigate("/transactions");
			},
		},
	];
	const menuitem = (item: any, index: number) => (
		<div key={index} className="col-sm-6">
			<div
				tabIndex={index + 1}
				className="d-flex align-items-center menu-item p-3 my-1"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						item.command();
					}
				}}
				onClick={() => item.command()}
			>
				<IconButton
					icon={item.icon}
					width={48}
					height={48}
					onClick={() => {}}
					actived={false}
					className="custom-primary-button"
				/>
				<div className="flex-grow-1 ps-3 fw-bold" style={{ color: "#30363F" }}>
					{item?.label}
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div className="row" style={{ height: screenSize.height - 90 }}>
				<div className="col-lg-12 col-xl-6 mb-3 h-100">
					<WtcCard
						className="h-100"
						title={<div className="text-white">{t("Categories")}</div>}
						body={
							<div className="row">
								{items.filter((it) => it.visible).map((item, index) => menuitem(item, index))}
							</div>
						}
						background="#283673"
					/>
				</div>
				<div className="col-lg-12 col-xl-6 mb-3 h-100">
					<WtcCard
						className="h-100"
						title={<div className="text-white">{t("Tickets")}</div>}
						body={
							<div className="row h-100">
								<div className="col-sm-5 h-100 pb-3">
									<div
										className="d-flex flex-column align-items-center justify-content-center w-100 p-3 h-100"
										style={{ background: "#FFF6E4", borderRadius: 11 }}
									>
										<IconButton
											icon={"ri-hand-coin-fill"}
											width={72}
											height={72}
											onClick={() => {}}
											actived={false}
											className="custom-yellow-icon-button"
										/>
										<div className="pt-2 fw-bold">{t("ticket_total")}</div>
										<div className="fs-2 fw-bold custom-text-primary">512</div>
										<div className="d-flex">
											<div className="custom-text-grey align-self-center">Hôm qua: 300</div>
											<div className="d-flex inc-percent-box text-white mx-2 px-1">
												<i className="ri-arrow-up-line fs-4 me-1"></i>
												<span className="align-self-center">37.8%</span>
											</div>
										</div>
										<div className="d-flex mt-2">
											<div className="custom-text-grey align-self-center">Hôm nay: 200</div>
											<div className="d-flex inc-percent-box text-white mx-2 px-1">
												<i className="ri-arrow-up-line fs-4 me-1"></i>
												<span className="align-self-center">37.8%</span>
											</div>
										</div>
									</div>
								</div>
								<div className="col-sm-7">
									<div className="row">
										<div className="col-sm-6 pb-3">
											<div
												className="d-flex w-100 p-3"
												style={{ background: "#FFFFFF", borderRadius: 11, height: 117 }}
											>
												<div className="align-self-center">
													<IconButton
														icon={"ri-user-follow-fill"}
														width={48}
														height={48}
														onClick={() => {}}
														actived={false}
														className="custom-primary-button"
													/>
												</div>
												<div className="flex-grow-1"></div>
											</div>
										</div>
										<div className="col-sm-6 pb-3">
											<div
												className="d-flex w-100 p-3"
												style={{ background: "#FFFFFF", borderRadius: 11, height: 117 }}
											>
												<div className="align-self-center">
													<IconButton
														icon={"ri-user-location-fill"}
														width={48}
														height={48}
														onClick={() => {}}
														actived={false}
														className="custom-primary-button"
													/>
												</div>
												<div className="flex-grow-1"></div>
											</div>
										</div>
										<div className="col-sm-6 pb-3">
											<div
												className="d-flex w-100 p-3"
												style={{ background: "#FFFFFF", borderRadius: 11, height: 117 }}
											>
												<div className="align-self-center">
													<IconButton
														icon={"ri-user-unfollow-fill"}
														width={48}
														height={48}
														onClick={() => {}}
														actived={false}
														className="custom-primary-button"
													/>
												</div>
												<div className="flex-grow-1"></div>
											</div>
										</div>
										<div className="col-sm-6 pb-3">
											<div
												className="d-flex w-100 p-3"
												style={{ background: "#FFFFFF", borderRadius: 11, height: 117 }}
											>
												<div className="align-self-center">
													<IconButton
														icon={"ri-user-follow-fill"}
														width={48}
														height={48}
														onClick={() => {}}
														actived={false}
														className="custom-primary-button"
													/>
												</div>
												<div className="flex-grow-1"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						}
						background="#283673"
					/>
					{/* <WtcCard 
                    title={<>Thông báo</>} 
                    body={<></>}
                /> */}
				</div>
			</div>
			{/* <div className="row pt-3">
            <div className="col-sm-6">
                <WtcCard
                    title={<>Tổng quan hoạt động</>}
                    body={<></>}
                />
            </div>
            <div className="col-sm-3">
                <WtcCard
                    title={<>Tổng quan doanh thu</>}
                    body={<></>}
                />
            </div>
            <div className="col-sm-3">
                <WtcCard
                    title={<>Tiến độ KPI</>}
                    body={<></>}
                />
            </div>
        </div> */}
		</>
	);
}
