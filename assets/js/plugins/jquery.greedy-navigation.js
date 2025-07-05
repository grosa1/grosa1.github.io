/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];

function updateNav() {
  var availableSpace = $nav.width() - $vlinks.children('.persist').outerWidth(true);

  // The visible list is overflowing the nav
  if ($vlinks.width() > availableSpace) {

    // Record the width of the list
    breaks.push($vlinks.width());

    // Move item to the hidden list
    $vlinks.children('li:not(.persist)').last().prependTo($hlinks);

    // Show the dropdown btn if it's not already visible
    if ($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
    }

  // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    if (availableSpace > breaks[breaks.length - 1]) {
      // Move the item to the visible list
      $hlinks.children().first().appendTo($vlinks);
      breaks.pop();
    }
  }

  // Recalculate the width of the visible links after potential changes
  var vlinksWidth = 0;
  $vlinks.children().each(function() {
    vlinksWidth += $(this).outerWidth(true);
  });


  // Hide the dropdown btn if hidden list is empty
  if (breaks.length < 1) {
    $btn.addClass('hidden');
    $hlinks.addClass('hidden');
  }

  // Keep counter updated
  $btn.attr("count", breaks.length);
}

// Window listeners
$(window).on('resize', function() {
  updateNav();
}).trigger('resize'); // Trigger the resize event on page load

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

// Initially hide the button and then run updateNav
$btn.addClass('hidden');
updateNav();