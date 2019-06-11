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

        data.forEach(function(state) {
            container.select('#' + state.State)
                .attr('fill', function() {
                    if (state.difference > 5) {
                        return '#e11f26';
                    } else if (state.difference > 0) {
                        return '#fd7a7e'
                    } else if (state.difference < -5) {
                        return '#2e4ea2';
                    } else {
                        return '#5f75cf';
                    }
                }.bind(state));
        })

        this.exportGraphic('2016-state', '2016 election results headline', 'Federal Election Commission', html.window.document.documentElement.outerHTML);
    },

    exportGraphic: function(name, title, source, html) {
        var template = fs.readFileSync('./assets/template.html', 'utf8');
            template = template.replace('__HTML__', html);
            template = template.replace('__TITLE__', title);
            template = template.replace('__SOURCE__', source);

        fs.mkdirsSync('./.build');
        fs.writeFileSync('./.build/' + name + '.html', template);
    }
}
