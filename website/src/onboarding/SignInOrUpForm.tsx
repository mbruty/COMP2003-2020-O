import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React from "react";
import TabPanel from "./TabPanel";
import { makeStyles, Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import LogInForm from "./LogInForm";
import { useTheme } from "@material-ui/core/styles";

interface Props {
  tabIdx: number;
  setTabIdx: React.Dispatch<React.SetStateAction<number>>;
  refresh: () => void;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Form: React.FC<Props> = ({ tabIdx, setTabIdx, refresh }) => {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIdx(newValue);
  };

  const theme = useTheme();

  console.log(theme);

  return (
    <>
      <Paper square>
        <Tabs
          centered
          value={tabIdx}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab
            icon={<FontAwesomeIcon icon={faSignInAlt} />}
            label="Sign In"
            {...a11yProps(0)}
          />
          <Tab
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            label="Create Account"
            {...a11yProps(1)}
          />
        </Tabs>
      </Paper>
      <TabPanel value={tabIdx} index={0}>
        <LogInForm refresh={refresh} />
      </TabPanel>
      <TabPanel value={tabIdx} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tabIdx} index={2}>
        Item Three
      </TabPanel>
    </>
  );
};

export default Form;
