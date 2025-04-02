import IconButton from "../../../components/commons/IconButton";
import WtcHeaderColor from "../../../components/commons/WtcHeaderColor";
import { formatCapitalize } from "../../../const";
import { ProfileModel } from "../../../models/category/Profile.model";
import { UserModel } from "../../../models/category/User.model";
type PropsWindow = {
	index: number;
	selected: number | null;
	onClick: (index: number) => void;
	onClickEmployee?: (index: number) => void;
	employee?: UserModel;
	onClickSelectEmpl?: (User: UserModel) => void;
	user?: ProfileModel;
	isUSer: boolean;
	height?: number;
	heightIcon?: number;
	widthIcon?: number;
};
export default function Square(props: PropsWindow) {
	const handleClick = () => {
		if (!props.user) {
			props.onClick(props.index);
		}
		if (props.onClickSelectEmpl && props.employee && props.onClickEmployee) {
			props.onClickSelectEmpl(props.employee);
			props.onClickEmployee(props.index);
		}
	};
	return (
		<div className={`col-sm-3 mt-0`} style={{ height: props.height, paddingLeft: 2, paddingRight: 2 }}>
			<div
				className={`h-100 ${props.isUSer ? "my-user-focus p-1" : ""}  ${
					props.selected === props.index ? "" : ""
				}`}
				style={{
					borderRadius: 11,
					height: 100,
					border: props.selected === props.index ? "1px solid rgb(40, 54, 115)" : "1px solid transparent",
				}}
			>
				<div
					tabIndex={0}
					className={`d-flex w-100 p-3 index-key ${props.selected === props.index ? "" : ""}  ${
						props.user ? "my-click-selected" : ""
					} `}
					style={{ background: "#eef1fa", borderRadius: 11, height: "100%" }}
					onClick={handleClick}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleClick();
						}
					}}
				>
					<div className="align-self-center">
						<IconButton
							icon={"ri-user-line fs-icon-action"}
							width={props.widthIcon || 40}
							height={props.heightIcon || 40}
							onClick={() => {}}
							actived={false}
							className="me-1 custom-primary-button"
						/>
						<div className="number">#{props.index + 1}</div>
						{props.user && (
							<WtcHeaderColor width={30} className="header-color" color={props.user.color || "#283673"} />
						)}
					</div>
					<div
						className="align-self-center fs-value"
						style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
					>
						{props.user &&
							`${formatCapitalize(props.user.firstName)} ${
								props.user.middleName ? formatCapitalize(props.user.middleName) + " " : ""
							}${formatCapitalize(props.user.lastName)}`}
					</div>
				</div>
			</div>
		</div>
	);
}
