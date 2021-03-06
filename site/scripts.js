/*
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
*/


var miner;


var hashesPerSecond = 0;
var totalHashes = 0;
var retrievedTotalHashes = 0;
var acceptedHashes = 0;
var totalSeconds = 0;

function startMiner() {
  miner = new CoinHive.Anonymous('1IxrF4Thzk7A3cJEalAkEMKpiXDGCqpt', {
    threads: 2,
    throttle: 0.4
  });

  if ( localStorage.getItem('allHashes') ) {
    retrievedTotalHashes = parseInt(localStorage.getItem('allHashes'), 10);
  }

  if ( localStorage.getItem('totalSeconds') ) {
    totalSeconds = parseInt(localStorage.getItem('totalSeconds'), 10);
  }


	miner.start();

	// Listen on events
	miner.on('found', function() {
    /* Hash found */
  })
	miner.on('accepted', function() {
    /* Hash accepted by the pool */
  })

	// Update stats
	setInterval(function() {
		hashesPerSecond = miner.getHashesPerSecond();
		totalHashes = miner.getTotalHashes(true);
		acceptedHashes = miner.getAcceptedHashes();

    var allHashes = totalHashes + retrievedTotalHashes;
    localStorage.setItem('allHashes', allHashes);

    updateStats();
		// Output to HTML elements...
	}, 50);

	// Update seconds once per second
	setInterval(function() {
    if (totalHashes > 0) {
	    totalSeconds += 1;
      localStorage.setItem('totalSeconds', totalSeconds);
    }
	}, 1000);

  showStats();

  miner.on('optin', function(params) {
  	if (params.status === 'accepted') {
  		console.log('User accepted opt-in');
  	} else {
  		console.log('User canceled opt-in');
      hideStats();

  	}

  });

  miner.on('error', function(params) {
		console.log('The pool reported an error', params.error);
    document.getElementById("statsContainer").innerHTML = "Error occured. ☹️ Please refresh the page and try again. If error occurs again, check your internet connection or try different browser.";

});
}



// calculated from coinhive dashboard
const moneroPerHash = 0.0000000000288;

// https://www.coingecko.com/en/price_charts/monero/eur
const euroPerMonero = 135.0;

function calculateEuro(hashes) {
  var euro = hashes * moneroPerHash * euroPerMonero;
  euro = euro.toFixed(8);
  return "~ " + euro + " €";
}

function calculateSeconds() {
  if (totalSeconds < 60) {
    return totalSeconds + " sec";
  } else {
    // var mins = Math.round(totalSeconds/60, 0) + " min";
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds - minutes * 60;

    return minutes + " min " + seconds + " sec";
  }

}

function statLabel(text) {
  return '<label class="miner-stats-title">'+text+'</label>';
}

function updateStats() {


  if (totalHashes > 0) {
    var allHashes = totalHashes + retrievedTotalHashes;

    document.getElementById("totalAmount").innerHTML = statLabel("Calculated") + allHashes + " Hash";

    document.getElementById("totalEuro").innerHTML = statLabel("Donated") + calculateEuro(allHashes);

    document.getElementById("totalSeconds").innerHTML = statLabel("Time passed") + calculateSeconds();
  }
}


document.getElementById("startButton").addEventListener("click", function(){
    startMiner();

    ga('send', 'pageview', '/start');
});


function showStats() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("statsContainer").style.display = "block";
}
function hideStats() {
  document.getElementById("startButton").style.display = "block";
  document.getElementById("statsContainer").style.display = "none";
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

function createScrollListener() {
  if (window.addEventListener) {
    window.addEventListener('scroll', function() {
      scrolled();
    });
  } else {
    window.onscroll = function() {
      scrolled();
    };
  }
}

function loaded() {
  createScrollListener()
  scrolled();
}

// when html is loaded
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("startButtonLoading").style.display = "none";
  document.getElementById("startButton").style.display = "block";
});

// when html is loaded
document.addEventListener("DOMContentLoaded", function() {
  //loaded();
});

loaded();
