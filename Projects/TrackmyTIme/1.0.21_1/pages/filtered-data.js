/*global DayTracker, chrome, google, $, d3  */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  $(function () {
    $("#datepicker").datepicker({
      maxDate: "0D",
      onSelect: function (d) {
        var date = d.split('/');
      },
      selectWeek: true,
      inline: true
    });
  });

  function getRandomColor() {
    return "#" + [1, 2, 3, 4, 5, 6].map(function () {return Math.floor(Math.random() * 14).toString(16); }).join('');
  }

  var day = new DayTracker('2014-04-16');

  day.preProcessingVisits(function (err, result) {
    console.log(err, result);
    var timeLabels,
      dataset = result,
      w = 640,
      h = 480,
      lineHeight = 20,
      leftPadding = 40,

      xScale = d3.scale.linear()
        .domain([0, 3600000]) // from 0 to   60_min * 60_sec * 1000_ms
        .range([0, w]),

      svg = d3.select("body")
        .select("svg#time-line")
        .attr("width", w)
        .attr("height", h);

    //Create bars
    svg.append('g').attr('class', 'periods')
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return leftPadding + xScale(d[2]);
      })
      .attr("y", function (d) {
        return d[0] * lineHeight;
      })
      .attr("width", function (d) {return xScale(d[3] - d[2]); })
      .attr("height", lineHeight)
      .attr("fill", function (d) {
        return getRandomColor();
      });

//    svg.append('g').attr('class', 'timeLabels')
//      .selectAll("rect")
//      .data(dataset);



//    //Create labels
//    svg.selectAll("text")
//      .data(dataset)
//      .enter()
//      .append("text")
//      .text(function(d) {
//        return d;
//      })
//      .attr("text-anchor", "middle")
//      .attr("x", function(d, i) {
//        return xScale(i) + xScale.rangeBand() / 2;
//      })
//      .attr("y", function(d) {
//        return h - yScale(d) + 14;
//      })
//      .attr("font-family", "sans-serif")
//      .attr("font-size", "11px")
//      .attr("fill", "white");

  });
});

