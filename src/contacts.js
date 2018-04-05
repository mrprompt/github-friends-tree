const github = require('octonode');
const parse = require('parse-link-header');

const token = process.env.GITHUB_TOKEN || '';
const LIMIT = 100;

let page = 1;
let pages = 100;
let pageRepositories = 1;
let pagesRepositories = 100;

function followings(pg = 1) {
    const client = github.client(token);
    const me = client.me();

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

        followings(page);
    }

    return true;
}

function repositories(user, pg = 1) {
    const client = github.client(token);

    client.requestDefaults['qs'] = { per_page: LIMIT, page: pg };

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

    return true;
}

function getPagesFromHeader(header) {
    if (!header.link) return 1;

    const parsed = parse(header.link);

    if (!parsed || !parsed.last) return 1;
    
    return +parsed.last.page;
}

module.exports = { followings, repositories };