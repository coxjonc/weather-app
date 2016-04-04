var React = require("react")
var Select = require("react-select")

require("react-select/dist/react-select.min.css")

module.exports = React.createClass({
    getInitialState: function() {
        return {
            citySelectValue: 'blabla',
            cities: []
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
                    return { value: city.name, label: city.name }
                })
                this.setState({cities: data})
                callback(null, {options: this.state.cities})
            }.bind(this)
        })
    },

    updateSelect: function(val) {
        this.setState({citySelectValue: val})
    },

    render: function() {
        return (
            <Select.Async
                value={this.state.citySelectValue}
                onChange={this.updateSelect}
                loadOptions={this.updateCities}    
                minimumInput={2}
            />
        )
    }
})
