
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    //NYTimes AJAX request
    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=2f50919b5013fd47a4c93f22c23e3c92:0:72612827';

    $.getJSON(nyTimesUrl, function(data) {
      $nytHeaderElem.text('New York Times Articles About ' + cityStr);
      articles = data.response.docs;
      for(var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article"' + '<a href=" '+ articles.web_url + '">' +article.headline.main + '</a>' +
                                          '<p>' + article.snippet + '</p>' + '</li>')
      }
    }).error(function(e){
      $nytHeaderElem.text('New York Times articles could not be loaded')
    });

    //wikipedia ajax request
    var wikipediaUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    //timeout function
    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
      url: wikipediaUrl,
      dataType: "jsonp",
      //jsonp = "callback",
      success: function(response) {
        var articleList = response[1];

        for (var i = 0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };
        clearTimout(wikiRequestTimeout);
      }
    })

    return false;
};

$('#form-container').submit(loadData);
