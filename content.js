// show, hide events
(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      return el.apply(this, arguments);
    };
  });
})(jQuery);

// main function
function StoryRenderer(){
  this.hookImages = function(story){
    $(story).find('img').each(function(){
      if($(this).attr('src').indexOf('crossorigin') === -1) $(this).attr('src', 'https://crossorigin.me/' + $(this).attr('src'));
    });
  }

  this.renderStory = function(story_id){
    $('body').append('<div class="renderStoryPreloader" style="z-index: 1000;background: rgba(42,48,62,0.7);color: white;font-family: Arial;line-height: 100vh;text-align: center;position: fixed;width: 100%;top: 0;">Подождите, сохраняем пост как картинку...</div>');
    story = $('[data-story-id="' + story_id + '"]');
    this.hookImages(story);

    story.find('.b-story__content').css({'margin': '0'});
    story.find('.b-story__content_type_media').css({'padding': ''})

    block = story.find('.b-story__content');

    html2canvas(block, {
       useCORS: true,
       width: 598,
       onrendered: function (canvas) {
         w = 598;
         h = $(window).height();
         window.open(canvas.toDataURL("image/png"), 'Сохраненная картинка', 'width='+w+', height='+h);
         $('.renderStoryPreloader').remove();
         story.find('.b-story__content').css({'margin': '', 'padding': ''});
       }
    });
  }

  this.removeButtons = function(){
    $('.b-story__footer').find('[data-render]').remove();
  }
  this.addButtons = function(){
    $('.b-story__footer').append('<div class="b-story__footer-element" data-render="1"><a class="b-story__slide-up"><span data-hover="сохранить как картинку">сохранить как картинку</span></a></div>');
    $('.b-story__footer').find('[data-render]').click(function(){
      StoryRenderer.renderStory($(this).closest('[data-story-id]').data('storyId'));
    });
  }
}

// on load
var StoryRenderer;
$(document).ready(function(){
    StoryRenderer = new StoryRenderer();
    StoryRenderer.addButtons();
    $('#tw_loader').on('hide', function(){
      StoryRenderer.removeButtons();
      StoryRenderer.addButtons();
    });
});
