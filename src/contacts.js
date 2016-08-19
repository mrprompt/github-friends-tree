'use strict';

var github = require('octonode');
var contacts = {
    load: load
};

function load() {
    var token = process.env.GITHUB_CLIENT || '';
    var client = github.client(token);
    var me = client.me();

    for (var i = 1; i < 5; i++) {
        search(client, me, i);
    }
}

function search(client, me, page) {
    client.requestDefaults['qs'] = {per_page: 100, page: page};

    me.following(function(err, result, headers) {
        if (err) return;

        result.forEach(function(row) {
            repositories(client, row.login, 1);
        });
    });
}

function repositories(client, login, page) {
    var user = client.user(login);

    user.repos(function(err, result) {
        if (err) return;

        result.forEach(function(row) {
            console.log(row.full_name);
        });
    });
}

function getPagesFromHeader(header) {
    var links = header.link.split(',');
    var next = links.pop();
    var link = /(&page=([0-9]+))/g;
    var pages = link.exec(next);
    var totalPages = pages[2];

    return Number(totalPages);
}

module.exports = contacts;