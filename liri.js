require("dotenv").config();

let keys = require("./keys.js");
let Spotify = require('node-spotify-api');
 
let spotify = new Spotify(keys.spotify);


let axios = require("axios");
let moment = require('moment');
let fs = require("fs");

// Gets the request type and the name of the item passed to it (regardless of the lenght)
let requestType = process.argv[2];
let requestName = "";
for (let i = 3; i < process.argv.length; i++) {
    if (i < process.argv.length - 1) {
        requestName += process.argv[i] + "+";
    } else {
        requestName += process.argv[i];
    }
   
}

// Appends the data from the API request to log.txt file
let logToFile = function(text) {
    fs.appendFile("log.txt", text, function(err) {
        if (err) {
            console.log(err);
        } 
    })
}

let textToLog = "";

let concertRequest = function(name) {
    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
        .then(function(response) {
            let dataArr = response.data;
            textToLog = "********** Concert Information Request **********\n\n";
            for (let item of dataArr) {
                console.log("Venue name:", item.venue.name);
                console.log("Venue location:", item.venue.location);
                console.log("Event date:", moment(item.datetime).format("MM/DD/YYYY"));
                console.log("-----------------------------------------------");
                
                textToLog += "Venue name: " + item.venue.name + "\n" + "Venue location: " + item.venue.location + "\n" + "Event date: " + moment(item.datetime).format("MM/DD/YYYY") + "\n" + "-----------------------------------------------" + "\n";
            }
            logToFile(textToLog);
        })
        .catch(function(error) {
        if (error.response) {
            console.log(error.response.data);
            }
        });
}

let songRequest = function(name) {
    if (!name) {
        name = "The+Sign"
    }

    spotify.search({ 
        type: 'track', 
        query: name })
    .then(function(response) {
    let tracksArr = response.tracks.items;
    textToLog = "********** Song Information Request **********\n\n";
    for (let i = 0; i < tracksArr.length; i++) {
        console.log("Song name:", tracksArr[i].name);
        let artistsArr = tracksArr[i].artists;
        let artistNames = "";
        if (artistsArr.length === 1) {
            artistNames = artistsArr[0].name;
        } else {
            for (let j = 0; j < artistsArr.length; j++) {
                if (j === artistsArr.length - 1) {
                    artistNames += artistsArr[j].name;
                } else { 
                    artistNames += artistsArr[j].name + " & ";
                }  
            }
        }
           
        console.log("Artists:", artistNames);
        console.log("Preview Link:", tracksArr[i].preview_url);
        console.log("Album:", tracksArr[i].album.name);
        console.log("--------------------------------------------------------------");
        textToLog += "Song name: " + tracksArr[i].name + "\n" + "Artists: " + artistNames + "\n" + "Preview Link: " + tracksArr[i].preview_url + "\n" + "Album: " + tracksArr[i].album.name + "\n" + "--------------------------------------------------------------";
    }
    logToFile(textToLog);
})
  .catch(function(err) {
    console.log(err);
  });
}

let movieRequest = function(name) {
    if (!name) {
        name = "Mr.Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        
        console.log('Title:', response.data.Title);
        console.log('Release year:', response.data.Year);
        console.log("IMDB rating:", response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes rating:", response.data.Ratings[1].Value);
        console.log("Country:", response.data.Country);
        console.log("Language:", response.data.Language);
        console.log("Plot:", response.data.Plot);
        console.log("Actors:", response.data.Actors);
        
        textToLog = "********** Movie Information Request **********\n\n" + 'Title: ' + response.data.Title + "\n" + 'Release year: ' + response.data.Year + "\n" + "IMDB rating: " + response.data.Ratings[0].Value + "\n" + "Rotten Tomatoes rating: " + response.data.Ratings[1].Value + "\n" + "Country: " + response.data.Country + "\n" + "Language: " + response.data.Language + "\n" + "Plot: " + response.data.Plot + "\n" + "Actors: " + response.data.Actors + "\n" + "--------------------------------------------------------------";

        logToFile(textToLog);
    })
    .catch(function(err) {
        console.log(err);
      });
}

// Reads the commands and the name of the item passed to it from the random.txt file
let doWhatItSays= function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        let dataArr = data.split(",");
        let actionType = dataArr[0];
        let actionName = dataArr[1];
        if (actionType == "concert-this") {
            concertRequest(actionName);
        } else if (actionType == "spotify-this-song") {
            songRequest(actionName);
        } else {
            movieRequest(actionName);
        }
        if (error) {
            console.log(error);
        }
    })
}

switch(requestType) {
    case "concert-this":
        concertRequest(requestName);
        break;
    case "spotify-this-song":
        songRequest(requestName);
        break;
    case "movie-this":
        movieRequest(requestName);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Liri doesn't understand that");
}   







// 7b0bbb6e
