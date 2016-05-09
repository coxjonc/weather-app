var React = require('react')
var ReactDOM = require('react-dom')
var Select = require('react-select')
var chart = require('./chart.js')

require('react-select/dist/react-select.min.css')

var App = React.createClass({
    getInitialState: function() {
        return {
            citySelectValue: 'x',
            cityOptions: [],
            zmw: '',
            weatherData: [],
            type: 'metric'
        }
    },

    updateCities: function(input, callback) {
        $.ajax({
            method: 'GET',
            url: 'http://autocomplete.wunderground.com/aq',
            data: {query: input},
            dataType: 'jsonp',
            jsonp: 'cb',
            crossDomain: true,
            success: function(data){
                var data = data.RESULTS.map(function(city){
                    return { value: city.zmw, label: city.name }
                })
                this.setState({cityOptions: data})
                callback(null, {options: this.state.cityOptions})
            }.bind(this)
        })
    },

    getWeather: function() {
        $.ajax({
            method: 'GET',
            url: 'http://api.wunderground.com/api/f8e80b5bdc3e3694/' + 
            'hourly10day/almanac/q/zmw:' + this.state.zmw + '.json',
            dataType: 'jsonp', 
            jsonp: 'callback',
            crossDomain: true,
            success: function(data){
                this.setState({weatherData: data})
                chart.generateChart(this.state.weatherData, this.state.type)
            }.bind(this)
        })
    },

    updateSelected: function(val) {
        this.setState({citySelectValue: (val) ? val : '', 
            zmw: (val) ? val.value : ''})
        setTimeout(this.getWeather, 500)
    },

    render: function() {
        return (
            <div>
            <h1>72-Hour Forecast</h1>
            <h2>Enter any city in the world</h2>
            <div id='select'>
            <Select.Async
                value={this.state.citySelectValue}
                onChange={this.updateSelected}
                loadOptions={this.updateCities}    
                minimumInput={2}
            />
            </div>
            </div> 
        )
    }
})

ReactDOM.render(<App />, document.getElementById('app'))
