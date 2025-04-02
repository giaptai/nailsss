import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import useWindowSize from "../../../app/screen";

interface BarChartProps {
	data: {
		revenue: number[];
		customers: number[];
		categories: string[];
	};
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
	const screenSize = useWindowSize();

	const chartOptions: ApexOptions = {
		chart: {
			type: "bar",
			height: 250,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "55%",
				// endingShape: 'rounded',
			},
		},
		colors: ["#FFCA64", "#283673"],
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
		<Chart
			options={chartOptions}
			series={chartSeries}
			type="bar"
			height={screenSize.height - 430 < 180 ? 180 : screenSize.height - 430}
		/>
	);
};

export default BarChart;
