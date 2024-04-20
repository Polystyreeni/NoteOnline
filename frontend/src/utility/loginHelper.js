import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// export const validEmailRegex = /^[a-zA-Z0-9_+&*-] + (?:\\.[a-zA-Z0-9_+&*-] + )*@(?:[a-zA-Z0-9-]+\\.) + [a-zA-Z]{2, 7}/;

const lowerCaseRegex = /^(?=.*[a-z])/; 
const upperCaseRegex = /^(?=.*[A-Z])/; 
const digitRegex = /^(?=.*\d)/;
const nonWordRegex = /^(?=.*\W)/;


const passOptions = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary
    },
}
zxcvbnOptions.setOptions(passOptions);

export const isValidEmail = (email) => {
    if (!validEmailRegex.test(email))
        return false;
    return true;
}

export const isValidPassword = (password) => {
    const minLength = 10;
    const maxLength = 64;

    if (password.length < minLength || password.length > maxLength) {
        return ({
            success: false,
            message: `Must be between ${minLength}-${maxLength} characters!`
        });
    }

    if (!lowerCaseRegex.test(password)) {
        return ({
            success: false,
            message: "Must contain a lowercase letter!"
        });
    }

    if (!upperCaseRegex.test(password)) {
        return ({
            success: false,
            message: "Must contain an uppercase letter!"
        });
    }

    if (!digitRegex.test(password)) {
        return ({
            success: false,
            message: "Must contain a digit!"
        });
    }

    if (!nonWordRegex.test(password)) {
        return ({
            success: false,
            message: "Must contain a special character!"
        });
    }

    return ({
        success: true,
        message: ""
    });
}

export const checkPasswordStrength = (password) => {
    return zxcvbn(password);
}