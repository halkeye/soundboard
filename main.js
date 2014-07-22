/* global Mousetrap: false */
var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "q", "w", "e", "r", "t", "z", "u", "i", "a", "s", "d", "f", "g", "h", "j", "k", "y", "x", "c", "v", "b", "n", "m", ","];
var SoundBoard = {};

SoundBoard.delete = function() {
};

SoundBoard.create = function() {
  var count = 0;
  $('*[data-sound]').each(function(idx, elm) {
    var key = keys[count] || false;
    var $elm = $(elm);
    $elm.addClass('player');
    $elm.data('key', key);
    $elm.css('position', 'relative');

    var player = $('<div class="inner_player">').appendTo($elm);
    $('<div class="status">').css({
      'position': 'absolute',
      'top': 0,
      'left': 0
    }).appendTo(player);

    var button = $('<div class="key">');
    button.css({
      "background-color": "#d8d8d8"
    });
    button.append(
      $("<div>").text(key).css({ "text-align": "center" })
    );
    player.append(button);

    var audio = $('<audio>').attr('id', 'player' + key);
    player.append(audio);

    var info = $('<div class="info">');
    info.append('<p class="countdown">-0:00</p>');
    info.append('<p class="title">Bereit</p>');
    player.append(info);

    /*var stopper = $('<p style="margin: -5px 0px -25px -80px;"><a href="#"><img src="images/control_stop.png" alt="stop" class="control_stop" /></a></p>');
    player.append(stopper); */

    var volume = $('<section class="volume"></span><div class="slider"></div><span class="volume_indicator"></span></section>');
    var volume_slider = volume.find('.slider').slider({
      range: "min",
      min: 0,
      max: 1,
      step: 0.01,
      value: audio[0].volume,
      orientation: "vertical",
      slide: function(event, ui) {
        var $volume = volume.find('.volume_indicator');
        var value = ui.value;
        if(value <= 0.5) { $volume.css('background-position', '0 0'); }
        else if (value <= 0.25) { $volume.css('background-position', '0 -25px'); }
        else if (value <= 0.75) { $volume.css('background-position', '0 -50px'); }
        else { $volume.css('background-position', '0 -75px'); }
        audio[0].volume = value;
      }
    });
    volume_slider.slider('option', 'slide').call(volume_slider, null, { value: audio[0].volume });

    $elm.append(volume);

    audio.attr('src', $elm.data('filename'));
    audio.attr('preload', 'preload');
    $elm.addClass('filled');
    info.find('.title').text($elm.data('filename').substr($elm.data('filename').lastIndexOf('/')+1));

    audio.bind("audio.toggle", function() {
			if(audio[0].paused) {
        audio.trigger('audio.play');
			} else {
        //audio.trigger('audio.pause');
        audio.trigger('audio.stop');
			}
		});

    audio.bind('audio.play', function() {
      var $status = $elm.find('.status');
      $status.addClass('playing');
      player.addClass('playing');
      console.log($status);

      audio[0].play();
    });

    audio.on('audio.pause', function() {
      audio[0].pause();
    });

    audio.on('audio.stop', function() {
      audio[0].pause();
      audio[0].currentTime = 0;
    });

    audio.bind("ended", function() {
      $elm.find('.playing').removeClass('playing');
      audio[0].pause();
    });

    audio.bind("timeupdate", function() {
      var pos = (this.currentTime / this.duration) * 100,
      rem = parseInt(this.duration - this.currentTime, 10),
      mins = Math.floor(rem/60,10),
      secs = rem - mins*60;

      $elm.find('.status').css({width: pos + '%'});
      $elm.find(".countdown").text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
    });

    audio.bind("progress", function() {
      if (this.buffered.length === 0) { return 0; }
      var loaded = parseInt(((this.buffered.end(0) / this.duration) * 100), 10);
      $elm.find(".countdown").text(loaded + "%");
    });

    /*
    $("input").bind("change", function() {
      $(this).parent().parent().parent().find('#player' + this.id.substr(1)).get(0).volume = this.value;
      localStorage.setItem("volume_" + this.id.substr(1), this.value);
    });
    */

    if (key !== false) {
      Mousetrap.bind(key, function() { player.click(); });
    }

    count++;
  });

  var get_elm = function(elm) {
    return $(elm).parents('*[data-sound]');
  };

  $('#board').on('click', '.inner_player', function(e) {
    get_elm(this).find('audio').trigger('audio.toggle');
  });

  /*$('#board').on('click', '.control_stop', function() {
    get_elm(this).find('audio').trigger('audio.stop');
  });*/

  $("#stop").bind("click", function() {
    $("audio").trigger('audio.stop');
  }).css();
};
$(document).ready(function() {
  SoundBoard.create();
});
