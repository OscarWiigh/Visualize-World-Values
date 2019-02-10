import React, { Component } from "react"

class CountryInfo extends Component {
  constructor() {
    super()
    this.objtoelements = this.objtoelements.bind(this)

  }

  objtoelements (obj) {
    let elarray = []
    for (const key of Object.keys(obj)) {
      elarray.push(<p key={key}>{key + ": " + obj[key] + "%"}</p>);
  }
    return elarray;
  }

  render() {
    let countrydata = this.props.selectedCountry;

    if (Object.keys(countrydata).length !== 0) {
      return (
        <div>
          <h2>Country data</h2>
          {this.objtoelements(countrydata)}
        </div>
      )
    }
    else {
      return <p>No data!</p>
    }
  }
}

export default CountryInfo