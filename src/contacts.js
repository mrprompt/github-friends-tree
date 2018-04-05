const github = require('octonode');

const token = process.env.GITHUB_TOKEN || '';
const client = github.client(token);

const LIMIT = 50;

let page = 1;
let pages = 100;
let pageRepositories = 1;
let pagesRepositories = 100;

function load() {
    const me = client.me();

    followings(me, page);
}

function followings(me, pg) {
    me.client.requestDefaults['qs'] = { per_page: LIMIT, page: pg };

    me.following(function(err, result, headers) {
        if (err) return;

        pages = getPagesFromHeader(headers);

        result.forEach(function(row) {
            repositories(row, pageRepositories);
        });
    });

    if (pg <= pages) {
        page++;

        followings(me, page);
    }

    return;
}

function repositories(user, pg = 1) {
    client.requestDefaults['qs'] = {
        per_page: LIMIT, 
        page: pg
    };

    client.user(user.login).repos(function (err, result, headers) {
        if (err) return;

        if (pg === 1) {
            console.log(`- @${user.login}`);
        }

        pagesRepositories = getPagesFromHeader(headers);

        result.forEach(function (row) {
            console.log(`\t${row.name} - ${row.language} - ${row.url}`);
        });
    });

    if (pg <= pagesRepositories) {
        pageRepositories++;

        repositories(user, pageRepositories);
    }

    return;
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