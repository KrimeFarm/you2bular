# jQuery tubular plugin ver2
#|* Originally developed by Sean McCambridge
#|* http://www.seanmccambridge.com/tubular
#|* licensed under the MIT License
#|* =========================================
#|* Version brought to you by KrimeFarm
#|* developed by Alessandro Vioni
#|* licensed under the MIT License
#|* Summer 2014

(($, window) ->

  # test for feature support and return if failure

  # defaults
  defaults =
    ratio: 16 / 9 # usually either 4/3 or 16/9 -- tweak as needed
    videoId: "tKQxFKV67yk"
    mute: true
    repeat: true
    width: $(window).width()
    wrapperZIndex: -1
    loopBefore: 1000
    start: 0


  # methods
  tubular = (node, options) -> # should be called on the wrapper div
    options = $.extend({}, defaults, options)
    $body = $("body") # cache body node
    $node = $(node) # cache wrapper node

    # build container
    tubularContainer = "<div id=\"tubular-container\" style=\"overflow: hidden; position: fixed; z-index: 1; width: 100%; height: 100%\"><div id=\"tubular-player\" style=\"position: absolute\"></div></div><div id=\"tubular-shield\" style=\"width: 100%; height: 100%; z-index: 2; position: absolute; left: 0; top: 0;\"></div>"

    # set up css prereq's, inject tubular container and set up wrapper defaults
    $("html,body").css
      width: "100%"
      height: "100%"

    $body.prepend tubularContainer
    $node.css
      position: "relative"
      "z-index": options.wrapperZIndex


    # set up iframe player, use global scope so YT api can talk
    window.onYouTubeIframeAPIReady = ->
      window.player = new YT.Player("tubular-player",
        width: options.width
        height: Math.ceil(options.width / options.ratio)
        videoId: options.videoId
        playerVars:
          controls: 0
          showinfo: 0
          modestbranding: 1
          wmode: "transparent"
          rel: 0

        events:
          onReady: onPlayerReady
          onStateChange: onPlayerStateChange
      )
      return

    tubularLenght = undefined
    window.onPlayerReady = (e) ->
      resize()
      e.target.mute() if options.mute
      e.target.playVideo()
      tubularLenght = (e.target.getDuration() * 1000) - options.loopBefore
      console.log tubularLenght
      return

    window.onPlayerStateChange = (state) ->
      if state.data is 2 and options.repeat # video ended and repeat option is set true
        $("#the-video-loader").fadeIn 10
        $(".post-loading-content").fadeOut 10

        player.seekTo options.start # restart
        player.playVideo()

      if state.data is 1
        player.seekTo options.start
        $(".post-loading-content, #the-video-loader").fadeOut 1000
        $(".post-loading-content").fadeIn 1000
        setTimeout ->
          player.pauseVideo()
          $("the-video-loader").fadeIn 10
          $(".post-loading-content").fadeOut 10
          return
        , tubularLenght
      return


    # resize handler updates width, height and offset of player after resize/init
    resize = ->
      width = $(window).width()
      pWidth = undefined
      # player width, to be defined
      height = $(window).height()
      pHeight = undefined
      # player height, tbd
      $tubularPlayer = $("#tubular-player")

      # when screen aspect ratio differs from video, video must center and underlay one dimension
      if width / options.ratio < height # if new video height < window height (gap underneath)
        pWidth = Math.ceil(height * options.ratio) # get new player width
        $tubularPlayer.width(pWidth).height(height).css # player width is greater, offset left; reset top
          left: (width - pWidth) / 2
          top: 0

      else # new video width < window width (gap to right)
        pHeight = Math.ceil(width / options.ratio) # get new player height
        $tubularPlayer.width(width).height(pHeight).css # player height is greater, offset top; reset left
          left: 0
          top: (height - pHeight) / 2

      return


    # events
    $(window).on "resize.tubular", ->
      resize()
      return

  # load yt iframe js api
  tag = document.createElement("script")
  tag.src = "//www.youtube.com/iframe_api"
  firstScriptTag = document.getElementsByTagName("script")[0]
  firstScriptTag.parentNode.insertBefore tag, firstScriptTag

  # create plugin
  $.fn.tubular = (options) ->
    @each ->
      # let's only run one
      $.data this, "tubular_instantiated", tubular(this, options)  unless $.data(this, "tubular_instantiated")
      return


  return
) jQuery, window
