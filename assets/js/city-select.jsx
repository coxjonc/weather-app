var React = require("react")
var Select = require("react-select")

require("react-select/dist/react-select.min.css")

module.exports = React.createClass({
    getInitialState: function() {
        return {
            citySelectValue: '',
            cities: []
        }
    },

    getCities: function(input, callback) {
        setTimeout(
            function() {
            $.ajax({
                method: "GET",
                url: "http://autocomplete.wunderground.com/aq",
                data: {query: input},
                dataType: "jsonp",
                jsonp: 'cb',
                crossDomain: true,
                success: function(data){
                    var data = data.RESULTS.map(function(city){
                        return city.name
                    })
                    this.setState({cities: data})
                    console.log(this.state.cities)
                }.bind(this)
            })
            callback(null, {
                options: this.state.cities
            })
            }.bind(this),
            1000
        )
    },

    render: function() {
        return (
            <Select.Async
                value={this.state.citySelectValue}
                loadOptions={this.getCities}    
            />
        )
    }
})
