import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import useWindowSize from "../../app/screen";
import emptyImage from "../../assets/images/empty/empty_box_1.svg";
import { update_code, updateCustomer, updatetempService } from "../../slices/refund.slice";
import { toFixedRefactor, toLocaleStringRefactor } from "../../utils/string.ultil";
import EmptyBox from "../commons/EmptyBox";
import SelectedServiceEmployee from "../commons/SelectedServiceEmployee";
import WtcCard from "../commons/WtcCard";
import { FormatMoneyNumber, MethodPayment } from "../../const";
import feeCreditIcon from "../../assets/svg/fee_creditcard.svg";
import { Tooltip } from "primereact/tooltip";
import LoadingIndicator from "../Loading";
export default function RefundOrderOld() {
	const screenSize = useWindowSize();
	const dispatch = useDispatch();
	const bodyHeight = screenSize.height;
	const refundState = useAppSelector((state) => state.refund);
	const newOderState = useAppSelector((state) => state.newOder);
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const [CountService, setCountService] = useState(0);

	const getTaxRate = (data: any): number => {
		const taxRateInfo = data.find((item: any) => item.key === "taxRate");
		return taxRateInfo ? Number(taxRateInfo.value) : 0;
	};
	const ref = useRef<any>(null);
	const [height, setHeight] = useState(0);
	const calculateTotalDiscount = (): number => {
		return refundState.tempService.reduce((total, item) => total + (item.discount || 0), 0);
	};

	useEffect(() => {
		setHeight(ref.current.clientHeight);
		dispatch(updatetempService(newOderState.tempService));
		dispatch(updateCustomer(newOderState.customer));
		dispatch(update_code(newOderState.code));
		const totalServices = newOderState.tempService.reduce(
			(accumulator, item) => accumulator + (item.ListService?.length || 0),
			0
		);
		setCountService(totalServices);
	}, []);

	return (
		<>
			<div className="h-100 my-background-order ps-0 pe-0 pt-0" style={{ borderRadius: "22px", opacity: "0.6" }}>
				<div className="" style={{ height: height == 0 ? 276 : bodyHeight - height - 273 }}>
					<WtcCard
						title={<>{t("Services")}</>}
						background="#dadff2"
						classNameBody="flex-grow-1 px-1 pb-0 my-0"
						className="h-100 pe-0 me-0"
						borderRadius={12}
						body={
							<>
								<div className="pe-1 px-0 h-100" style={{ overflowY: "auto", overflowX: "hidden" }}>
									{refundState.tempService.length > 0 ? (
										<>
											{refundState.tempService.map((item, index) => {
												return (
													<div key={"order-product-" + index}>
														<SelectedServiceEmployee
															status={item.status}
															isView
															Employee={item.Employee}
															ListService={item.ListService}
															_id={""}
															code={undefined}
															tip={item.tip}
															discount={item.discount}
															ListGiftCard={item.ListGiftCard}
															OrderDetailId={item.OrderDetailId}
															BookingDetailId={item.BookingDetailId}
														/>
													</div>
												);
											})}
										</>
									) : (
										<div className="h-100 d-flex flex-column justify-content-center">
											<EmptyBox
												description={<>{t("empty_srv")}</>}
												image={emptyImage}
												disabled={false}
											/>
										</div>
									)}
								</div>
							</>
						}
					/>
				</div>
				<div className="pt-1" style={{ height: 129 }}>
					<WtcCard
						classNameBody="p-0 m-0 h-100"
						className="h-100"
						title={<span className="fs-title">{t("history_payment")}</span>}
						body={
							refundState.fetchState.status == "loading" ? (
								<div className="w-100 h-100 d-flex flex-column justify-content-center text-center">
									<LoadingIndicator />
								</div>
							) : (
								<>
									<div className="me-1 pt-1">
										{refundState.ListPaymentOld.length > 0 &&
											refundState.ListPaymentOld.map((item, index) => {
												return (
													<div
														key={index}
														className={`'w-100 mb-1 my-border-left d-flex py-0 px-2 me-order-product'}`}
														style={{ fontSize: 18, cursor: "pointer" }}
													>
														<div
															className={`w-100 flex-grow-1`}
															onClick={() => {}}
															style={{ alignContent: "center" }}
														>
															<div className="d-flex w-100 align-items-center">
																<div className="flex-grow-1 py-1">
																	{!(
																		item.typePayment == MethodPayment.GIFTCARD ||
																		item.typePayment == MethodPayment.CASH
																	) ? (
																		<>
																			<div
																				className="align-self-center flex-grow-1 ps-2 fs-value fw-bold"
																				style={{ color: "#30363F" }}
																			>
																				<div className="fs-value">
																					{item.feeCreditCard &&
																					item.feeCreditCard > 0 ? (
																						<>
																							<img
																								id="isFee"
																								className="size-svg-order"
																								src={feeCreditIcon}
																							/>{" "}
																							<Tooltip
																								style={{
																									fontSize: 10,
																								}}
																								position="mouse"
																								target="#isFee"
																								content={t(
																									"isFeeCreditcard"
																								)}
																							/>
																						</>
																					) : null}
																					{t("credit_card")}
																					<span className="my-label-in-grid">
																						{" - "}
																						{t(item.optionPayment || "") ||
																							""}
																					</span>
																				</div>
																			</div>
																		</>
																	) : (
																		<>
																			<div
																				className="align-self-center flex-grow-1 ps-2 fw-bold"
																				style={{ color: "#30363F" }}
																			>
																				<div className="fs-value">
																					{t(item.typePayment)}
																				</div>
																			</div>
																		</>
																	)}
																</div>
																<div className=" px-2" style={{ fontWeight: 700 }}>
																	<div className={"wtc-text-primary fs-value"}>
																		$
																		{item.feeCreditCard && item?.feeCreditCard > 0
																			? FormatMoneyNumber(
																					Number(item.amount) +
																						item.feeCreditCard
																			  )
																			: toLocaleStringRefactor(
																					toFixedRefactor(
																						Number(item.amount),
																						2
																					)
																			  )}
																	</div>
																</div>
															</div>
														</div>
													</div>
												);
											})}
									</div>
								</>
							)
						}
					/>
				</div>
				<div className="ps-0 pe-1 d-flex flex-column" style={{ borderRadius: 20, height: 100 }} ref={ref}>
					<div className="flex-grow-1 d-flex align-items-end pt-1 pe-2 ps-1">
						<div className="d-flex align-items-end">
							<div className=" ps-1 fw-bold" style={{ color: "#30363F" }}>
								<div className="label-item-total fs-value">
									{t("Services")} (
									<span className="label-total fs-value-disabled">{CountService} items</span>)&ensp;
									<span className="wtc-text-primary">
										$ {toLocaleStringRefactor(toFixedRefactor(refundState.totalAmount, 2))}
									</span>
								</div>

								<div className="label-item-total">
									{t("taxs")} (
									<span className="label-total fs-value-disabled">
										{getTaxRate(storeConfigState.list)}%
									</span>
									)&ensp;<span className="wtc-text-primary">$ {refundState.tax}</span>
								</div>

								<div className="label-item-total">
									{t("tips")}&ensp;
									<span className="wtc-text-primary">
										$ {toLocaleStringRefactor(toFixedRefactor(refundState.tip, 2))}
									</span>
								</div>
							</div>
						</div>
						<div
							className="text-end flex-grow-1 align-items-center"
							style={{ textAlign: "end", alignSelf: "center" }}
						>
							<span className="text-danger money-payment fw-bold">
								${" "}
								{toLocaleStringRefactor(
									toFixedRefactor(
										Math.max(
											0,
											refundState.tax +
												refundState.totalAmount +
												refundState.tip -
												(refundState.storeDiscount + calculateTotalDiscount())
										),
										2
									)
								)}
							</span>
						</div>
					</div>
					<div className="label-item-total ps-2 pe-1 fw-bold">
						{
							<>
								{t("discount")}(
								<span className="label-total fs-value-disabled">
									{t("store")}/{t("Employees")}
								</span>
								) &ensp;
								<span className="wtc-text-primary fs-value">
									$ {toLocaleStringRefactor(toFixedRefactor(refundState.storeDiscount, 2))} / ${" "}
									{toLocaleStringRefactor(toFixedRefactor(calculateTotalDiscount(), 2))}
								</span>
							</>
						}
					</div>
				</div>
			</div>
		</>
	);
}
