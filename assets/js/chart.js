var d3 = require("d3")

module.exports = {
    generateChart: function(data, type) {
        $("#chart").empty();

        var HEIGHT = 500, 
            WIDTH = 750,
            PADDING = 50;
        
        // Select and size the svg element
        var svg = d3.select("svg")
                    .attr("height", HEIGHT + "px")
                    .attr("width", WIDTH + "px");
        
        // Get an array of max and min temperatures for each day in 
        // the 4-day forecast
        var data = data.hourly_forecast.map(function(entry) {
            var format = d3.time.format("%Y-%m-%d-%H");
            var time = entry.FCTTIME;

            var prettyTime = format.parse(
                            time.year + "-" 
                            + time.mon_padded + "-" 
                            + time.mday + "-" 
                            + time.hour)
            return {
                time: prettyTime,
                temp: (type == "english") ? entry.temp.english : entry.temp.metric
            }
        }); 

        var x = d3.time.scale()
                  .domain([data[0].time, data.slice(-1)[0].time])
                  .range([PADDING+10, WIDTH-PADDING])

        var y = d3.scale.linear()
                  .domain([
                      d3.min(data, function(d){return parseInt(d.temp)}),
                      d3.max(data, function(d){return parseInt(d.temp)})
                  ])
                  .range([HEIGHT-PADDING-10, PADDING])
        
        var lineGen = d3.svg.line()
                        .x(function(d) {return x(d.time)})
                        .y(function(d) {return y(d.temp)})

        svg.append("path")
           .attr("d", lineGen(data))
           .attr("stroke", "black")
           .attr("stroke-width", 2)
           .attr("fill", "none")

        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom")
                      .tickFormat(d3.time.format("%Hh %a"))
                      .ticks(10)

        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0, " + (HEIGHT - PADDING) + ")")
           .call(xAxis)

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + PADDING + ", 0)")
           .call(yAxis)
    }
}
