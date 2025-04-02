import { Dropdown } from "primereact/dropdown";
import { StatusDropdownProps } from "../../const";
import { t } from "i18next";

export default function StatusDropdown(props: StatusDropdownProps) {
	const StatusTemplate = (value: string) => {
		let icon, text;
		switch (value) {
			case "ALL":
				icon = <i className="my-grid-icon text-muted"></i>;
				text = t("all");
				break;
			case "ACTIVE":
				icon = <i className="my-grid-icon ri-check-double-line text-success"></i>;
				text = t("active");
				break;
			case "INACTIVE":
				icon = <i className="my-grid-icon ri-close-line text-danger"></i>;
				text = t("deleted");
				break;
			case "INPROCESSING":
				icon = <i className="my-grid-icon ri-loader-2-line wtc-text-primary"></i>;
				text = t("status_processing");
				break;
			case "FINAL":
				icon = <i className="my-grid-icon ri-check-line text-success"></i>;
				text = t("status_final");
				break;
			default:
				icon = null;
				text = "";
				break;
		}
		return (
			<div className="d-flex">
				<div className="me-1">{icon}</div>
				<div style={{ alignContent: "center" }}>{text}</div>
			</div>
		);
	};
	return (
		<div
			tabIndex={0}
			className="p-1"
			style={{
				border: "1px solid #d1d5db",
				borderRadius: props.radius ? props.radius : 8,
				width: props.width,
				height: props.height,
			}}
		>
			{props?.isProcess == true ? (
				<Dropdown
					autoFocus
					tabIndex={0}
					value={props.value}
					// options={["ALL", "ACTIVE", "INACTIVE", "DELETED"]}
					options={["ALL", "INPROCESSING", "FINAL"]}
					itemTemplate={StatusTemplate}
					valueTemplate={StatusTemplate}
					onChange={(e) => props.onChange(e)}
					placeholder=""
					style={{
						width: "100%",
						height: "100%",
						borderRadius: 8,
						border: "none",
						maxHeight: "300px",
					}}
				/>
			) : (
				<Dropdown
					autoFocus
					tabIndex={0}
					value={props.value}
					// options={["ALL", "ACTIVE", "INACTIVE", "DELETED"]}
					options={["ALL", "ACTIVE", "INACTIVE"]}
					itemTemplate={StatusTemplate}
					valueTemplate={StatusTemplate}
					onChange={(e) => props.onChange(e)}
					placeholder=""
					style={{
						width: "100%",
						height: "100%",
						borderRadius: 8,
						border: "none",
						maxHeight: "300px",
					}}
				/>
			)}
		</div>
	);
}
