var request = require('request');
var qs = require('querystring');
var config = require('./../../config.js');

exports = module.exports;

exports.getAuthUrl = function getAuthUrl() {
  var queryParams = {
    client_id: config.clientId,
    redirect_uri: config.redirectUri
  };
  return config.oauthUrl+'userdialog?'+qs.stringify(queryParams);
};

exports.getAccessToken = function getAccessToken(code, callback) {
  var queryParams = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code: code,
    grant_type: 'authorization_code'
  };

  var options = {
    url: config.oauthUrl + 'access_token?'+qs.stringify(queryParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  request.post(options,getRequestCb(callback));


};

exports.refreshAccessToken = function refreshAccessToken(refresh_token, callback) {
  var queryParams = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  };

  var options = {
    url: config.oauthUrl + 'refresh_token?'+qs.stringify(queryParams),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  request.post(options, getRequestCb(callback));
};

function getRequestCb(callback){

  return  function postedRequest(error, response, body) {
    if (error || response.statusCode != 200) { return callback({error: error, code: response.statusCode}, response, body); }
    var info = JSON.parse(body);
    if (info.error) { return callback(info.error, response, info); }

    return callback(null, response, info);
  };
}