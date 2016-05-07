var d3 = require('d3')

module.exports = {
    generateChart: function(data, type) {
        $('#chart').empty();

        // Set margins
        var margin = {top: 20, right: 20, bottom: 20, left: 40},
            width = 600 - margin.right - margin.left,
            height = 400 - margin.right - margin.left;
       
        // Select and size the svg element
        var svg = d3.select('div#weatherChart')
            .attr('class', 'svg-container')
          .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 600 400');
        
        // Get an array of max and min temperatures for each day in 
        // the 4-day forecast
        var data = data.hourly_forecast.map(function(entry) {
            var format = d3.time.format('%Y-%m-%d-%H');
            var time = entry.FCTTIME;

            var prettyTime = format.parse(
                time.year + '-' 
                + time.mon_padded + '-' 
                + time.mday + '-' 
                + time.hour)
            return {
                time: prettyTime,
                temp: (type == 'english') ? entry.temp.english : entry.temp.metric
            }
        }); 

        var x = d3.time.scale()
            .domain([data[0].time, data.slice(-1)[0].time])
            .range([0, width])

        var y = d3.scale.linear()
            .domain([
              d3.min(data, function(d){return parseInt(d.temp)}),
              d3.max(data, function(d){return parseInt(d.temp)})
            ])
            .range([height, 0])
        
        var lineGen = d3.svg.line()
            .x(function(d) {return x(d.time)})
            .y(function(d) {return y(d.temp)})

        svg.append('path')
           .attr('d', lineGen(data))
           .attr('stroke', 'black')
           .attr('stroke-width', 2)
           .attr('fill', 'none')

        // Create axis templates
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat(d3.time.format('%Hh %a'))
            .ticks(10)

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis)
          .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'end')
            .attr('x', width - 20)
            .attr('y', height - 20)
            .text('Hour')

        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)
          .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .attr('y', -20)
            .text('Temperature (C)')
    }
}
