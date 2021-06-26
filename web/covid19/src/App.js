import * as React from "react";
import { PersistentDrawerLeft } from "./views/PersistentDrawerLeft";
import { SignUp } from "./views/SignUp";
import { SignIn } from "./views/SignIn";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
async function getActiveCases() {
  console.log('Active cases')
  const response = await fetch('http://127.0.0.1:8000/getCases?cases_type=Active')
  const data = await response.json()
  return data
}
async function getRecoveredCases() {
  console.log('Recovered cases')
  const response = await fetch('http://127.0.0.1:8000/getCases?cases_type=Recovered')
  const data = await response.json()
  return data
}
async function getDeathCases() {
  console.log('Death cases')
  const response = await fetch('http://127.0.0.1:8000/getCases?cases_type=Deaths')
  const data = await response.json()
  return data
}
async function getTotalCases() {
  console.log('Total cases')
  const response = await fetch('http://127.0.0.1:8000/getCases?cases_type=Active')
  const data = await response.json()
  return data
}

export default class App extends React.PureComponent {
  state = {
    active : [],
    recovered: [],
    death: [],
    total: [],
    isLoadedactive : false,
    isLoadedrecovered : false,
    isLoadeddeath : false,
    isLoadedtotal : false
  }
  componentDidMount() { 
    getActiveCases().then(res =>{
      this.setState({
        active:res,
        isLoadedactive:true
      })
    })
    getRecoveredCases().then(res =>{
      this.setState({
        recovered:res,
        isLoadedrecovered:true
      })
    })
    getDeathCases().then(res =>{
      this.setState({
        death:res,
        isLoadeddeath:true
      })
    })
    getTotalCases().then(res =>{
      this.setState({
        total:res,
        isLoadedtotal:true
      })
    })
    this.forceUpdate()
  }
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <Router>
        <Switch>
            <Route path="/Dashboard">
              {this.state.isLoadedactive && this.state.isLoadeddeath && this.state.isLoadedrecovered && this.state.isLoadedtotal ?
              <PersistentDrawerLeft state = {this.state}></PersistentDrawerLeft> :
              null}
            </Route>
            <Route path="/SignUp">
              <SignUp />
            </Route>
            <Route path="/">
              <SignIn />
            </Route>
        </Switch>
      </Router>
    )
      
    
  }
}
