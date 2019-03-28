$(function(){
  'use strict';
  var $page = $('#main'),
      options = {
        debug: true,
        prefetch: true,
        cacheLength: 4,
        onStart: {
          duration: 350, // Duration of our animation
          render: function ($container) {
            // Add your CSS animation reversing class
            $container.addClass('loading');
            // Restart your animation
            smoothState.restartCSSAnimations();
          }
        },
        onReady: {
          duration: 350,
          render: function ($container, $newContent) {
            // Remove your CSS animation reversing class
            $container.removeClass('loading');
            // Inject the new content
            $container.html($newContent);
          }
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');
});
