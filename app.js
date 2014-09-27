/**
 * Created by tituswoo on 9/26/14.
 */

var BASE_URI = 'https://query.yahooapis.com/v1/public/yql';

var getLocation = function (query) {

    return $.get(BASE_URI, {
        q: "select * from geo.places where text='" + query + "' limit 1",
        format: "json",
        callback: ""
    }, function (data) {
        //console.log(data);
    });
};

var getWeather = function (woeid) {
    return $.get(BASE_URI, {
        q: "select * from weather.forecast where woeid='" + woeid + "'",
        format: "json",
        callback: ""
    }, function (data) {
        //console.log("here's the data:");
        //console.log(data);
    });
};

function search() {
    var query = $("#location").val();
    getLocation(query).done(function (result) {
        var woeid = result.query.results.place.woeid;
        getWeather(woeid).done(function (result) {
            var channel = result.query.results.channel;
            var units = channel.units;
            var forecast = channel.item.forecast;

            console.log(channel.title);
            console.log("wind chill: " + channel.wind.chill + units.temperature);
            console.log("wind direction: " + channel.wind.direction);
            console.log("current conditions: " + channel.item.condition.temp + " " + channel.units.temperature);
            console.log("forecast for the next 5 days:");
            for (var i = 0; i < forecast.length; i++) {
                var day = forecast[i];
                console.log(day.day + ": " + day.high + " " + units.temperature + " high, " + day.low + " " + units.temperature + " low. " + day.text + ".");
            }
        });
    });
}