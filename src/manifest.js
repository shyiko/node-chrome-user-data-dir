var createReadStream = require('streamifier').createReadStream;
var unzip = require('unzip');
var concat = require('concat-stream');
var once = require('once');

module.exports = function (zipArchive, cb) {
  cb = once(cb);
  createReadStream(zipArchive)
    .pipe(unzip.Parse())
    .on('error', function (e) {
      cb(e);
    })
    .on('entry', function (entry) {
      var fileName = entry.path;
      if (fileName === "manifest.json") {
        entry.pipe(concat({encoding: 'string'}, function (o) {
          cb(null, JSON.parse(o));
        }));
      } else {
        entry.autodrain();
      }
    })
    .on('end', function () {
      cb(new Error('manifest.json not found'));
    });
};
