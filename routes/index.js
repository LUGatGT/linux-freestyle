var express = require('express');
var router = express.Router();
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
const { spawn } = require('child_process');
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

var dd;
var distBytes = 0;

var ddStatusClean = {
	bytes_written: 0,
        bytes_total: distBytes,
        percentage: 0,
	speed: 0,
	speed_units: 'MB/s',
	state: "init",
        status: "",
};
var ddStatus = ddStatusClean;

// TODO rewrite to use callback (non-sync version)
function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

function ddParseStatus(data) {
  try {
      // we use a try because it's possible the entire message isn't buffered
      const lines = data.split('\n').filter(line => line.length != 0); //filter out empty lines
      const fields = lines[2].split(' ');
      const bytes = fields[0];

      const speed = fields[fields.length - 2];
      const speed_units = fields[fields.length - 1];

      ddStatus = {
	      bytes_written: bytes,
              bytes_total: distBytes,
              percentage: Math.trunc((bytes / distBytes)*100),
	      speed: speed,
	      speed_units: speed_units,
	      state: "running",
              status: "",
      };
  } catch (error) {
    console.log('Error while parsing output from dd.');
  }
}

router.post('/install', function(req, res, next) {
  var dist = req.body.distro;
  if (usbIn != "") {
    var usbNum = usbIn.charCodeAt(2) - 97;

    //TODO validate dist parameter to prevent shell injection
    var distFile = 'dist/' + dist + '.iso';
    distBytes = getFilesizeInBytes(distFile);
    dd = spawn("dd", ['if=' + distFile, 'of=/dev/' + usbIn, 'bs=8M', 'conv=fdatasync']);

    dd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    dd.stderr.on('data', (data) => {
      /* Information on copy speed, etc is send to stderr on SIGUSR1 */
      console.log(`stderr: ${data}`);
      ddParseStatus(data.toString());
    });

    dd.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code == 0) {
        ddStatus.state = "done";
        ddStatus.status = "success";
      }

      if (code != 0) {
        ddStatus.state = "done";
        ddStatus.status = "failure";
      }
    });

    setInterval( () => {
      if (ddStatus.state != "done") {
        console.log("Sending signal...");
        dd.kill("SIGUSR1");
      }
    }, 10000);

    res.json({ 'error': false });
  } else {
    res.json({'error':true});
  }
});

router.get('/status', function(req, res, next) {
  res.json(ddStatus);
});

module.exports = router;
