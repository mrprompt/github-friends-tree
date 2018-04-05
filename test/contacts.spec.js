/* global describe, it */
const contacts = require('../src/contacts');
const should = require('should');

describe('Contacts', function() {
    describe("followings()", function() {
        it('is a function', function(done) {
            should(contacts.followings).be.a.Function();

            done();
        });

        it('to be ok', function(done) {
            should(contacts.followings()).be.ok;

            done();
        });
    });

    describe("repositories()", function() {
        it('is a function', function(done) {
            should(contacts.repositories).be.a.Function();

            done();
        });

        it('to be ok', function(done) {
            const user = { login: 'mrprompt', client: { requestDefaults: [] } };

            should(contacts.repositories(user)).be.ok;

            done();
        });
    });
});