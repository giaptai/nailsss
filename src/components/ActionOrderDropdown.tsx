import { t } from "i18next";
import { useDispatch } from "react-redux";
import { PageTarget, Status, StatusValueOrder } from "../const";
import { OrderModel } from "../models/category/Order.model";
import { deleteOrder } from "../slices/order.slice";
import { warningWithConfirm } from "../utils/alert.util";
import WtcButton from "./commons/WtcButton";
import WtcRoleButton from "./commons/WtcRoleButton";
type ActionOrderDropdownProps = {
	status: Status;
	isProfile: boolean;
	callback: () => void;
	onClickTransfer?: () => void;
	onClickDone?: () => void;
	handleClickService?: () => void;
	OrderDetailId?: string | undefined;
	CheckinId?: string | undefined;
	item?: OrderModel;
};
export default function ActionOrderDropdown(props: ActionOrderDropdownProps) {
	const dispatch = useDispatch();
	const handleDeleteOrder = () => {
		if (props.CheckinId) dispatch(deleteOrder(props.CheckinId));
	};
	const menuStatus = (status: string) => {
		switch (status) {
			case StatusValueOrder.inprocessing:
				return (
					<div className="row pe-0">
						<div className="col-md-12 pe-0 ">
							<WtcRoleButton
								action="UPD"
								target={PageTarget.order}
								label={t("status_done")}
								className="wtc-bg-primary text-white d-inline float-inline-end w-100"
								icon="ri-check-line text-success fs-icon-action"
								fontSize={18}
								borderRadius={11}
								height={35}
								onClick={props.onClickDone}
							/>
						</div>
						<div className="col-md-12 pe-0 mt-1">
							<WtcRoleButton
								action="UPD"
								target={PageTarget.order}
								label={t("transfer")}
								className="wtc-bg-primary text-white d-inline float-inline-end w-100"
								icon="ri-file-transfer-line text-warning fs-icon-action"
								fontSize={18}
								borderRadius={11}
								height={35}
								onClick={props.onClickTransfer}
							/>
						</div>
					</div>
				);
			case StatusValueOrder.waiting:
				return (
					<div className="row">
						<div
							className="col-md-12 pe-0 mb-1"
							onClick={() => {
								if (props.handleClickService) props.handleClickService();
							}}
						>
							<WtcButton
								label={t("Services")}
								className="wtc-bg-white text-color-info border-text-primary d-inline float-inline-end w-100"
								icon="ri-service-line wtc-text-primary fs-icon-action"
								fontSize={18}
								borderRadius={11}
								height={35}
							/>
						</div>
						<div className="col-md-12 pe-0 mb-1">
							<WtcButton
								label={t("detail")}
								className="wtc-bg-white text-color-info border-text-primary d-inline float-inline-end w-100"
								icon="ri-edit-line wtc-text-primary fs-icon-action"
								fontSize={18}
								borderRadius={11}
								height={35}
							/>
						</div>
						<div
							className="col-md-12 pe-0"
							onClick={(e) => {
								e.stopPropagation();
								warningWithConfirm({
									title: t("do_you_delete"),
									text: "",
									confirmButtonText: t("Delete"),
									confirm: () => {
										handleDeleteOrder();
									},
								});
							}}
						>
							<WtcButton
								label={t("action.delete")}
								className="wtc-bg-white text-color-info border-text-primary d-inline float-inline-end w-100"
								icon="ri-delete-bin-line text-danger fs-icon-action"
								fontSize={18}
								borderRadius={11}
								height={35}
							/>
						</div>
					</div>
				);
			default:
				<></>;
				break;
		}
	};
	return (
		<>
			<div className="iq-sub-dropdown" style={{ width: 138 }}>
				<div className="iq-card shadow-none m-0">
					<div className="iq-card-body p-2 ">
						<div className="me-1">{menuStatus(props.status.code)}</div>
					</div>
				</div>
			</div>
		</>
	);
}
