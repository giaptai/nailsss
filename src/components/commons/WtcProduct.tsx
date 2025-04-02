import WtcHeaderColor from "./WtcHeaderColor";

type ProductProps = {
	data: any;
	index: string;
	active: boolean;
	onClick?: VoidFunction;
};
export default function WtcProduct(props: ProductProps) {
	const product = props.data;
	return (
		<div
			key={"me-product-" + props.index}
			className={`col-sm-6`}
			onClick={props.onClick}
			style={{ cursor: "pointer", height: 80, textAlign: "center" }}
		>
			<div className="p-1 h-100 pb-0">
				<div
					className={`d-flex flex-column h-100 p-1 me-product ${props.active ? "active" : ""}`}
					style={{ borderRadius: 11, border: "1px solid #E0E4EA" }}
				>
					<WtcHeaderColor width={30} color={props.data.color || "#283673"} />
					<div className="flex-grow-1 px-1 pb-1 d-flex flex-column justify-content-center h-100">
						<div className="py-1 two-line-ellipsis fs-value">{product.name}</div>
						{/* <div className="text-warning">{t('tax')}&ensp;${toLocaleStringRefactor(toFixedRefactor(Number(10),2))}</div>
                          <div className="text-danger">$ {toLocaleStringRefactor(toFixedRefactor(Number(product.storePrice),2))}</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}
