/****************************************************
 Dependencies
 ****************************************************/

var httpReference = dependencies.http;

var httpDependency = {
    get: httpReference.get,
    post: httpReference.post,
    put: httpReference.put,
    patch: httpReference.patch,
    delete: httpReference.delete,
    head: httpReference.head,
    options: httpReference.options
};
var httpService = {};

function handleRequestWithRetry(requestFn, options, callbackData, callbacks) {
    try {
        return requestFn(options, callbackData, callbacks);
    } catch (error) {
        sys.logs.info("[skeleton] Handling request...");
        sys.logs.error(JSON.stringify(error));
        // TODO : If use oauth (ex endpoint per user) uncomment this, otherwise delete this comment
        /*
        dependencies.oauth.functions.refreshToken();
        return requestFn(setAuthorization(options), callbackData, callbacks);
        */
    }
}

function createWrapperFunction(requestFn) {
    return function(options, callbackData, callbacks) {
        return handleRequestWithRetry(requestFn, options, callbackData, callbacks);
    };
}

for (var key in httpDependency) {
    if (typeof httpDependency[key] === 'function') httpService[key] = createWrapperFunction(httpDependency[key]);
}

/****************************************************
 Helpers
 ****************************************************/

exports.testPath = {};

exports.path1 = {};

exports.path2 = {};

exports.path3 = {};

exports.path4 = {};

exports.testPath.get = function(httpOptions) {
    var url = parse('/testPath');
    sys.logs.debug('[skeleton] GET from: ' + url);
    var options = checkHttpOptions(url, httpOptions);
    return httpService.get(Skeleton(options));
};

exports.path1.put = function(testPath, httpOptions) {
    if (!testPath) {
        sys.logs.error('Invalid argument received. This helper should receive the following parameters as non-empty strings: [testPath].');
        return;
    }
    var url = parse('/path1/:testPath', [testPath]);
    sys.logs.debug('[skeleton] PUT from: ' + url);
    var options = checkHttpOptions(url, httpOptions);
    return httpService.put(Skeleton(options));
};

exports.path2.patch = function(httpOptions) {
    var url = parse('/path2?param2=' + httpOptions.query.param2 + '&param3=' + httpOptions.query.param3 + '');
    sys.logs.debug('[skeleton] PATCH from: ' + url);
    var options = checkHttpOptions(url, httpOptions);
    return httpService.patch(Skeleton(options));
};

exports.path3.get = function(httpOptions, callbackData, callbacks) {
    var url = parse('/path3');
    sys.logs.debug('[skeleton] GET from: ' + url);
    var options = checkHttpOptions(url, httpOptions);
    return httpService.get(Skeleton(options), callbackData, callbacks);
};

exports.path4.delete = function(httpOptions) {
    //CUSTOM CODE
    return httpService.delete(Skeleton(options));
};

/****************************************************
 Public API - Generic Functions
 ****************************************************/

exports.get = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.get(Skeleton(options), callbackData, callbacks);
};

exports.post = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.post(Skeleton(options), callbackData, callbacks);
};

exports.put = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.put(Skeleton(options), callbackData, callbacks);
};

exports.patch = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.patch(Skeleton(options), callbackData, callbacks);
};

exports.delete = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.delete(Skeleton(options), callbackData, callbacks);
};

exports.head = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.head(Skeleton(options), callbackData, callbacks);
};

exports.options = function(url, httpOptions, callbackData, callbacks) {
    var options = checkHttpOptions(url, httpOptions);
    return httpService.options(Skeleton(options), callbackData, callbacks);
};

exports.utils = {};

exports.utils.parseTimestamp = function(dateString) {
    if (!dateString) {
        return null;
    }
    var dt = dateString.split(/[: T\-]/).map(parseFloat);
    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
};

