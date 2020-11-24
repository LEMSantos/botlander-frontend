import { LocalStorage, Cookies } from 'quasar';
import Vue from 'vue';

const getSecurityData = () => {
    const jwtSecurityKey = Cookies.get('jwtSecurityKey');
    const secutityKeys = LocalStorage.getItem('secutityKeys');

    let decryptedData = Vue.CryptoJS.AES.decrypt(
        secutityKeys,
        jwtSecurityKey,
    ).toString(Vue.CryptoJS.enc.Utf8);

    decryptedData = JSON.parse(decryptedData);

    return decryptedData;
};

const setSecurityData = (payload) => {
    let jwtSecurityKey = '';

    if (Cookies.has('jwtSecurityKey')) {
        jwtSecurityKey = Cookies.get('jwtSecurityKey');
    } else {
        jwtSecurityKey = Math.random().toString(16).substring(2, 32);
        Cookies.set('jwtSecurityKey', jwtSecurityKey);
    }

    const securityKeys = JSON.stringify(payload);

    const encrypted = Vue.CryptoJS.AES.encrypt(
        securityKeys,
        jwtSecurityKey,
    ).toString();

    LocalStorage.set('secutityKeys', encrypted);
};

const wordWrap = (str, maxWidth) => {
    const newLineStr = '\n';
    let res = '';

    while (str.length > maxWidth) {
        let found = false;
        // Inserts new line at first whitespace of the line
        for (let i = maxWidth - 1; i >= 0; i -= 1) {
            if (str.charAt(i) === ' ') {
                res += [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }

        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }
    }

    return res + str;
};

const truncateText = (str, truncatePoint) => {
    if (str.length > truncatePoint) {
        return `${str.slice(0, truncatePoint)}...`;
    }

    return str;
};

export default {
    getSecurityData,
    setSecurityData,
    wordWrap,
    truncateText,
};
