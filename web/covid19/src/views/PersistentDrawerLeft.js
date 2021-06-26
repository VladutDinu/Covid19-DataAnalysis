import * as React from "react";
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import '../App.css';
import Paper from '@material-ui/core/Paper';
import '../css/main.module.css';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import CheckIcon from '@material-ui/icons/Check';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  BarSeries,
  PieSeries
} from '@devexpress/dx-react-chart-material-ui';

async function getActiveCases() {
  console.log('Active cases')
  const response = await fetch('http://127.0.0.1:8000/getActiveCases')
  const data = await response.json()
  return data
}
async function getRecoveredCases() {
  console.log('Recovered cases')
  const response = await fetch('http://127.0.0.1:8000/getRecoveredCases')
  const data = await response.json()
  return data
}
async function getDeathCases() {
  console.log('Death cases')
  const response = await fetch('http://127.0.0.1:8000/getDeathCases')
  const data = await response.json()
  return data
}
async function getTotalCases() {
  console.log('Total cases')
  const response = await fetch('http://127.0.0.1:8000/getTotalCases')
  const data = await response.json()
  return data
}

export function PersistentDrawerLeft({state}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [activeData, setActive] = React.useState(state.active);
  const [recoveredData, setRecoveder] = React.useState(state.recovered);
  const [deathData, setDeath] = React.useState(state.death);
  const [totalData, setTotal] = React.useState(state.total);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Menu
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key={"Active"} onClick={() => {
              getActiveCases().then(res =>{
                  setActive(res);
              })
            }}>
              <ListItemIcon>
                <PriorityHighIcon />
              </ListItemIcon>
              <ListItemText primary={"Active"} />
            </ListItem>
            <ListItem button key={"Recovered"} onClick={() => {
              getRecoveredCases().then(res =>{
                  setRecoveder(res);
              })
            }}>
              <ListItemIcon >
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary={"Recovered"} />
            </ListItem>
            <ListItem button key={"Death"} onClick={() => {
              getDeathCases().then(res =>{
                  setDeath(res);
              })
            }}>
              <ListItemIcon>
                <CloseIcon />
              </ListItemIcon>
              <ListItemText primary={"Death"} />
            </ListItem>
            <ListItem button key={"Total"} onClick={() => {
              getTotalCases().then(res =>{
                  setTotal(res);
              })
            }}>
              <ListItemIcon>
                <GroupWorkIcon />
              </ListItemIcon>
              <ListItemText primary={"Total"} />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Paper>

            <div style={{ width: "50%", display: "inline-block", margin: "auto" }}>
              <h3>Line Graph</h3>
              <Chart data={state.active} >
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField="value" argumentField="argument" />
              </Chart>
            </div>

            <div style={{ width: "50%", display: "inline-block", margin: "auto" }}>
              <h3>Line Graph</h3>
              <Chart data={state.recovered} >
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField="value" argumentField="argument" />
              </Chart>
            </div>

            <div style={{ width: "50%", display: "inline-block", margin: "auto" }}>
              <h3>Bar Graph</h3>
              <Chart data={state.death}>
                <ArgumentAxis />
                <ValueAxis />

                <BarSeries valueField="value" argumentField="argument" />
              </Chart>
            </div>

            <div style={{ width: "50%", display: "inline-block", margin: "auto" }}>
              <h3>Pie Graph</h3>
              <Chart data={state.total} >
                <ArgumentAxis />
                <ValueAxis />

                <PieSeries valueField="value" argumentField="argument" />
              </Chart>
            </div>
          </Paper>
        </main>

      </div>

    </div>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

