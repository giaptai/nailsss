import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { ListServiceSelectedModel } from "../../models/category/ListServiceSelected.model";
import { selectCustomerOrder } from "../../slices/customer.slice";
import SelectedServiceEmployee from "../commons/SelectedServiceEmployee";
import WtcCard from "../commons/WtcCard";

export default function PaymentAction() {
	const checkinState = useAppSelector((state) => state.newOder);
	const [selected, _setSelected] = useState<ListServiceSelectedModel[]>(checkinState.tempService);
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(selectCustomerOrder(undefined));
	}, []);
	return (
		<div className="h-100 my-background-order" style={{ borderRadius: "22px" }}>
			<div className="d-flex flex-column justify-content-between h-100">
				<div className="d-flex flex-column rounded w-100 h-100">
					<WtcCard
						classNameBody="flex-grow-1 px-1 my-0"
						background="#dadff2"
						className="h-100"
						body={
							<>
								{selected.map((item, index) => {
									return (
										<div key={"order-product-" + index}>
											<SelectedServiceEmployee
												status={item.status}
												isView
												Employee={item.Employee}
												ListService={item.ListService}
												_id={item._id}
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
						}
					/>
				</div>
			</div>
		</div>
	);
}
