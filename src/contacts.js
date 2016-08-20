'use strict';

var github = require('octonode');
var contacts = {
    load: load
};

function load() {
    var token = process.env.GITHUB_CLIENT || '';
    var client = github.client(token);
    var me = client.me();

    // chamo uma vez somente para pegar o total de páginas
    me.following(function(err, body, headers) {
        if (err) return;

        var pages = getPagesFromHeader(headers);

        for (var page = 1; page <= pages; page++) {
            search(client, me, page);
        }
    });
}

function search(client, me, page) {
    client.requestDefaults['qs'] = {
        per_page: 100, 
        page: page
    };

    me.following(function(err, result) {
        if (err) return;

        result.forEach(function(row) {
            console.log(`${row.id} - @${row.login}`);
        });
    });
}

function getPagesFromHeader(header) {
    if (!header.link) return;

    var links = header.link.split(',');
    var next = links.pop();
    var link = /(&page=([0-9]+))/g;
    var pages = link.exec(next);
    var totalPages = pages[2];

    return Number(totalPages);
}

module.exports = contacts;