var fs = require('fs-extra');
var D3Node = require('d3-node');

module.exports = {
    compile: function() {
        this.createChart();
    },

    createChart: function() {
        var d3n = new D3Node();
        var d3 = d3n.d3;

        // create the chart here

        fs.mkdirsSync('./.build');
        fs.writeFileSync('./.build/master.html', 'cool');
    }
}
