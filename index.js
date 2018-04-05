#!/usr/bin/env node
const contacts = require('./src/contacts');

const params = process.argv.slice(2);
const limit = params.shift();

contacts.load(limit);