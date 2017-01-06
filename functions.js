// Fetch exchange rate data for SEK
$.getJSON("http://api.fixer.io/latest?base=SEK", function (data) {
    var currencies = [];
    $.each(data.rates, function (currency, rate) {
        // Attach the currency options to the dropdown select menu  
        currencies.push("<option id='" + currency.toLowerCase() + "'>" + currency + " " + rate.toFixed(2) + "</option>");
    });
    $(".currency-list").append(currencies.join(""));
})

// Calculate and show the value of 200kr into other currencies
$(".currency-list").click(function () {
    var amount = 200;
    var currencyAmount = $(this).val().split(' ')[1];
    var currencyName = $(this).val().split(' ')[0];
    if (currencyAmount == undefined) {
        $(".results").html("0");
    } else {
        $(".results").html(currencyAmount * 200 + " " + currencyName);
    }
});

// Loop through the historic dates and call the calculateDifference() function
function fetchHistoricData() {
    $(".history-btn").attr('disabled', 'true');

    var dateFrom = "2015-03-26";
    var dateTo = "2016-06-13";
    var dates = [dateFrom, dateTo];
    var historicRates = [];

    $.each(dates, function (index, date) {
        $.getJSON("http://api.fixer.io/" + date + "?base=SEK", function (data) {
            $.each(data.rates, function (currency, rate) {
                var selectedCurrency = $(".currency-list").val().split(' ')[0];
                if (selectedCurrency == currency) {
                    historicRates.push(rate);
                    if (dates.length - 1 == index) {
                        calculateAndDisplayDifference(historicRates);
                    }
                }
            });

        });
    });
}

function calculateAndDisplayDifference(historicRates) {
    var percentage;
    var change;

    if (historicRates[0] > historicRates[1]) {
        percentage = (historicRates[0] / historicRates[1]);
        change = "increased";
    } else {
        percentage = (historicRates[1] / historicRates[0]);
        change = "decreased";
    }

    $("<div/>", {
        "class": "historic-currency",
        html: "The exchange rate " + change + " " + percentage.toFixed(2) + " %"
    }).appendTo(".historic-section");
}

// Prevent multiple calculations of historic difference when no new currency is selected
$(".currency-list").change(function () {
    $(".historic-currency").remove();
    $(".history-btn").removeClass("disabled");
    $(".history-btn").removeAttr("disabled");
});