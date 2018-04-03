var onCoinHiveSimpleUIReady = function() {

  var miner = CoinHive.Miner;

  CoinHive.Miner.on('authed', function(params) {
    console.log('Simple UI has authed with the pool');
  });
  CoinHive.Miner.on('job', function(params) {
    console.log('New job received from pool');
  });

  // Allow coinhive iframe to be transparent
  document.getElementsByTagName("iframe")[0].setAttribute("allowtransparency", "true")
}







function isElementInViewport(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}



function fadeItems() {
  var time = 0;
  var items = document.getElementsByClassName("will-fade");
  for(var i = 0; i < items.length; i++) {
     var item = items.item(i);
     if(isElementInViewport(item)) {
       time += 150;
       setTimeout(function(item) {
         item.classList.remove('will-fade');
         item.classList.add('faded');
       }, time, item)
     }
  }
}

function scrolled() {
  fadeItems();
}


function loaded() {
  if (window.addEventListener) {
    window.addEventListener('scroll', function() {
      scrolled();
    });
  } else {
    window.onscroll = function() {
      scrolled();
    };
  }

  scrolled();
}

document.addEventListener("DOMContentLoaded", function() {
  loaded();
});
