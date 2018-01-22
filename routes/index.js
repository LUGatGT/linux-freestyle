var express = require('express');
var router = express.Router();
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
const { spawn } = require('child_process');
var fs = require('fs');

const distros = JSON.parse(fs.readFileSync('distros.json'));
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');
var usbIn = "";
var usbsIn = [];
var remove = function(array, searchTerm) {
  var index = array.indexOf(searchTerm);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

const MAX_USB = 10;
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
  res.render('index', { title: 'Express', distros: distros, MAX_USB: MAX_USB});
});

var ddStatusModel = {
	bytes_written: 0,
        bytes_total: 0,
        percentage: 0,
	speed: 0,
	speed_units: 'MB/s',
	state: "init",
        status: "",
};

//TODO combine these into a single object
var childrenProcesses = Array(MAX_USB).fill({});
var ddStatus = Array(MAX_USB).fill(ddStatusModel);
var intervals = Array(MAX_USB).fill(0);

var errorBuf = Array(MAX_USB).fill([]);

function ddParseStatus(lines, usbNum) {
  try {
      // we use a try because it's possible the entire message isn't buffered
      const fields = lines[2].split(' ');
      const bytes = fields[0];

      const speed = fields[fields.length - 2];
      const speed_units = fields[fields.length - 1];

      ddStatus[usbNum] = {
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
  var distroId = req.body.distro;
  if (usbIn != "") {
    var usbNum = usbIn.charCodeAt(2) - 'b'.charCodeAt(0);

    const distFile = 'isos/' + distros[distroId].url.split('/').pop();
    console.log(`distfile is ${distFile}`);
    distBytes = distros[distroId].size;
    const dd = spawn("dd", ['if=' + distFile, 'of=/dev/' + usbIn, 'bs=8M', 'conv=fdatasync']);
    console.log(dd.spawnargs);
    childrenProcesses[usbNum] = dd;

    dd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    dd.stderr.on('data', (data) => {
      // buffer output from dd as sometimes we get a partial record
      errorBuf[usbNum] = errorBuf[usbNum].concat(data.toString().split('\n').filter(line => line.length));
      if (errorBuf[usbNum].length >= 3) {
          /* Information on copy speed, etc is send to stderr on SIGUSR1 */
          ddParseStatus(errorBuf[usbNum].splice(0, 3), usbNum);
      }
    });

    dd.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code == 0) {
        ddStatus[usbNum].state = "done";
        ddStatus[usbNum].status = "success";
      }

      if (code != 0) {
        ddStatus[usbNum].state = "done";
        ddStatus[usbNum].status = "failure";
      }
    });

    intervals[usbNum] = setInterval( () => {
      if (ddStatus[usbNum].state != "done" && ddStatus[usbNum].state != "error") {
        console.log(".");
        dd.kill("SIGUSR1");
      } else {
        clearInterval(intervals[usbNum]);
      }
    }, 5000);

    res.json({ 'error': false });
  } else {
    res.json({'error':true});
  }
});

router.get('/status', function(req, res, next) {
    return res.json(ddStatus);
});

module.exports = router;
