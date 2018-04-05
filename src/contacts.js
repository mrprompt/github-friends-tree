const github = require('octonode');

const token = process.env.GITHUB_TOKEN || '';
const client = github.client(token);

let page = 1;
let pages = 100;

let users = [];

function load() {
    const me = client.me();

    followings(me, page);
}

function followings(me, pg) {
    me.client.requestDefaults['qs'] = { per_page: 50, page: pg };

    me.following(function(err, result, headers) {
        if (err) return;

        pages = getPagesFromHeader(headers);

        result.forEach(function(row) {
            console.log(`- @${row.login}`);

            users.push(row);
        });
    });

    if (pg <= pages) {
        page++;

        followings(me, page);
    }

    return;
}

function repositories(users, page = 1) {
    client.requestDefaults['qs'] = {
        per_page: 50, 
        page: page
    };

    users.forEach(function(user) {
        console.log(`- @${user.login}`);

        client.user(user).repos(function (err, result) {
            if (err) return;

            result.forEach(function (row) {
                console.log(`\t${row.name} - ${row.language} - ${row.url}`);
            });
        });
    });
}

function getPagesFromHeader(header) {
    if (!header.link) return;

    var links = header.link.split(',');
    var next = links.pop();
    var link = /((&|\?)page=([0-9]+))/g;
    var pages = link.exec(next);
    var totalPages = pages.pop();

    return Number(totalPages);
}

module.exports = { load, followings, repositories };