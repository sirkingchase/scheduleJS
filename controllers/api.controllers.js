var parser = require('fast-xml-parser');
var exec = require('ssh-exec');
var dateFormat = require("dateformat");
var moment = require('moment');
const { NotExtended } = require('http-errors');

var dict = {
  "192.168.202.0/24": { name: "Schedule", timeoutSeconds: null, timeoutDate: null, timeoutTime: null, ip: "192.168.202.0/24" },
  "192.168.69.0/24": { name: "LoT", timeoutSeconds: null, timeoutDate: null, timeoutTime: null, ip: "192.168.69.0/24" },
  "192.168.123.0/24": { name: "Hello", timeoutSeconds: null, timeoutDate: null, timeoutTime: null, ip: "192.168.123.0/24" }
};

function updateDictionary(key, mem) {
  var t = new Date();
  var iStatus = dict[key];
  iStatus.timeoutSeconds = mem.timeout; 
  
  t.setSeconds(mem.timeout);  
  iStatus.timeoutDate = t;
  iStatus.timeoutTime = dateFormat(t, "HH:MM:ss" );
  iStatus.ip = mem.elem;
}

exports.putSchedule = async (member) => {
  var timeout = 1;

  if(member.timeoutTime){
    var dtMoment = moment(dateFormat(new Date(), "yyyy-mm-dd") + ' ' + member.timeoutTime);
    timeout = dtMoment.diff(moment(), 'seconds');    
  }

  var ipsetCommand = 'ipset add NetSet -exist ' + member.ip + ' timeout ' + timeout;

  console.log(ipsetCommand);

  return new Promise((resolve, reject) => {
    exec(ipsetCommand, {
      user: 'root',
      host: '192.168.1.1',
      password: ''
    },
      function (err, stdout, stderr) {
        resolve(stdout);
        console.log("(router.put('exports.getScheduleStatus");
        console.log(stdout);
      });
  });
};

exports.getScheduleStatus = async function(req, res, next) {
  return new Promise((resolve, reject) => {
    //exec('ipset -L NetSet -o xml', {  
    exec('ipset -L NetSet -o xml', {
        user: 'root',
        host: '192.168.1.1',
        password: 'cc1229xx'
      }, 
      function (err, stdout, stderr) {
        if( parser.validate(stdout) === true) { 
          var options = {
            ignoreAttributes : false,
            ignoreNameSpace : false,
            allowBooleanAttributes : false,
            parseNodeValue : true,
            parseAttributeValue : false,
            trimValues: true,
            cdataTagName: "__cdata", //default is 'false'
            cdataPositionChar: "\\c",
            parseTrueNumberOnly: false,
            arrayMode: false
          };
          var result = parser.parse(stdout, options);
          if(result){
            var members = result.ipsets.ipset.members.member;
            if(members.length){ //we have many members
              members.forEach(mem => {
                updateDictionary(mem.elem, mem);
              });
          }
          else{
            updateDictionary(members.elem, members);}
          }
        }
      });

      resolve(dict);

  });
};


              