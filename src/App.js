import React, { Component } from 'react';
import './App.css';
import Map from "./components/Map"
import * as d3 from 'd3'
import CountryInfo from './components/CountryInfo';
import Select from 'react-select'

const areaoptions = [
  { value: 'Happiness', label: 'Happiness in Life' },
  { value: 'WorkImportance', label: 'Work Importance in Life' }
]

const waveoptions = [
  { value: 'Wave6', label: 'Wave 6 (2010-2014)' },
  { value: 'Wave5', label: 'Wave 5 (2005-2009)' },
  { value: 'Wave4', label: 'Wave 4 (1999-2004)' },
  { value: 'Wave3', label: 'Wave 3 (1995-1998)' },
]

class App extends Component {

  constructor(props) {
    super(props)

  }
  state = {
    countryData: [],
    wave: 'Wave6',
    variable: 'Happiness',
    columns: [],
    selectedCountry: {},
    maxPercentage: 100,
    update: false

  };

  componentDidMount() {
    this.loadData()
  }

  handleDataSelection = (data) => {
    this.setState({ selectedCountry: data });
  }

  handleWaveSelection = (e) => {
    let wave = this.state.wave;
    if (wave !== e.value){this.setState({wave: e.value, update: true, selectedCountry: {}})}
    setTimeout(() => {
      this.setState({update: false})
    }, 100)
  }

  handleAreaSelection = (e) => {
    let area = this.state.variable;
    if (area !== e.value){this.setState({variable: e.value, update: true, selectedCountry: {}})}
    setTimeout(() => {
      this.setState({update: false})
    }, 100)
  }

  loadData = () => {
    let max = 0;
    let data = {}
    let url = process.env.PUBLIC_URL + "./data/" + this.state.variable + this.state.wave + '.csv'
    d3.csv(url).then(res => {
      let columns = Object.keys(res[0]).slice(1);
      this.setState({ columns: columns })
      res.forEach((row) => {
        let country = row.Country
        delete row.Country
        var newRow = {}

        Object.keys(row).map((o) => {

          newRow[o] = parseInt(row[o])
        })
        data[country] = newRow
        if (data[country][Object.keys(data[country])[0]] >= max) {
          max = data[country][Object.keys(data[country])[0]]
        }
      })
      this.setState({ countryData: data, maxPercentage: max })
    })

  }
  render() {
    if(this.state.update) {
      this.loadData()
    }
    return (
      <div>
        <div class="select" id="waveContainer">
          <h3>{"Wave " + this.state.wave.substring(4,5)}</h3>
          <Select defaultValue={waveoptions[0]} onChange={this.handleWaveSelection} options={waveoptions}/>
        </div>
        <div class="select" id="areaContainer">
          <h3>Area</h3>
          <Select defaultValue={areaoptions[0]} onChange={this.handleAreaSelection} options={areaoptions}/>
        </div>
        <CountryInfo selectedCountry={this.state.selectedCountry} />
        <Map countryData={this.state.countryData} percentage={this.state.maxPercentage} onCountrySelect={this.handleDataSelection} />
      </div>
    );
  }
}

export default App;
