var STATE_FIP = "25";
var BASE_URL = "http://api.census.gov/data/2015/acs1";

$(document).ready(function () {
    $(document).on('click', "#submit", function (e) {
        var incomeChoice = $('#income option:selected').val();

        $.ajax("/income", {
            "method": "POST",
            "data": {
                zipcode: $("#zip-code").val()
            },
            "success": function (response) {
                // console.log(response.county_fip)
                $.ajax(BASE_URL, {
                    "method": "GET",
                    "data": {
                        get: "NAME," + incomeChoice,
                        for: "county:" + response.county_fip,
                        in: "state:" + STATE_FIP,
                        key: KEY
                    },
                    "success": function (resp) {
                        // var numPeople = JSON.stringify(resp[1][1]);
                        console.log(resp);
                    }
                });
            }
        });
    });
});