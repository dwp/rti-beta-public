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
          errorMsg('add',ninoInput);
          return false;
        } else {
          errorMsg('remove',ninoInput);
          return true;
        }
  };

  var errorMsg = function (action,input,formGroupCompound) {
    var errorMsg = '<span class="error-message" aria-hidden="true">' + input.getAttribute('data-error') + '</span> ';
    if (formGroupCompound) {
      var formGroup  = document.querySelector('.form-group-' + formGroupCompound),
          errorMsgEl = document.querySelector('.form-label-' + formGroupCompound);
    } else {
      var formGroup  = input.parentNode,
          errorMsgEl = input.previousElementSibling;
    }

    if (action === 'remove') {
      formGroup.className = formGroup.className.replace('error','');
      errorMsgEl.innerHTML = errorMsgEl.innerHTML.replace(errorMsg,'');
    } else if (! formGroup.className.match('error')) {
      formGroup.className += ' error';
      errorMsgEl.innerHTML = errorMsg + errorMsgEl.innerHTML;
    }
  }

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
      var submitForm  = true,
          firstName   = document.querySelector('#first-name'),
          lastName    = document.querySelector('#last-name'),
          nino        = document.querySelector('#input-nino'),
          confirmNino = document.querySelector('#confirm-nino'),
          dobDay      = document.querySelector('#dob-day'),
          gender      = document.getElementsByName('gender'),
          genderM     = document.querySelector('#radio-gender-m');

          if (firstName.value === '') {
            errorMsg('add',firstName);
            submitForm = false;
          } else {
            errorMsg('remove',firstName);
          }

          if(lastName.value === '') {
            errorMsg('add',lastName);
            submitForm = false;
          } else {
            errorMsg('remove',lastName);
          }

          if (confirmNino.value !== nino.value) {
            errorMsg('add',confirmNino)
            submitForm = false;
          } else {
            errorMsg('remove',confirmNino)
          }

          if (! isDobValid()) {
            errorMsg('add',dobDay,'dob')
            submitForm = false;
          } else {
            errorMsg('remove',dobDay,'dob')
          }

          if (! atLeastOneChecked(gender)) {
            errorMsg('add',genderM,'gender')
            submitForm = false;
          } else {
            errorMsg('remove',genderM,'gender')
          }

          if(! submitForm) {
            e.preventDefault();
          }
    })

  };

  return {
      bindEvents        : bindEvents(),
      prePopulateInputs : prePopulateInputs()
  };

})();
