require('dotenv').config()
const fs = require("fs");
const path = require('path');
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR = path.join(__dirname, '../../.youtube-credentials');
var TOKEN_PATH = TOKEN_DIR + "/youtube-token.json";

const youtube = google.youtube("v3");
var videoId;

async function getVideoDetail(id) {
  try {
    videoId = id
    // Load client secrets from a local file.
    let content = await fs.readFileSync(path.resolve(__dirname, "../../youtube-credentials.json"), 'utf-8')

    // Authorize a client with the loaded credentials, then call the YouTube API.
    let oauth2Client = await authorize(JSON.parse(content))
    let videoDetail = await makeAuthCall(oauth2Client)
    return videoDetail
  } catch (error) {
    console.log('Error loading client secret file: ' + error);
  }
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  try {
    // Check if we have previously stored a token.
    let token = await fs.readFileSync(TOKEN_PATH, 'utf-8')
    oauth2Client.credentials = JSON.parse(token);
    return oauth2Client;
  } catch (error) {
    console.log(error);
    getNewToken(oauth2Client);
  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const makeAuthCall = async (auth) => {
  try {
    let response = await youtube.videos.list(
      {
        auth: auth,
        id: videoId,
        part: "id,snippet,statistics",
      })
    return response.data.items[0]
  } catch (error) {
    console.log(err);
    return null;
  }
};

module.exports = {
  getVideoDetail
}