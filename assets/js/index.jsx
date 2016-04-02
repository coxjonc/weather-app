var React = require("react")
var ReactDOM = require("react-dom")
var CitySelect = require("./city-select")

var App = React.createClass({
    render: function() {
        return (
            <div>
            <h1>Oh hai there</h1>
            <CitySelect/>
            </div>
        )
    }
})

ReactDOM.render(<App />, document.getElementById("app"))
