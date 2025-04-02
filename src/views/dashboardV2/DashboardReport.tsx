import { t } from "i18next";
// import WtcButton from "../components/commons/WtcButton";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import useWindowSize from "../../app/screen";
import WtcCard from "../../components/commons/WtcCard";
import WtcCardV2 from "../../components/commons/WtcCardV2";
import BarChart from "./Charts/BarChart";
import ProgressBar from "./Charts/ProgressBar";
import Visitor from "./Visitor";

export default function DashboardReport() {
	const screenSize = useWindowSize();
	// const customerState = useAppSelector((state) => state.customer);
	// const employeeState = useAppSelector((state) => state.user);
	const [showSidebar, setShowSidebar] = useState(false);

	// const typesCus = [
	// 	{ id: "WAIT", name: "WAIT" },
	// 	{ id: "PROCESS", name: "PROCESS" },
	// ];
	// const typesEmpl = [
	// 	{ id: "EMPTY", name: "EMPTY" },
	// 	{ id: "PROCESS", name: "PROCESS" },
	// ];
	// const [activeTabName, setActiveTabName] = useState<"info" | "role" | "addstore">("info");
	const data = {
		revenue: [34, 56, 75, 87, 45, 65, 18],
		customers: [23, 83, 59, 56, 19, 94, 36],
		categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	};
	// const menuListEmpl = (item: any, index: number) => {
	// 	return (
	// 		<div key={`empl` + index} className="menu-item-2 my-1">
	// 			<div className="col-sm-12">
	// 				<div
	// 					className="d-flex align-items-center py-2 mb-2 bg-white"
	// 					style={{ borderRadius: 12 }}
	// 					onClick={() => item.command()}
	// 				>
	// 					<div className="d-flex align-items-center p-1" onClick={() => {}}>
	// 						<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
	// 							<div>{item.profile?.firstName + " " + item.profile?.lastName}</div>
	// 							<div className="label-role">{item.role}</div>
	// 						</div>
	// 					</div>
	// 					<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
	// 						{item?.label}
	// 					</div>
	// 					{index < 5 ? (
	// 						<WtcButton
	// 							label={t("Đang trống")}
	// 							className={`button-status-empty-empl me-1`}
	// 							fontSize={14}
	// 							height={32}
	// 							borderRadius={50}
	// 							width={99}
	// 							onClick={() => {}}
	// 						/>
	// 					) : index < 15 ? (
	// 						<WtcButton
	// 							label={t("Đang chờ khách")}
	// 							className={`button-status-danger-empl me-1`}
	// 							fontSize={14}
	// 							height={32}
	// 							borderRadius={50}
	// 							width={130}
	// 							onClick={() => {}}
	// 						/>
	// 					) : (
	// 						<WtcButton
	// 							label={t("Đang làm")}
	// 							className={`button-status-success-empl me-1`}
	// 							fontSize={14}
	// 							height={32}
	// 							borderRadius={50}
	// 							width={99}
	// 							onClick={() => {}}
	// 						/>
	// 					)}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// };
	// const menuListCus = (item: any, index: number) => {
	// 	return (
	// 		<div className="menu-item-2 my-1">
	// 			<div className="col-sm-12">
	// 				<div
	// 					className="d-flex align-items-center py-2 mb-2 bg-white"
	// 					style={{ borderRadius: 12 }}
	// 					onClick={() => item.command()}
	// 				>
	// 					<div className="d-flex align-items-center p-1" onClick={() => {}}>
	// 						<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
	// 							<div>{item.firstName + " " + item.lastName}</div>
	// 							<div className="label-role">{formatPhoneNumberViewUI(item.phone)}</div>
	// 						</div>
	// 					</div>
	// 					<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
	// 						{item?.label}
	// 					</div>
	// 					{index < 5 ? (
	// 						<WtcButton
	// 							label={t("Đang chờ")}
	// 							className={`button-status-empty-empl me-1`}
	// 							fontSize={14}
	// 							height={32}
	// 							borderRadius={50}
	// 							width={99}
	// 							onClick={() => {}}
	// 						/>
	// 					) : (
	// 						<WtcButton
	// 							label={t("Đang thực hiện")}
	// 							className={`button-status-success-empl me-1`}
	// 							fontSize={14}
	// 							height={32}
	// 							borderRadius={50}
	// 							width={130}
	// 							onClick={() => {}}
	// 						/>
	// 					)}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// };
	// const employeeModelView = () => {
	// 	const tabs = [
	// 		t("Khách hàng"),
	// 		t("Nhân viên"),
	// 		// ,t('access_store')
	// 	];
	// 	const contents = [
	// 		<div className="p-3">
	// 			<>
	// 				<div className={`w-100 d-flex me-order-types`} style={{ overflowX: "auto" }}>
	// 					<div className="d-flex pb-1">
	// 						{typesCus.map((e, i) => {
	// 							return (
	// 								<div key={"product-type-" + i} className="me-1 mb-1">
	// 									<WtcButton
	// 										label={e.name}
	// 										fontSize={16}
	// 										height={40}
	// 										borderRadius={12}
	// 										width={90}
	// 										className={`${
	// 											false ? "my-custom-primary-outline-active" : ""
	// 										} my-custom-primary-outline primary-color one-line-ellipsis`}
	// 										onClick={() => {}}
	// 									/>
	// 								</div>
	// 							);
	// 						})}
	// 					</div>
	// 				</div>
	// 				<div className="row" style={{ height: screenSize.height - 207 }}>
	// 					<WtcCard
	// 						classNameBody="flex-grow-1 px-0 pb-0 my-0"
	// 						className="h-100"
	// 						background="#F4F4F4"
	// 						body={
	// 							<>
	// 								{customerState.list.map((item, index) => {
	// 									return <div key={index}>{menuListCus(item, index)}</div>;
	// 								})}
	// 							</>
	// 						}
	// 					/>
	// 				</div>
	// 			</>
	// 		</div>,
	// 		<div className="p-3">
	// 			<div className={`w-100 d-flex me-order-types`} style={{ overflowX: "auto" }}>
	// 				<div className="d-flex pb-1">
	// 					{typesEmpl.map((e, i) => {
	// 						return (
	// 							<div key={"product-type-" + i} className="me-1 mb-1">
	// 								<WtcButton
	// 									label={e.name}
	// 									fontSize={16}
	// 									height={40}
	// 									borderRadius={12}
	// 									width={90}
	// 									className={`${
	// 										false ? "my-custom-primary-outline-active" : ""
	// 									} my-custom-primary-outline primary-color one-line-ellipsis`}
	// 									onClick={() => {}}
	// 								/>
	// 							</div>
	// 						);
	// 					})}
	// 				</div>
	// 			</div>
	// 			<div className="row" style={{ height: screenSize.height - 207 }}>
	// 				<WtcCard
	// 					className="h-100"
	// 					classNameBody="flex-grow-1 px-0 pb-0 my-0"
	// 					background="#F4F4F4"
	// 					body={
	// 						<>
	// 							{employeeState.list.map((item, index) => {
	// 								return <div key={index}>{menuListEmpl(item, index)}</div>;
	// 							})}
	// 						</>
	// 					}
	// 				/>
	// 			</div>
	// 		</div>,
	// 	];
	// 	return (
	// 		<WtcTabs
	// 			backgroundPanel="#fff"
	// 			tabs={tabs}
	// 			activeTab={activeTabName == "info" ? 0 : 1}
	// 			contents={contents}
	// 			key={"tab" + activeTabName}
	// 			onChangeTab={(index) => setActiveTabName(index == 0 ? "info" : "role")}
	// 		/>
	// 	);
	// };

	return (
		<>
			<div className="d-flex h-100 overflow-hidden position-relative">
				<div
					className="h-100 px-3 py-2"
					style={{
						overflowY: "auto",
						scrollBehavior: "smooth",
						scrollbarWidth: "none",
						minWidth: "calc(100% - 512px)",
						flex: 1,
						transition: "all 0.3s ease-in-out",
					}}
				>
					<div className="dashboard row" style={{ height: 176 }}>
						<div className="col-md-6">
							<WtcCardV2
								className="h-100 shadow"
								borderRadius={8}
								hideBorder
								title={<div className="text-black">{t("saleresult")}</div>}
								body={
									<div
										className="d-flex flex-column align-items-start w-100 h-100"
										style={{ borderRadius: 11 }}
									>
										<div className="fw-bold" style={{ color: "#1160B7", fontSize: "42px" }}>
											86,868,000 đ
										</div>
										<div className="d-flex gap-1">
											<div
												className="d-flex inc-percent-box-up px-1"
												style={{ color: "#15AF59" }}
											>
												<i className="ri-arrow-up-line fs-4 me-1"></i>
												<span className="align-self-center">86.8%</span>
											</div>
											<div className="custom-text-grey align-self-center">
												vs {t("yesterday")}: 68,686,000 đ
											</div>
										</div>
									</div>
								}
								background="#283673"
							/>
						</div>
						<div className="col-md-6">
							<WtcCardV2
								className="h-100 shadow"
								borderRadius={8}
								hideBorder
								title={<div className="text-black">Khách tham quan hôm nay</div>}
								body={
									<div
										className="d-flex flex-column align-items-start w-100 h-100"
										style={{ borderRadius: 11 }}
									>
										<div className="d-flex align-items-center w-100">
											<div
												className="fw-bold d-flex align-items-center"
												style={{ color: "#FFCB73", fontSize: "42px" }}
											>
												45
											</div>
											<div
												className="d-flex align-items-center h-100 w-100 p-3"
												style={{ color: "#1160B7", cursor: "pointer" }}
												onClick={() => {
													setShowSidebar((prev) => !prev);
												}}
											>
												<p className="my-auto" style={{ fontSize: "18px", fontWeight: "400" }}>
													Check visitor’s status
												</p>
												<ArrowRight style={{ width: 24, height: 24 }} />
											</div>
										</div>
										<div className="d-flex gap-1">
											<div
												className="d-flex inc-percent-box-down px-1"
												style={{ color: "#A31415" }}
											>
												<i className="ri-arrow-down-line fs-4 me-1"></i>
												<span className="align-self-center">6.78%</span>
											</div>
											<div className="custom-text-grey align-self-center">
												vs {t("yesterday")}: 65
											</div>
										</div>
									</div>
								}
								background="#283673"
							/>
						</div>
					</div>
					<div className="mt-3" style={{ height: "482px" }}>
						<WtcCard
							className="h-100 shadow"
							background="#FFF"
							hideBorder
							borderRadius={8}
							title={
								<>
									<div className="my-label-dashboard fs-4 fw-bold">Tổng quan hoạt động</div>
								</>
							}
							body={
								<>
									<BarChart data={data} />
								</>
							}
						/>
					</div>
					<div className="row mt-3 pb-3" style={{ height: screenSize.height - 335, maxHeight: "280px" }}>
						<div className="col-md-12 h-100">
							<WtcCard
								className="h-100 shadow"
								background="#FFF"
								hideBorder
								borderRadius={8}
								title={
									<>
										<div className="my-label-dashboard fs-4 fw-bold">Tiến độ KPI</div>
									</>
								}
								body={
									<>
										<div className="d-flex justify-content-around gap-4">
											<div
												className="px-3 d-flex flex-column justify-content-center w-100"
												style={{
													backgroundColor: "#F4F4F4",
													height: "80px",
													borderRadius: "8px",
												}}
											>
												<span className="label-kpi" style={{ fontSize: "16px" }}>
													KPI:
												</span>
												<span
													className="value-kpi"
													style={{ fontSize: "20px", fontWeight: "400" }}
												>
													1.000.000.000$
												</span>
											</div>
											<div
												className="px-3 d-flex flex-column justify-content-center w-100"
												style={{
													backgroundColor: "#F4F4F4",
													height: "80px",
													borderRadius: "8px",
												}}
											>
												<span className="label-kpi" style={{ fontSize: "16px" }}>
													Đã đạt:
												</span>
												<span
													className="value-kpi"
													style={{ fontSize: "20px", fontWeight: "400" }}
												>
													800.000.000$
												</span>
											</div>
											<div
												className="px-3 d-flex flex-column justify-content-center w-100"
												style={{
													backgroundColor: "#F4F4F4",
													height: "80px",
													borderRadius: "8px",
												}}
											>
												<span className="label-kpi" style={{ fontSize: "16px" }}>
													Còn thiếu:
												</span>
												<span
													className="value-kpi"
													style={{ fontSize: "20px", fontWeight: "400" }}
												>
													200.000.000$
												</span>
											</div>
										</div>
										<ProgressBar percentage={80} />
									</>
								}
							/>
						</div>
					</div>
				</div>
				<Visitor showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
				{/* <div className="col-md-12 h-100">{employeeModelView()}</div> */}
			</div>
		</>
	);
}
