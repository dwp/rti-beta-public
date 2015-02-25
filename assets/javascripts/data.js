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
          tableData  = '',
          today      = new Date(),
          dd         = today.getDate(),
          mm         = today.getMonth()+1,
          yyyy       = today.getFullYear(),
          setFromDate = today.setDate(today.getDate() -90),
          newfromDate = new Date(setFromDate),
          fromMonth  = newfromDate.getMonth()+1,
          todaysDate = dd + '/' + mm + '/' + yyyy,
          fromDate   = dd + '/' + fromMonth + '/' + yyyy;

      document.querySelector('.person-name').innerHTML = person.name;
      document.querySelector('.person-nino').innerHTML = person.nino;

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
                + todaysDate +'</p></div>'
                + tableData;
  }

  document.querySelector('.income-details').innerHTML = incomeHtml;

  };

  var getJson = function () {
    var nino        = sessionStorage.getItem('nino'),
        duration    = sessionStorage.getItem('duration'),
        jsonRequest = new XMLHttpRequest(),
        url         = 'assets/javascripts/json/data-' + nino + '-' + duration + '.json';

    jsonRequest.onreadystatechange = function () {
      console.log(jsonRequest.readyState)
        console.log(jsonRequest.status)
        if (jsonRequest.status == 404) {
          document.querySelector('.income-details').innerHTML = 'no data';
        } else if (jsonRequest.readyState == 4 && jsonRequest.status == 200) {
        insertData(JSON.parse(jsonRequest.responseText));
      }
    }

    jsonRequest.open("GET", url, true);
    jsonRequest.send();
  };

  var bindEvents = function () {
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
