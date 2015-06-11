var mockFS = require('mock-fs');

var fs = require('fs');
var assert = require('assert');

var udd = require('../src');

mockFS({
  '/home/username/.config/google-chrome': {},
  '/tmp/mfabfdnimhipcapcioneheloaehhoggk.crx':
    fs.readFileSync(__dirname + '/fixture/mfabfdnimhipcapcioneheloaehhoggk.crx')
});

udd({
  defaultPreferences: {homepage: "chrome://version/"},
  externalExtensions: ['/tmp/mfabfdnimhipcapcioneheloaehhoggk.crx']
}, function (err, userDataDir) {
  assert(userDataDir);
  assert.equal(fs.readFileSync(userDataDir + '/Default/Preferences', 'utf8'),
    '{"homepage":"chrome://version/"}');
  assert.equal(fs.readFileSync(userDataDir +
      '/External Extensions/mfabfdnimhipcapcioneheloaehhoggk.json', 'utf8'),
    '{\"external_crx\":\"/tmp/mfabfdnimhipcapcioneheloaehhoggk.crx\",\"external_version\":\"0.1.0\"}');
  mockFS.restore();
});
