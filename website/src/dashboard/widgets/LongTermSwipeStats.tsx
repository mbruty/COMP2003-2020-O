import React from "react";
import { Line } from "react-chartjs-2";
import IWidgetProps from "../IWidgetProps";
import Widget from "../Widget";

const data = {
  labels: Array.from({ length: 40 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }),
  datasets: [
    {
      label: "# of likes",
      data: Array.from({ length: 40 }, () => Math.floor(Math.random() * 30)),
      fill: false,
      borderColor: "rgb(98, 229, 133)",
      backgroundColor: "rgb(98, 229, 133)",
    },
    {
      label: "# of dislikes",
      data: Array.from({ length: 40 }, () => Math.floor(Math.random() * 30)),
      fill: false,
      borderColor: "rgb(229, 107, 98)",
      backgroundColor: "rgb(229, 107, 98)",
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const LongTermSwipeStats: React.FC<IWidgetProps> = (props) => (
  <Widget {...props} rows={2} columns={3}>
    <Line data={data} options={options} />
  </Widget>
);

export default LongTermSwipeStats;
