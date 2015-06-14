var assign = require('object-assign');
var async = require('async');
var parseCRX = require('crx-parser');
var eid = require('chrome-extension-id');
var tmp = require('tmp');

var fs = require('fs');

var manifest = require('./manifest');

/**
 * @param {Object} [options]
 * @param {String} [options.userDataDir] path to the existing user-data-dir
 * @param {Object} [options.defaultPreferences] user preferences
 * @param {Array} [options.externalExtensions] extensions to register (CRX packages)
 * @param {Function} cb(err, userDataDir)
 */
module.exports = function (options, cb) {
  var o = assign({}, options);
  async.series([
    function createUserDataDirIfNeeded(cb) {
      if (o.userDataDir) {
        fs.mkdir(o.userDataDir, function (err) {
          if (err && err.code !== 'EEXIST') {
            return cb(err);
          }
          cb();
        });
      } else {
        tmp.dir({keep: true}, function (err, path) {
          o.userDataDir = path;
          cb();
        });
      }
    },
    function (cb) {
      async.parallel([
        function updateDefaultPreferences(cb) {
          !o.defaultPreferences ? cb() :
            fs.mkdir(o.userDataDir + '/Default', function () {
              fs.writeFile(o.userDataDir + '/Default/Preferences',
                JSON.stringify(o.defaultPreferences), cb);
            });
        },
        function registerExternalExtensions(cb) {
          var path = o.userDataDir + '/External Extensions';
          !o.externalExtensions ? cb() :
            fs.mkdir(path, function (err) {
              if (err && err.code !== 'EEXIST') {
                return cb(err);
              }
              async.each(o.externalExtensions, function (crx, eecb) {
                async.waterfall([
                  fs.readFile.bind(fs, crx),
                  parseCRX,
                  function (data, cb) {
                    var id = eid(data.header.publicKey);
                    manifest(data.body, function (err, m) {
                      if (err) {
                        return cb(err);
                      }
                      fs.writeFile(path + '/' + id + '.json',
                        JSON.stringify({
                          external_crx: crx,
                          external_version: m.version
                        }), cb);
                    });
                  }
                ], eecb);
              }, cb);
            });
        }
      ], cb);
    }
  ], function (err) {
    cb(err, o.userDataDir);
  });
};
