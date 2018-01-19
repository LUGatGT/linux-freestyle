var express = require('express');
var router = express.Router();
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
const { spawn } = require('child_process');
var fs = require('fs');

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');
var usbIn = "";
var usbsIn = [];
var remove = function(array, searchTerm) {
  var index = array.indexOf(searchTerm);    // <-- Not supported in <IE9
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}
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
      usbsIn.push(usbIn);
    } else {
      console.log(nm + " removed");
      usbsIn = remove(usbsIn, nm);
      if (usbIn == nm) {
        usbIn = "";
      }
    }
  }
};

var devDescriptor = inotify.addWatch(devDir);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', distros:['ubuntu', 'fedora', 'arch', 'slackware', 'gentoo', 'opensuse', 'mint', 'centos'] });
});

var dd = [{}, {}, {}, {}, {}];
var ddStatusModel = {
	bytes_written: 0,
	speed: 0,
	speed_units: 'MB/s',
	state: "init"
};
var ddStatus = [{}, {}, {}, {}, {}];
var intervals = [0, 0, 0, 0, 0];

for (var i = 0; i < ddStatus.length; i++) {
  ddStatus[i] = JSON.parse(JSON.stringify(ddStatusModel));
}

function ddParseStatus(data, usbNum) {
  try {
      // we use a try because it's possible the entire message isn't buffered
      const lines = data.split('\n').filter(line => line.length != 0); //filter out empty lines
      const fields = lines[2].split(' ');
      const bytes = fields[0];

      const speed = fields[fields.length - 2];
      const speed_units = fields[fields.length - 1];

      ddStatus[usbNum] = {
	      bytes_written: bytes,
	      speed: speed,
	      speed_units: speed_units,
	      state: "running",
      };
  } catch (error) {
    console.log('Error while parsing output from dd.');
  }
}

router.post('/install', function(req, res, next) {
  var dist = req.body.distro;
  if (usbIn != "") {
    var usbNum = usbIn.charCodeAt(2) - 98;

    //TODO validate dist parameter to prevent shell injection
    dd[usbNum] = spawn("dd", ['if=dist/' + dist + '.iso', 'of=/dev/' + usbIn, 'bs=8M', 'conv=fdatasync']);

    dd[usbNum].stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    dd[usbNum].stderr.on('data', (data) => {
      /* Information on copy speed, etc is send to stderr on SIGUSR1 */
      console.log(`stderr: ${data}`);
      ddParseStatus(data.toString(), usbNum);
    });

    dd[usbNum].on('close', (code) => {
      console.log(`child process closed with code ${code}`);
      if (code == 0) {
        ddStatus[usbNum].state = "done";
      } else {
        ddStatus[usbNum].state = "error";
      }

    });
    dd[usbNum].on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code == 0) {
        ddStatus[usbNum].state = "done";
      } else {
        ddStatus[usbNum].state = "error";
      }
    });

    intervals[usbNum] = setInterval( () => {
      if (!(ddStatus[usbNum].state == "done" || ddStatus[usbNum].state == "error")) {
        console.log("Sending signal...");
        dd[usbNum].kill("SIGUSR1");
      } else {
        clearInterval(intervals[usbNum]);
      }
    }, 10000);

    res.json({ 'error': false });
  } else {
    res.json({'error':true});
  }
});

router.get('/status/:usbNum', function(req, res, next) {
  var n = parseInt(req.params.usbNum);
  ddStatus[n].num = n;
  res.json(ddStatus[n]);
});

router.get('/usbin/', function(req, res, next) {
  res.json({usb: usbsIn});
});

module.exports = router;
