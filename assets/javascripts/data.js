(function () {
  'use strict';

  var insertData = function (data) {
    var incomeHtml = '';

    for (var i = 0; i < data.length; i++) {


      var person     = data[i],
          name       = person.name,
          nino       = person.nino,
          company    = person.companyName,
          fromDate   = person.fromDate,
          toDate     = person.toDate,
          pension    = (person.pension) ? 'Pension' : 'Employment',
          financials = person.financials,
          tableData  = '';

      document.querySelector('.heading-large').innerHTML = "Income for " + person.name;
      document.querySelector('.person-nino').innerHTML = "National Insurance Number: " + person.nino;

      tableData += '<table id="test"><thead><tr>'
               + '<th scope="col">Date</th>'
               + '<th class="numeric" scope="col">Gross</th>'
               + '<th class="numeric" scope="col">Deduction</th>'
               + '<th class="numeric" scope="col">Net</th>'
               + '</tr></thead><tbody><tr>';

      for (var f = 0; f < financials.length; f++) {
        var deductions = (financials[f].Deductions) ? '<a href="#" data-date="'
                        + financials[f].DatePaid +'" data-deduction="'
                        + financials[f].Deductions + '" class="deductions">'
                        + financials[f].Deductions + '</a>' : '';

        tableData += '<tr><td>'
                  + financials[f].DatePaid + '</td><td class="numeric">'
                  + financials[f].Gross + '</td><td class="numeric">'
                  + deductions + '</td><td class="numeric">'
                  + financials[f].Net + '</td></tr>'
      }

      tableData +='</tbody></table>';

      incomeHtml += '<div><h3 class="heading-medium">'
                + company + ' ('
                + pension +') </h3><p>'
                + fromDate + ' - '
                + toDate +'</p></div>'
                + tableData;
  }

  document.querySelector('.income-details').innerHTML = incomeHtml;

  };

  var getJson = function () {
    var nino        = sessionStorage.getItem('nino'),
        duration    = sessionStorage.getItem('duration'),
        jsonRequest = new XMLHttpRequest(),
        printButton = document.querySelectorAll('.print'),
        url         = 'assets/javascripts/json/data-' + nino + '-' + duration + '.json';

    jsonRequest.onreadystatechange = function () {
        if (jsonRequest.status == 404) {
          window.location.href = './noData.html';
        } else if (jsonRequest.readyState == 4 && jsonRequest.status == 200) {
        insertData(JSON.parse(jsonRequest.responseText));
      }
    }

    jsonRequest.open("POST", url, true);
    jsonRequest.send();
  };

  var bindEvents = function () {
    var printButton = document.querySelectorAll('.print'),
        newSearch   = document.querySelector('.new-search');

    for (var i = 0; i < printButton.length; i++) {
      printButton[i].addEventListener('click', function (e) {
        window.print()
      });
    };

    newSearch.addEventListener('click', function (e) {
      sessionStorage.clear();
    });

    //modals
    $('.income-details').on('click','.deductions',function () {
      var date      = $(this).data('date'),
          deduction = $(this).data('deduction'),
          modalText = '<p class="font-xsmall">Date Paid: ' + date + ' Tax: ' + deduction + '</p>';

      $('.modal-body').empty().append(modalText);
      $('#deductions-modal').modal('show');
      return false;
    });


  };

  return {
    getJson    : getJson(),
    bindEvents : bindEvents()
  };
})();
