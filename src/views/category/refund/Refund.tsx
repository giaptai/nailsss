import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Body from "../../../components/commons/Body";
import RefundBar from "../../../components/refund/RefundBar";
import RefundOrderNew from "../../../components/refund/RefundOrderNew";
import RefundOrderOld from "../../../components/refund/RefundOrderOld";
import RefundPayment from "../../../components/refund/RefundPayment";
import { fetchCustomers } from "../../../slices/customer.slice";
import { fetchMenus } from "../../../slices/menu.slice";
import { fetchServices } from "../../../slices/service.slice";
import { fetchUsers } from "../../../slices/user.slice";
import { fetchWindow } from "../../../slices/window.slice";

export default function RefundOrder() {
	const dispatch = useDispatch();
	const fetchListLocal = () => {
		dispatch(fetchCustomers());
		dispatch(fetchUsers());
		dispatch(fetchWindow());
		dispatch(fetchServices());
		dispatch(fetchMenus());
	};
	useEffect(() => {
		fetchListLocal();
	}, []);
	return (
		<Body
			header={<RefundBar />}
			body={
				<>
					<div className="col-sm-4 h-100">
						<RefundOrderOld />
					</div>
					<div className="col-sm-8 h-100 row">
						<div className="col-sm-6">
							<RefundOrderNew />
						</div>
						<div className="col-sm-6">
							<RefundPayment />
						</div>
					</div>
				</>
			}
		/>
	);
}
