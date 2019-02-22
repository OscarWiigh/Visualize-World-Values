import React from "react"
import "./chart.css";
import * as d3 from 'd3';
import { utcMinute } from "d3";


class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.drawChart = this.drawChart.bind(this)

  }

  componentDidMount() {
    const propsdata = this.props
    this.drawChart(propsdata)
  }
  componentWillReceiveProps(propsdata) {
    if (propsdata !== this.props) {
      this.updateChart(propsdata)
    }
  }

  scaleRadius(variable, min, max) {
    if(min > 0 && max > 0) {
      const radius = 30*(variable-min)/(max-min);
      return radius
    }
    else return variable

  }


  updateChart(propsdata) {
    let this2 = this;
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 980 - margin.left - margin.right,
      height = 658 - margin.top - margin.bottom;
    // Parse the date / time
    var parseDate = d3.timeParse("%Y");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]).domain([0.5, 1]);

    // Define the axes
    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    // Define the line
    var valueline = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });

    // Get the data again
    let url = process.env.PUBLIC_URL + "./data/" + propsdata.gapVar + '.csv'
    d3.csv(url).then(res => {
      var data = [
        {
          "date": "1995",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2004",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2009",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2014",
          "close": 0,
          "happ": 0
        }
      ]
      res.forEach((row) => {
        if (row.Country == propsdata.selectedCountry) {
          data[0]["close"] = row[Object.keys(row)[0]];
          data[1]["close"] = row[Object.keys(row)[1]];
          data[2]["close"] = row[Object.keys(row)[2]];
          data[3]["close"] = row[Object.keys(row)[3]];

        }
      })
      let url1 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave3" + '.csv'
      let url2 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave4" + '.csv'
      let url3 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave5" + '.csv'
      let url4 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave6" + '.csv'
      d3.csv(url1).then(res1 => {
        res1.forEach((row1) => {
          if (row1.Country == propsdata.selectedCountry) {
            data[0]["happ"] = row1[propsdata.detail]
            console.log(row1[propsdata.detail])
          }
        })
        d3.csv(url2).then(res2 => {
          res2.forEach((row2) => {
            if (row2.Country == propsdata.selectedCountry) {
              data[1]["happ"] = row2[propsdata.detail]
              console.log(row2[propsdata.detail])
            }
          })
        })
        d3.csv(url3).then(res3 => {
          res3.forEach((row3) => {
            if (row3.Country == propsdata.selectedCountry) {
              data[2]["happ"] = row3[propsdata.detail]
              console.log(row3[propsdata.detail])
            }
          })
        })
        d3.csv(url4).then(res4 => {
          res4.forEach((row4) => {
            if (row4.Country == propsdata.selectedCountry) {
              data[3]["happ"] = row4[propsdata.detail]
              console.log(row4[propsdata.detail])
            }
          })
          data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
            d.happ = d.happ / 2;
          });
          // Scale the range of the data again 
          x.domain(d3.extent(data, function (d) { return d.date; }));
          y.domain([d3.min(data, function (d) { return d.close * 0.99; }), d3.max(data, function (d) { return d.close; })]);

          // Select the section we want to apply our changes to
          var svg = d3.select("#containerchart");

          var div = d3.select(".tooltip")

          svg.selectAll("circle")
            .data(data)
            .attr("r", function (d) { return this2.scaleRadius(d.happ, d3.min(data, function (d) { return d.happ}), d3.max(data, function (d) { return d.happ})) })
            .attr("cx", function (d) { return x(d.date); })
            .attr("cy", function (d) { return y(d.close); })
            .on("mouseover", function (d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(propsdata.selectedCountry + ", " + propsdata.area + "<br/>" + "Year: " + d.date.getFullYear() + "<br/>" + propsdata.gapVar.replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() }) + ": " + d.close + "<br/>" + propsdata.detail + ": " + d.happ * 2 + "%")
                .style("left", (d3.event.pageX-85) + "px")
                .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("mouseout", function (d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });

          // Make the changes
          svg.transition().select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
          svg.transition().select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
          svg.transition().select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
            svg.select("#ytext") // change the y axis
            .text(propsdata.gapVar.replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() }));
        })
      })


    });
  }

  drawChart(propsdata) {
    let this2 = this;
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 980 - margin.left - margin.right,
      height = 658 - margin.top - margin.bottom;

    var div = d3.select("#containerchart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Parse the date / time
    var parseDate = d3.timeParse("%Y");

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]).domain([0.5, 1]);

    // Define the axes
    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    // Define the line
    var valueline = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });

    var svg = d3.select("#containerchart")
      .append("svg")
      .attr("id", "chartid")
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("viewBox", "0 0 980 658")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    let url = process.env.PUBLIC_URL + "./data/" + propsdata.gapVar + '.csv'
    d3.csv(url).then(res => {
      var data = [
        {
          "date": "1995",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2004",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2009",
          "close": 0,
          "happ": 0
        },
        {
          "date": "2014",
          "close": 0,
          "happ": 0
        }
      ]
      res.forEach((row) => {
        if (row.Country == propsdata.selectedCountry) {
          data[0]["close"] = row[Object.keys(row)[0]];
          data[1]["close"] = row[Object.keys(row)[1]];
          data[2]["close"] = row[Object.keys(row)[2]];
          data[3]["close"] = row[Object.keys(row)[3]];

        }
      })
      let url1 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave3" + '.csv'
      let url2 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave4" + '.csv'
      let url3 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave5" + '.csv'
      let url4 = process.env.PUBLIC_URL + "./data/" + propsdata.area + "Wave6" + '.csv'
      d3.csv(url1).then(res1 => {
        res1.forEach((row1) => {
          if (row1.Country == propsdata.selectedCountry) {
            data[0]["happ"] = row1[propsdata.detail]
          }
        })
        d3.csv(url2).then(res2 => {
          res2.forEach((row2) => {
            if (row2.Country == propsdata.selectedCountry) {
              data[1]["happ"] = row2[propsdata.detail]
            }
          })
        })
        d3.csv(url3).then(res3 => {
          res3.forEach((row3) => {
            if (row3.Country == propsdata.selectedCountry) {
              data[2]["happ"] = row3[propsdata.detail]
            }
          })
        })
        d3.csv(url4).then(res4 => {
          res4.forEach((row4) => {
            if (row4.Country == propsdata.selectedCountry) {
              data[3]["happ"] = row4[propsdata.detail]
            }
          })
          data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
            d.happ = d.happ / 2;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function (d) { return d.date; }));
          y.domain([d3.min(data, function (d) { return d.close * 0.99; }), d3.max(data, function (d) { return d.close; })]);

          // Add the valueline path.
          svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

          svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", function (d) { return this2.scaleRadius(d.happ, d3.min(data, function (d) { return d.happ}), d3.max(data, function (d) { return d.happ})) })
            .attr("cx", function (d) { return x(d.date); })
            .attr("cy", function (d) { return y(d.close); })
            .on("mouseover", function (d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(propsdata.selectedCountry + ", " + propsdata.area + "<br/>" + "Year: " + d.date.getFullYear() + "<br/>" + propsdata.gapVar.replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() }) + ": " + d.close + "<br/>" + propsdata.detail + ": " + d.happ * 2 + "%")
                .style("left", (d3.event.pageX-85) + "px")
                .style("top", (d3.event.pageY + 10) + "px");
            })

            .on("mouseout", function (d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
            });

          // Add the X Axis
          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          svg.append("text")
          .attr("class", "labels")
            .attr("transform",
              "translate(" + (width-5) + " ," +
              (height - 10) + ")")
            .style("text-anchor", "middle")
            .text("Year");

          // Add the Y Axis
          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

          // text label for the y axis
          svg.append("text")
          .attr("class", "labels")
          .attr("id", "ytext")
          .attr("transform",
              "translate(" + (5) + " ," +
              (5) + ")")
            .text(propsdata.gapVar.replace(/_/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase() }));
        })
      })
    })

  }
  render() {
    return (
      <div id="containerchart">
      </div>

    );
  }
}

export default Chart;