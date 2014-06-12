(function() {
  (function($, window) {
    var defaults, firstScriptTag, tag, tubular;
    defaults = {
      ratio: 16 / 9,
      videoId: "tKQxFKV67yk",
      mute: true,
      repeat: true,
      width: $(window).width(),
      wrapperZIndex: -1,
      loopBefore: 1000,
      start: 10
    };
    tubular = function(node, options) {
      var $body, $node, resize, tubularContainer, tubularLenght;
      options = $.extend({}, defaults, options);
      $body = $("body");
      $node = $(node);
      tubularContainer = "<div id=\"tubular-container\" style=\"overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%\"><div id=\"tubular-player\" style=\"position: absolute\"></div></div><div id=\"tubular-shield\" style=\"width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;\"></div>";
      $("html,body").css({
        width: "100%",
        height: "100%"
      });
      $body.prepend(tubularContainer);
      $node.css({
        position: "relative",
        "z-index": options.wrapperZIndex
      });
      window.onYouTubeIframeAPIReady = function() {
        window.player = new YT.Player("tubular-player", {
          width: options.width,
          height: Math.ceil(options.width / options.ratio),
          videoId: options.videoId,
          playerVars: {
            controls: 0,
            showinfo: 0,
            disablekb: 1,
            modestbranding: options.repeat ? 1 : void 0,
            wmode: "transparent",
            rel: 0,
            start: options.start
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
      };
      tubularLenght = void 0;
      window.onPlayerReady = function(event) {
        resize();
        if (options.mute) {
          event.target.mute();
        }
        tubularLenght = (event.target.getDuration() * 1000) - options.loopBefore;
        console.log(tubularLenght);
        event.target.playVideo();
      };
      window.onPlayerStateChange = function(state) {
        clearTimeout(window.theStop);
        if (state.data === 2 && options.repeat) {
          console.log("restart");
          $("#the-video-loader").fadeOut(500);
          player.playVideo();
        }
        if (state.data === 1) {
          player.playVideo();
          $("#the-video-loader").fadeOut(1000);
          $(".post-loading-content").fadeIn(1000);
          window.theStop = setTimeout(function() {
            console.log("timeout");
            if (options.repeat) {
              $("#video-loader").css("display", "none");
              $("#the-video-loader").fadeIn(500, function() {
                player.pauseVideo();
                player.seekTo(options.start);
              });
            } else {
              player.pauseVideo();
            }
          }, tubularLenght);
        }
      };
      resize = function() {
        var $tubularPlayer, height, pHeight, pWidth, width;
        width = $(window).width();
        pWidth = void 0;
        height = $(window).height();
        pHeight = void 0;
        $tubularPlayer = $("#tubular-player");
        if (width / options.ratio < height) {
          pWidth = Math.ceil(height * options.ratio);
          $tubularPlayer.width(pWidth).height(height).css({
            left: (width - pWidth) / 2,
            top: 0
          });
        } else {
          pHeight = Math.ceil(width / options.ratio);
          $tubularPlayer.width(width).height(pHeight).css({
            left: 0,
            top: (height - pHeight) / 2
          });
        }
      };
      $(window).on("resize.tubular", function() {
        resize();
      });
    };
    tag = document.createElement("script");
    tag.src = "//www.youtube.com/iframe_api";
    firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    $.fn.tubular = function(options) {
      this.each(function() {
        if (!$.data(this, "tubular_instantiated")) {
          $.data(this, "tubular_instantiated", tubular(this, options));
        }
      });
    };
  })(jQuery, window);

}).call(this);
