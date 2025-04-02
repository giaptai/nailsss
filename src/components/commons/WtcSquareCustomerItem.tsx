import { formatPhoneNumberViewUI } from "../../const";
import { CustomerModel } from "../../models/category/Customer.model";

type PropsCustomer = {
	height?: number;
	widthIcon?: number;
	heightIcon?: number;
	keyIndex?: number;
	customer: CustomerModel;
	idCustomerSelected: string;
	onClick: (item: CustomerModel) => void;
};
export default function WtcSquareCustomerItem(props: PropsCustomer) {
	const handleClick = () => {
		if (props.customer) props.onClick(props.customer);
	};
	return (
		<div
			key={props.keyIndex}
			className={`col-sm-2 mt-0 p-0 pe-1 pb-1 `}
			style={{ height: props.height }}
			onClick={handleClick}
		>
			<div className={`h-100} `} style={{ borderRadius: 12, height: 80 }}>
				<div
					tabIndex={0}
					className={`d-flex w-100 p-2 index-key ${
						props.idCustomerSelected == props.customer._id && "border-active"
					}`}
					style={{ background: "#eef1fa", borderRadius: 11, height: "100%" }}
					onClick={() => {}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
				>
					<div className="align-self-center">
						{/* <IconButton icon={"ri-group-line fs-icon-action"} width={props.widthIcon || 50} height={props.heightIcon || 50} onClick={() => { }} actived={false} className='me-1 custom-primary-button' /> */}
					</div>
					<div className="align-self-center fs-fullname-list">
						<i className="pi pi-user fs-icon my-label-in-grid "></i>&ensp;
						{props.customer.firstName}&ensp;{props.customer.lastName}
						<div className="fs-value">
							<i className="pi pi-phone fs-icon my-label-in-grid "></i>&ensp;
							{formatPhoneNumberViewUI(props.customer.phone)}
						</div>
						<div className="fs-value">
							<i className="ri-user-location-line fs-icon my-label-in-grid "></i>&ensp;
							{props.customer.address}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
