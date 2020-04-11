var xlabel = [];
var ylabel = [];
var indianstate = [];




var xlabel = ['Total cases', 'Active cases', 'Total deaths', 'Total recovered'];
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: xlabel ,
        datasets: [{
            label: 'Country',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: ylabel
        }]
    },

    // Configuration options go here
    options: {}
});

$(document).ready(function(){
    $('#countryname').on('change', function(e){
        e.preventDefault();
        var country = $('#country').val();
        var ylabel = [];

        // for(var i = 2; i >= 1; i++){
        //     date.push(ymd(i));

        // }


        //country data
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=" +country,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "fce61b9f8amshf1817269f8a2a63p1d2382jsn44ad90697b6d"
            }
        }


        $.ajax(settings).done(function (response) {
            var obj = JSON.parse(response);
            ylabel = [];
            $('.country-details').css('display', 'inline')
            $('#con-name').append(obj.latest_stat_by_country[0].country_name);
            $('#total-cases').append(obj.latest_stat_by_country[0].total_cases);
            $('#active-cases').append(obj.latest_stat_by_country[0].active_cases);
            $('#total-deaths').append(obj.latest_stat_by_country[0].total_deaths);
            $('#total-recover').append(obj.latest_stat_by_country[0].total_recovered);
            ylabel.push(parseInt(removeCommas(obj.latest_stat_by_country[0].total_cases)));
            ylabel.push(parseInt(removeCommas(obj.latest_stat_by_country[0].active_cases)));
            ylabel.push(parseInt(removeCommas(obj.latest_stat_by_country[0].total_deaths)));
            ylabel.push(parseInt(removeCommas(obj.latest_stat_by_country[0].total_recovered)));
            chart.data.datasets[0].label = obj.latest_stat_by_country[0].country_name;
            chart.data.datasets[0].data = ylabel;
            chart.update();
        });
            $('#countryid').empty();
            $('#con-name').empty();
            $('#total-cases').empty();
            $('#active-cases').empty();
            $('#total-deaths').empty();
            $('#total-recover').empty();

    });

    //world data
    var settings2 = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "fce61b9f8amshf1817269f8a2a63p1d2382jsn44ad90697b6d"
        }
    }

    $.ajax(settings2).done(function (response) {
        var obj2 = JSON.parse(response);
        $('#world-total-cases').append("Total cases <br> " + obj2.total_cases);
        $('#world-total-deaths').append("Total deaths<br> " + obj2.total_deaths);
        $('#world-total-recover').append("Total recovered<br> " + obj2.total_recovered);
        $('#date').append("Last updated: " +obj2.statistic_taken_at);



    });

    //Indian states data

    var settings3 = {
        "async": true,
        "crossDomain": true,
        "url": "https://corona-virus-world-and-india-data.p.rapidapi.com/api_india",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
            "x-rapidapi-key": "fce61b9f8amshf1817269f8a2a63p1d2382jsn44ad90697b6d"
        }
    }

    $.ajax(settings3).done(function (response) {  
        
        for(p in response.state_wise){
            indianstatedistrict = [];
            for(q in response.state_wise[p].district){
                indianstatedistrict.push({
                    name: q,
                    confirmed:response.state_wise[p].district[q].confirmed
                });
            }

            indianstate.push({
                name: response.state_wise[p].state,
                active: response.state_wise[p].active ,
                confirmed:response.state_wise[p].confirmed,
                deaths:response.state_wise[p].deaths,
                recovered:response.state_wise[p].recovered,
                district: indianstatedistrict
            });
 
        }
        i=1;
        content = '';

          for (let i = 0; i < indianstate.length -1; i++) { 
            if(i > 8){
                print = 'display: none;';
            }else{
                print = '';
            }
            content+='<table class="table state-table tid'+i+'" id="sid'+i+'" style="'+print+'"><tbody>';
            content += '<tr onclick="toggleDistrict('+"'sid"+i+"'"+')" ><td class = "caret"  style="cursor:pointer; width:32px;"><i class="fa fa-caret-right" aria-hidden="true"></i><i class="fa fa-caret-down" aria-hidden="true" style="display:none;"></i></td><td style="background-color:#FFEFD5; width:132px;">'+indianstate[i].name+'</td>'+'<td style="background-color:rgba(0,123,255,.0627451); width:98px">'+indianstate[i].active+'</td>'+'<td style="background-color:rgba(255,7,58,.12549);width:143px">'+indianstate[i].confirmed+'</td>'+'<td style="background-color:#dddddd;width:105px;">'+indianstate[i].deaths+'</td>'+'<td style="background-color:rgba(40,167,69,.12549);width:147px;">'+indianstate[i].recovered+'</td></tr>';                    
            content+='</tbody></table>';
            
            content+='<table class="table district-table sid'+i+'" style="display:none;"> <thead><th  style="width:32px;"></th><th  style="width:132px; background-color: #7c710c; color: #fff;">District</th><th style="width:143px; background-color: crimson; color: #fff;">Confirmed</th> <th colspan="3"></th></thead> <tbody>';
            for (let j = 0; j < indianstate[i].district.length; j++) {
                content += '<tr ><td style="width:32px;"></td><td style="background-color:#FFEFD5;width:132px;">'+indianstate[i].district[j].name+'</td><td style="background-color:rgba(255,7,58,.12549); width:143px;">'+indianstate[i].district[j].confirmed+'</td><td colspan="3"></td>';                    
              }
            content+='</tbody></table>';
          }
          
          
          $('#tbody').append(content);    

    }); 
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "fce61b9f8amshf1817269f8a2a63p1d2382jsn44ad90697b6d"
        }
    }
    
    $.ajax(settings).done(function (response) {
        var obj = JSON.parse(response);
        var list = obj.affected_countries;
        list.sort();
        countrylist = ''
        for(let i = 1; i < list.length; i++){
            countrylist+='<option value="'+ list[i] +'">'+list[i]+'</option>'
        }

        $('#country').append(countrylist)

    });

    //indian data datewise

    // var settings4 = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://corona-virus-world-and-india-data.p.rapidapi.com/api_india_timeline",
    //     "method": "GET",
    //     "headers": {
    //         "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
    //         "x-rapidapi-key": "fce61b9f8amshf1817269f8a2a63p1d2382jsn44ad90697b6d"
    //     }
    // }
    
    // $.ajax(settings4).done(function (response) {
    //     console.log(response);
    // });

  });

function ymd(i) {
    var date = new Date();

    var d = new Date(date),
        fromdate = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() - i),
        year = d.getFullYear();

    if (fromdate.length < 2)
        fromdate = '0' + fromdate;
    if (day.length < 2)
        day = '0' + day;

    return [year, fromdate, day].join('-');
  }

  function removeCommas(str) {
      return(str.replace(/,/g,''));
  }


  function toggleDistrict(sid){
    $('.'+sid).toggle();
    $('.fa-caret-right').toggle();
    $('.fa-caret-down').toggle();
};