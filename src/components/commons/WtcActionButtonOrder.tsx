import { t } from "i18next";
import { Status, StatusValueOrder } from "../../const";
import { questionWithConfirm } from "../../utils/alert.util";
import WtcButton from "./WtcButton";
type Props = {
	status: Status;
	idOrderDetail: string | undefined;
};

export default function WtcActionButtonOrder(props: Props) {
	const status = props?.status?.code;
	const ButtonTemplate = () => {
		switch (status) {
			case StatusValueOrder.waiting:
				return (
					<div className="row pe-0">
						<div className="col-md-12 mb-1 pe-0">
							<WtcButton
								label={t("agree")}
								icon="ri-check-line text-success fs-icon-action fw-bold"
								width={"100%"}
								height={35}
								fontSize={16}
								className="text-white wtc-bg-primary"
								onClick={() =>
									questionWithConfirm({
										title: t("ques_agree"),
										text: "",
										confirmButtonText: t("agree"),
										confirm: () => {},
										close: () => {},
									})
								}
							/>
						</div>
						<div className="col-md-12 pe-0">
							<WtcButton
								label={t("reject")}
								icon="ri-close-line text-danger fs-icon-action fw-bold"
								width={"100%"}
								height={35}
								fontSize={16}
								className="text-white wtc-bg-primary"
								onClick={() =>
									questionWithConfirm({
										title: t("ques_reject"),
										text: "",
										confirmButtonText: t("reject"),
										confirm: () => {},
										close: () => {},
									})
								}
							/>
						</div>
					</div>
				);
			case StatusValueOrder.inprocessing:
				return (
					<>
						<WtcButton
							label={t("status_done")}
							icon="ri-task-line text-success fs-icon-action fw-bold"
							width={"100%"}
							height={35}
							fontSize={16}
							className="text-white wtc-bg-primary"
							onClick={() =>
								questionWithConfirm({
									title: t("ques_done"),
									text: "",
									confirmButtonText: t("status_done"),
									confirm: () => {},
									close: () => {},
								})
							}
						/>
					</>
				);
			case StatusValueOrder.done:
				return (
					<>
						<WtcButton
							label={""}
							icon="ri-check-line"
							width={"100%"}
							height={35}
							fontSize={16}
							className="text-white wtc-bg-primary"
							onClick={() => {}}
						/>
					</>
				);
			default:
				return null;
		}
	};
	return <ButtonTemplate />;
}
