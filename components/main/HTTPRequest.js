
let HTTPRequest = {};

/**
 *
 * GET请求
 *
 * @param url
 * @param params
 *
 * @return {promise object}
 */

HTTPRequest.get = function (url, params) {
  if (params) {
    let paramsArray = [];

    //获取params里面所有的key
    let paramsKeyArray = Object.keys(params);
    // 通过forEach方法拿到数组中每个元素，将元素和参数的值进行拼接处理，并放入新数组中
    paramsKeyArray.forEach(key => paramsArray.push(key + '=' + params[key]));
    //网址拼接
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&');
    }
    else{
      url += paramsArray.join('&');
    }
  }

  return new Promise(function (resolve, reject){
    fetch(url, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject({status:-1})
    })
    .done();
  })
}

/**
 *
 * POST请求
 *
 * @param url
 * @param params
 *
 * @return {promise object}
 */

HTTPRequest.post = function (url, params) {
  if (params) {
    let paramsArray = [];
    var formData = new FormData();
    //获取params里面所有的key
    let paramsKeyArray = Object.keys(params);
    // 通过forEach方法拿到数组中每个元素，将元素和参数的值进行拼接处理，并放入新数组中
    paramsKeyArray.forEach(key => formData.append(key,params[key]));
  }

  return new Promise(function (resolve, reject){
    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((response) => {
      resolve(response);
    })
    .catch((error) => {
      reject({status:-1})
    })
    .done();
  })
}



global.HTTPRequest = HTTPRequest;
