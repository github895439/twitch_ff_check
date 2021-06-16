const axios = require("axios");
const fs = require("fs");

const SETTING = JSON.parse(fs.readFileSync("./data/setting.json", "utf-8"))

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
    let params =
    {
        "client_id": SETTING.clientId,
        "client_secret": SETTING.clientSecret,
        "grant_type": "client_credentials"
    };
    let query = makeQuery(params);
    axios.post("https://id.twitch.tv/oauth2/token" + query).
        then(getFrom).
        catch(function (error)
        {
            if (error.response)
            {
                console.log("E res");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request)
            {
                console.log("E req");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else
            {
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
    let params =
    {
        "from_id": SETTING.selfId,
        "first": "100"
    };
    let query = makeQuery(params);
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
        {
            headers:
            {
                "Client-ID": SETTING.clientId,
                "Authorization": "Bearer " + access_token
            }
        }).
        then(getFromNext).
        catch(function (error)
        {
            if (error.response)
            {
                console.log("E res");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request)
            {
                console.log("E req");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else
            {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

var jsonFrom = [];

function getFromNext(response)
{
    jsonFrom = jsonFrom.concat(response.data.data);

    if (response.data.pagination.hasOwnProperty("cursor"))
    {
        let params =
        {
            "from_id": SETTING.selfId,
            "first": "100",
            "after": response.data.pagination.cursor
        };
        let query = makeQuery(params);
        axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
            {
                headers:
                {
                    "Client-ID": SETTING.clientId,
                    "Authorization": "Bearer " + access_token
                }
            }).
            then(getFromNext).
            catch(function (error)
            {
                if (error.response)
                {
                    console.log("E res");
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                else if (error.request)
                {
                    console.log("E req");
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else
                {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }
    else
    {
        getTo();
    }
}

function getTo()
{
    let params =
    {
        "to_id": SETTING.selfId,
        "first": "100"
    };
    let query = makeQuery(params);
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
        {
            headers:
            {
                "Client-ID": SETTING.clientId,
                "Authorization": "Bearer " + access_token
            }
        }).
        then(getToNext).
        catch(function (error)
        {
            if (error.response)
            {
                console.log("E res");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request)
            {
                console.log("E req");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else
            {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

var jsonTo = [];
var onlyToSelf;

function getToNext(response)
{
    jsonTo = jsonTo.concat(response.data.data);

    if ((response.data.pagination.hasOwnProperty("cursor")) && (jsonTo.length < 103))
    {
        let params =
        {
            "to_id": SETTING.selfId,
            "first": "100",
            "after": response.data.pagination.cursor
        };
        let query = makeQuery(params);
        axios.get(SETTING.apiBaseUrl + SETTING.apiGetUsersFollowsUrl + query,
            {
                headers:
                {
                    "Client-ID": SETTING.clientId,
                    "Authorization": "Bearer " + access_token
                }
            }).
            then(getToNext).
            catch(function (error)
            {
                if (error.response)
                {
                    console.log("E res");
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                else if (error.request)
                {
                    console.log("E req");
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else
                {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }
    else
    {
        onlyToSelf = analyze();
        checkStream();
    }
}

function analyze()
{
    console.log("following: " + jsonFrom.length);
    console.log("follower: " + jsonTo.length);
    console.log("");

    let listSrc =
    {
        from: [],
        to: [],
    };

    for (let index = 0; index < jsonTo.length; index++)
    {
        listSrc.from.push(
            {
                "name": jsonTo[index].from_name,
                "id": jsonTo[index].from_id,
                "login": jsonTo[index].from_login
            });
    }

    listSrc.from.sort(sortOriginal);

    for (let index = 0; index < jsonFrom.length; index++)
    {
        listSrc.to.push(
            {
                "name": jsonFrom[index].to_name,
                "id": jsonFrom[index].to_id,
            });
    }

    listSrc.to.sort(sortOriginal);
    let listDst =
    {
        both: [],
        onlyFromSelf: [],
        onlyToSelf: []
    };

    let rtn;

    for (let index = 0; index < listSrc.from.length; index++)
    {
        rtn = includesOriginal(listSrc.to, listSrc.from[index].id);

        if (rtn)
        {
            listDst.both.push(listSrc.from[index]);
        }
        else
        {
            listDst.onlyToSelf.push(listSrc.from[index]);
        }
    }

    for (let index = 0; index < listSrc.to.length; index++)
    {
        rtn = includesOriginal(listSrc.from, listSrc.to[index].id);

        if (!rtn)
        {
            listDst.onlyFromSelf.push(listSrc.to[index]);
        }
    }

    console.log("# both");
    console.log(joinOriginal(listDst.both));
    console.log("# onlyToSelf");
    console.log(joinOriginal(listDst.onlyToSelf));
    console.log("# onlyFromSelf");
    console.log(joinOriginal(listDst.onlyFromSelf));
    return listDst.onlyToSelf;
}

function sortOriginal(a, b)
{
    if (a.id == b.id)
    {
        return 0;
    }
    else if (a.id < b.id)
    {
        return 1;
    }

    return -1;
}

function includesOriginal(list, id)
{
    for (let index = 0; index < list.length; index++)
    {
        if (list[index].id == id)
        {
            return true;
        }
    }

    return false;
}

function joinOriginal(list)
{
    let rtn = "";
    let loginFlag = false;

    if (list[0].hasOwnProperty("login"))
    {
        loginFlag = true;
    }

    for (let index = 0; index < list.length; index++)
    {
        rtn += list[index].name;
        rtn += " " + list[index].id;

        if (loginFlag)
        {
            rtn += " " + list[index].login;
        }

        rtn += "\n";
    }

    return rtn;
}

var indexOnlyToSelf = 0;

function checkStream()
{
    let params =
    {
        "user_id": onlyToSelf[indexOnlyToSelf].id,
        "first": "1",
        "type": "archive"
    };
    let query = makeQuery(params);

    console.log("# User who has archive in onlyToSelf");
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetVideosUrl + query,
        {
            headers:
            {
                "Client-ID": SETTING.clientId,
                "Authorization": "Bearer " + access_token
            }
        }).
        then(checkStreamNext).
        catch(function (error)
        {
            if (error.response)
            {
                console.log("E res");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request)
            {
                console.log("E req");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else
            {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

function checkStreamNext(response)
{
    if (response.data.data.length > 0)
    {
        console.log("https://www.twitch.tv/" + onlyToSelf[indexOnlyToSelf].login + "/videos?filter=archives&sort=time");
    }

    indexOnlyToSelf++;

    if (indexOnlyToSelf >= onlyToSelf.length)
    {
        return;
    }

    let params =
    {
        "user_id": onlyToSelf[indexOnlyToSelf].id,
        "first": "1",
        "type": "archive"
    };
    let query = makeQuery(params);
    axios.get(SETTING.apiBaseUrl + SETTING.apiGetVideosUrl + query,
        {
            headers:
            {
                "Client-ID": SETTING.clientId,
                "Authorization": "Bearer " + access_token
            }
        }).
        then(checkStreamNext).
        catch(function (error)
        {
            if (error.response)
            {
                console.log("E res");
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request)
            {
                console.log("E req");
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else
            {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
}

getAccessToken();
