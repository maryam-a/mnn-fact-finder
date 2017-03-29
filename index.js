var STATE_ID = "25";
var BASE_URL = "http://api.census.gov/data/2015/acs1";
var TEMP_COUNTY_ID = "017";

$(document).ready(function () {
    $(document).on('click', "#submit", function (e) {
        var zipcode = $("#zip-code").val();
        var incomeChoice = $('#income option:selected').val();

         $.ajax(BASE_URL, {
            "method": "GET",
            "data": { 
                get: "NAME," + incomeChoice,
                for: "county:" + TEMP_COUNTY_ID,
                in: "state:" + STATE_ID,
                key: KEY
             },
            "success": function (response) {
                console.log(JSON.stringify(response));
              }
        });
    });
});