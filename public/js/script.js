$(document).ready(function() {
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
