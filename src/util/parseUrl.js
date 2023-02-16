import extend from "extend";

export function normalizeTokenKeys (params) {
  // normalize keys
  if (params.token) {
    params["access-token"] = params.token;
    delete params.token;
  }
  if (params.auth_token) {
    params["access-token"] = params.auth_token;
    delete params.auth_token;
  }
  if (params.client_id) {
    params.client = params.client_id;
    delete params.client_id;
  }
  if (params.config) {
    params.endpointKey = params.config;
    delete params.config;
  }

  return params;
};

const getAnchorSearch = function(location) {
  var rawAnchor = location.anchor || "",
    arr       = rawAnchor.split("?");
  return (arr.length > 1) ? arr[1] : null;
};

const getSearchQs = function(location) {
  var rawQs = location.search || "";
  var qs = rawQs.replace("?", "");
  var qsObj = new URLSearchParams(qs);
  return Object.fromEntries(qsObj);
};

const getAnchorQs = function(location) {
  var anchorQs    = getAnchorSearch(location);
  if(anchorQs) {
    return Object.fromEntries(new URLSearchParams(anchorQs));
  } else {
    return {};
  }
};

export function getAllParams (location) {
  return extend({}, getAnchorQs(location), getSearchQs(location));
};