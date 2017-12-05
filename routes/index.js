var express = require('express');
var router = express.Router();
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();

var devDir = {
  path:'/dev/', // <--- change this for a valid directory in your machine.
  watch_for: Inotify.IN_CREATE | Inotify.IN_DELETE,
  callback: function(event) {
    console.log(event.name);
  }
};

var devDescriptor = inotify.addWatch(devDir);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', distros:['ubuntu', 'fedora', 'arch', 'slackware', 'gentoo', 'debian', 'opensuse', 'dragonos', 'mint', 'centos'] });
});
router.post('/install', function(req, res, next) {
  res.json({ 'error': false });
});
module.exports = router;
