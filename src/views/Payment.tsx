import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hooks";
import Body from "../components/commons/Body";
import PaymentAction from "../components/payment/PaymentAction";
import PaymentCustomer from "../components/payment/PaymentCustomer";
import PaymentMethod from "../components/payment/PaymentMethod";
import { clearState } from "../slices/payment.slice";
import LoadingIndicator from "../components/Loading";

export default function Payment() {
	const dispatch = useDispatch();
	const paymentState = useAppSelector((state) => state.payment);
	useEffect(() => {
		dispatch(clearState());
	}, []);
	return (
		<Body
			body={
				paymentState.fetchState.status == "loading" ? (
					<LoadingIndicator />
				) : (
					<>
						<div className="col-sm-5 h-100">
							<PaymentMethod />
						</div>
						<div className="col-sm-4 h-100">
							<PaymentAction />
						</div>
						<div className="col-sm-3 h-100">
							<PaymentCustomer />
						</div>
					</>
				)
			}
		/>
	);
}
