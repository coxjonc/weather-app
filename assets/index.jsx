var React = require("react")
var ReactDOM = require("react-dom")
var Select = require("react-select")

require("react-select/dist/reaciasdft-select.css")

var App = React.createClass({
    render: function() {
        return (
            <div>
            <h1>Oh hai there</h1>
            <Select/>
            </div>
        )
    }
})

ReactDOM.render(<App />, document.getElementById("app"))
