# clickatellSMS
Node.js module for clickatell.com SMS transport


clickatellSMSconfig.js should include:

```
module.exports.clickatell = [{
  user: 'username',  
  password: 'password', 
  apiid: '123456',
  from: '971505582336',
  default: true
}, {
  user: 'username1',
  password: 'password1',
  apiid: '1234567',
  from: '15554442211',
  defcodes: ['+1']
}];
```

The first element in the array is the default configuraion.

