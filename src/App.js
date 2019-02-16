import React, { Component } from 'react';
import './App.css';
import Map from "./components/Map"
import * as d3 from 'd3'
import CountryInfo from './components/CountryInfo';
import Select from 'react-select'
import AsyncSelect from 'react-select/lib/Async';

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
    detaillist: [{ value: "Very happy", label: "Very happy" },
    { value: "Rather happy", label: "Rather happy" },
    { value: "Not very happy", label: "Not very happy" },
    { value: "Not at all happy", label: "Not at all happy" }, { value: "Others", label: "Others" }],
    detail: 'Very happy',
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
    if (wave !== e.value) { this.setState({ wave: e.value, update: true, selectedCountry: {} }) }
    setTimeout(() => {
      this.setState({ update: false })
    }, 100)
  }

  handleDetailSelection = (e) => {
    let detail = this.state.detail;
    if (detail !== e.value) { this.setState({ detail: e.value, update: true, selectedCountry: {} }) }
    setTimeout(() => {
      this.setState({ update: false })
    }, 100)
  }

  handleAreaSelection = (e) => {
    let area = this.state.variable;
    if (area !== e.value) { this.setState({ variable: e.value, update: true, selectedCountry: {} }) }
    setTimeout(() => {
      this.setState({ update: false })
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
        if (data[country][this.state.detail] >= max) {
          max = data[country][this.state.detail]
        }
      })
      var detaillista = []
      let detailsobj = data;
      if (Object.keys(detailsobj).length > 0) {
        for (var key in detailsobj) break;
        Object.keys(detailsobj[key]).forEach(function (keynum) {
          detaillista.push({ value: keynum, label: keynum });
        });
        this.setState({ detaillist: detaillista })
      }
      this.setState({ countryData: data, maxPercentage: max })
    })

  }
  render() {
    if (this.state.update) {
      this.loadData()

    }
    console.log(this.state.detail)
    return (
      <div id="supercontainer">
        <div id="toprow">
          <h3 className="select name">EXPLORE</h3>
          <div className="select" id="areaContainer">
            <Select defaultValue={areaoptions[0]} onChange={this.handleAreaSelection} options={areaoptions} />
          </div>
          <h3 className="select name">DURING</h3>
          <div className="select" id="waveContainer">
            <Select defaultValue={waveoptions[0]} onChange={this.handleWaveSelection} options={waveoptions} />
          </div>
          <h3 className="select name">ATTRIBUTE</h3>
          <div className="select" id="detailsContainer">
            <Select defaultValue={this.state.detaillist[0]} onChange={this.handleDetailSelection} options={this.state.detaillist} />
          </div>
        </div>
        <Map countryDetail={this.state.detail} countryData={this.state.countryData} percentage={this.state.maxPercentage} onCountrySelect={this.handleDataSelection} />
        <CountryInfo selectedCountry={this.state.selectedCountry} />
      </div>
    );
  }
}

export default App;
