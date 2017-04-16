var STATE_FIP = "25";
var BASE_URL = "http://api.census.gov/data/2015/acs1";

var COUNTY_FIPS = {
    "Barnstable" : "001",
    "Berkshire" : "003",
    "Bristol" : "005",
    "Essex" : "009",
    "Franklin" : "011",
    "Hampden" : "013",
    "Hampshire" : "015",
    "Middlesex" : "017",
    "Norfolk" : "021",
    "Plymouth" : "023",
    "Suffolk" : "025",
    "Worcester" : "027"
}

var INCOME_BRACKETS = "B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_017E";

$(document).ready(function () {

    $(document).on('click', "#submit", function (e) {
        var incomeChoice = $('#income-options option:selected').val();
        var demographicChoice = $('#demographic-options option:selected').val();

        var countyInput = "";

        // TODO: Ensure that there is valid input

        $(".label-info").each(function () {
            countyInput += COUNTY_FIPS[$(this).text()] + ",";
        });

        $.ajax(BASE_URL, {
            "method": "GET",
            "data": {
                get: "NAME," + INCOME_BRACKETS,
                for: "county:" + countyInput.slice(0,-1),
                in: "state:" + STATE_FIP,
                key: KEY
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