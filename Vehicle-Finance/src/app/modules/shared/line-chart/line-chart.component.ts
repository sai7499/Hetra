import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as D3 from 'd3';

import * as d3 from 'd3-scale-chromatic';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @ViewChild('containerPieChart', { static: true }) element: ElementRef<any>

  private host;
  private svg;
  private width;
  private height;
  private radius;
  private htmlElement: HTMLElement;
  private pieData;

  lineChartData = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';
  apiData: any;
  arr: any;
  newApiData: { date: string; value: number; }[];
  allGroup: string[];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.pieData = [
      {
        label: 'data1',
        value: 3
      },
      {
        label: 'data2',
        value: 2
      },
      {
        label: 'data3',
        value: 3
      },
      {
        label: 'data4',
        value: 4
      },
      {
        label: 'data5',
        value: 5
      },
    ]
    // for Pie CHART
    // this.htmlElement = this.element.nativeElement;
    // this.host = D3.select(this.htmlElement);
    // this.setUp();
    // this.buildSVG();
    // this.buildPie();

    // // for Bar chart Starts
    // // this.host = D3.style('color', 'blue')
    // // D3.select('h1').style('color', 'blue');
    // // let dataSet = [100,102,30,40,500, 60, 100];
    // let dataSet = [1,2,3,4,5,6,7,8,9]

    // let svgWidth = 500;
    // let svgHeight = 300;
    // let barPadding = 10;
    // let barWidth = (svgWidth / dataSet.length);

    // let svg = D3.select('svg ')
    // .attr('width', svgWidth)
    // .attr('height', svgHeight)
    // .style('background-color', 'gray')

    // let xScale = D3.scaleLinear()
    // .domain([0, D3.max(dataSet)])
    // .range([0, svgWidth]);

    // let yScale = D3.scaleLinear()
    // .domain([0, D3.max(dataSet)])
    // .range([svgHeight ,0]);

    // let x_axis = D3.axisBottom()
    // .scale(xScale);

    // let y_axis = D3.axisLeft()
    // .scale(yScale);

    // svg.append('g')
    // .attr('transform', 'translate(50, 10)')
    // .call(y_axis);

    // let xAxisTranslate = svgHeight - 20;

    // svg.append('g')
    // .attr('transform', "translate(50, " + xAxisTranslate + ")")
    // .call(x_axis);

    // // let barChart = svg.selectAll('rect')
    // // .data(dataSet)
    // // .enter()
    // // .append('rect')
    // // .attr('y', (d) => {
    // //   return svgHeight - yScale(d);
    // // })
    // // .attr('height', (d) => {
    // //   return yScale(d);
    // // })
    // // .attr('width', barWidth - barPadding)
    // // .attr('transform', (d, i) => {
    // //   var translate = [barWidth * i, 0];
    // //   return "translate("+ translate +")";
    // // })

    // let text = svg.selectAll('text')
    // .data(dataSet)
    // .enter()
    // .append('text')
    // .text((d) => {
    //   return d;
    // })
    // .attr('y', (d, i) => {
    //   return svgHeight - d - 2;
    // })
    // .attr('x', (d, i) => {
    //   return barWidth * i
    // })
    // .attr('fill', 'red')
    // // for Line chart Ends

    // For Line Chart
    
    // margin for new line chart
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    let svg = D3.select('#lineChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

    // line Data
    // D3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv",
    //  (data) => {
    this.allGroup = ["valueA", "valueB", "valueC"]
    var data = [{ time: '1', valueA: '2', valueB: '5', valueC: '13' },
    { time: '2', valueA: '3', valueB: '4', valueC: '14' },
    { time: '3', valueA: '1', valueB: '4', valueC: '16' },
    { time: '4', valueA: '7', valueB: '4', valueC: '12' },
    { time: '5', valueA: '8', valueB: '8', valueC: '7' },
    { time: '6', valueA: '8', valueB: '13', valueC: '9' },
    { time: '7', valueA: '5', valueB: '15', valueC: '3' },
    { time: '8', valueA: '4', valueB: '17', valueC: '2' },
    { time: '9', valueA: '9', valueB: '18', valueC: '1' },
    { time: '10', valueA: '11', valueB: '13', valueC: '1' },
    ]

   
    
    D3.select('#selectButton')
      .selectAll('myOptions')
      .data(this.allGroup)
      .enter()
      .append('option')
      .text(d => { return d })
      .attr('value', d => { return d })

    // a color scale
    let myColor = D3.scaleOrdinal()
      .domain(this.allGroup)
      .range(D3.schemeSet2);

    let x = D3.scaleLinear()
    .domain([0, 10])
      // .domain(D3.extent(dimensionsData, d => {return d.year}))
      .range([0, width]);

    svg.append('g')
      .attr('transform', "translate(0, " + height + ")")
      .call(D3.axisBottom(x))
      .append('text')
      .attr("fill", "#000")
      .attr("dx", width - 10)
      .attr("dy", "-0.71em")
      .text('Time');

    let y = D3.scaleLinear()
      .domain([0, 20])
      .range([height, 0]);

    svg.append('g')
      .call(D3.axisLeft(y))
      .append('text')
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1.71em")
      .text('Value');

    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
      .datum(data)
      .attr("d", D3.line()
        .x(function (d) { return x(+d.time) })
        .y(function (d) { return y(+d.valueA) })
      )
      .attr("stroke", function (d) { return myColor("valueA") })
      .style("stroke-width", 4)
      .style("fill", "none");

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })
      // var dataFilter = dimensionsData.filter(d => d.name === selectedGroup)

      // Give these new data to update line
      line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", D3.line()
          .x(function (d) { return x(+d.time) })
          .y(function (d) { return y(+d.value) })
        )
        .attr("stroke", function (d) { return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    D3.select("#selectButton").on("change", function (d) {
      // recover the option that has been chosen
      var selectedOption = D3.select(this).property("value")
      // run the updateChart function with this selected option
      D3.select('h4').text(`Line Chart with Time and value for ${selectedOption ? selectedOption : 'ValueA'}`)
      update(selectedOption)
    })
    


  }



  onLineChartChange(data) {


    if (data == 'oldData') {
      this.arr = [];
      let arr = [];
      for (let i = 0; i < this.apiData.length; i++) {
        arr.push({
          date: new Date(this.apiData[i].date),
          value: this.apiData[i].value
        })
        // console.log(arr);
        this.arr = arr;

      }
      this.drawChart(this.arr);
    } else if (data == 'newData') {
      this.arr = [];
      let newArr = [];
      for (let i = 0; i < this.newApiData.length; i++) {
        newArr.push({
          date: new Date(this.newApiData[i].date),
          value: this.newApiData[i].value
        })
        this.arr = newArr
      }
      this.drawChart(this.arr);
    }

  }


  drawChart(data) {
    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    let svg = D3.select('svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = D3.scaleTime()
      .rangeRound([0, width]);

    var y = D3.scaleLinear()
      .rangeRound([height, 0]);

    var line = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
    x.domain(D3.extent(data, function (d) { return d.date }));
    y.domain(D3.extent(data, function (d) { return d.value }));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(D3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      // .attr("transform", "rotate(-90)")
      // .attr("x", 6)
      .attr("dx", "1.71em")
      .attr("dy", "-0.71em")
      // .attr("text-anchor", "end")
      .text("Date")
      .select(".domain")
      .remove();

    g.append("g")
      .call(D3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }

  setUp() {
    this.width = 500;
    this.height = 250;
    this.radius = Math.min(this.width, this.height) / 2; //to draw a pie chart we need these variable
  }

  buildSVG() { //this function is used for to transform square into circle
    this.svg = this.host.append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
  }

  buildPie() {
    let pie = D3.pie();
    let values = this.pieData.map(data => data.value);
    // Generate groups
    let arcSelection = this.svg.selectAll('.arc').
      data(pie(values))
      .enter()
      .append('g').
      attr('class', 'arc');

    this.popuatePie(arcSelection);
  }

  popuatePie(arcSelection) { //this function is used to add colors for each group
    let innerRadius = this.radius - 50;
    let outerRadius = this.radius - 10;
    let pieColor = D3.scaleOrdinal(D3.schemeCategory10);
    //GENERATE ARCS
    let arc = D3.arc().innerRadius(0).outerRadius(outerRadius);
    // Draw arc paths
    arcSelection.append('path')
      .attr('d', arc)
      .attr('fill', (data, index) => {
        return pieColor(this.pieData[index].label)
      });

    arcSelection.append('text')
      .attr('transform', (data: any) => {
        data.innerRadius = 0;
        data.outerRadius = outerRadius;
        return "translate(" + arc.centroid(data) + ")";
      })
      .text((data, index) => this.pieData[index].label + " - " + this.pieData[index].value)
      .style('text-anchor', 'middle')
      .style('font-size', 10)


  }

}
