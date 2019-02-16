import React from "react"
import "./chart.css";
import * as d3 from 'd3';


class Chart extends React.Component {

  constructor(props) {
    super(props);
    this.drawChart = this.drawChart.bind(this)

    // this.state = {
    //   selectedpersons: []
    // }

  }

  componentDidMount() {
    // const { data } = this.props;
    // this.drawChart(data)
    this.drawChart()
    setTimeout(() => {
      this.updateChart()
    }, 2000);
  }
  // componentWillReceiveProps({ data }) {
  //   this.updateChart(data)
  // }


  updateChart() {
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;
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
    let url = process.env.PUBLIC_URL + "./data/" + "data2" + ".csv"
    d3.csv(url).then(function (data) {
      data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
        d.happ = d.happ / 2;
      });

      // Scale the range of the data again 
      x.domain(d3.extent(data, function (d) { return d.date; }));
      y.domain([d3.min(data, function (d) { return d.close * 0.99; }), d3.max(data, function (d) { return d.close; })]);

      // Select the section we want to apply our changes to
      var svg = d3.select("#container");

      svg.selectAll("circle")
        .data(data)
        .transition()
        .attr("r", function (d) { return d.happ; })
        .attr("cx", function (d) { return x(d.date); })
        .attr("cy", function (d) { return y(d.close); })
        .duration(750);

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


    });
  }

  drawChart() {
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

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

    var svg = d3.select("#container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    let url = process.env.PUBLIC_URL + "./data/" + "data" + ".csv"
    d3.csv(url).then(function (data) {
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
        .attr("r", function (d) { return d.happ; })
        .attr("cx", function (d) { return x(d.date); })
        .attr("cy", function (d) { return y(d.close); });

      // Add the X Axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Add the Y Axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    });
  }
  render() {
    return (
      <div id="container">
      </div>

    );
  }
}

export default Chart;