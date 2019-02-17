import React, { Component } from "react"
import "./countryinfo.css"

class CountryInfo extends Component {
  constructor() {
    super()
    this.objtoelements = this.objtoelements.bind(this)

  }

  objtoelements(obj) {
    let elarray = []
    for (const key of Object.keys(obj)) {
      elarray.push(<p className="textcountry" key={key}>{key + ": " + obj[key] + "%"}</p>);
    }
    elarray.pop()
    return elarray;
  }

  render() {
    let countrydata = this.props.selectedCountry;

    if (Object.keys(countrydata).length > 2) {
      return (
        <div id="countrycontainer">
          <h2 className="countryTitle">{countrydata.Country}</h2>
          {this.objtoelements(countrydata)}
        </div>
      )
    }
    else {
      return <div id="countrycontainer">
        <h2 className="textcountry">{countrydata.Country}</h2>
        <p className="textcountry">No data!</p>
      </div>
    }
  }
}

export default CountryInfo