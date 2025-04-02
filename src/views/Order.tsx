import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Body from "../components/commons/Body";
import OrderAction from "../components/order/OrderAction";
import OrderBar from "../components/order/OrderBar";
import OrderCategory from "../components/order/OrderCategory";
import OrderProduct from "../components/order/OrderProduct";
import { fetchCustomers } from "../slices/customer.slice";
import { fetchMenus } from "../slices/menu.slice";
import { fetchServices } from "../slices/service.slice";
import { fetchUsers } from "../slices/user.slice";
import { fetchWindow } from "../slices/window.slice";

export default function Order() {
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
			header={<OrderBar />}
			body={
				<>
					<div className="col-sm-4 h-100">
						<OrderProduct />
					</div>
					<div className="col-sm-6 h-100">
						<OrderAction />
					</div>
					<div className="col-sm-2 h-100">
						<OrderCategory />
					</div>
				</>
			}
		/>
	);
}
