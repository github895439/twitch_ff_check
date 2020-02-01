var request        = require('request');

const CLIENT_ID = "<クライアントID>";
const SELF_ID = "<自分のID>";
var BASE_TWITCH_API_URL = "https://api.twitch.tv/helix";
var FOLLOW_API_URL = "/users/follows";
var DEBUG = "OFF";

var listSrc;
var listDst;

function debug(str, func)
{
    if (DEBUG == "ON")
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

function syncRequest(url)
{
    return new Promise(
        function(resolve, reject)
        {
            console.log(url);
            request(
                {
                    url: url,
                    method: "GET",
                    headers:
                        {
                            "Client-ID": CLIENT_ID
                        }
                },
                function(error, response, body)
                {
                    let ret =
                        {
                            resp: response,
                            statusCode: response.statusCode,
                            body: body
                        };
                    debug("func",
                        function()
                        {
                            for (let key of Object.keys(response))
                            {
                                if (!key.startsWith("_"))
                                {
                                    console.log(key + ":" + response[key]);
                                }
                            }
                        });
                    debug(body);
                    resolve(ret);
                    return;
                });
        });
}

async function callFollowApi()
{
    let params;
    let query;
    let url;
    let respApi;

    params =
        {
            "from_id": SELF_ID,
            "first": "100"
        };

    query = makeQuery(params);

    url = BASE_TWITCH_API_URL + FOLLOW_API_URL + query;

    respApi = await syncRequest(url);

    if (!respApi.resp)
    {
        console.error("E:response none.")
        process.exit();
    }

    if (respApi.statusCode != 200)
    {
        console.error("E:statuscode " + respApi.statusCode);
        process.exit();
    }

    let jsonFrom = JSON.parse(respApi.body);

    params =
        {
            "to_id": SELF_ID,
            "first": "100"
        };

    query = makeQuery(params);

    url = BASE_TWITCH_API_URL + FOLLOW_API_URL + query;

    respApi = await syncRequest(url);

    if (!respApi.resp)
    {
        console.error("E:response none.")
        process.exit();
    }

    if (respApi.statusCode != 200)
    {
        console.error("E:statuscode " + respApi.statusCode);
        process.exit();
    }

    let jsonTo = JSON.parse(respApi.body);

    let ret =
        {
            from: jsonFrom,
            to: jsonTo
        };
    return ret;
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

async function wrapper()
{
    respApi = await callFollowApi();

    console.log("following: " + respApi.from.data.length);
    console.log("follower: " + respApi.to.data.length);
    console.log("");

    if ((respApi.from.data.length >= 100) || (respApi.to.data.length >= 100))
    {
        console.error("E:This cannot be used with more than 100.");
        process.exit();
    }

    listSrc =
        {
            from: [],
            to: [],
        };

    for (let index = 0; index < respApi.to.data.length; index++) {
        listSrc.from.push(respApi.to.data[index].from_name);
    }

    listSrc.from.sort();

    for (let index = 0; index < respApi.from.data.length; index++) {
        listSrc.to.push(respApi.from.data[index].to_name);
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

wrapper();
