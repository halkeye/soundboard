
var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "q", "w", "e", "r", "t", "z", "u", "i", "a", "s", "d", "f", "g", "h", "j", "k", "y", "x", "c", "v", "b", "n", "m", ","];
var SoundBoard = {};

SoundBoard.delete = function() {
};

SoundBoard.create = function() {
  var count = 0;
  $('*[data-sound]').each(function(idx, elm) {
    var key = keys[count];
    var $elm = $(elm);
    $elm.data('count', count);

    var player = $('<div class="player">').attr('id', 'd'+key);
    player.append( $('<div class="status">').attr('id', 's'+key));
    $elm.append(player);

    var button = $('<div class="key">');
    button.css({
      "background-color": "#d8d8d8"
    });
    button.append(
      $("<div>").text(key).css({ "text-align": "center" })
    );
    /*
    button.load('images/button.svg', function(response) {
      console.log($(response));
      button.find('.button_svg_letter').html(key).css('text-align','center');
      console.log(button.find('.button_svg_letter').parent().html());
    });
    */
    player.append(button);

    var audio = $('<audio>').attr('id', 'player' + key);
    player.append(audio);

    var info = $('<div class="info">');
    info.append('<p class="countdown">-0:00</p>');
    info.append('<p class="title">Bereit</p>');
    player.append(info);

    var control = $('<div class="control">');
    control.append('<p style="margin: -5px 0px -25px -80px;"><a href="#"><img src="images/control_stop.png" alt="stop" class="control_stop" /></a></p>');
    control.append('<input type="range" style="width:70px; margin-right: -10px;" min="0" max="1" value="0.8" step="0.01">');
    $elm.append(control);

    audio.attr('src', $elm.data('filename'));
    audio.attr('preload', 'preload');
    audio.parent().addClass('filled');
    info.find('.title').text($elm.data('filename').substr($elm.data('filename').lastIndexOf('/')+1));

    player.bind("click", function() {
			if(audio[0].paused) {
        audio[0].play();
			} else {
        audio[0].pause();
			}
		});
    audio.bind('play', function() {
      $elm.find('.status').addClass('playing');
    });

    audio.bind("ended", function() {
      $elm.find('.playing').removeClass('playing');
      audio[0].pause();
    });
    audio.bind("timeupdate", function() {
      pos = (this.currentTime / this.duration) * 100,
      $elm.find('.status').css({width: pos + '%'});
      var rem = parseInt(this.duration - this.currentTime, 10),
      pos = (this.currentTime / this.duration) * 100,
      mins = Math.floor(rem/60,10),
      secs = rem - mins*60;
      $elm.find(".countdown").text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
    });

    audio.bind("progress", function() {
      if (this.buffered.length === 0) { return 0; }
      var loaded = parseInt(((this.buffered.end(0) / this.duration) * 100), 10);
      $elm.find(".countdown").text(loaded + "%");
    });
    audio.on('stop', function() {
      audio[0].pause();
      audio[0].currentTime = 0;
    });

    /*
    $("input").bind("change", function() {
      $(this).parent().parent().parent().find('#player' + this.id.substr(1)).get(0).volume = this.value;
      localStorage.setItem("volume_" + this.id.substr(1), this.value);
    });
    */

    Mousetrap.bind(key, function() {
      player.click();
    });

    count++;
  });

  var get_elm = function(elm) {
    return $(elm).parents('*[data-sound]');
  };

  $('#board').on('click', '.control_stop', function() {
    get_elm(this).find('audio').trigger('stop');
  });

  $("#stop").bind("click", function() {
    $("audio").trigger('stop');
  });
};
$(document).ready(function() {
  SoundBoard.create();
});
