var React = require("react")
var ReactDOM = require("react-dom")
var Select = require("react-select")

require("react-select/dist/react-select.min.css")

var App = React.createClass({
    getInitialState: function() {
        return {
            citySelectValue: "x",
            cityOptions: [],
            zmw: ""
        }
    },

    updateCities: function(input, callback) {
        $.ajax({
            method: "GET",
            url: "http://autocomplete.wunderground.com/aq",
            data: {query: input},
            dataType: "jsonp",
            jsonp: "cb",
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
            url: "http://api.wunderground.com/api/f8e80b5bdc3e3694/forecast/q/zmw:" + this.state.zmw + ".json",
            dataType: "jsonp", 
            jsonp: "callback",
            crossDomain: true,
            success: function(data){
                console.log(data)
                alert("well done padawan")
            }
        })
    },

    updateSelected: function(val) {
        this.setState({citySelectValue: val, zmw: val.value})
        setTimeout(this.getWeather, 500)
    },

    render: function() {
        return (
            <Select.Async
                value={this.state.citySelectValue}
                onChange={this.updateSelected}
                loadOptions={this.updateCities}    
                minimumInput={2}
            />
        )
    }
})

ReactDOM.render(<App />, document.getElementById("app"))
