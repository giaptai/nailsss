import { t } from "i18next";
import { FormatMoneyNumber } from "../../const";
type propsPaymentDetailsTable = {
	totalCash: number;
	totalSpaCash: number;
	totalSpa: number;
	totalCheckAndTip: number;
	totalTip: number;
	totalDiscount: number;
	totalPaymentEmployee: number;
	isFooter?: boolean;
};
export const PaymentDetailsTable = (props: propsPaymentDetailsTable) => {
	return (
		<table className="w-100" style={{ lineHeight: "17px" }}>
			<tbody>
				<tr>
					<td className="fw-bold" colSpan={3}>
						{t("detail")}
					</td>
				</tr>

				<tr>
					<td>1. {t("Cash")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalCash || 0)}</span>
					</td>
				</tr>

				<tr>
					<td>2. {t("spacash")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalSpaCash || 0)}</span>
					</td>
				</tr>

				<tr>
					<td>3. {t("total_spa")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalSpa || 0)}</span>
					</td>
				</tr>

				<tr>
					<td>4. {t("checkvstip")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalCheckAndTip || 0)}</span>
					</td>
				</tr>

				<tr>
					<td>5. {t("tip")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalTip || 0)}</span>
					</td>
				</tr>

				<tr>
					<td>6. {t("discount")}:</td>
					<td className="text-end">
						<span>$ {FormatMoneyNumber(props.totalDiscount || 0)}</span>
					</td>
				</tr>

				<tr>
					<td colSpan={4} style={{ borderBottom: "1px dashed" }}></td>
				</tr>

				<tr>
					<td colSpan={4} className="text-center pt-2">
						{t("payment_due")}{" "}
						<div className="fw-bold fs-4 pt-2">$ {FormatMoneyNumber(props.totalPaymentEmployee || 0)}</div>
					</td>
				</tr>
			</tbody>
			{props.isFooter && (
				<tfoot>
					<tr>
						<td colSpan={4} className="text-center pt-3">
							{t("thank_u")}
						</td>
					</tr>
				</tfoot>
			)}
		</table>
	);
};
