import { LogOut, Settings } from "lucide-react";
import "./sidebar.css";
import { useEffect, useState } from "react";
import { ProfileState } from "../../slices/profile.slice";
import Loading from "../../assets/images/loading_beautiful.gif";
import NoAvatar from "../../assets/images/empty/no-avatar.jpg";
import { useAppSelector } from "../../app/hooks";
import { Avatar } from "primereact/avatar";
import { formatCapitalize, PageTarget } from "../../const";
import { RoleService } from "../../services/Role.service";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SidebarV2() {
	const location = useLocation();
	const { t } = useTranslation();
	const profile = useAppSelector((state) => state.profile);
	const user = useAppSelector((state) => state.app.user);
	const role = useAppSelector((state) => state.auth.role);
	const [AvatarView, setAvatarView] = useState(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const navigate = useNavigate();

	function getImageSource(profile: ProfileState) {
		if (profile?.getAvtState === "loading") {
			return Loading;
		} else if (profile?.avatar && profile.avatar !== "") {
			return profile.avatar;
		} else {
			return NoAvatar;
		}
	}

	const items: any[] = [
		{
			id: PageTarget.dashboard,
			label: t("DASH"),
			icon: "ri-layout-grid-fill",
			visible: RoleService.isAllowMenu(role, PageTarget.dashboard),
			command: () => ({
				url: "/",
				action: () => navigate("/"),
			}),
		},
		{
			id: PageTarget.employee,
			label: t("Employees"),
			icon: "ri-user-line",
			visible: RoleService.isAllowMenu(role, PageTarget.employee),
			command: () => ({
				url: "/employees",
				action: () => navigate("/employees"),
			}),
		},
		{
			label: t("Customers"),
			icon: "ri-group-3-line",
			visible: RoleService.isAllowMenu(role, PageTarget.customer),
			command: () => ({
				url: "/customers",
				action: () => navigate("/customers"),
			}),
		},
		{
			id: PageTarget.role,
			label: t("Roles"),
			icon: "ri-shield-keyhole-line",
			visible: RoleService.isAllowMenu(role, PageTarget.role),
			command: () => ({
				url: "/roles",
				action: () => navigate("/roles"),
			}),
		},
		{
			id: PageTarget.window,
			label: t("window"),
			icon: "ri-window-line",
			visible: RoleService.isAllowMenu(role, PageTarget.window),
			command: () => ({
				url: "/window",
				action: () => navigate("/window"),
			}),
		},
		{
			id: PageTarget.service,
			label: t("Services"),
			icon: "ri-service-line",
			visible: RoleService.isAllowMenu(role, PageTarget.service),
			command: () => ({
				url: "/service",
				action: () => navigate("/service"),
			}),
		},
		{
			id: PageTarget.giftcard,
			label: t("giftcards"),
			icon: "ri-gift-line",
			visible: RoleService.isAllowMenu(role, PageTarget.giftcard),
			command: () => ({
				url: "/giftcard",
				action: () => navigate("/giftcard"),
			}),
		},
		{
			id: PageTarget.menu,
			label: t("menu"),
			icon: "ri-menu-line",
			visible: RoleService.isAllowMenu(role, PageTarget.menu),
			command: () => ({
				url: "/menu",
				action: () => navigate("/menu"),
			}),
		},
		{
			id: PageTarget.storeconfig,
			label: t("storeconfig"),
			icon: "ri-settings-2-line",
			visible: RoleService.isAllowMenu(role, PageTarget.storeconfig),
			command: () => ({
				url: "/storeconfig",
				action: () => navigate("/storeconfig"),
			}),
		},
		{
			id: "POSITION",
			label: t("position"),
			icon: "ri-user-location-line",
			visible: RoleService.isAllowMenu(role, "POSITION"),
			command: () => ({
				url: "/position-list",
				action: () => navigate("/position-list"),
			}),
		},
		{
			id: PageTarget.booking,
			label: t("booking"),
			icon: "ri-receipt-line",
			visible: RoleService.isAllowMenu(role, PageTarget.booking),
			command: () => ({
				url: "/booking",
				action: () => navigate("/booking"),
			}),
		},
		{
			id: PageTarget.order,
			label: t("order"),
			icon: "ri-receipt-line",
			visible: RoleService.isAllowMenu(role, PageTarget.order),
			command: () => ({
				url: "/order",
				action: () => navigate("/order"),
			}),
		},
		{
			id: PageTarget.order,
			label: t("orderlist"),
			icon: "ri-receipt-line",
			visible: RoleService.isAllowMenu(role, PageTarget.order),
			command: () => ({
				url: "/order-list",
				action: () => navigate("/order-list"),
			}),
		},
		{
			id: PageTarget.payroll,
			label: t("pay_rolls"),
			icon: "pi pi-dollar",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => ({
				url: "/payrolls",
				action: () => navigate("/payrolls"),
			}),
		},
		{
			id: PageTarget.report,
			label: t("statement"),
			icon: "ri-file-chart-line",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => ({
				url: "/statement",
				action: () => navigate("/statement"),
			}),
		},
		{
			id: PageTarget.report,
			label: t("transactions"),
			icon: "ri-file-chart-line",
			visible: RoleService.isAllowMenu(role, PageTarget.report),
			command: () => ({
				url: "/transactions",
				action: () => navigate("/transactions"),
			}),
		},
	];
	useEffect(() => {
		setAvatarView(getImageSource(profile));
	}, [profile]);

	const name = user?.profile?.firstName + " " + user?.profile?.lastName || "###";

	const menuitem = (item: any, index: number) => (
		<div
			tabIndex={index + 1}
			key={index}
			className={`menu-item text-white ${location.pathname === item.command()?.url ? "active" : ""}`}
			style={{
				maxWidth: isCollapsed ? "48px" : undefined,
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					item.command().action();
				}
			}}
			onClick={() => item.command().action()}
		>
			<i className={item.icon} style={{ fontSize: "16.5px" }} />
			<div className={`flex-grow-1 fw-bold ${isCollapsed && "d-none"}`}>{item?.label}</div>
		</div>
	);

	return (
		<div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
			<div className="sidebar-header my-header-stick">
				<div
					className={`d-flex ${
						isCollapsed ? "justify-content-center" : "justify-content-between"
					} align-items-center w-100 p-3`}
				>
					<span
						className={`logo`}
						style={{
							display: isCollapsed ? "none" : "block",
						}}
					>
						WTC NAILS POS
					</span>
					<i
						className="pi pi-bars"
						style={{ color: "#1B1A19", fontSize: 26, cursor: "pointer" }}
						onClick={() => setIsCollapsed(!isCollapsed)}
					/>
				</div>
			</div>

			<div className="sidebar-menu">
				{items
					.filter((it) => it.visible)
					.map((item, index) => {
						return menuitem(item, index);
					})}
			</div>

			<div className="sidebar-footer" style={{ borderRight: "1px solid #F0F2F4" }}>
				<div className={`user-profile`}>
					<Avatar image={AvatarView || ""} shape="circle" size="large" className="m-auto" />
					<div className={`user-info ${isCollapsed && "d-none"}`}>
						<span className="">{formatCapitalize(name)}</span>
						<div className="title">(Title name)</div>
					</div>
					<div className={`actions ${isCollapsed && "d-none"}`}>
						<Settings />
						<LogOut className="text-danger" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default SidebarV2;
