import React, { Component } from 'react';
import './App.css';
import Map from "./components/Map"
import * as d3 from 'd3'

class App extends Component {

  constructor(props){
    super(props)
   
  }
  state = { 
    countryData:[],
    wave:'Wave6',
    variable: 'Happiness',
    columns: [],
    selectedCountry:{}
    
  };

  componentDidMount(){
    this.loadData()
  }

  loadData =() => {
    let data = {}
    let url = process.env.PUBLIC_URL+ "./data/" + this.state.variable +this.state.wave + '.csv'
    d3.csv(url).then(res => {
      let columns = Object.keys(res[0]).slice(1);
      this.setState({columns: columns})
      res.forEach((row) => {
        let country = row.Country
        delete row.Country
        var newRow = {}
        
        Object.keys(row).map((o) => {
          
          newRow[o] = parseInt(row[o])
        })
        data[country] = newRow
        
      })
      this.setState({countryData:data})
      console.log(data)
      //this.setState({countryData:res})
    }) 
   
  }
  render() {
    return (
      <Map countryData={this.state.countryData} />
    );
  }
}

export default App;
