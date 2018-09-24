const SPREADSHEET_ID = "1LXqEpMdsnOxJpeKqAZkmRbVK_Fpx5H6aO8fscP45IbI";
const SPREADSHEET_DATA_LOCATION = "A1";

let SheetsAPI;

var samples = [];

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    SheetsAPI = cordova.require('cordova-plugin-google-sheets.GoogleSheets');
    SheetsAPI.signIn(
        (data) => {
            console.log("GAPI sign in successful!");
        },
        (error) => {
            console.warn("GAPI sign in failed!");
            console.warn(error);
            alert("Unable to sign in to Google Sheets! Please try again later.");
        });
}

function upload() {
    if (samples.length === 0) {
        alert("No samples to upload!");
        return;
    }
    var numDatapoints = samples.length;
    SheetsAPI.spreadsheets.values.append((data) => {
            alert("Successfully uploaded " + numDatapoints + " datapoint(s)!");
            console.log("Upload successful!")
        },
        (error) => {
            console.warn("Upload failed!");
            console.warn(error);
            alert("Unable to upload data! Please try again later.");
        },
        SPREADSHEET_ID,
        SPREADSHEET_DATA_LOCATION,
        samples,
        "RAW", "INSERT_ROWS");
    samples = [];
}

function takeSample() {


    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

var onSuccess = function(position) {
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');

    var currentdate = new Date();
    var datetime = (currentdate.getMonth() + 1) + "/"
        + currentdate.getDate() + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    samples.push([
        datetime,
        position.coords.latitude,
        position.coords.longitude,
        position.coords.accuracy]);
    alert("Sample taken!");
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('geolocation error! code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}