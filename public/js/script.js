$(document).ready(function() {
  setInterval( () => {
      updateProgressBars();
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

function updateProgressBars() {
    $.get('/status').done(function(data) {
        for (let i = 0; i < data.length; i++) {
            const ddStatus = data[i];

            if (ddStatus.state === "done") {
                alert(`Done writing flashdrive #${i}.`);
                $.post(`/reset/${i}`);
            }

            if (ddStatus.state === "init") {
                $(`#bar${i}`).hide();
            } else {
                $(`#bar${i}`).show();
                $(`#bar${i} .progress-completed`).width(ddStatus.percentage + "%");
                $(`#bar${i} .progress-center-text`).text(ddStatus.percentage + "% complete");
                $(`#bar${i} .progress-left-text`).text(ddStatus.bytes_written + " bytes written");
                $(`#bar${i} .progress-right-text`).text(ddStatus.speed + " " + ddStatus.speed_units);
            }
        }
    });
}
