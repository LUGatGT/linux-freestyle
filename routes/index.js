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
      const usbNum = usbIn.charCodeAt(2) - 'b'.charCodeAt(0);
      resetProcess(usbNum);
      
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
	state: "init", //allowed values: "init", "running", "done"
        status: "",    //allowed values when state is done: "success", "failure"
        distroId: "",
};

//TODO combine these into a single object
var childrenProcesses = Array(MAX_USB).fill({});
var ddStatus = Array(MAX_USB).fill(ddStatusModel);
var intervals = Array(MAX_USB).fill(0);
var errorBuf = Array(MAX_USB).fill([]);

setInterval( () => {
    for (let i = 0; i < MAX_USB; i++) {
        if (ddStatus[i].state === "init" || ddStatus[i].state === "running") {
            const dd = childrenProcesses[i];
            if (dd.kill) {
                console.log("->");
                dd.kill("SIGUSR1");
            }
        }
  }
}, 5000);


function ddParseStatus(lines, usbNum) {
  try {
      // we use a try because it's possible the entire message isn't buffered
      const fields = lines[2].split(' ');
      const bytes = fields[0];

      const speed = fields[fields.length - 2];
      const speed_units = fields[fields.length - 1];
      const distBytes = distros[ddStatus[usbNum].distroId].size;

      ddStatus[usbNum] = {
	      bytes_written: bytes,
              bytes_total: ddStatus[usbNum],
              percentage: Math.trunc((bytes / distBytes)*100),
	      speed: speed,
	      speed_units: speed_units,
	      state: "running",
              status: "",
              distroId: ddStatus[usbNum].distroId,
      };
  } catch (error) {
    console.log('Error while parsing output from dd.');
    console.log(error);
  }
}

router.post('/install', function(req, res, next) {
  //todo validate distroId in distros
  const distroId = req.body.distro;
  if (usbIn != "") {
    const usbNum = usbIn.charCodeAt(2) - 'b'.charCodeAt(0);

    const distFile = 'isos/' + distros[distroId].url.split('/').pop();
    console.log(`distfile is ${distFile}`);
    const dd = spawn("dd", ['if=' + distFile, 'of=/dev/' + usbIn, 'bs=8M', 'conv=fdatasync']);
    console.log(dd.spawnargs);
    childrenProcesses[usbNum] = dd;

    ddStatus[usbNum].distroId = distroId;

    dd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    dd.stderr.on('data', (data) => {
      console.log(data.toString());
      // buffer output from dd as sometimes we get a partial record
      errorBuf[usbNum] = errorBuf[usbNum].concat(data.toString().split('\n').filter(line => line.length));
      if (errorBuf[usbNum].length >= 3) {
          /* Information on copy speed, etc is send to stderr on SIGUSR1 */
          ddParseStatus(errorBuf[usbNum].splice(0, 3), usbNum);
          console.log("<-");
      }
    });

    dd.on('exit', (code, signal) => {
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

    res.json({ 'error': false });
  } else {
    res.json({'error':true});
  }
});

router.get('/status', function(req, res, next) {
    return res.json(ddStatus);
});

function resetProcess(index) {
    if (ddStatus[index] === "running") {
        childrenProcesses[index].kill('SIGTERM');
    }
    ddStatus[index] = ddStatusModel;
}

// this transitions from state done to init
router.post('/reset/:id', function(req, res, next) {
    const index = parseInt(req.params.id);
    if (index === NaN) {
        return res.json({status: "failure"});
    }
    resetProcess(index);
    return res.json({status: "success"});
});

module.exports = router;
