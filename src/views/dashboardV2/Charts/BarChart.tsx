import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BarChartProps {
	data: {
		revenue: number[];
		customers: number[];
		categories: string[];
	};
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
	const chartOptions: ApexOptions = {
		chart: {
			type: "bar",
			height: 250,
			redrawOnParentResize: true,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "55%",
				// endingShape: 'rounded',
			},
		},
		colors: ["#1160B7", "#FF9F23"],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ["transparent"],
		},
		xaxis: {
			categories: data.categories,
		},
		yaxis: [
			{
				title: {
					text: "Doanh thu",
				},

				min: 0,
			},
			{
				opposite: true,

				title: {
					offsetX: 0,
					offsetY: -20,
					text: "Khách hàng",
				},
				min: 0,
			},
		],
		fill: {
			opacity: 1,
		},
		tooltip: {
			shared: true,
			intersect: false,
		},
		legend: {
			position: "bottom",
			horizontalAlign: "center",
		},
	};

	const chartSeries = [
		{
			name: "Doanh Thu",
			data: data.revenue,
		},
		{
			name: "Khách hàng",
			data: data.customers,
		},
	];

	return (
		<div className="w-100 h-100 overflow-hidden">
			<Chart
				options={chartOptions}
				series={chartSeries}
				type="bar"
				height={"100%"}
				width={"100%"}
				style={{ minWidth: "100%" }}
			/>
		</div>
	);
};

export default BarChart;
