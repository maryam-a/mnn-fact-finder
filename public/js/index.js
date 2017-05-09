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
var INCOME_LABELS = ["Less than \n\$10,000", "\$10,000 to \n14,999", "\$15,000 to\n19,999", "\$20,000 to\n24,999", "\$25,000 to\n29,999", "\$30,000 to\n34,999", "\$35,000 to\n39,999", "\$40,000 to\n44,999", "\$45,000 to\n49,999    ", "\$50,000 to\n59,999", "\$60,000 to\n74,999", "\$75,000 to\n99,999", "\$100,000 to\n124,999", "\$125,000 to\n149,999", "\$150,000 to\n199,999", "Over\n200,000"];

var ED_BRACKETS = "B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_017E";
var ED_LABELS = ["Less than \n\$10,000", "\$10,000 to \n14,999", "\$15,000 to\n19,999", "\$20,000 to\n24,999", "\$25,000 to\n29,999", "\$30,000 to\n34,999", "\$35,000 to\n39,999", "\$40,000 to\n44,999", "\$45,000 to\n49,999    ", "\$50,000 to\n59,999", "\$60,000 to\n74,999", "\$75,000 to\n99,999", "\$100,000 to\n124,999", "\$125,000 to\n149,999", "\$150,000 to\n199,999", "Over\n200,000"];

var AGE_BRACKETS = "B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_017E";
var AGE_LABELS = ["Less than \n\$10,000", "\$10,000 to \n14,999", "\$15,000 to\n19,999", "\$20,000 to\n24,999", "\$25,000 to\n29,999", "\$30,000 to\n34,999", "\$35,000 to\n39,999", "\$40,000 to\n44,999", "\$45,000 to\n49,999    ", "\$50,000 to\n59,999", "\$60,000 to\n74,999", "\$75,000 to\n99,999", "\$100,000 to\n124,999", "\$125,000 to\n149,999", "\$150,000 to\n199,999", "Over\n200,000"];




function getSum(total, num) {
    return total + num;
}

$(document).ready(function () {



    $(document).on('click', "#submit", function (e) {

        var queryType = $('.nav-tabs .active').text()
        console.log("here");
        console.log(queryType);
        if (queryType == "Income") {
            brackets = INCOME_BRACKETS;
            labels = INCOME_LABELS;
        } else if (queryType == "Education") {
            brackets = ED_BRACKETS;
            labels = ED_LABELS;
        } else if (queryType == "Age") {
            brackets = AGE_BRACKETS;
            labels = AGE_LABELS;
        }

        //var incomeChoice = $('#income-options option:selected').val();
        //var demographicChoice = $('#demographic-options option:selected').val();


        var countyInput = "";

        // TODO: Ensure that there is valid input

        $(".label-info").each(function () {
            countyInput += COUNTY_FIPS[$(this).text()] + ",";
        });

        $.ajax(BASE_URL, {
            "method": "GET",
            "data": {
                get: "NAME," + brackets,
                for: "county:" + countyInput.slice(0,-1),
                in: "state:" + STATE_FIP,
                key: KEY
            },
            "success": function (resp) {
                console.log(resp);
                console.log(INCOME_LABELS);
                var data = [];

                if ($(".percentages").is(":checked")) {
                    for (i = 1; i < resp.length; i++) { 
                        var vals = resp[i].slice(1,-2);
                        var sum = vals.reduce(getSum)
                        var percentages = vals.map(function(x) {return x*1.0/sum});
                        console.log(percentages);
                        resp[i].slice(1,-2) = percentages;
                    }
                }

                console.log(resp);

                for (i = 1; i < resp.length; i++) { 
                    data.push({
                        x: labels,
                        y: resp[i].slice(1, -2),
                        name: resp[i][0].split(',')[0],
                        type: 'bar'
                    });
                }

                var layout = {
                    barmode: 'group', 
                    title: 'Plot Title',
                    margin: {b: 150},
                    height: 600,
                    width: 900,
                    xaxis: {
                        title: 'Household Income',
                        titlefont: {
                            family: 'Helvetica',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    },
                    yaxis: {
                        title: 'Number of People',
                        titlefont: {
                            family: 'Helvetica',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    }
                };

                Plotly.newPlot('myDiv', data, layout);
            }
        });

    });
});