exports.utils.formatTimestamp = function(date) {
    if (!date) {
        return null;
    }
    var pad = function(number) {
        var r = String(number);
        if ( r.length === 1 ) {
            r = '0' + r;
        }
        return r;
    };
    return date.getUTCFullYear()
        + '-' + pad( date.getUTCMonth() + 1 )
        + '-' + pad( date.getUTCDate() )
        + 'T' + pad( date.getUTCHours() )
        + ':' + pad( date.getUTCMinutes() )
        + ':' + pad( date.getUTCSeconds() )
        + '.' + String( (date.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
        + 'Z';
};

exports.utils.fromDateToTimestamp = function(params) {
    if (!!params) {
        return {timestamp: new Date(params).getTime()};
    }
    return null;
};

exports.utils.fromMillisToDate = function(params) {
    if (!!params) {
        var sdf = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'UTC'
        });
        return {date: sdf.format(new Date(parseInt(params)))};
    }
    return null;
};

/****************************************************
 Private helpers
 ****************************************************/

var concatQuery = function (url, key, value) {
    return url + ((!url || url.indexOf('?') < 0) ? '?' : '&') + key + "=" + value;
}

var checkHttpOptions = function (url, options) {
    options = options || {};
    if (!!url) {
        if (isObject(url)) {
            // take the 'url' parameter as the options
            options = url || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contain the http package format
                options.path = url;
            } else {
                // create html package
                options = {
                    path: url,
                    body: options
                }
            }
        }
    }
    return options;
}

var isObject = function (obj) {
    return !!obj && stringType(obj) === '[object Object]'
}

var stringType = Function.prototype.call.bind(Object.prototype.toString)

var parse = function (str) {
    try {
        if (arguments.length > 1) {
            var args = arguments[1], i = 0;
            return str.replace(/(:(?:\w|-)+)/g, () => {
                if (typeof (args[i]) != 'string') throw new Error('Invalid type of argument: [' + args[i] + '] for url [' + str + '].');
                return args[i++];
            });
        } else {
            if (str) {
                return str;
            }
            throw new Error('No arguments nor url were received when calling the helper. Please check it\'s definition.');
        }
    } catch (err) {
        sys.logs.error('Some unexpected error happened during the parse of the url for this helper.')
        throw err;
    }
}

/****************************************************
 Constants
 ****************************************************/


var SKELETON_API_BASE_URL = "https://example.com"; // TODO: Set the base url (Remove comments after set the url)
var API_URL = SKELETON_API_BASE_URL+"/api/v1/"; // TODO: Set the base url for the api (Remove comments after set the url)

/****************************************************
 Configurator
 ****************************************************/

var Skeleton = function (options) {
    options = options || {};
    options= setApiUri(options);
    options= setRequestHeaders(options);
    return options;
}

/****************************************************
 Private API
 ****************************************************/

function setApiUri(options) {
    var url = options.path || "";
    options.url = API_URL + url;
    sys.logs.debug('[skeleton] Set url: ' + options.path + "->" + options.url);
    return options;
}

function setRequestHeaders(options) {
    var headers = options.headers || {};
    if (config.get("choice") === "apiKey") { // TODO: Set the authentication method, if needed or remove this if (Remove comments after set the url)
        sys.logs.debug('[skeleton] Set header apikey');
        headers = mergeJSON(headers, {"Authorization": "API-Key " + config.get("text")});
    } 
    headers = mergeJSON(headers, {"Content-Type": "application/json"});

    options.headers = headers;
    return options;
}

function setAuthorization(options) { // TODO: Set the authorization method and verify prefix, if needed or remove this function (Remove comments after set the url)
    /**********************************************************************************************
         Dynamic configuration
         config.oauth.id = 'installationInfo-skeleton-User-'+sys.context.getCurrentUserRecord().id();
         return config;
     ***********************************************************************************************/
    sys.logs.debug('[skeleton] Setting header token oauth');
    var authorization = options.authorization || {};
    authorization = mergeJSON(authorization, {
        type: "oauth2",
        accessToken: sys.storage.get(config.get("oauth").id + ' - access_token'),
        headerPrefix: "token"
    });
    options.authorization = authorization;
    return options;
}

function mergeJSON (json1, json2) {
    const result = {};
    var key;
    for (key in json1) {
        if(json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if(json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}

/****************************************************
 Extra helper
 ****************************************************/

exports.callbackTest = function () {
    log('test function arrived UI');
    sys.ui.sendMessage({
        scope: 'uiService:testUiService.testUiService',
        name: 'callbackTest',
        callbacks: {
            callbackTest: function (originalMessage, callbackData) {
                sys.logs.info('callbackTest');
            }
        }
    });
}