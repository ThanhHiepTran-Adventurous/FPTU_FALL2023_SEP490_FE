class TokenService {
 
  setCookie(cookie_name, cookie_value, expires_day) {
    const d = new Date();
    d.setTime(d.getTime() + expires_day * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cookie_name}=${JSON.stringify(cookie_value)}; ${expires}`;

      /*
        Ex :   "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      */

  }

  getCookie(cookie_name) {
    const name = `${cookie_name}=`;
    const decodeCookie = decodeURIComponent(document.cookie);
    const cookie_array = decodeCookie.split(";");

    for (const cookie of cookie_array) {
      let c = cookie.trim();

      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }

    return "";
  }

  checkCookie(cookie_name) {
    const c = this.getCookie(cookie_name);
    if (!c) {
      // access the site without login
    } else {
      // redirect to login page
    }
  }

  deleteCookie(cookie_name) {
    document.cookie = `${cookie_name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  updateCookie(cookie_name, cookie_value) {
    this.setCookie(cookie_name, cookie_value, 10);
  }
} 

export default new TokenService();
