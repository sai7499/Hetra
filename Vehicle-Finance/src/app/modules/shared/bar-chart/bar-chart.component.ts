import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import d3Tip from 'd3-tip';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {

    barChartData = [
        {
            "date": "23/03",
            "visits": 0
        },
        {
            "date": "24/03",
            "visits": 2
        },
        {
            "date": "25/03",
            "visits": 0
        },
        {
            "date": "26/03",
            "visits": 1.04
        },
        {
            "date": "27/03",
            "visits": 0
        },
        {
            "date": "28/03",
            "visits": 0
        },
        {
            "date": "29/03",
            "visits": 0
        },
        {
            "date": "30/03",
            "visits": 0
        },
        {
            "date": "31/03",
            "visits": 0
        },
        {
            "date": "01/04",
            "visits": 0.67
        },
        {
            "date": "02/04",
            "visits": 0
        },
        {
            "date": "03/04",
            "visits": 0
        },
        {
            "date": "04/04",
            "visits": 0.5
        },
        {
            "date": "05/04",
            "visits": 0
        },
        {
            "date": "06/04",
            "visits": 1.89
        },
        {
            "date": "07/04",
            "visits": 0
        },
        {
            "date": "08/04",
            "visits": 0
        },
        {
            "date": "09/04",
            "visits": 1.1
        },
        {
            "date": "10/04",
            "visits": 0.9
        },
        {
            "date": "11/04",
            "visits": 0
        },

    ];
    marginDataFromParent = {
        "top": 20,
        "right": 20,
        "bottom": 40,
        "left": 60
    };

    barHeight = 300
    barWidth = 1000

    xField = "date"
    yField = "visits"
    xLabel = "Date"
    yLabel = "Total views"
    svg: any;
    g: any;
    x: any;
    y: any;
    margin: any;
    defaultMargin = { top: 20, right: 20, bottom: 40, left: 60 };
    chartObject = {
        xAxisColour: '#fcaf42', axisColour: '#9caede', yAxisScaleColour: '#3faedb', xLabelxAxisPosition: 450,
        xLabelyAxisPosition: 273, barColour: '#5b2e8f', axisLabelSize: '13px', strokeWidth: '2px'
    }

    ngOnInit() {
        this.margin = this.defaultMargin;
        this.renderBarChart(this.barChartData)
    }

    renderBarChart(data: any) {

        var width = this.barWidth - this.margin.left - this.margin.right;
        var height = this.barHeight - this.margin.top - this.margin.bottom;

        console.log('width', width, 'height', height)

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
            .offset([-5, 0])
            .html(function (e, d) {
                return "<span class='tool-tip'>" + that.yField + ":" + d[that.yField] + "</span>";
            })
        this.g.call(tip);

        //  method for drawing the bar chart using the data
        this.g.selectAll('#bar-chart')
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