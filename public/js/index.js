var STATE_FIP = "25";
var BASE_URL = "http://api.census.gov/data/2015/acs1";

$(document).ready(function () {
    $(document).on('click', "#submit", function (e) {
        var incomeChoice = $('#income-options option:selected').val();
        var demographicChoice = $('#demographic-options option:selected').val();

        $.ajax("/income", {
            "method": "POST",
            "data": {
                zipcode: $("#zip-code").val()
            },
            "success": function (response) {
                $.ajax(BASE_URL, {
                    "method": "GET",
                    "data": {
                        get: "NAME," + INCOME_BRACKETS,
                        for: "county:" + response.county_fip,
                        in: "state:" + STATE_FIP,
                        key: KEY
                    },
                    "success": function (resp) {
                        console.log(JSON.stringify(resp));
                    }
                });
            }
        });
    });
});