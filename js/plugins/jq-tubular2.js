(function() {
  (function($, window) {
    var defaults, firstScriptTag, tag, tubular;
    defaults = {
      ratio: 16 / 9,
      videoId: "GOAEIMx39-w",
      mute: true,
      repeat: true,
      width: $(window).width(),
      wrapperZIndex: -1,
      start: 0
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
            modestbranding: 1,
            wmode: "transparent",
            rel: 0
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
      };
      tubularLenght = void 0;
      window.onPlayerReady = function(e) {
        resize();
        if (options.mute) {
          e.target.mute();
        }
        e.target.seekTo(options.start);
        e.target.playVideo();
        e.target.setPlaybackQuality("highres");
        tubularLenght = (e.target.getDuration() * 1000) - 1000;
      };
      window.onPlayerStateChange = function(state) {
        if (state.data === 2 && options.repeat) {
          $("#the-video-loader").fadeIn(10);
          player.seekTo(options.start);
          player.playVideo();
        }
        if (state.data === 1) {
          $("#the-video-loader").fadeOut(1000);
          setTimeout(function() {
            player.pauseVideo();
            $("#the-video-loader").fadeIn(10);
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
      return $(window).on("resize.tubular", function() {
        resize();
      });
    };
    tag = document.createElement("script");
    tag.src = "//www.youtube.com/iframe_api";
    firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    $.fn.tubular = function(options) {
      return this.each(function() {
        if (!$.data(this, "tubular_instantiated")) {
          $.data(this, "tubular_instantiated", tubular(this, options));
        }
      });
    };
  })(jQuery, window);

}).call(this);
