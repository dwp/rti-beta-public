(function() {
  'use strict';

  var getChecked = function (inputGroup) {
    for (var i = 0; i < inputGroup.length; i++) {
      if (inputGroup[i].checked) {
        var inputValue = inputGroup[i].value;
      }
    }
    return inputValue;
  }

  var ninoValidation = function (ninoInput) {
    // http://www.c-sharpcorner.com/uploadfile/aa04e6/collection-of-regular-expression/
    // ^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-DFM]{0,1}$
    // phil g - '^(?!BG|GB|NK|KN|TN|NT|ZZ)[ABCEGHJ-PRSTW-Z][ABCEGHJ-NPRSTW-Z]\d{6}[A-D]$'
    var ninoRegex   = new RegExp('^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{0,1}$', 'ig'),
        ninoEntered = ninoInput.value;

        if (! ninoEntered.match(ninoRegex)) {
          errorMsg('add',ninoInput,'Enter a National Insurance number in the correct format');
          return false;
        } else {
          errorMsg('remove',ninoInput,'');
          return true;
        }
  };

  var errorMsg = function (action,input,msgText) {
    var msgBox   = document.createElement('div'),
        msgText  = document.createTextNode(msgText),
        ninoForm = document.querySelector('#search-form-group');

    if (action === 'add') {
      input.className += ' invalid';
      input.parentNode.className += ' invalid';

      if (!document.querySelector('.validation-message')) {
        msgBox.className += ' validation-message';
        msgBox.appendChild(msgText);
        ninoForm.insertBefore(msgBox,ninoForm.lastChild.previousSibling);
      }
    }
    else if (document.querySelector('.validation-message')){
      input.className = 'form-control';
      input.parentNode.className = 'validation-wrapper';
      ninoForm.removeChild(document.querySelector('.validation-message'));
    }
  };

  var prePopulateInputs = function () {
    if (sessionStorage.nino) {
      document.querySelector('#verify').className = 'show';
      document.querySelector('#input-nino').value = sessionStorage.nino;
      document.querySelector('#radio-' + sessionStorage.duration + '-months').checked = true;
    }
  }

  var atLeastOneChecked = function (inputs) {
    var atLeastOneChecked =  false;
    for (var i=0; i<inputs.length; i++) {
      if (inputs[i].checked) {
        atLeastOneChecked = true;
      }
    }
    return atLeastOneChecked;
  }

  var isDobValid = function () {
    var day     = document.querySelector('#dob-day').value,
        month   = document.querySelector('#dob-month').value,
        year    = document.querySelector('#dob-year-yyyy').value,
        m       = parseInt(month),
        d       = parseInt(day),
        y       = parseInt(year),
        date    = new Date(y,m-1,d),
        isValid = false;

    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
      isValid = true;
    }
    return isValid;
  }

  var bindEvents = function () {
    var searchForm      = document.querySelector('#form-nino'),
        verifyForm      = document.querySelector('#form-verify'),
        setInterestForm = document.querySelector('#form-set-interest'),
        ninoInput       = document.querySelector('#input-nino'),
        radioGroup      = document.getElementsByName('radioGroup'),
        ninoSearchBtn   = document.querySelector('#submit-nino');

    searchForm.addEventListener('submit', function(e) {
      if (ninoValidation(ninoInput) === false) {
        verify.className = 'hide';
        setInterest.className = 'hide';
      } else {
        if (ninoInput.value.toLowerCase() === 'ab123456c') {
          verify.className = 'show';
          setInterest.className = 'hide';
        } else {
          setInterest.className ='show';
          verify.className = 'hide';
        }

      }
      e.preventDefault();
    })

    verifyForm.addEventListener('submit', function (e) {
      var nino = ninoInput.value.toLowerCase();
      sessionStorage.nino = ninoInput.value;
      sessionStorage.setItem("duration", getChecked(radioGroup));

      if(ninoValidation(ninoInput) === false) {
        e.preventDefault();
      } else {
        var inputs = document.getElementsByName('radioGroup');
        for (var i=0; i<inputs.length; i++) {
            if (inputs[i].checked) {
              var duration = inputs[i].value;
            }
          }
          verifyForm.action = './data_' + duration + '.html';
      }
    });

    setInterestForm.addEventListener('submit', function (e) {
      var formElements = {
            firstName  : document.querySelector('#first-name').value,
            surname    : document.querySelector('#last-name').value,
            nino       : document.querySelector('#confirm-nino').value,
            dob        : isDobValid(),
            gender     : atLeastOneChecked(document.getElementsByName('gender'))
          },
          submitForm = false;


      for (var key in formElements) {
        if(formElements[key] === false || formElements[key] === '') {
         console.log(key + " -> " + formElements[key]);
        }
      }
      e.preventDefault();
    })

  };

  return {
      bindEvents        : bindEvents(),
      prePopulateInputs : prePopulateInputs()
  };

})();
