import { t } from "i18next";
import { Tooltip } from "primereact/tooltip";

export type RefreshButtonProps = {
	callback: VoidFunction;
	width?: number;
	height?: number;
};
export default function RefreshButton(props: RefreshButtonProps) {
	return (
		<button
			className="my-refresh-button me-button px-4 p-ripple btn-light wtc-bg-white border text-blue wtc-hidden "
			style={{
				width: props.width,
				height: props.height,
			}}
			onClick={props.callback}
		>
			<i
				id="refresh_button"
				className="my-size-icon-header align-self-center p-overlay-badge ri-refresh-line d-flex justify-content-center text-nowrap mr-0"
			></i>
			<Tooltip position="bottom" target="#refresh_button" content={t("Refresh")} />
		</button>
	);
}
