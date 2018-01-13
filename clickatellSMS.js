'use strict';
console.log('SMS started');
require('colors');
const request = require('request');
const clickatell = require('./clickatellSMSconfig');
//Exposes a method for sending SMS to a given mobile number

const clickatellURL = "http://api.clickatell.com/http/sendmsg?user={user}&password={password}&api_id={apiid}&to={number}&text={text}&mo=1&from={from}&unicode=1";


//console.log(clickatell);

let send = function (givenNumber, givenText) {
  //givenNumber can instead be an object {number:'15552223344', text:'hello'}
  let _number = undefined;
  let _text = undefined;
  if (!givenText && typeof givenNumber === 'object' && givenNumber.number && givenNumber.text) {
    _number = givenNumber.number;
    _text = givenNumber.text;
  } else {
    if (givenNumber && typeof givenNumber === 'string') _number = givenNumber;
    if (givenText && typeof givenText === 'string') _text = givenText;
  }
  if (!_number || !_text) return new Promise.reject();

  return new Promise(
    function resolver(resolve, reject) {
      let tempURL = clickatellURL;
      try { //find clickatell configuration which matches the number or take the default configuraion.
        let tempConf = clickatell[0];
        for (let conf of clickatell)
          if (conf.defcodes)
            for (let code of conf.defcodes)
              if (_number.startsWith(code))
                tempConf = conf;

        //populate credentials from the configuraion into the URL string
        tempURL = tempURL.formatUnicorn(tempConf);

        //populate number and the message text
        tempURL = tempURL.formatUnicorn({
          number: _number,
          text: hexEncode(_text)
        });

        console.log('sending'.green, tempURL);

        request({
          url: tempURL,
          method: 'GET'
        }, function (error, response, body) {
          if (error) {
            console.error('ERROR sending SMS:'.red, error);
            reject(false);
          } else {
            console.log('Sent SMS:'.green, _number, 'text'.green, _text);
            resolve(true);
          }
        });
      } catch (e) {
        console.error('Error sening SMS to clickatel'.red, e);
        reject(false);
      }
    });

}


let isNumberValid = function (givenNumber) {
  //returns true if given number is a valid mobile number
  //TODO
  return true;
}


module.exports.isNumberValid = isNumberValid;
module.exports.send = send;









String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
  //by stackoverflow.com
  function () {
    let str = this.toString();
    if (arguments.length) {
      let t = typeof arguments[0];
      let key;
      let args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments) :
        arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }

    return str;
  };


let hexEncode = function (given) {
  let hex, i;

  let result = "";
  for (i = 0; i < given.length; i++) {
    hex = given.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result
}


let hexDecode = function (given) {
  let j;
  let hexes = given.match(/.{1,4}/g) || [];
  let back = "";
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}
