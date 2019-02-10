import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import ReactTooltip from "react-tooltip"
import "./map.css"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class Map extends Component {
  constructor() {
    super()

  }

  componentDidMount() {
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 300)
  }


  onSelectCountry = (geography, evt) => {
    var geodata = this.props.countryData;
    let selectedCountryData;
    if (geodata[geography.properties.name]) {
      selectedCountryData = (geodata[geography.properties.name])
    }
    else {
      selectedCountryData = ""
    }
    this.props.onCountrySelect(selectedCountryData)
  }

  countryColor (countryName, popScale) {
    let allCountries = this.props.countryData;
    let country = allCountries[countryName];
    if (country) {
      return popScale(country[Object.keys(country)[0]])}
    else {return "#bcbcbc"}
  }

  render() {
    var popScale = scaleLinear()
        .domain([0, this.props.percentage/2, this.props.percentage])
        .range(["#ff0000", "#ffff00", "#00ff00"])
    return (
      <div id="container">
        <div style={wrapperStyles}>
          <ComposableMap
            projectionConfig={{
              scale: 205,
              rotation: [-11,0,0],
            }}
            width={980}
            height={551}
            style={{
              width: "100%",
              height: "auto",
            }}
            >
            <ZoomableGroup center={[0,20]}>
              <Geographies
                geography={ "/world-50m-with-population.json" }
                disableOptimization
                >
                {(geographies, projection) =>
                  geographies.map((geography, i) => (
                    <Geography
                      key={`${geography.properties.iso_a3}-${i}`}
                      cacheId={`${geography.properties.iso_a3}-${i}`}
                      data-tip={geography.properties.name}
                      geography={ geography }
                      projection={ projection }
                      onClick={ this.onSelectCountry }
                      round
                      style={{
                        default: {
                          fill: this.countryColor(geography.properties.name, popScale),
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: this.countryColor(geography.properties.name, popScale),
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "blue",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        }
                      }}
                    />
                ))}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <ReactTooltip />
          <div id="legend">
              <p id="all">{this.props.percentage + "%"}</p>
              <p id="half">{Math.round(this.props.percentage/2)+ "%"}</p>
              <p id="zero">0%</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Map