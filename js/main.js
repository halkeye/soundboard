/* global Mousetrap: false */
"use strict";
var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "q", "w", "e", "r", "t", "z", "u", "i", "a", "s", "d", "f", "g", "h", "j", "k", "y", "x", "c", "v", "b", "n", "m", ","];
var SoundBoard = {};

/*!
 * Run event after the DOM is ready
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} fn Callback function
 */
function onReady(fn) {
	// Sanity check
	if (typeof fn !== 'function') return;

	// If document is already loaded, run method
	if (document.readyState === 'interactive' || document.readyState === 'complete') {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener('DOMContentLoaded', fn, false);
}

function togglePlay(audio) {
  if (audio.paused) {
    audio.play()
  } else {
    audio.pause()
  }
}


function getAudioPlayer(id, url) {
  return new Promise(function(resolve, reject) {
    const audio = document.createElement("audio");
    audio.setAttribute('id', id);
    // const mp3 = document.createElement('source')
    // mp3.src = url
    // mp3.type = "audio/mpeg"
    // audio.appendChild(mp3);
    const ogg = document.createElement('source')
    ogg.src = url
    ogg.type = "audio/mpeg"
    audio.appendChild(ogg);
    audio.addEventListener('canplay', () => { resolve(audio); }, { options: { once: true }});
    audio.addEventListener('error', () => { reject(); }, { options: { once: true }});
  });
}


SoundBoard.delete = function() {
};

SoundBoard.create = function() {
  var count = 0;
  document.querySelectorAll('*[data-sound]').forEach(function(elm, idx) {
    var key = keys[count] || false;
    elm.classList.add('player');
    elm.style.position = 'relative';
    elm.dataset.key = key;

    var player = document.createElement('div')
    player.className = 'inner_player';

    var status = document.createElement('div');
    status.className='status';
    status.style.position = 'absolute';
    status.style.top = status.style.left = 0;
    player.appendChild(status)

    var button = document.createElement('div');
    button.className='key';
    button.style.backgroundColor = '#d8d8d8';
    player.appendChild(button)

    if (key) {
      var keyElm = document.createElement('div');
      keyElm.textContent = key;
      keyElm.style.textAlign = 'center';
      button.appendChild(keyElm);
    }

    getAudioPlayer('player' + key, elm.dataset.filename).then(function(audio) {
      player.append(audio);
      player.audioElm = audio;

      var info = document.createElement('div');
      info.className = 'info';

      var countdown = player.countdownElm = document.createElement('p');
      countdown.className='countdown';
      countdown.textContent = '-0:00';
      info.appendChild(countdown);

      var title = player.titleElm = document.createElement('p');
      title.className='title';
      title.textContent = elm.dataset.filename.split('/').pop();
      info.appendChild(title);

      player.appendChild(info);

      elm.classList.add('filled');

      audio.addEventListener('play', function() {
        player.querySelector('.status').classList.add('playing');
        player.classList.add('playing');
      });
 
      audio.addEventListener("pause", function() {
        elm.querySelectorAll('.playing').forEach(elm => elm.classList.remove('playing'));
        this.currentTime = 0;
      });

      audio.addEventListener("ended", function() {
        this.pause();
      });

      audio.addEventListener("timeupdate", function() {
        var pos = (this.currentTime / this.duration) * 100,
        rem = parseInt(this.duration - this.currentTime, 10),
        mins = Math.floor(rem/60,10),
        secs = rem - mins*60;
 
        player.querySelector('.status').style.width = pos + '%';
        player.countdownElm.textContent = '-' + mins + ':' + (secs < 10 ? '0' + secs : secs);
      });

      audio.addEventListener("progress", function() {
        if (this.buffered.length === 0) { return 0; }
        var loaded = parseInt(((this.buffered.end(0) / this.duration) * 100), 10);
        player.countdownElm.textContent = loaded + "%";
      });
    });

    /*
    $("input").bind("change", function() {
      $(this).parent().parent().parent().find('#player' + this.id.substr(1)).volume = this.value;
      localStorage.setItem("volume_" + this.id.substr(1), this.value);
    });
    */

    // if (key !== false) {
    //   Mousetrap.bind(key, function() { player.click(); });
    // }

    count++;
    elm.appendChild(player);
  });

  document.getElementById('board').addEventListener('click', function (event) {

    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('.inner_player')) return;
  
    // Don't follow the link
    event.preventDefault();
  
    togglePlay(event.target.audioElm);
  
  }, false);
  
  /*$('#board').on('click', '.control_stop', function() {
    get_elm(this).find('audio').trigger('audio.stop');
  });*/

  document.getElementById('stop').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('audio').forEach(audio => audio.pause());
  });
};

document.addEventListener('keypress', function(e) {
  const container = document.querySelector('*[data-key="' + e.key + '"]');
  if (!container) { return; }
  togglePlay(container.querySelector('audio'))
})

onReady(function() {
  SoundBoard.create();
});
