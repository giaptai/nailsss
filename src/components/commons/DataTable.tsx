import React, { useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import WtcEmptyBox from "./WtcEmptyBox";

interface DataTablesProps<T> {
	data: T[];
	columns: any;
	footerGroup?: React.ReactNode;
	id?: string;
	heightScroll: number;
	headerGroup?: React.ReactNode;
	onRowClick?: (rowData: any) => void;
	onCellClick?: (a: any) => void;
}

const DataTables = <T extends object>({ data, columns, onRowClick, onCellClick, ...props }: DataTablesProps<T>) => {
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const CustomNoRowsOverlay = () => {
		return (
			<div
				className="w-100  d-flex flex-column justify-content-center"
				style={{ height: props.heightScroll - 155 }}
			>
				<WtcEmptyBox />
			</div>
		);
	};

	const rowClassName = (rowData: any) => {
		return {
			"highlighted-row": rowData === selectedRow,
		};
	};

	return (
		<DataTable
			id={props.id}
			headerColumnGroup={props.headerGroup}
			emptyMessage={CustomNoRowsOverlay()}
			value={data}
			scrollable
			responsiveLayout="scroll"
			scrollHeight={props.heightScroll + "px"}
			footerColumnGroup={props.footerGroup}
			className="p-datatable-striped"
			showGridlines={true}
			onRowClick={(e) => {
				if (selectedRow === e.data) {
					setSelectedRow(null);
				} else {
					setSelectedRow(e.data);
				}
				onRowClick?.(e.data);
			}}
			rowClassName={rowClassName}
		>
			{columns.map((col: any, index: any) => (
				<Column
					key={index}
					field={col.field as string}
					header={col.header}
					headerStyle={{ textAlign: "center", placeItems: "center" }}
					bodyStyle={{ textAlign: col.align ? col.align : "center" }}
					frozen={col.frozen || false}
					style={{ minWidth: col.minWidth ? col.minWidth : "120px" }}
					body={(rowData: any) =>
						col.body ? (
							col.body(rowData)
						) : (
							<div
								style={{ cursor: "pointer" }}
								onClick={() => onCellClick?.({ rowData, field: col.field })}
							>
								{rowData[col.field]}
							</div>
						)
					}
				/>
			))}
		</DataTable>
	);
};

export default DataTables;
