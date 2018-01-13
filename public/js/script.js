$(document).ready(function() {
  setInterval( () => {
      updateProgressBar(1);
  }, 1000);
  $(".circle").click(function() {
    var id = $(this).attr("id");
    $(".bord").removeClass("bord");
    $(this).addClass("bord");
    if (confirm("Are you sure you want to install " + id + "?")) {
      $.post('/install', { distro: id }).done(function(data) {
        alert(data.error);
      });
    }
  });
});

var alerted = false;
function updateProgressBar(bar_number) {
    $.get('/status').done(function(data) {
        var totalBytes = 1587609600; // TODO we should store these values somewhere or calculate them at startup
        const ddStatus = data;
        console.log(ddStatus);

        if (ddStatus.state === "init") {
            alerted = false;
        }

        if (ddStatus.state === "done" && !alerted) {
            alert("Done writing flashdrive.");
            alerted = true;
        }

        $(`#bar${bar_number} .progress-completed`).width(ddStatus.percentage + "%");
        $(`#bar${bar_number} .progress-center-text`).text(ddStatus.percentage + "% complete");
        $(`#bar${bar_number} .progress-left-text`).text(ddStatus.bytes_written + " bytes written");
        $(`#bar${bar_number} .progress-right-text`).text(ddStatus.speed + " " + ddStatus.speed_units);
    });
}
