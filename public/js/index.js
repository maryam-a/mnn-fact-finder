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
                        var names = resp[0].slice(1, -2)
                        var values = resp[1].slice(1, -2)
                        var labels = names.map(function getLabel(name) {
                            return INCOME_LABELS.name;
                        });


                        console.log(resp)
                        console.log(labels);
                        console.log(values);

                        var data = [
                          {
                            x: names,
                            y: values,
                            type: 'bar'
                          }
                        ];

                        Plotly.newPlot('myDiv', data);
                    }
                });
            }
        });
    });
});