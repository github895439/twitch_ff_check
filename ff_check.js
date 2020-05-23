const axios = require("axios");
const fs = require("fs");

const SETTING = JSON.parse(fs.readFileSync("./data/setting.json", "utf-8"))

var listSrc;
var listDst;

function debug(str, func)
{
    if (SETTING.debug == "ON")
    {
        if (str != "func")
        {
            console.debug("[DEBUG] " + str);
        }
        else
        {
            func();
        }
    }

    return;
}

function makeQuery(params)
{
    let ret = "?";

    for (let key of Object.keys(params))
    {
        ret += key + "=" + params[key] + "&";
    }

    ret = ret.substr(0, ret.length - 1);
    return ret;
}

function getAccessToken()
{
    params =
        {
            "client_id": SETTING.clientId,
            "client_secret": SETTING.clientSecret,
            "grant_type": "client_credentials"
        };
    query = makeQuery(params);
    axios.post("https://id.twitch.tv/oauth2/token" + query).
        then(getFrom).
        catch(function (error) {
            if (error.response) {
                console.log("E res");
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
                console.log("E req");
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
}

var access_token;

function getFrom(response)
{
    access_token = response.data.access_token;
    params =
        {
            "from_id": SETTING.selfId,
            "first": "100"
        };
    query = makeQuery(params);
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
        {
            headers:
                {
                    "Client-ID": SETTING.clientId,
                    "Authorization": "Bearer " + access_token
                }
        }).
        then(getTo).
        catch(function (error) {
            if (error.response) {
                console.log("E res");
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
                console.log("E req");
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
}

var jsonFrom;

function getTo(response)
{
    jsonFrom = response.data.data;
    params =
        {
            "to_id": SETTING.selfId,
            "first": "100"
        };
    query = makeQuery(params);
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
        {
            headers:
                {
                    "Client-ID": SETTING.clientId,
                    "Authorization": "Bearer " + access_token
                }
        }).
        then(analyze).
        catch(function (error) {
            if (error.response) {
                console.log("E res");
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
                console.log("E req");
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
}

function ffCheck()
{
    listDst =
        {
            both: [],
            onlyFromSelf: [],
            onlyToSelf: []
        };

    for (let index = 0; index < listSrc.from.length; index++) {
        if (listSrc.to.includes(listSrc.from[index]))
        {
            listDst.both.push(listSrc.from[index]);
        }
        else
        {
            listDst.onlyToSelf.push(listSrc.from[index]);
        }
    }

    for (let index = 0; index < listSrc.to.length; index++) {
        if (!listSrc.from.includes(listSrc.to[index]))
        {
            listDst.onlyFromSelf.push(listSrc.to[index]);
        }
    }

    return;
}

var jsonTo;

function analyze(response)
{
    jsonTo = response.data.data;

    console.log("following: " + jsonFrom.length);
    console.log("follower: " + jsonTo.length);
    console.log("");

    if ((jsonFrom.length >= 100) || (jsonTo.length >= 100))
    {
        console.error("E:This cannot be used with more than 100.");
        process.exit();
    }

    listSrc =
        {
            from: [],
            to: [],
        };

    for (let index = 0; index < jsonTo.length; index++) {
        listSrc.from.push(jsonTo[index].from_name);
    }

    listSrc.from.sort();

    for (let index = 0; index < jsonFrom.length; index++) {
        listSrc.to.push(jsonFrom[index].to_name);
    }

    listSrc.to.sort();

    ffCheck();

    console.log("# both");
    console.log(listDst.both.join("\n"));
    console.log("");
    console.log("# onlyToSelf");
    console.log(listDst.onlyToSelf.join("\n"));
    console.log("");
    console.log("# onlyFromSelf");
    console.log(listDst.onlyFromSelf.join("\n"));
    return;
}

getAccessToken();
