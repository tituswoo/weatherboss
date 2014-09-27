var BASE_URI = 'https://query.yahooapis.com/v1/public/yql';

var getLocation = function (query) {

    return $.get(BASE_URI, {
        q: "select * from geo.places where text='" + query + "' limit 1",
        format: "json",
        callback: ""
    });
};

var getWeather = function (woeid) {
    return $.get(BASE_URI, {
        q: "select * from weather.forecast where woeid='" + woeid + "'",
        format: "json",
        callback: ""
    });
};

var displayWeather = function (result) {
    var channel = result.query.results.channel;
    var location = channel.location;
    var units = channel.units;
    var forecast = channel.item.forecast;

    // We can write it to the console to confirm that we're getting the data:
    console.log(channel.title);
    console.log("wind chill: " + channel.wind.chill + units.temperature);
    console.log("wind direction: " + channel.wind.direction);
    console.log("current conditions: " + channel.item.condition.temp + " " + channel.units.temperature);
    console.log("forecast for the next 5 days:");
    for (var i = 0; i < forecast.length; i++) {
        var day = forecast[i];
        console.log(day.day + ": " + day.high + units.temperature + " high, " + day.low + units.temperature + " low. " + day.text + ".");
    }

    // Let's actually show it on the page now:
    $("#results")
        .html("")
        .append("<h2>"+channel.title+"</h2>")
        .append("<h3> It's "+channel.item.condition.temp+units.temperature+" right now.</h3>")
        .append("<p>Wind chill: " + channel.wind.chill + units.temperature + ", direction: " + channel.wind.direction + "</p>")
        .append("<h3>5 day forecast:</h3>");

    for (var i = 0; i < forecast.length; i++) {
        var day = forecast[i];
        var unit = units.temperature;
        $("#results").append("<p>" + day.day + ": " + day.high + unit + " high, " + day.low + unit + " low. " + day.text + ".");
    }

    // Yes, the above is messy. That's one reason why I like AngularJS for JS development.
};

function search() {
    var query = $("#location").val();

    getLocation(query).done(function (result) {
        var woeid = result.query.results.place.woeid;

        getWeather(woeid).done(function (result) {
            displayWeather(result);
        });
    });
}

$(document).ready(function() {
    $("#location").keypress(function(e) {
        if (e.which == 13) {
            search();
        }
    });
});
