export const getToken = () => {
    // get all cookies from the browser
    const cookies = document.cookie.split('; ');
    // find the cookie that starts with '_auth='
    const cookie = cookies.find((cookie) => cookie.startsWith('_auth='));
    // if there is no cookie, return null
    if (!cookie) {
        return null;
    }

    // get the token from the cookie
    const token = cookie.split('=')[1];
    return token;
}