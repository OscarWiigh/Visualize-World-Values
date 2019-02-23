import React, { Component } from 'react';
import './App.css';
import Map from "./components/Map"
import Chart from "./components/Chart"
import * as d3 from 'd3'
import CountryInfo from './components/CountryInfo';
import Select from 'react-select'

const areaoptions = [
  { value: 'Happiness', label: 'Happiness in Life' },
  { value: 'WorkImportance', label: 'Work Importance in Life' },
  { value: 'LeisureImportance', label: 'Leisure Importance in Life' },
  { value: 'FamilyImportance', label: 'Family Importance in Life' },
  { value: 'ReligionImportance', label: 'Religion Importance in Life' },
  { value: 'SubjectiveHealth', label: 'Subjective state of health' },
  { value: 'TrustInPeople', label: 'Trust in people' },
  { value: 'MostImportant', label: 'What is most important (of given options)?' }
]

const waveoptions = [
  { value: 'Wave6', label: 'Wave 6 (2010-2014)' },
  { value: 'Wave5', label: 'Wave 5 (2005-2009)' },
  { value: 'Wave4', label: 'Wave 4 (1999-2004)' },
  { value: 'Wave3', label: 'Wave 3 (1995-1998)' },
]

const gapoptions = [
  { value: 'child_mortality', label: 'Child Mortality per 1000 births' },
  { value: 'life_expectancy_years', label: 'Life expectancy in years' },
  { value: 'co2_emissions_tonnes_per_person', label: 'CO2 emissions tonnes/person' },
  { value: 'income_per_person', label: 'Income/person (GDP/capita, PPP$, infl. adj.) ' },
  { value: 'long_term_unemployment', label: 'Long term unemployment (% of pop.)' },
  { value: 'children_per_woman', label: 'Number of children per woman' },
  { value: 'hdi_human_development', label: 'Human Development Index' },
  { value: 'population_growth_annual_percent', label: 'Annual population growth/year (%)' }
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
    gapVar: "life_expectancy_years",
    detailtest : [{ value: "Very happy", label: "Very happy" }],
    columns: [],
    selectedCountry: {
      "Very happy": 40,
      "Rather happy": 54,
      "Not very happy": 4,
      "Not at all happy": 0,
      "Country": "Sweden"
    },
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

  handleGapSelection = (e) => {
    let gap = this.state.gapVar;
    if (gap !== e.value) { this.setState({ gapVar: e.value, update: true }) }
    setTimeout(() => {
      this.setState({ update: false })
    }, 100)
  }

  handleDetailSelection = (e) => {
    let detail = this.state.detail;
    if (detail !== e.value) { this.setState({ detail: e.value, detailtest: [{value: e.value, label:  e.value}], update: true, selectedCountry: {} }) }
    setTimeout(() => {
      this.setState({ update: false })
    }, 100)
  }

  handleAreaSelection = (e) => {
    let area = this.state.variable;
    if (area !== e.value) { this.setState({ variable: e.value, update: true, selectedCountry: {} }) }
    if (e.value == "WorkImportance") { this.setState({ detail: "Very important", detailtest: [{value: "Very important", label: "Very important"}] }) }
    if (e.value == "LeisureImportance") { this.setState({ detail: "Very important", detailtest: [{value: "Very important", label: "Very important"}] }) }
    if (e.value == "FamilyImportance") { this.setState({ detail: "Rather important", detailtest: [{value: "Rather important", label: "Rather important"}] }) }
    if (e.value == "ReligionImportance") { this.setState({ detail: "Very important", detailtest: [{value: "Very important", label: "Very important"}] }) }
    if (e.value == "SubjectiveHealth") { this.setState({ detail: "Very good", detailtest: [{value: "Very good", label: "Very good"}] }) }
    if (e.value == "Happiness") { this.setState({ detail: "Very happy", detailtest: [{value: "Very happy", label: "Very happy"}] }) }
    if (e.value == 'TrustInPeople') { this.setState({ detail: "Most people can be trusted", detailtest: [{value: "Most people can be trusted", label: "Most people can be trusted"}] }) }
    if (e.value == 'MostImportant') { this.setState({ detail: "A stable economy", detailtest: [{value: "A stable economy", label: "A stable economy"}] }) }
    setTimeout(() => {
      this.setState({ update: false})
    }, 100)
  }

  loadData = () => {
    let max = 0;
    let data = {}
    let url = process.env.PUBLIC_URL + "/data/" + this.state.variable + this.state.wave + '.csv'
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
    return (
      <div id="supercontainer">
        <div id="toprow">
          <h3 className="select name">YOU CAN NOW EXPLORE</h3>
          <div className="select" id="areaContainer">
            <Select defaultValue={areaoptions[0]} onChange={this.handleAreaSelection} options={areaoptions} />
          </div>
          <h3 className="select name">DURING THE FOLLOWING</h3>
          <div className="select" id="waveContainer">
            <Select defaultValue={waveoptions[0]} onChange={this.handleWaveSelection} options={waveoptions} />
          </div>
          <h3 className="select name">WITH MAP ATTRIBUTE</h3>
          <div className="select" id="detailsContainer">
            <Select defaultValue={this.state.detaillist[0]} value={this.state.detailtest} onChange={this.handleDetailSelection} options={this.state.detaillist} />
          </div>
          <h3 className="select name">AND COMPARE THAT WITH</h3>
          <div className="select" id="gapContainer">
            <Select defaultValue={gapoptions[1]} onChange={this.handleGapSelection} options={gapoptions} />
          </div>
          <h3 className="select name">IN THE GRAPH BELOW</h3>
        </div>
        <Map countryDetail={this.state.detail} countryData={this.state.countryData} percentage={this.state.maxPercentage} onCountrySelect={this.handleDataSelection} />
        <Chart selectedCountry={this.state.selectedCountry.Country} gapVar={this.state.gapVar} area={this.state.variable} detail={this.state.detail}/>
        <CountryInfo selectedCountry={this.state.selectedCountry} wave={this.state.wave} />
        <div id="chartinfo">
        <h2 className="chartinfoTitle">{this.state.variable} ({this.state.detail}) vs. {this.state.gapVar.replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() })}</h2>
        <div id="questionmark">?</div>
        <span className="tooltiptextnew">Bubble size represent percentages of a selected world value (such as 30% very happy) while the y-axis represents gapminder data (such as 83.2 life expectancy)</span>
        <p className="chartinfotext">Selected Country: {this.state.selectedCountry.Country}, 1995-2014</p>
      </div>
      </div>
    );
  }
}

export default App;
