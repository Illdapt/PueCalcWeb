/**
 * Created by nicktuttle on 11/4/2016.
 */
$(document).ready(function() {
    var calcTable;
    var kwFinalCost;
    $.ajax({
        'url': 'https://query.yahooapis.com/v1/public/yql',
        'data': {
            'q': 'SELECT * FROM html WHERE url="http://files.server-rack-online.com/states2.json"',
            'format': 'json',
            'jsonCompat': 'new'
        },
        'dataType': 'jsonp',
        'success': function (data) {

            data = data.query.results.body;
            //  console.log(data);
            calcTable = $.parseJSON(data);
            //console.log(calcTable);

            loadStates();
            $('#kwCost').val("0.0918");
        }

    }); // end ajax call and success: function(

    //Populate Country List
    var strCountry = "United States,Australia,Belgium,Brazil,Canada,China,Finland,France,Germany,Hong Kong,India,Indonesia,Ireland,Italy," +
        "Japan,Malaysia,Netherlands,Other,Philippines,Singapore,South Korea,Spain,Sweden,Switzerland,Taiwan,United Kingdom";
    strCountry = strCountry.split(',');
    $.each(strCountry, function (idx, val) {
        console.log(val);
        $('#countrySelect').append("<option value='" + val + "'> " + val + " </option>");
    });

    function loadStates() {
        //  console.log(calcTable);
        $(calcTable.states).each(function (index, state) {
            $('#stateSelect').append("<option value='" + state.stateValue + "'> " +state.stateName+ " </option>");
            //console.log(state);
            console.log(state.stateName)
            $(state).each(function(key, value){
                console.log(value);
            })
        });
    }

    function process(){
        var totalIt = $('#totalIt').val();
        var totalFac = $('#totalFac').val();
        var countrySelect = $('#countrySelect').val();
        var stateSelect = $('#stateSelect').val();
        var kwCost = $('#kwCost').val();
        var countryVal = $('#countrySelect').val();
        var elecTotal;
        var moneyTotal;
        var emissionTotal;
        var pueResults;
        var dcieResults;
        var progBarResult;

        console.log(totalIt);
        console.log(totalFac);


        /* DO CALCULATIONS HERE*/
        pueResults = totalFac / totalIt;
        dcieResults = totalIt / totalFac * 100;
        elecTotal = totalFac * 8760;
        moneyTotal = kwCost * elecTotal;
        emissionTotal = (elecTotal * 1.21) / 2000;
        elecTotal = numeral(elecTotal).format('0,0.00');
        moneyTotal = numeral(moneyTotal).format('0,0.00');
        emissionTotal = numeral(emissionTotal).format('0,0.00');

        progBarResult = (100 - dcieResults) +"%";
        /* PUSH RESULTS*/
        $('#pue').text(pueResults.toFixed(2));
        $('#dcie').text(dcieResults.toFixed(2)+ "%");
        $('#elecTotal').text(elecTotal+" kW/h");
        $('#emissionTotal').text(emissionTotal +" Tons");
        //$('#pueBack').animate({"width": progBarResult},"slide");
        $('#pueBack').animate({"width": progBarResult},"slide");
        $('#pueBack .progressbar').animate({backgroundColor : "#369"});

        if(countryVal == "United States" || countryVal == "Australia" || countryVal == "Canada" || countryVal == "Hong Kong" || countryVal == "Brazil" || countryVal == "Singapore"){
            $('#moneyTotal').text('$'+moneyTotal);
            $('#currencyKW').html('$');
        }
        else if(countryVal == "Germany" || countryVal == "France" || countryVal == "Belgium" || countryVal == "Italy" || countryVal == "Finland" || countryVal == "Spain" || countryVal == "Ireland" || countryVal == "Sweden"){
            $('#moneyTotal').html('&euro;'+moneyTotal);
            $('#currencyKW').html('&euro;');
        }
        else if(countryVal == "United Kingdom"){
            $('#moneyTotal').html('&pound;'+moneyTotal);
            $('#currencyKW').html('&pound;');
        }
        else if(countryVal == "China" || countryVal == "Japan"){
            $('#moneyTotal').html('&yen;'+moneyTotal);
            $('#currencyKW').html('&yen;');
        }
        else if(countryVal == "India"){
            $('#moneyTotal').html('&#x20B9;'+moneyTotal);
            $('#currencyKW').html('&#x20B9;');
        }
        else if(countryVal == "Indonesia"){
            $('#moneyTotal').html('Rp '+moneyTotal);
            $('#currencyKW').html('Rp');
        }
        else if(countryVal == "Malaysia"){
            $('#moneyTotal').html('RM '+moneyTotal);
            $('#currencyKW').html('RM');
        }
        else if(countryVal == "Philippines"){
            $('#moneyTotal').html('&#x20b1;'+moneyTotal);
            $('#currencyKW').html('&#x20b1;');
        }
        else if(countryVal == "South Korea"){
            $('#moneyTotal').html('&#x20a9;'+moneyTotal);
            $('#currencyKW').html('&#x20a9;');
        }
        else if(countryVal == "Switzerland"){
            $('#moneyTotal').html('CHF '+moneyTotal);
            $('#currencyKW').html('CHF');
        }
        else{
            $('#moneyTotal').html(moneyTotal);
            $('#currencyKW').html('$');
        }
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
    }

    $(".pueOption" ).change(function() {
        var $this = this;
        if ($($this).prop('id') == "stateSelect") {
            //alert("State Selector Change");
            kwFinalCost = $($this).prop("value");
            $('#kwCost').val(kwFinalCost);
            if (($('#totalIt').val() > 0) && ($('#totalFac').val() > 0)){
                process();
            }
        }
        if ($($this).prop('id') == "countrySelect"){
            //alert("Country Selector Change");
            if($('#countrySelect').val()== "United States"){
                $('#stateSelect').removeAttr('disabled');
            }
            else{
                $('#stateSelect').attr('disabled', 'disabled');
            }
            if(($('#totalIt').val() > 0) && ($('#totalFac').val() > 0)){
                process();
            }
        }
        if ($($this).prop('id') == "totalIt"){
            //alert("Total IT Selector Change");
            if(($('#totalIt').val() > 0) && ($('#totalFac').val() > 0)){
                process();
            }
        }
        if ($($this).prop('id') == "totalFac"){
            //alert("Total Facility Selector Change");
            if(($('#totalIt').val() > 0) && ($('#totalFac').val() > 0)){
                process();
            }
        }
        if ($($this).prop('id') == "kwCost"){
            //alert("kW Cost Selector Change");
            if(($('#totalIt').val() > 0) && ($('#totalFac').val() > 0)){
                process();
            }
        }
    });
})();