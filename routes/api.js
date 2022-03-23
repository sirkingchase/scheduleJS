const { response } = require('express');
var express = require('express');
var router = express.Router();
var dateFormat = require("dateformat");
var ApiController = require('../controllers/api.controllers.js');


/** GET /api-status - Check service status **/
router.get('/api-status', (req, res) =>
  res.json({
    status: "ok"
  })
);

router.get('/status', async (req, res) => {

var check = clientCertificateAuth(checkAuth);
console.log(check);

  var status = await ApiController.getScheduleStatus();
  console.log(status);
  res.send(status);
})

router.put('/schedule', async (req, res) => {
  var member = req.body;
  var putSchedule = await ApiController.putSchedule(member);
  var status = await ApiController.getScheduleStatus();
  res.send(status);
})

module.exports = router;