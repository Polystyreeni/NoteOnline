import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    // TODO: For testing purposes only, no rules are enforced!!!
    return true;
}

export const checkPasswordStrength = (password) => {
    return zxcvbn(password);
}