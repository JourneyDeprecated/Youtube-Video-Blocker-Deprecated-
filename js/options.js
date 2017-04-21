translateHTMLfile();
document.getElementById('button-help').addEventListener('click', function(e) {
  document.getElementById('button-help').classList.add('active');
  document.getElementById('button-settings').classList.remove('active');
  document.body.querySelector('.main-container-settings').style.display = 'none';
  document.body.querySelector('.main-container-help').style.display = 'block';
});
document.getElementById('button-settings').addEventListener('click', function(e) {
  document.getElementById('button-settings').classList.add('active');
  document.getElementById('button-help').classList.remove('active');
  document.body.querySelector('.main-container-help').style.display = 'none';
  document.body.querySelector('.main-container-settings').style.display = 'block';
});
getSettings(function(storage) {
  if (storage.enableicon === true) {
    document.getElementById('change-icon-visibility').setAttribute('checked', 'true');
  }
  if (storage.redirect === true) {
    document.getElementById('change-redirect').setAttribute('checked', 'true');
  }
  if (storage.password !== '') {
    initLogin(storage.password);
  } else {
    initSettings();
  }
});

function initLogin(password) {
  document.body.querySelector('.container-loading').style.display = "none";
  document.body.querySelector('.container-protected').style.display = "block";
  document.body.querySelector('.container-protected input[type="password"]').focus();
  document.body.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (e.target[0].value === password) {
      initSettings();
    } else {
      e.target[0].value = "";
      document.body.querySelector('.login-error').style.display = "block";
    }
  });
}

function initSettings() {
  document.body.querySelector('.container-loading').style.display = "none";
  document.body.querySelector('.container-protected').style.display = "none";
  document.body.querySelector('.container-settings').style.display = "block";
  document.getElementById('change-icon-visibility').addEventListener('change', function(e) {
    var enableicon;
    if (document.body.querySelector('#change-icon-visibility:checked') === null)
      enableicon = false;
    else
      enableicon = true;
    setSetting('enableicon', enableicon);
  });
  document.getElementById('change-redirect').addEventListener('change', function(e) {
    var redirect;
    if (document.body.querySelector('#change-redirect:checked') === null)
      redirect = false;
    else
      redirect = true;
    setSetting('redirect', redirect);
  });
  document.getElementById('change-password').addEventListener('submit', function(e) {
    e.preventDefault();
    getSettings(function(storage) {
      var settings = storage;
      var oldpass = document.body.querySelector('input[name="oldpassword"]').value,
        newpass1 = document.body.querySelector('input[name="newpassword1"]').value,
        newpass2 = document.body.querySelector('input[name="newpassword2"]').value;
      if (oldpass === settings.password) {
        if (newpass1 === newpass2) {
          setSetting('password', newpass1);
          document.body.querySelector('input[name="oldpassword"]').value = "";
          document.body.querySelector('input[name="newpassword1"]').value = "";
          document.body.querySelector('input[name="newpassword2"]').value = "";
          document.getElementById('password-error').textContent = chrome.i18n.getMessage('passwordChanged');
        } else {
          document.getElementById('password-error').textContent = chrome.i18n.getMessage('wrongMatchingPasswords');
        }
      } else {
        document.getElementById('password-error').textContent = chrome.i18n.getMessage('wrongCurrentPassword');
      }
    });
  });
}
//# sourceMappingURL=options.js.map