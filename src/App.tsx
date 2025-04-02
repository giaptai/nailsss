import { use } from "i18next";
import "primeicons/primeicons.css";
import React, { Suspense, useState } from "react";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAppSelector } from "./app/hooks";
import { getLanguageData } from "./app/languages";
import { HttpService } from "./services/http/HttpService";
import EditEmployee from "./views/category/Employees/EditEmployees";
import Employees from "./views/category/EmployeesV2/Employees";
import EmployeesOld from "./views/category/Employees/Employees";
import Giftcard from "./views/category/Giftcard/Giftcard";
import Menu from "./views/category/Menu/Menu";
import MenuItem from "./views/category/Menu/MenuItem";
import ListOrder from "./views/category/Order/ListOrder";
import ListPosition from "./views/category/PositionV2/ListPosition";
import ListPositionOld from "./views/category/Position/ListPosition";
import RefundOrder from "./views/category/refund/Refund";
import Service from "./views/category/Service/Service";
import Statement from "./views/category/Statement/Statement";
import StoreConfig from "./views/category/StoreConfig/StoreConfig";
import Windows from "./views/category/WindowV2/Window";
import WindowsOld from "./views/category/Window/Window";
import ChangePassword from "./views/ChangePassword";
import DashBoard from "./views/Dashboard";
import DashboardReport from "./views/dashboard/DashboardReport";
import DashboardReportV2 from "./views/dashboardV2/DashboardReport";
import Layout from "./views/Layout";
import Payment from "./views/Payment";
import Payrolls from "./views/payrolls/Payrolls";
import TransactionList from "./views/reports/TransactionList";
import SplashScreen from "./views/SplashScreen";
import UpdatePassword from "./views/update_password/update_password";
import LayoutV2 from "./views/LayoutV2";
import Login from "./views/Login";
import useWindowSize from "./app/screen";
const Roles = React.lazy(() => import("./views/roleV2/Roles"));
const RolesInit = React.lazy(() => import("./views/role/Roles"));
const RoleItem = React.lazy(() => import("./views/role/Role.item"));
const Customers = React.lazy(() => import("./views/category/Customers"));
const LanguageEditor = React.lazy(() => import("./views/language/LanguageEditor"));
const Setting = React.lazy(() => import("./views/Setting"));
const Profile = React.lazy(() => import("./views/Profile"));
const Turn = React.lazy(() => import("./views/Turn"));
const Order = React.lazy(() => import("./views/Order"));
const Booking = React.lazy(() => import("./views/category/Booking/Booking"));

