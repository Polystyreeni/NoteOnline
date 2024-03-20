export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email) => {
    if (!validEmailRegex.test(email))
        return false;
    return true;
}

export const isValidPassword = (password) => {
    // TODO: For testing purposes only, no rules are enforced!!!
    return true;
}