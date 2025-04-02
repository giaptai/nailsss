import { t } from "i18next";
import { toUpcaseSentence } from "../utils/string.ultil";

type StatusProps = {
    status: string
}
const badgeMaps: Record<string, string> = {
    'DEACTIVE': "text-danger border-danger",
    'CANCEL': "text-danger border-danger",
    'ACTIVE': "text-primary border-primary",
    "WAITING_APPROVE": "text-warning border-warning",
    "WAITING_PAYMENT": "text-warning border-warning",
    "PAYMENT_NOT_ENOUGH": "text-warning border-warning",
    "PROCESSING": "text-warning border-warning",
    "FINAL": "text-success border-success",
    "SUCCESS": "text-success border-success",
    "PAYMENT_SUCCESS": "text-success border-success",
    "APPROVED": "text-primary border-primary"
}
export default function StatusWidget(props: StatusProps) {
    const badge = badgeMaps[props.status.toUpperCase()] ?? ''
    const text = toUpcaseSentence(t(props.status).toLowerCase())
    if (props.status == undefined) return <span>N/A</span>
    return (
        <span className={`badge border ${badge}`} style={{ fontWeight: '600', fontSize: '8pt' }}>{text}</span>
    );
}