function App() {
	const lang = useAppSelector((state) => state.app.user.profile?.language || "en");
	const screenSize = useWindowSize();
	const bodyHeight = screenSize.height;
	use(initReactI18next).init({
		lng: lang,
		resources: {
			en: {
				translation: getLanguageData("en"),
			},
			vi: {
				translation: getLanguageData("vi"),
			},
		},
	});
	HttpService.initialize();
	const [readyApp, setReadyApp] = useState(false);
	if (!readyApp) {
		setTimeout(function () {
			setReadyApp(true);
		}, 860);
		return (
			<>
				<SplashScreen />
			</>
		);
	}
	const pageList = [
		{
			path: "/*",
			element: <LayoutV2 children={<DashboardReportV2 />} target={"/"}></LayoutV2>,
		},
		{
			path: "/:storeCode",
			element: (
				<div style={{ height: bodyHeight - 1, overflowY: "auto" }}>
					<Suspense fallback={<></>}>
						<Login />
					</Suspense>
				</div>
			),
		},
		{
			path: "/v2",
			element: <Layout children={<DashboardReport />} target={"/v2"}></Layout>,
		},
		{
			path: "/functions",
			element: <Layout children={<DashBoard />} target={"/functions"}></Layout>,
		},
		{
			path: "/employees",
			element: <LayoutV2 children={<Employees />} target={"/employees"}></LayoutV2>,
		},
		{
			path: "/employees-old",
			element: <LayoutV2 children={<EmployeesOld />} target={"/employees"}></LayoutV2>,
		},
		{
			path: "/customers",
			element: <Layout children={<Customers />} target={"/customers"}></Layout>,
		},
		{
			path: "/roles-init",
			element: <Layout children={<RolesInit />} target={"/roles-init"}></Layout>,
		},
		{
			path: "/roles",
			element: <LayoutV2 children={<Roles />} target={"/roles"}></LayoutV2>,
		},
		{
			path: "/role-item",
			element: <Layout children={<RoleItem />} target={"/roles"}></Layout>,
		},
		{
			path: "/language",
			element: <Layout children={<LanguageEditor />} target={"/language"}></Layout>,
		},
		{
			path: "/setting",
			element: <Layout children={<Setting />} target={"/setting"}></Layout>,
		},
		{
			path: "/profile",
			element: <Layout children={<Profile />} target={"/profile"}></Layout>,
		},
		{
			path: "/change-password",
			element: <Layout children={<ChangePassword />} target={"/change-password"}></Layout>,
		},
		//client
		{
			path: "/edit-employee",
			element: <Layout children={<EditEmployee />} target={"/edit-employee"}></Layout>,
		},
		{
			path: "/window",
			element: <LayoutV2 children={<Windows />} target={"/window"}></LayoutV2>,
		},
		{
			path: "/window-old",
			element: <LayoutV2 children={<WindowsOld />} target={"/window"}></LayoutV2>,
		},
		{
			path: "/menu",
			element: <Layout children={<Menu />} target={"/menu"}></Layout>,
		},
		{
			path: "/menu-item",
			element: <Layout children={<MenuItem />} target={"/menu-item"}></Layout>,
		},
		{
			path: "/storeconfig",
			element: <Layout children={<StoreConfig />} target={"/storeconfig"}></Layout>,
		},
		{
			path: "/service",
			element: <Layout children={<Service />} target={"/service"}></Layout>,
		},
		{
			path: "/giftcard",
			element: <Layout children={<Giftcard />} target={"/giftcard"}></Layout>,
		},
		{
			path: "/turn",
			element: <Layout children={<Turn />} target={"/turn"}></Layout>,
		},
		{
			path: "/order",
			element: <Layout children={<Order />} target={"/order"}></Layout>,
		},
		{
			path: "/booking",
			element: <LayoutV2 children={<Booking />} target={"/booking"}></LayoutV2>,
		},
		{
			path: "/payment",
			element: <Layout children={<Payment />} target={"/payment"}></Layout>,
		},
		{
			path: "/order-list",
			element: <Layout children={<ListOrder />} target={"/order-list"}></Layout>,
		},
		{
			path: "/position-list",
			element: <LayoutV2 children={<ListPosition />} target={"/position-list"}></LayoutV2>,
		},
		{
			path: "/position-list-old",
			element: <LayoutV2 children={<ListPositionOld />} target={"/position-list-old"}></LayoutV2>,
		},
		{
			path: "/payrolls",
			element: <Layout children={<Payrolls />} target={"/payrolls"}></Layout>,
		},
		{
			path: "/reset-password",
			element: <UpdatePassword />,
		},
		{
			path: "/statement",
			element: <Layout children={<Statement />} target={"/statement"}></Layout>,
		},
		{
			path: "/refund",
			element: <Layout children={<RefundOrder />} target={"/refund"}></Layout>,
		},
		{
			path: "/transactions",
			element: <Layout children={<TransactionList />} target={"/transactions"}></Layout>,
		},
		{
			path: "/dashboard",
			element: <Layout children={<DashboardReport />} target={"/dashboard"}></Layout>,
		},
	];
	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					{pageList.map((page) => (
						<Route key={page.path} path={page.path} element={page.element} />
					))}
				</Routes>
			</div>
		</BrowserRouter>
	);
}
export default App;
