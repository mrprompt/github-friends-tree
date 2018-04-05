/* global describe, before, after, it */
const mockery = require('mockery');
const should = require('should');

describe('Contacts', function() {
    before(function () {
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false
        });

        mockery.registerMock('octonode', {
            client: function(token) {
                return {
                    requestDefaults: [],
                    me: function() {
                        return {
                            token,
                            login: 'mrprompt',
                            client: {
                                requestDefaults: [],
                            },
                            following: function() {
                                return []
                            }
                        };
                    },
                    user: function() {
                        return {
                            login: 'mrprompt',
                            repos: function() {
                                return [
                                    {
                                        login: 'mrprompt'
                                    }
                                ];
                            }
                        };
                    }
                };
            }
        });

        this.contacts = require('../src/contacts');
    });

    after(function () {
        mockery.disable()
    });

    describe("followings()", function() {
        it('is a function', function(done) {
            should(this.contacts.followings).be.a.Function();

            done();
        });

        it('to be ok', function(done) {
            should(this.contacts.followings()).be.ok;

            done();
        });

        it('should return true after finish', function(done) {
            const result = this.contacts.followings();

            should(result).be.equal(true);

            done();
        });
    });

    describe("repositories()", function() {
        it('is a function', function(done) {
            should(this.contacts.repositories).be.a.Function();

            done();
        });

        it('to be ok', function(done) {
            const user = { login: 'mrprompt', client: { requestDefaults: [] } };

            should(this.contacts.repositories(user)).be.ok;

            done();
        });

        it('should return true after finish', function (done) {
            const user = { login: 'mrprompt', client: { requestDefaults: [] } };
            const result = this.contacts.repositories(user);

            should(result).be.equal(true);

            done();
        });
    });
});