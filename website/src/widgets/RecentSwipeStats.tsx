import React from "react";
import Widget from "./Widget";
import IWidgetProps from "./IWidgetProps";
import { Bar } from "react-chartjs-2";

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

const data = {
  labels: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }),
  datasets: [
    {
      label: "# of likes",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 30)),
      backgroundColor: "rgb(98, 229, 133)",
    },
    {
      label: "# of dislikes",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 30)),
      backgroundColor: "rgb(229, 107, 98)",
    },
  ],
};

const RecentSwipeStats: React.FC<IWidgetProps> = (props) => {
  return (
    <Widget {...props} rows={2} columns={1}>
      <Bar data={data} options={options} />
    </Widget>
  );
};

export default RecentSwipeStats;
