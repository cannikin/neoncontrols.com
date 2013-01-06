window.partNumberTimeout = null;

$(function() {

  // Turn on popovers
  $('[rel=popover]').popover({trigger:'hover'}).click(function() {
    return false;
  });

  // Show quote modal
  $('#get-quote-modal').on('show', function() {
    var partNumber = $.map($('#part-number li'), function(part, index) {
      return $(part).text();
    }).join('');
    $(this).find('textarea').val("I'd like to request a quote about Neon Controls part number " + partNumber);
  })

  var $builder = $('#builder');
  
  // lock part number position so it stays on screen
  var numberOffsetTop = $builder.offset().top;

  // $(window).on('scroll', function() {
  //   console.info('scroll');
  //   var $builder = $('#builder');
  //   var $builderPlaceholder = $('#builder-placeholder');

  //   if ($builder.hasClass('affix')) {
  //     $builder-placeholder.show().css({height:$('#builder').height()});
  //   } else {
  //     $builder-placeholder.hide();
  //   }
  // }


  $(document).on('scroll', function() {
    if ($(document).scrollTop() > numberOffsetTop) {
      $builder.addClass('affix');
      if ($('#builder-placeholder').get(0) === undefined) {
        $placeholder = $('<div>').attr('id','builder-placeholder');
        $builder.after($placeholder);
        var marginAndPadding = parseInt($builder.css('paddingTop')) + parseInt($builder.css('paddingBottom')) + parseInt($builder.css('marginTop')) + parseInt($builder.css('marginBottom'));
        $placeholder.css({'height':$builder.height() + marginAndPadding});
      }
    } else {
      $builder.removeClass('affix')
      $('#builder-placeholder').remove();
    }
  });

  // Hack for IE8 to make clicking on the flow images actually work
  $('#options .flow').on('click', 'img', function() {
    $(this).siblings('input').trigger('change');
    return false;
  });
  
  // Clicking a radio/checkbox
  $('#options').on('change', 'input', function() {
    $('#part-number li').removeClass('selected');
    var $this = $(this);
    var group = $this.closest('ul').attr('data-group');
    //var $parentGroup = $('ul[data-group=' + $this.closest('ul').attr('data-group') + ']');
    var $parentGroup = $('#group-'+group);
    var group = $parentGroup.attr('data-group');
    var partNumber = $('#part-group'+group);
    
    // Update the part number depending on type (single or multiple options)
    if ($parentGroup.attr('data-max') === undefined) {
      // single part number
      partNumber.text($this.val()).addClass('selected');
    } else if ($parentGroup.find('input:checked').length === (parseInt($parentGroup.attr('data-max')) + 1)) {
      // too many options selected
      $this.attr('checked', false);
      alert('You have already selected a maximum of ' + $parentGroup.attr('data-max') + ' options. Unselect at least one to choose another!');
    } else {
      // multiple parts selected
      var part = '';
      var selected = $parentGroup.find('input:checked')
      selected.each(function(index, item) {
        if ($parentGroup.attr('data-separator')) {
          part += '<span class="separator">' + $parentGroup.attr('data-separator') + '</span>';
        }
        part += $(item).val();
      })
      partNumber.html(part);
      if (part != '') { 
        partNumber.addClass('selected');
      }
    }

    // Show/Hide options if necessary
    $('li[data-toggle-group='+group+']').each(function() {
      var values = $(this).attr('data-toggle-value').split(',');
      var found = false
      $.each(values, function(i, item) {
        if (item == $this.val()) {
          found = true;
        }
      });
      if (found) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
    
    // Hide the part number highlight box after a couple seconds
    clearTimeout(window.partNumberTimeout);
    window.partNumberTimeout = setTimeout(function() {
      partNumber.removeClass('selected');
    }, 2000);

    // Update images
    if (group == 2) {
      $('#layer1').attr('src', '/images/series' + $this.attr('value') + '.png');
    }

    // Update images
    // if ($parentGroup.attr('data-layer')) {
    //   var layers = $parentGroup.attr('data-layer').split(',');
    //   $.each(layers, function(index, layer) {
    //     $('#layer'+layer).attr('src', '/images/builder/series85/layer'+layer+'-group'+group+'-value'+$this.val()+'.png')
    //   })
    // }
  });

  // Series 85 has a second stage
  $('#group-2 input').on('change', function() {
    if ($('#series-85').attr('checked')) {
      $('#second-stage').show();
      $('#second-stage-part').show();
    } else {
      $('#second-stage').hide();
      $('#second-stage-part').hide();
    }
  });
  
  // A <ul> with the .no-input class should show a highlight around the selected option
  $('ul.no-input').on('change', 'input', function() {
    $(this).closest('li').siblings().removeClass('selected');
    $(this).closest('li').addClass('selected');
  });

  // Image selector
  var images = {
    '85':{
      '1':'',
      '2':''
    }
  }

  // Preset a series if present in the URL
  if (url('?series')) {
    $('#group-2 input').attr('checked', false);
    $('#series-' + url('?series')).attr('checked', true);
  }

  // Select the first series just so we have something to show
  $('input:checked').trigger('change');

});
