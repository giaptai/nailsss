import { t } from "i18next";
import { Toast } from "primereact/toast";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import useWindowSize from "../app/screen";
import notiSound from "../assets/audio/notification.mp3";
import Header from "../components/Header";
import { HttpService } from "../services/http/HttpService";
import { RoleService } from "../services/Role.service";
import { setExpired, setRefreshToken } from "../slices/app.slice";
import { resetLoginState } from "../slices/auth.slice";
import { clearState, resetState } from "../slices/newOder.slice";
import { fetchPermissions } from "../slices/masterdata.slice";
import { OrderRealTimeAction } from "../slices/order.slice";
import { showMessageToast } from "../utils/alert.util";
import Login from "./Login";
type Props = {
	children: JSX.Element;
	target: string;
	isBodyHeight?: boolean;
};
export default function Layout(props: Props) {
	const screenSize = useWindowSize();
	const dispatch = useAppDispatch();
	const bodyHeight = screenSize.height;
	const appState = useAppSelector((state) => state.app);
	const masterState = useAppSelector((state) => state.masterdata);
	const idUserLogin = useAppSelector((state) => state.auth.user._id);
	const notificationSound = new Audio(notiSound);
	const [socket, setSocket] = useState<any>(undefined);
	const [fetched, setFetched] = useState(false);
	const toast = useRef<any>(null);
	const location = useLocation();
	const path = location.pathname;
	const navigate = useNavigate();
	const authState = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (socket) {
			socket.on("CHECK_IN", (data: any) => {
				console.log("🚀 ~ socket.on ~ data:", data);
				notificationSound.play();
				dispatch(OrderRealTimeAction({ toast: toast, dataSend: data }));
			});
			socket.on("ORDER", (data: any) => {
				console.log("🚀 ~ socket.on ~ data:", data);
				notificationSound.play();
				dispatch(OrderRealTimeAction({ toast: toast, dataSend: data }));
			});
			socket.on("error", (error: any) => {
				console.log("ERROR");
				console.log(error);
			});
			socket.on("connect", () => {
				console.log("Socket connected:", socket.id);
			});
			socket.on("connect_error", (err: any) => {
				console.error("Socket connection error:", err);
			});
		}
	}, [socket]);
	useEffect(() => {
		if (appState.logined) {
			//console.log("appState.refreshToken", appState.refreshToken);
			if (!fetched) {
				dispatch(fetchPermissions(localStorage.getItem(import.meta.env.VITE_APP_dbNameKey!)));
			}
			if (!socket) {
				const newSocket = io(import.meta.env.VITE_URL_SOCKET, {
					transports: ["websocket"],
					auth: {
						userId: idUserLogin,
					},
					query: {
						dbName: localStorage.getItem(import.meta.env.VITE_APP_dbNameKey!),
					},
				});
				setSocket(newSocket);
			}
		} else {
			dispatch(setRefreshToken(undefined));
			HttpService.setRefreshToken("");
			dispatch(resetState());
			if (socket) {
				socket.disconnect();
			} else {
				setSocket(null);
			}
			dispatch(resetLoginState());
			dispatch(clearState());
		}
	}, [appState.logined, fetched]);
	useEffect(() => {
		if (masterState.fetchState && masterState.fetchState.status === "completed") {
			setFetched(true);
		}
	}, [masterState.fetchState]);
	useEffect(() => {
		if (appState.expired) {
			showMessageToast(toast, "warn", t("Your session was expired!"));
			dispatch(setExpired(false));
		}
	}, [appState.expired]);
	useEffect(() => {
		const hasPermission = RoleService.isAllowPage(authState.role, path);
		if (!hasPermission) {
			navigate("/");
		}
	}, [path, authState.role, navigate]);
	return (
		<div key={"app-" + appState.language}>
			<div className="body">
				<Toast ref={toast} />
				{appState.logined ? (
					<div className="d-flex flex-column h-100">
						<Header />
						<div className="flex-grow-1 px-3 py-2" style={{ height: bodyHeight - 73, overflowY: "auto" }}>
							<Suspense fallback={<></>}>{props.children}</Suspense>
						</div>
					</div>
				) : (
					<div style={{ height: bodyHeight - 1, overflowY: "auto" }}>
						<Suspense fallback={<></>}>
							<Login />
						</Suspense>
					</div>
				)}
			</div>
		</div>
	);
}
