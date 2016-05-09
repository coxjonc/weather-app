var d3 = require('d3')

module.exports = {
    generateChart: function(data, type) {
        $('#weatherChart').empty();

        // Set margins
        var margin = {top: 20, right: 20, bottom: 20, left: 40},
            width = 600 - margin.right - margin.left,
            height = 400 - margin.top - margin.bottom;
       
        // Select and size the svg element
        var svg = d3.select('div#weatherChart')
            .attr('class', 'svg-container')
          .append('svg')
            .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + 
                ' ' + (height + margin.top + margin.bottom)) 
            .attr('class', 'svg-content-responsive')
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
       
        // Get an array of max and min temperatures for each day in 
        // the 4-day forecast
        var tempData = data.hourly_forecast.map(function(entry) {
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
        temps = tempData.slice(0,72)
        recordHigh = data.almanac.temp_high.record.C
        recordLow = data.almanac.temp_low.record.C

        var xScale = d3.time.scale()
            .domain([temps[0].time, temps.slice(-1)[0].time])
            .range([0, width])

        var yScale = d3.scale.linear()
            .domain([
              d3.min(temps, function(d){return parseInt(d.temp) - 15}),
              d3.max(temps, function(d){return parseInt(d.temp) + 15})
            ])
            .range([height, 0])
        
        // Line generator function
        var lineGen = d3.svg.line()
            .x(function(d) {return xScale(d.time)})
            .y(function(d) {return yScale(d.temp)})

        // Create axis templates
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(d3.time.format('%Hh %a'))
            .ticks(10)

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')

        // Append axes
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis)
          .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'end')
            .attr('x', width)
            .attr('y', 30)
            .text('Hour');

        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis)
          .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .attr('y', -30)
            .text('Temperature (Celsius)');

        // Append box showing temperature ranges
        svg.append('rect')
            .style('fill', 'lightgrey')
            .style('opacity', '0.3')
            .attr('x', 0)
            .attr('y', yScale(recordHigh))
            .attr('width', width)
            .attr('height', Math.abs(yScale(recordHigh) - yScale(recordLow)))

        // Append line
        svg.append('path')
            .attr('d', lineGen(temps))
            .attr('stroke', '#660033')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
    }
}
