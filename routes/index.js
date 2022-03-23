var express = require('express');
var router = express.Router();
var dateFormat = require("dateformat");
var moment = require('moment');
var ApiController = require('../controllers/api.controllers.js');

router.get('/', async (req, res) => {
  var status = await ApiController.getScheduleStatus();
  var dTime = dateFormat(new Date(), "HH:MM");
  res.render('status', { title: 'Hey', dtime: dTime, members: status });
})

/*
router.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

router.post('/', function(request, response){
  var time = request.body.scheduleTime; //"18:00";
  console.log(time);
  console.log(dateFormat(new Date(), "yyyy-mm-dd" ) + ' ' + time );

  var dtMoment = moment(dateFormat(new Date(), "yyyy-mm-dd" ) + ' ' + time );

  console.log(dtMoment);

  var timeout = dtMoment.diff(moment(),'seconds')

  console.log(timeout);

});
*/

module.exports = router;