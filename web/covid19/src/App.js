import * as React from "react";
import { PersistentDrawerLeft } from "./PersistentDrawerLeft";

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
      console.log(1)
    })
    getRecoveredCases().then(res =>{
      this.setState({
        recovered:res,
        isLoadedrecovered:true
      })
      console.log(2)
    })
    getDeathCases().then(res =>{
      this.setState({
        death:res,
        isLoadeddeath:true
      })
      console.log(3)
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
    return this.state.isLoadedactive && this.state.isLoadeddeath && this.state.isLoadedrecovered && this.state.isLoadedtotal ?
      <PersistentDrawerLeft state = {this.state}></PersistentDrawerLeft> :
      null
      
    
  }
}
