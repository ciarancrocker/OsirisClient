import { API_URL } from '../app_config';
import { getAllParams } from './parseUrl';

function openAuthenticationPopup() {
  return window.open(`${API_URL}/api/auth/login`, 'Osiris2 Authentication', 'scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no');
}

function listenForAuthentication(popup, resolve, reject) {
  if(!resolve) {
    console.log('Setting up authentication');
    return new Promise((res, rej) => {
      listenForAuthentication(popup, res, rej);
    });
  } else {
    let creds;
    try {
      creds = getAllParams(popup.location);
    } catch (err) { }
    if(creds && creds.jwt) {
      console.log('We did it reddit!');
      popup.close();
      resolve(creds.jwt);
    } else if (popup.closed) {
      reject({ err: 'Authentication cancelled.' });
    } else {
      setTimeout(() => {
        listenForAuthentication(popup, resolve, reject);
      }, 0);
    }
  }
}

export { openAuthenticationPopup, listenForAuthentication }
