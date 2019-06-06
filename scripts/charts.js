var fs = require('fs-extra');
var d3 = require('d3');
var jsdom = require('jsdom').JSDOM;

module.exports = {
    compile: function() {
        fs.mkdirsSync('./.build');
        this.createStateMap();
    },

    createStateMap: function() {
        var data = JSON.parse(fs.readFileSync('./assets/2016-election.json', 'utf8'));
        var valueArray = [];

        data.forEach(function(state, i) {
            data[i].winner = state.Trump > state.Clinton ? 'Trump' : 'Clinton';
            data[i].difference = ((parseInt(state.Trump) - parseInt(state.Clinton)) / parseInt(state.Trump)) * 100;
            valueArray.push(state.difference);
        });

        var html = new jsdom('<!DOCTYPE html><html><body></body></html>');
        var preRenderedHTML = fs.readFileSync('./assets/state-map.html', 'utf8')

        var body = d3.select(html.window.document).select('body');
        var container = body.append('div').attr('class', 'container').html(preRenderedHTML);

        var minVal = d3.min(valueArray);
        var maxVal = d3.max(valueArray);
        var ramp = d3.scaleQuantize()
            .domain([-5, 5])
            .clamp(true)
            .ticks(2)
            .range(['#2e4ea2', '#e11f26']);

        data.forEach(function(state) {
            container.select('#' + state.State)
                .attr('fill', ramp(state.difference));
        })

        fs.mkdirsSync('./.build');
        fs.writeFileSync('./.build/master.html', html.window.document.documentElement.outerHTML);
    }
}
