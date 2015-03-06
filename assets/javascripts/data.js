(function () {
  'use strict';

  var insertData = function (data) {
    var incomeHtml = '';

    document.querySelector('.heading-large').innerHTML = "Income for " + data.name;
    document.querySelector('.person-nino').innerHTML   = "National Insurance Number: " + data.nino;

    for (var i = 0; i < data.earnings.length; i++) {


      var earnings   = data.earnings[i],
          company    = earnings.organisation,
          fromDate   = earnings.endDate,
          toDate     = earnings.startDate,
          pension    = (earnings.pension) ? 'Pension' : 'Employment',
          financials = earnings.payments,
          tableData  = '';

      tableData += '<details><summary class="summary">View payments</summary><table><thead><tr>'
               + '<th scope="col">Date</th>'
               + '<th class="numeric" scope="col">Gross</th>'
               + '<th class="numeric" scope="col">Deduction</th>'
               + '<th class="numeric" scope="col">Net</th>'
               + '</tr></thead><tbody><tr>';

      for (var f = 0; f < financials.length; f++) {
        var deduction = (financials[f].deduction > 0) ? '<a href="#" data-date="'
                        + financials[f].datePaid +'" data-deduction="'
                        + financials[f].deduction + '" class="deductions">'
                        + financials[f].deduction + '</a>' : '';

        tableData += '<tr><td>'
                  + financials[f].datePaid + '</td><td class="numeric">'
                  + financials[f].gross + '</td><td class="numeric">'
                  + deduction + '</td><td class="numeric">'
                  + financials[f].net + '</td></tr>'
      }

      tableData +='</tbody></table></details>';

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
    var nino        = sessionStorage.getItem('nino').toLowerCase(),
        duration    = sessionStorage.getItem('duration').toLowerCase(),
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
