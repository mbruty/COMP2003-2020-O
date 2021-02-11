import React from "react";

interface Props {
  children?: React.ReactNode;
  index: any;
  value: any;
}


const TabPanel: React.FC<Props> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <h1>{index}</h1>}
    </div>
  );
};

export default TabPanel;
