
export class Utils {

  /**
   * Gets value
   * if undefined or null it returns a default
   *
   * @param value
   * @param defaultsTo
   * @return any
   */
  static getValue(value: any, defaultsTo: any): any {
    if (this.isDefined(value) && value !== null) {
      return value;
    } else {
      return defaultsTo;
    }
  }

  /**
   * Gets value,
   * if undefined, null or error it returns a default value.
   * Use this function to get Object values safely.
   *
   * ie: const myVar = Utils.getValueSafe(() => someObject.someProp.SomeChildProp, defaultsTo);
   *
   * @param value
   * @param defaultsTo
   * @returns any
   */
  static getValueSafe(value: any, defaultsTo: any): any {
    let safeValue: any;

    try {
      safeValue = value();
    } catch (e) {
      return defaultsTo;
    }

    if (this.isDefined(safeValue) && safeValue !== null) {
      return safeValue;
    } else {
      return defaultsTo;
    }
  }

  /**
   * Checks if value is an Array
   *
   * @param value
   * @return boolean
   */
  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Checks if a value is defined
   *
   * @param value
   * @return boolean
   */
  static isDefined(value: any): boolean {
    return (typeof (value) !== 'undefined');
  }

  /**
   * Checks if a value is empty
   *
   * @param value
   * @return boolean
   */
  static isEmpty(value: any): boolean {
    if (
      !this.isDefined(value)
      || value === ''
      || value === false
      || value === 0
      || this.isEmptyObject(value)
      || value === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if value is an empty Array
   *
   * @param value
   * @return boolean
   */
  static isEmptyArray(value): boolean {
    if (value === undefined) {
      return true;
    }
    if (!Array.isArray(value)) {
      return true;
    }

    return value.length === 0;
  }

  /**
   * Checks if obj is an empty Object
   *
   * @param obj
   * @return boolean
   */
  static isEmptyObject(obj: Object): boolean {
    if(typeof(obj)!='object')
      return false

    let name;

    for (name in obj) {
      return false;
    }

    return true;
  }

  /**
   * Checks if value is an empty string
   *
   * @param value
   * @return boolean
   */
  static isEmptyString(value: any): boolean {
    if (value === undefined) {
      return true;
    }

    if (typeof value !== "string") {
      return false;
    }

    return value === "";
  }

  /**
   * Checks if value is an integer
   *
   * @param value
   * @return boolean
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(value);
  }

  /**
   * Checks if value is an Object
   *
   * @param value
   * @return boolean
   */
  static isObject(value: any): boolean {
    return (Object.prototype.toString.call(value) === '[object Object]');
  }

  /**
   * Checks if value is a string
   *
   * @param value
   * @return boolean
   */
  static isString(value: any): boolean {
    return (typeof value === "string");
  }

  /**
   * Checks if value is a boolean
   *
   * @param value
   * @return boolean
   */
  static isBoolean(value: any): boolean {
    return (typeof value === "boolean");
  }


  /**
   * Will print the console error always.
   * Please use this function wherever possible.
   *
   * @param params an X number of params
   */
  static error(...params: any[]) {
    if (window.console) {
      console.error( Array.prototype.slice.call(params) );
    }
  }

  /**
   * Converts seconds to mm:ss => 00:00
   *
   * @param sec - number of seconds
   * @return string - String of format mm:ss
   */
  static secondsToMS(sec: any): string {
    sec = Number(sec);
    const m = Math.floor(sec % 3600 / 60);
    const s = Math.floor(sec % 3600 % 60);

    let hms = (m == 0) ? "00:" : ((m > 0 && m < 10) ? `0${m}:` : `${m}:`);
    hms += (s == 0) ? "00" : ((s > 0 && s < 10) ? `0${s}` : s);

    return hms;
  }

  /**
   * Converts seconds to hh:mm:ss => 00:00:00
   *
   * @param sec - number of seconds
   * @return string - String of format hh:mm:ss
   */
  static secondsToHMS(sec: any): string {
    sec = Number(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor(sec % 3600 / 60);
    const s = Math.floor(sec % 3600 % 60);

    let hms = (h == 0) ? "00:" : ((h > 0 && h < 10) ? `0${h}:` : `${h}:`);
    hms += (m == 0) ? "00:" : ((m > 0 && m < 10) ? `0${m}:` : `${m}:`);
    hms += (s == 0) ? "00" : ((s > 0 && s < 10) ? `0${s}` : s);

    return hms;
  }

  /**
   * Strips a string by replacing any non alphanumeric
   * characters with underscores
   *
   * @param value
   * @return string
   */
  static stripString(value: string): string {
    return value.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  /**
   * Coverts value to boolean
   *
   * @param value
   * @return boolean
   */
  static toBool(value: any): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    if (value === "true" || value === "1" || value === 1) {
      return true;
    }

    return false;
  }

  /**
   * Converts value to a string
   *
   * @param value
   * @return string
   */
  static toString(value: any): string {
    if (typeof value === "string") {
      return value;
    }

    if (value === undefined) {
      return "";
    }

    return String(value);
  }

  /**
   * Converts URI params to an Object
   *
   * @param uri - URI string with format: param1=value1&param2=value2...
   * @return {Object}
   */
  static uriParamsToObject(uri: string): Object {
    let object: Object;

    let params = decodeURI(uri)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"');

    if (Utils.isEmptyString(params)) {
      params= '{}';
    } else {
      params= '{"' + params+ '"}';
    }

    try {
      object = JSON.parse(params);
    } catch (e) {
      object = {};
    }

    return object;
  }

  /**
   * Checks if a given URL is valid
   *
   * @param ur - URI string with format: param1=value1&param2=value2...
   * @return boolean
   */
  static validURL(url: string): boolean {

    let pattern =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if(!pattern.test(url))
      return false;

    return true;
  }


}
