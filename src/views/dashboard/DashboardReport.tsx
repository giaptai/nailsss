import { t } from "i18next";
// import WtcButton from "../components/commons/WtcButton";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import IconButton from "../../components/commons/IconButton";
import WtcButton from "../../components/commons/WtcButton";
import WtcCard from "../../components/commons/WtcCard";
import WtcTabs from "../../components/commons/WtcTabs";
import BarChart from "./Charts/BarChart";
import RadialBarChart from "./Charts/RadialChart";
import { formatPhoneNumberViewUI } from "../../const";

export default function DashboardReport() {
	const screenSize = useWindowSize();
	const customerState = useAppSelector((state) => state.customer);
	const employeeState = useAppSelector((state) => state.user);
	// const role = useAppSelector(state => state.auth.role)
	const typesCus = [
		{ id: "WAIT", name: "WAIT" },
		{ id: "PROCESS", name: "PROCESS" },
	];
	const typesEmpl = [
		{ id: "EMPTY", name: "EMPTY" },
		{ id: "PROCESS", name: "PROCESS" },
	];
	const [activeTabName, setActiveTabName] = useState<"info" | "role" | "addstore">("info");
	const data = {
		revenue: [34, 56, 75, 87, 45, 65, 18],
		customers: [23, 83, 59, 56, 19, 94, 36],
		categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	};
	const menuListEmpl = (item: any, index: number) => {
		return (
			<div key={`empl` + index} className="menu-item-2 my-1">
				<div className="col-sm-12">
					<div
						className="d-flex align-items-center py-2 mb-2 bg-white"
						style={{ borderRadius: 12 }}
						onClick={() => item.command()}
					>
						<div className="d-flex align-items-center p-1" onClick={() => {}}>
							<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
								<div>{item.profile?.firstName + " " + item.profile?.lastName}</div>
								<div className="label-role">{item.role}</div>
							</div>
						</div>
						<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
							{item?.label}
						</div>
						{index < 5 ? (
							<WtcButton
								label={t("Đang trống")}
								className={`button-status-empty-empl me-1`}
								fontSize={14}
								height={32}
								borderRadius={50}
								width={99}
								onClick={() => {}}
							/>
						) : index < 15 ? (
							<WtcButton
								label={t("Đang chờ khách")}
								className={`button-status-danger-empl me-1`}
								fontSize={14}
								height={32}
								borderRadius={50}
								width={130}
								onClick={() => {}}
							/>
						) : (
							<WtcButton
								label={t("Đang làm")}
								className={`button-status-success-empl me-1`}
								fontSize={14}
								height={32}
								borderRadius={50}
								width={99}
								onClick={() => {}}
							/>
						)}
					</div>
				</div>
			</div>
		);
	};
	const menuListCus = (item: any, index: number) => {
		return (
			<div className="menu-item-2 my-1">
				<div className="col-sm-12">
					<div
						className="d-flex align-items-center py-2 mb-2 bg-white"
						style={{ borderRadius: 12 }}
						onClick={() => item.command()}
					>
						<div className="d-flex align-items-center p-1" onClick={() => {}}>
							<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
								<div>{item.firstName + " " + item.lastName}</div>
								<div className="label-role">{formatPhoneNumberViewUI(item.phone)}</div>
							</div>
						</div>
						<div className="flex-grow-1 ps-2" style={{ color: "#30363F" }}>
							{item?.label}
						</div>
						{index < 5 ? (
							<WtcButton
								label={t("Đang chờ")}
								className={`button-status-empty-empl me-1`}
								fontSize={14}
								height={32}
								borderRadius={50}
								width={99}
								onClick={() => {}}
							/>
						) : (
							<WtcButton
								label={t("Đang thực hiện")}
								className={`button-status-success-empl me-1`}
								fontSize={14}
								height={32}
								borderRadius={50}
								width={130}
								onClick={() => {}}
							/>
						)}
					</div>
				</div>
			</div>
		);
	};
	const employeeModelView = () => {
		const tabs = [
			t("Khách hàng"),
			t("Nhân viên"),
			// ,t('access_store')
		];
		const contents = [
			<div className="p-3">
				<>
					<div className={`w-100 d-flex me-order-types`} style={{ overflowX: "auto" }}>
						<div className="d-flex pb-1">
							{typesCus.map((e, i) => {
								return (
									<div key={"product-type-" + i} className="me-1 mb-1">
										<WtcButton
											label={e.name}
											fontSize={16}
											height={40}
											borderRadius={12}
											width={90}
											className={`${
												false ? "my-custom-primary-outline-active" : ""
											} my-custom-primary-outline primary-color one-line-ellipsis`}
											onClick={() => {}}
										/>
									</div>
								);
							})}
						</div>
					</div>
					<div className="row" style={{ height: screenSize.height - 207 }}>
						<WtcCard
							classNameBody="flex-grow-1 px-0 pb-0 my-0"
							className="h-100"
							background="#F4F4F4"
							body={
								<>
									{customerState.list.map((item, index) => {
										return <div key={index}>{menuListCus(item, index)}</div>;
									})}
								</>
							}
						/>
					</div>
				</>
			</div>,
			<div className="p-3">
				<div className={`w-100 d-flex me-order-types`} style={{ overflowX: "auto" }}>
					<div className="d-flex pb-1">
						{typesEmpl.map((e, i) => {
							return (
								<div key={"product-type-" + i} className="me-1 mb-1">
									<WtcButton
										label={e.name}
										fontSize={16}
										height={40}
										borderRadius={12}
										width={90}
										className={`${
											false ? "my-custom-primary-outline-active" : ""
										} my-custom-primary-outline primary-color one-line-ellipsis`}
										onClick={() => {}}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<div className="row" style={{ height: screenSize.height - 207 }}>
					<WtcCard
						className="h-100"
						classNameBody="flex-grow-1 px-0 pb-0 my-0"
						background="#F4F4F4"
						body={
							<>
								{employeeState.list.map((item, index) => {
									return <div key={index}>{menuListEmpl(item, index)}</div>;
								})}
							</>
						}
					/>
				</div>
			</div>,
		];
		return (
			<WtcTabs
				backgroundPanel="#fff"
				tabs={tabs}
				activeTab={activeTabName == "info" ? 0 : 1}
				contents={contents}
				key={"tab" + activeTabName}
				onChangeTab={(index) => setActiveTabName(index == 0 ? "info" : "role")}
			/>
		);
	};

	return (
		<>
			<div className="row" style={{ height: screenSize.height - 101 }}>
				<div className="col-md-9 h-100">
					<div className="dashboard" style={{ height: 227 }}>
						<WtcCard
							className="h-100"
							title={<div className="text-white">{t("saleresult")}</div>}
							body={
								<div className="row">
									<div className="col-sm-5">
										<div
											className="d-flex flex-column align-items-center justify-content-center w-100 p-3 h-100"
											style={{ background: "#FFF6E4", borderRadius: 11 }}
										>
											{/* <IconButton icon={"ri-hand-coin-fill"} width={72} height={72} onClick={() => { }} actived={false} className='custom-yellow-icon-button' /> */}
											<div className="pt-2 fw-bold">{t("Tổng doanh thu")}</div>
											<div className="fs-2 fw-bold custom-text-primary">86,868,000</div>
											<div className="d-flex">
												<div className="custom-text-grey align-self-center">
													{t("yesterday")}: 68,686,000
												</div>
												<div className="d-flex inc-percent-box text-white mx-2 px-1">
													<i className="ri-arrow-up-line fs-4 me-1"></i>
													<span className="align-self-center">86.8%</span>
												</div>
											</div>
										</div>
									</div>
									<div className="col-sm-7 h-100">
										<div className="row">
											<div className="col-sm-6 pb-3 position-relative">
												<div
													className="d-flex w-100 px-3 py-2"
													style={{ background: "#FFFFFF", borderRadius: 11, height: "auto" }}
												>
													<div className="align-self-center me-2">
														<IconButton
															icon={"ri-user-follow-fill"}
															width={48}
															height={48}
															onClick={() => {}}
															actived={false}
															className="custom-primary-button"
														/>
													</div>
													<div className="ms-1 flex-grow-1">
														<div className="my-number-dashboard">45</div>
														<div className="my-label-dashboard">Khách hàng hôm nay</div>
													</div>
												</div>
											</div>
											<div className="col-sm-6 pb-3">
												<div
													className="d-flex w-100 px-3 py-2"
													style={{ background: "#FFFFFF", borderRadius: 11, height: "auto" }}
												>
													<div className="align-self-center me-2">
														<IconButton
															icon={"ri-time-line"}
															width={48}
															height={48}
															onClick={() => {}}
															actived={false}
															className="custom-primary-button"
														/>
													</div>
													<div className="ms-1 flex-grow-1">
														<div className="my-number-dashboard">19</div>
														<div className="my-label-dashboard">Khách đang phục vụ</div>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div
													className="d-flex w-100 px-3 py-2"
													style={{ background: "#FFFFFF", borderRadius: 11, height: "auto" }}
												>
													<div className="align-self-center me-2">
														<IconButton
															icon={"ri-user-shared-2-fill"}
															width={48}
															height={48}
															onClick={() => {}}
															actived={false}
															className="custom-primary-button"
														/>
													</div>
													<div className="ms-1 flex-grow-1">
														<div className="my-number-dashboard">19</div>
														<div className="my-label-dashboard">Khách hẹn sắp đến</div>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div
													className="d-flex w-100 px-3 py-2"
													style={{ background: "#FFFFFF", borderRadius: 11, height: "auto" }}
												>
													<div className="align-self-center me-2">
														<IconButton
															icon={"ri-user-unfollow-fill"}
															width={48}
															height={48}
															onClick={() => {}}
															actived={false}
															className="custom-primary-button"
														/>
													</div>
													<div className="ms-1 flex-grow-1">
														<div className="my-number-dashboard">1</div>
														<div className="my-label-dashboard">Khách hủy lịch</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							}
							background="#283673"
						/>
					</div>
					<div className="row mt-3" style={{ height: screenSize.height - 335 }}>
						<div className="col-md-8 h-100">
							<WtcCard
								className="h-100"
								background="#FFF"
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
						<div className="col-md-4 h-100">
							<WtcCard
								className="h-100"
								background="#FFF"
								title={
									<>
										<div className="my-label-dashboard fs-4 fw-bold">Tiến độ KPI</div>
									</>
								}
								body={
									<>
										<RadialBarChart percentage={80} />
										<div className="px-3 d-flex justify-content-between">
											<span className="label-kpi">KPI:</span>
											<span className="value-kpi">1.000.000.000$</span>
										</div>
										<div className="px-3 d-flex justify-content-between">
											<span className="label-kpi">Đã đạt:</span>
											<span className="value-kpi">800.000.000$</span>
										</div>
										<div className="px-3 d-flex justify-content-between">
											<span className="label-kpi">Còn thiếu:</span>
											<span className="value-kpi">200.000.000$</span>
										</div>
									</>
								}
							/>
						</div>
					</div>
				</div>
				<div className="col-md-3 h-100">{employeeModelView()}</div>
			</div>
		</>
	);
}
