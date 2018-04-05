const github = require('octonode');

const token = process.env.GITHUB_TOKEN || '';
const LIMIT = 50;

let page = 1;
let pages = 100;
let pageRepositories = 1;
let pagesRepositories = 100;

function load() {
    const client = github.client(token);
    const me = client.me();

    followings(me, page);
}

function followings(me, pg) {
    me.client.requestDefaults['qs'] = { per_page: LIMIT, page: pg };

    me.following(function(err, result, headers) {
        if (err) return console.error(err);

        pages = getPagesFromHeader(headers);

        result.forEach(function(row) {
            repositories(row);
        });
    });

    if (pg <= pages) {
        page++;

        followings(me, page);
    }

    return;
}

function repositories(user, pg = 1) {
    const client = github.client(token);

    client.requestDefaults['qs'] = { per_page: LIMIT,  page: pg };

    client.user(user.login).repos(function (err, result, headers) {
        if (err) return console.error(err);

        pagesRepositories = getPagesFromHeader(headers);

        result.forEach(function (row) {
            console.log(`- @${user.login} - ${row.name} - ${row.language} - ${row.url}`);
        });
    });

    if (pg <= pagesRepositories) {
        pageRepositories++;

        repositories(user, pageRepositories);
    }

    return;
}

function getPagesFromHeader(header) {
    console.log(header);

    if (!header.link) return;

    var links = header.link.split(',');
    var next = links.pop();
    var link = /((&|\?)page=([0-9]+))/g;
    var pages = link.exec(next);
    var totalPages = pages.pop();

    return Number(totalPages);
}

module.exports = { load, followings, repositories };