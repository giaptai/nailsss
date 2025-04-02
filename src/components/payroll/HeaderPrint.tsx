import { useAppSelector } from "../../app/hooks";
import { formatPhoneNumberViewUI } from "../../const";
type Props = {
	fromDate?: string;
	toDate?: string;
	toDay?: string;
	orderCode?: string;
	title: string;
};
export const HeaderPrint = (props: Props) => {
	const storeConfigState = useAppSelector((state) => state.storeconfig);
	const StoreInfoName = storeConfigState.list.find((item: any) => item.key === "name");
	const StoreInfoPhone = storeConfigState.list.find((item: any) => item.key === "phone");
	const StoreInfoAddress = storeConfigState.list.find((item: any) => item.key === "street1");
	return (
		<>
			<div className="text-center">
				<div className="fs-4 text-uppercase fw-bold py-0 mt-1" style={{ lineHeight: "30px" }}>
					{StoreInfoName?.value}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div>{StoreInfoAddress?.value}</div>
				<div>{formatPhoneNumberViewUI(StoreInfoPhone?.value)}</div>
				<div className="fs-6 fw-bold text-uppercase mt-1">{props.title}</div>
				<div>
					{props.fromDate && props.toDate ? (
						<>
							<span>{props.fromDate}</span> &ensp;-&ensp;
							<span>{props.toDate}</span>
						</>
					) : (
						<span>{props.toDay}</span>
					)}
				</div>
				{props.orderCode && <div>{props.orderCode}</div>}
			</div>
			<div style={{ borderBottom: "1px dashed" }}></div>
		</>
	);
};
