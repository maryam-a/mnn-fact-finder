var STATE_FIP = "25";
var BASE_URL = "https://api.census.gov/data/2015/acs1";

var COUNTY_FIPS = {
    "barnstable": "001",
    "berkshire": "003",
    "bristol": "005",
    "essex": "009",
    "franklin": "011",
    "hampden": "013",
    "hampshire": "015",
    "middlesex": "017",
    "norfolk": "021",
    "plymouth": "023",
    "suffolk": "025",
    "worcester": "027"
}

var INCOME_BRACKETS = "B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_017E";
var INCOME_LABELS = ["Less than\n10000", "10000 to\n14999", "15000 to\n19999", "20000 to\n24999", "25000 to\n29999", "30000 to\n34999", "35000 to\n39999", "40000 to\n44999", "45000 to\n49999", "50000 to\n59999", "60000 to\n74999", "75000 to\n99999", "100000 to\n124999", "125000 to\n149999", "150000 to\n199999", "Over\n200000"];

// Google Analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-97409379-1', 'auto');
ga('send', 'pageview');

function getSum(total, num) {
    return total + num;
}

$(document).ready(function () {
    $(document).on('click', "#submit", function (e) {
        // TODO: Will be worth adding eventLabel when we have different variables
        ga('send', 'event', 'Button', 'submit');

        // var demographicChoice = $('#demographic-options option:selected').val();

        var countyInput = "";

        $(".label-info").each(function () {
            // Only process valid input strings
            var key = $(this).text().toLowerCase();
            if (COUNTY_FIPS[key]) {
                countyInput += COUNTY_FIPS[key] + ",";
                ga('send', 'event', 'Counties', 'find', key);
            }
        });

        if (countyInput !== "") {
            $.getJSON("../settings.json", function (json) {
                $.ajax(BASE_URL, {
                    "method": "GET",
                    "data": {
                        get: "NAME," + INCOME_BRACKETS,
                        for: "county:" + countyInput.slice(0, -1),
                        in: "state:" + STATE_FIP,
                        key: json.KEY
                    },
                    "success": function (resp) {
                        // console.log(resp);
                        // console.log(INCOME_LABELS);
                        var data = [];

                        if ($(".percentages").is(":checked")) {
                            ga('send', 'event', 'Button', 'check', 'Percentages');
                            for (i = 1; i < resp.length; i++) {
                                var vals = resp[i].slice(1, -2);
                                var sum = vals.reduce(getSum)
                                var percentages = vals.map(function (x) { return x * 1.0 / sum });
                                // console.log(percentages);
                                resp[i].slice(1, -2) = percentages;
                            }
                        }

                        for (i = 1; i < resp.length; i++) {
                            data.push({
                                x: INCOME_LABELS,
                                y: resp[i].slice(1, -2),
                                name: resp[i][0],
                                type: 'bar'
                            });
                        }

                        var layout = { barmode: 'group' };
                        Plotly.newPlot('myDiv', data, layout);
                    }
                });
            })
        } else {
            $("#location-info").append('<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                "Please enter a valid county name.</div>")
        }
    });
});