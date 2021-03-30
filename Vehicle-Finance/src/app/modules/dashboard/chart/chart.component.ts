import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import d3Tip from 'd3-tip';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {

  barChartData = [815, 150, 250, 320, 400, 550, 325, 625];
  marginDataFromParent = { top: 20, right: 20, bottom: 40, left: 60 };

  xField = 'date';
  yField = 'visits';
  xLabel: any;
  yLabel = 'Total views';
  barHeight = 300
  barWidth = 1420
  mileStoneGraphData: any;
  tab: any = 'tab1';

  svg: any;
  x: any;
  y: any;
  g: any;
  margin: any;
  defaultMargin = { top: 20, right: 20, bottom: 40, left: 60 };
  chartObject = {
    xAxisColour: '#fcaf42', axisColour: '#9caede', yAxisScaleColour: '#3faedb', xLabelxAxisPosition: 1291,
    xLabelyAxisPosition: 273, barColour: '#239A55', axisLabelSize: '12px',strokeWidth:'2px'
  } // this chart object contains all the necessary css data and position of xlabel and height of the bar chart

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {

    if (this.svg) {
      this.svg.selectAll('*').remove(); // removes the existing svg if present in the page for fresh rendering the graph when compiler detects changes
    }
    if (this.marginDataFromParent) { // checking whether the margin data is being passed from parent component or not
      this.margin = this.marginDataFromParent
    } else {
      this.margin = this.defaultMargin // if data is not passed we are setting up the default margin for the graph
    }

    if (this.barChartData) {
      // console.log('chart data from parent', this.barChartData);
      this.renderBarChart(this.barChartData);
    }
  }

  renderBarChart(data: any) {

    var width = this.barWidth - this.margin.left - this.margin.right;
    var height = this.barHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select('#bar-chart')
      .attr('width', this.barWidth)
      .attr('height', this.barHeight);
    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    var that = this
    this.x = d3Scale
      .scaleBand()
      .range([0, width])
      .domain(data.map(d => d[this.xField]))
      .padding(0.2)

    // Creating the Y-axis band scale

    var maxValue = d3.max(data, function (d) {
      return Number(d[that.yField]);
    })
    if (maxValue == 0) {
      maxValue = 5
    }
    this.y = d3Scale.scaleLinear()
      .range([height, 0])
      .domain([0, maxValue])

    // Drawing the X-axis on the DOM
    this.g
      .append('g')
      .attr('class', 'xaxis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3Axis.axisBottom(this.x))
      .select('path').style('stroke', this.chartObject.axisColour).style('stroke-width', this.chartObject.strokeWidth)

    this.g.append("text")
      .attr("transform", "translate(" + this.chartObject.xLabelxAxisPosition + " ," + this.chartObject.xLabelyAxisPosition + ")")
      .style('font-size', this.chartObject.axisLabelSize)
      .text(this.xLabel)
    // .attr("fill", this.chartObject[0].xAxisColour)

    // Drawing the Y-axis on the DOM

    this.g
      .append('g')
      .attr('class', 'yaxis')
      .call(d3Axis.axisLeft(this.y).tickSize(10))
      // .attr('stroke', this.chartObject[0].yAxisScaleColour)
      .select('path').style('stroke', this.chartObject.axisColour).style('stroke-width', this.chartObject.strokeWidth)

    this.g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-size', this.chartObject.axisLabelSize)
      // .attr("fill", this.chartObject[0].yAxisScaleColour)
      .text(this.yLabel)

    // // creating tooltip for the chart

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (e, d) {
        return "<span class='tool-tip'>" + that.yField + ":" + d[that.yField] + "</span>";
      })
    this.g.call(tip);

    //  method for drawing the bar chart using the data

    this.g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(d[this.xField]))
      .attr('y', d => this.y(d[this.yField]))
      .attr('width', this.x.bandwidth())
      .attr('height', d => height - this.y(d[this.yField]))
      .attr('fill', this.chartObject.barColour)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
  }

}
