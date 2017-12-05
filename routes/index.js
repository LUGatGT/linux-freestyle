var express = require('express');
var router = express.Router();
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
var exec = require('child_process').spawn;
var fs = require('fs');

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');
var usbIn = "";
var devDir = {
  path:'/dev/', // <--- change this for a valid directory in your machine.
  watch_for: Inotify.IN_CREATE | Inotify.IN_DELETE,
  callback: function(event) {
    var nm = event.name;
    if (nm != "sdb" && nm != "sdc" && nm != "sdd") {
      return;
    }
    var mask = event.mask;
    if (mask & Inotify.IN_CREATE) {
      console.log(nm + " created");
      usbIn = nm;
    } else {
      console.log(nm + " removed");
      if (usbIn == nm) {
        usbIn = "";
      }
    }
  }
};

var devDescriptor = inotify.addWatch(devDir);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', distros:['ubuntu', 'fedora', 'arch', 'slackware', 'gentoo', 'debian', 'opensuse', 'dragonos', 'mint', 'centos'] });
});
router.post('/install', function(req, res, next) {
  var dist = req.body.distro;
  if (usbIn != "") {
    exec("dd", ['if=dist/' + dist + '.iso', 'of=' + '/dev/' + usbIn],{ detached: true, stdio:['ignore',out,err]});
    res.json({ 'error': false });
  } else {
    res.json({'error':true});
  }
});
module.exports = router;
