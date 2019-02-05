import React, { Component } from "react"

class CountryInfo extends Component {
  constructor() {
    super()

  }


  render() {

    if (this.props.selectedCountry.Total) {
      console.log(this.props.selectedCountry)
      return (
        <div>
        <p>{"Total partcipants: " + this.props.selectedCountry.Total}</p>
        <p>{"Very happy: " + this.props.selectedCountry["Very happy"] + "%"}</p>
        </div>
      )
    }
    else {
      return null
    }
  }
}

export default CountryInfo