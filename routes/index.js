var express = require('express');
var router = express.Router();

var zcta = require("us-zcta-counties");
var COUNTY_FIPS = require("../countyFIP");

router.post("/", function (req, res) {
    var county = zcta.find({ zip: req.body.zipcode })["county"];
    res.json({
        "success": true,
        "county_fip": COUNTY_FIPS[county]
    });
});

module.exports = router;