webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            __webpack_require__(233)("./" + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(377)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _markItDown = __webpack_require__(11);

var _markItDown2 = _interopRequireDefault(_markItDown);

var _cashDom = __webpack_require__(188);

var _cashDom2 = _interopRequireDefault(_cashDom);

var _markdown = __webpack_require__(196);

var _markdown2 = _interopRequireDefault(_markdown);

var _clipboard = __webpack_require__(190);

var _clipboard2 = _interopRequireDefault(_clipboard);

var _lodash = __webpack_require__(231);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Markdown = {
  name: 'Markdown',
  props: {
    src: {
      type: String,
      default: ''
    },
    opts: {}
  },

  created: function created() {
    var opts = this.opts;


    this.md = new _markItDown2.default(_extends({
      hasHeadHash: false
    }, opts));
  },
  mounted: function mounted() {
    var md = this.md,
        $el = this.$el,
        $refs = this.$refs;

    md.mountToTextArea($refs.textarea);

    var cpSvg = '<svg width="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1528"><path d="M917.980361 1009.145687H434.961416c-37.918611 0-68.768223-30.845519-68.768223-68.75799v-60.047608H112.948445c-37.918611 0-68.768223-30.844495-68.768223-68.756966V135.336338c0-37.913495 30.848589-68.75799 68.768223-68.75799h547.421744c37.919634 0 68.768223 30.844495 68.768223 68.75799v154.199964a111.745037 111.745037 0 0 1 12.106736 10.44591l205.293643 205.304899c22.920012 22.907733 40.20877 64.60132 40.20877 96.978729v338.12288c0 37.912471-30.848589 68.756967-68.7672 68.756967zM406.036643 839.407841h1.088798v100.979856c0 15.343453 12.487406 27.825742 27.835975 27.825742h483.018945c15.34857 0 27.834952-12.482289 27.834952-27.825742V622.73094H765.226329c-37.918611 0-68.7672-30.845519-68.7672-68.75799V346.701257H406.036643v492.706584zM112.948445 107.510596c-15.34857 0-27.835975 12.482289-27.835975 27.825742v676.246785c0 15.34243 12.487406 27.824719 27.835975 27.824718h252.15595V305.769009h323.101769V135.336338c0-15.343453-12.487406-27.825742-27.835975-27.825742H112.948445zM737.391377 354.015849v199.957101c0 15.343453 12.486382 27.825742 27.834952 27.825742h177.615256c-4.679579-17.781992-14.360056-36.68962-25.241894-47.564295L737.391377 354.015849zM563.767014 236.31517H209.552643v-40.932248h354.213348v40.932248z" fill="#3E3A39" p-id="1529"></path></svg> ';
    (0, _cashDom2.default)($el).find('.mark-it-down pre').each(function (pre) {
      var copy = document.createElement('div');
      copy.appendChild(pre.cloneNode(true));
      copy.classList.add(_markdown2.default.cp);

      (0, _cashDom2.default)(copy).append('<div class="' + _markdown2.default.cpBoard + '" data-clipboard-text="' + (0, _lodash2.default)(pre.textContent) + '"> ' + cpSvg + '</div> ');
      pre.parentNode.replaceChild(copy, pre);
    });

    (0, _cashDom2.default)($el).find('.mark-it-down .' + _markdown2.default.cp).on('mouseleave', function (ev) {
      var currentTarget = ev.currentTarget;

      currentTarget.querySelector('.' + _markdown2.default.cpBoard).innerHTML = cpSvg;
    });

    new _clipboard2.default('.' + _markdown2.default.cpBoard).on('success', function (ev) {
      var trigger = ev.trigger;

      trigger.innerHTML = 'Copied';
    });
  },
  render: function render(h) {
    var src = this.src;


    return h(
      'div',
      {
        attrs: { 'data-markdown': true }
      },
      [h(
        'textarea',
        { ref: 'textarea', attrs: { hidden: true }
        },
        [src]
      )]
    );
  }
};

module.exports = Markdown;

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

__webpack_require__(9);

var _icon = __webpack_require__(214);

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var direction = {
  'arrow-left': 'arrow-down',
  'arrow-right': 'arrow-down'
};

var Icon = {
  name: 'Icon',

  props: {
    typ: {
      default: '',
      required: true,
      type: String
    },

    size: {
      type: [String, Number],
      default: '20x20'
    }
  },

  computed: {
    cSize: function cSize() {
      var size = this.size;

      var width = void 0,
          height = void 0;

      if (size.includes && size.includes('x')) {
        ;
        var _size$split = size.split('x');

        var _size$split2 = _slicedToArray(_size$split, 2);

        width = _size$split2[0];
        height = _size$split2[1];
      } else {
        width = height = size;
      }

      return {
        width: width, height: height
      };
    },
    rotate: function rotate() {
      var typ = this.typ;

      return direction[typ] || typ;
    }
  },

  render: function render(h) {
    var typ = this.typ,
        cSize = this.cSize;


    return h(
      'svg',
      {
        attrs: { width: cSize.width, height: cSize.height
        },
        'class': _icon2.default[typ],
        domProps: {
          'innerHTML': '<use xlink:href="#owl-icons-' + this.rotate + '"></use>'
        }
      },
      []
    );
  }
};

module.exports = Icon;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var nestRE = /^(attrs|props|on|nativeOn|class|style|hook)$/

module.exports = function mergeJSXProps (objs) {
  return objs.reduce(function (a, b) {
    var aa, bb, key, nestedKey, temp
    for (key in b) {
      aa = a[key]
      bb = b[key]
      if (aa && nestRE.test(key)) {
        // normalize class
        if (key === 'class') {
          if (typeof aa === 'string') {
            temp = aa
            a[key] = aa = {}
            aa[temp] = true
          }
          if (typeof bb === 'string') {
            temp = bb
            b[key] = bb = {}
            bb[temp] = true
          }
        }
        if (key === 'on' || key === 'nativeOn' || key === 'hook') {
          // merge functions
          for (nestedKey in bb) {
            aa[nestedKey] = mergeFn(aa[nestedKey], bb[nestedKey])
          }
        } else if (Array.isArray(aa)) {
          a[key] = aa.concat(bb)
        } else if (Array.isArray(bb)) {
          a[key] = [aa].concat(bb)
        } else {
          for (nestedKey in bb) {
            aa[nestedKey] = bb[nestedKey]
          }
        }
      } else {
        a[key] = b[key]
      }
    }
    return a
  }, {})
}

function mergeFn (a, b) {
  return function () {
    a.apply(this, arguments)
    b.apply(this, arguments)
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _loading = __webpack_require__(219);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  props: {
    typ: {
      type: String,
      default: 'pie'
    },
    size: {
      type: [String, Number]
    },
    show: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    style: function style() {
      var width = void 0,
          height = void 0;
      var size = this.size;
      var typ = this.typ,
          show = this.show;


      var style = {
        display: show ? 'block' : 'none'
      };

      switch (typ) {
        case 'pie':
          style.borderWidth = size + 'px';
          break;

        case 'bar':
          size = size || '100x10';
          var _size$split = size.split('x');

          var _size$split2 = _slicedToArray(_size$split, 2);

          width = _size$split2[0];
          height = _size$split2[1];

          style.width = width + 'px';
          style.height = height + 'px';
          break;
      }

      return style;
    }
  },

  render: function render(h) {
    var style = this.style,
        typ = this.typ;

    var type = 'loading' + typ;
    return h(
      'div',
      { 'class': _loading2.default[type], style: style },
      []
    );
  }
};

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _flex = __webpack_require__(212);

var _flex2 = _interopRequireDefault(_flex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Flex = {
  name: 'Flex',
  props: {
    grids: {
      type: Number,
      default: 12
    },

    margin: {
      type: Number,
      default: 20
    },

    mid: {
      type: Boolean,
      default: false
    },

    split: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes: function classes() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, _flex2.default.flexMid, this.mid), _defineProperty(_ref, _flex2.default.flexSplit, this.split), _ref;
    }
  },
  render: function render(h) {
    var $slots = this.$slots,
        classes = this.classes;

    return h(
      'div',
      { 'class': [_flex2.default.flex, classes] },
      [$slots.default]
    );
  }
};

Flex.Col = {
  name: 'FlexCol',
  props: {
    offset: {
      type: [Number, String]
    },
    size: {
      type: [Number, String]
    },
    width: {
      type: [Number, String]
    },
    mid: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    style: function style() {
      var $parent = this.$parent,
          size = this.size,
          offset = this.offset;


      var styleObj = {
        marginRight: $parent.margin + 'px'
      };

      if (size === 'auto') {
        styleObj.flex = 1;
      } else {
        styleObj.width = 100 / $parent.grids * size + '%';
      }

      if (offset) {
        styleObj.marginLeft = 100 / $parent.grids * offset + '%';
      }

      return styleObj;
    },
    classes: function classes() {
      return _defineProperty({}, _flex2.default.flexMid, this.mid);
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        classes = this.classes,
        style = this.style;

    return h(
      'div',
      { style: style, 'class': classes },
      [$slots.default]
    );
  }
};

module.exports = Flex;

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _babelHelperVueJsxMergeProps = __webpack_require__(4);

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Link = {
  name: 'Link',
  functional: true,
  render: function render(h, _ref) {
    var data = _ref.data,
        children = _ref.children;

    return h(
      'router-link',
      (0, _babelHelperVueJsxMergeProps2.default)([{
        attrs: { exact: true }
      }, data]),
      [children]
    );
  }
};

module.exports = Link;

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Logo = {
  name: 'Logo',
  props: {
    size: {
      type: [Number, String],
      default: 20
    }
  },

  computed: {
    sSize: function sSize() {
      var size = this.size;

      var width = void 0,
          height = void 0;

      if (size.includes && size.includes('x')) {
        ;
        var _size$split = size.split('x');

        var _size$split2 = _slicedToArray(_size$split, 2);

        width = _size$split2[0];
        height = _size$split2[1];
      } else {
        width = height = size;
      }

      return {
        width: width, height: height
      };
    }
  },

  render: function render(h) {
    var sSize = this.sSize;

    return h(
      'svg',
      {
        attrs: { width: sSize.width, height: sSize.height, version: '1.0', xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 128.000000 128.000000', preserveAspectRatio: 'xMidYMid meet' }
      },
      [h(
        'g',
        {
          attrs: { transform: 'translate(0.000000,128.000000) scale(0.050000,-0.050000)', stroke: 'none' }
        },
        [h(
          'path',
          {
            attrs: { d: 'M1140 2537 c-1391 -109 -1526 -2211 -160 -2496 1343 -281 2157 1416 1081 2252 -111 85 -117 95 -107 159 l11 68 -82 0 c-60 0 -83 -8 -83 -30 0 -37 -8 -37 -116 1 -122 42 -346 61 -544 46z m344 -239 c212 -45 301 -96 289 -166 -6 -34 -16 -143 -23 -242 l-11 -180 285 -144 286 -143 6 -112 c50 -922 -1107 -1421 -1766 -761 -721 720 -60 1956 934 1748z m700 -500 c107 -184 100 -190 -104 -83 l-182 95 11 70 c6 39 11 106 12 150 l0 80 106 -112 c58 -62 129 -152 157 -200z' }
          },
          []
        ), h(
          'path',
          {
            attrs: { d: 'M930 2172 c-435 -205 -329 -839 140 -839 345 0 591 357 452 657 -98 212 -359 292 -592 182z m382 -114 c84 -51 136 -171 123 -287 -46 -412 -655 -430 -655 -20 0 275 298 447 532 307z' }
          },
          []
        ), h(
          'path',
          {
            attrs: { d: 'M1021 1856 c-49 -52 -52 -92 -10 -152 44 -63 135 -59 188 9 97 123 -71 258 -178 143z' }
          },
          []
        ), h(
          'path',
          {
            attrs: { d: 'M1670 1541 c-524 -127 -499 -890 30 -887 546 3 684 765 160 884 -101 24 -106 24 -190 3z m290 -180 c271 -212 51 -604 -327 -584 -300 16 -279 568 24 635 29 6 62 14 73 18 49 16 166 -19 230 -69z' }
          },
          []
        ), h(
          'path',
          {
            attrs: { d: 'M1653 1183 c-69 -76 -17 -203 84 -203 57 0 123 68 123 127 0 99 -140 151 -207 76z' }
          },
          []
        ), h(
          'path',
          {
            attrs: { d: 'M882 1077 c-50 -148 -53 -143 107 -153 l128 -8 11 67 c27 165 29 160 -68 189 -131 40 -133 39 -178 -95z' }
          },
          []
        )]
      )]
    );
  }
};

module.exports = Logo;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _button = __webpack_require__(208);

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = {
  name: 'Button',
  props: {
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    style: function style() {
      var status = this.status,
          disabled = this.disabled;

      var style = [_button2.default.button];
      if (status) {
        style.push(_button2.default[status]);
      }
      if (disabled) {
        style.push(_button2.default.disabled);
      }
      return style;
    }
  },

  render: function render(h) {
    var status = this.status,
        style = this.style,
        fill = this.fill,
        $slots = this.$slots;


    return h(
      'button',
      {
        attrs: { type: 'button', 'data-color': 'red' },
        'class': style },
      [$slots.default]
    );
  }
};

Button.Group = {
  name: 'ButtonGroup',
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      buttonOptions: this.options,
      selectedIdx: this.options.find(function (option) {
        return option.selected === true;
      })
    };
  },

  computed: {
    renderButtons: function renderButtons() {
      var _this = this;

      var h = this.$createElement;
      var buttonOptions = this.buttonOptions;


      var _buttonOptions = buttonOptions.map(function (option, i) {
        var dataSelected = option.selected ? '1' : '0';
        if (option.selected) {
          _this.selectedIdx = i;
        }
        return h(
          Button,
          {
            attrs: { status: 'primaryOutline', 'data-selected': dataSelected, 'data-role': 'button' }
          },
          [option.title]
        );
      });
      return _buttonOptions;
    }
  },
  methods: {
    _handleClickButton: (0, _delegateTo2.default)('[data-role="button"]', function (e) {
      var _this2 = this;

      var delegateTarget = e.delegateTarget;
      var selectedIdx = this.selectedIdx;

      var idx = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget);
      if (idx === selectedIdx) {
        return;
      }
      this.$emit('change', {
        value: this.buttonOptions[idx].value,
        idx: idx
      });
      this.buttonOptions.forEach(function (buttonOption) {
        return _this2.$set(buttonOption, 'selected', false);
      });
      this.$set(this.buttonOptions[idx], 'selected', true);
    }),
    setOptions: function setOptions(newOpts) {
      this.buttonOptions = newOpts;
      this.selectedIdx = newOpts.find(function (option) {
        return option.selected;
      });
    },
    setSelectedOption: function setSelectedOption(value) {
      var selectedOptIdx = this.buttonOptions.findIndex(function (buttonOption) {
        return buttonOption.value === value;
      });
      this.$set(this.buttonOptions[this.selectedIdx], 'selected', false);
      this.$set(this.buttonOptions[selectedOptIdx], 'selected', true);
    }
  },
  render: function render(h) {
    var renderButtons = this.renderButtons,
        _handleClickButton = this._handleClickButton;

    return h(
      'div',
      { 'class': [_button2.default.buttonGroup], on: {
          'click': _handleClickButton
        }
      },
      [renderButtons]
    );
  }
};

module.exports = Button;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _checkbox = __webpack_require__(209);

var _checkbox2 = _interopRequireDefault(_checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Checkbox = {
  name: 'Checkbox',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },

  data: function data() {
    return {
      check: this.checked
    };
  },


  methods: {
    handleClick: function handleClick(e) {
      e.stopPropagation();
      var $parent = this.$parent,
          name = this.name;

      this.check = !this.check;

      var data = _defineProperty({}, name, this.check);

      this.$emit('change', data);

      $parent.$emit('handleSingleCheckboxChange', data);
    }
  },

  watch: {
    checked: function checked(newVal) {
      var $parent = this.$parent,
          name = this.name;

      this.check = newVal;

      $parent.$emit('handleSingleCheckboxChange', _defineProperty({}, name, newVal));
    }
  },

  render: function render(h) {
    var handleClick = this.handleClick,
        check = this.check,
        $slots = this.$slots;


    return h(
      'div',
      {
        on: {
          'click': handleClick
        },
        'class': [_checkbox2.default.cb] },
      [check ? h(
        _icon2.default,
        {
          attrs: { typ: 'checked' }
        },
        []
      ) : h(
        _icon2.default,
        {
          attrs: { typ: 'checkbox', fill: '#fff' }
        },
        []
      ), $slots.default]
    );
  }
};

Checkbox.Group = {
  name: 'CheckboxGroup',

  mounted: function mounted() {
    var handleChange = this.handleChange,
        $children = this.$children,
        checkedDatum = this.checkedDatum;

    this.$on('handleSingleCheckboxChange', handleChange);

    if (checkedDatum.all) {
      $children.forEach(function (c) {
        checkedDatum[c.name] = true;
        c.check = true;
      });
    }
  },


  computed: {
    checkedDatum: function checkedDatum() {
      var _this = this;

      var $children = this.$children;

      return $children.reduce(function (data, child) {
        var name = child.name,
            check = child.check;


        if (name === 'all') {
          _this.$all = child;
        }

        data[name] = !!check;
        return data;
      }, {});
    },
    counts: function counts() {
      var checkedDatum = this.checkedDatum;

      var datum = Object.keys(checkedDatum);
      var total = datum.length - (this.$all ? 1 : 0);
      var checked = datum.filter(function (d) {
        return d !== 'all' && checkedDatum[d];
      }).length;

      return {
        total: total, checked: checked
      };
    }
  },

  methods: {
    handleChange: function handleChange(checked) {
      var checkedDatum = _extends({}, this.checkedDatum, checked);

      var $children = this.$children,
          counts = this.counts;

      var isClickedAll = checked.all !== undefined;

      if (this.$all) {
        if (isClickedAll) {
          this.$all.check = checked.all;
          $children.forEach(function (c) {
            checkedDatum[c.name] = checked.all;
            c.check = checked.all;
          });
        } else {
          this.$all.check = checkedDatum.all = counts.checked >= counts.total;
        }
      }

      this.$emit('change', checkedDatum);
    }
  },

  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      { 'class': [_checkbox2.default.cbGroup] },
      [$slots.default]
    );
  }
};
module.exports = Checkbox;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _loading = __webpack_require__(5);

var _loading2 = _interopRequireDefault(_loading);

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _input = __webpack_require__(215);

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Input = {
  props: {
    name: {
      type: String,
      default: 'input'
    },
    icon: {
      type: Array
    },
    status: {
      type: String,
      default: 'normal'
    },
    defaultValue: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String
    },
    val: {
      type: [String, Number],
      default: ''
    }
  },

  data: function data() {
    return {
      pwdStatus: this.password,
      pwdFill: '#b8bdbf',
      pwdInput: this.password ? 'password' : 'text',
      showX: false,
      value: this.defaultValue || this.val
    };
  },


  watch: {
    value: function value(val) {
      this.$emit('input', val);
    },
    val: function val(data) {
      this.value = data;
    }
  },

  computed: {
    styles: function styles() {
      var status = this.status,
          disabled = this.disabled;

      var styles = [_input2.default.input, _input2.default[status], _defineProperty({}, _input2.default.disabled, disabled)];
      return styles;
    }
  },

  methods: {
    setValue: function setValue(value) {
      this.value = value;
    },
    handleIconClick: function handleIconClick(e) {
      var icon = this.icon,
          name = this.name;

      this.value = this.$refs[name].value = '';
      this.$parent.$emit('handleClickOnX', name);
      this.showX = false;
    },
    handleInput: function handleInput(e) {
      var name = this.name,
          x = this.x;

      this.value = this.$refs[name].value;
      this.showX = x && this.value && !this.loading ? true : false;
    },
    handlePwdStyle: function handlePwdStyle(e) {
      this.pwdStatus = !this.pwdStatus;
      this.pwdFill = this.pwdStatus ? '#b8bdbf' : '#8962d9';
      this.pwdInput = this.pwdStatus ? 'password' : 'text';
    }
  },

  render: function render(h) {
    var value = this.value,
        styles = this.styles,
        icon = this.icon,
        name = this.name,
        placeholder = this.placeholder,
        password = this.password,
        loading = this.loading,
        disabled = this.disabled,
        handlePwdStyle = this.handlePwdStyle,
        pwdFill = this.pwdFill,
        pwdInput = this.pwdInput,
        showX = this.showX,
        required = this.required,
        pattern = this.pattern,
        handleInput = this.handleInput,
        handleIconClick = this.handleIconClick;


    return h(
      'div',
      { 'class': [_input2.default.inputWrapper] },
      [h(
        _loading2.default,
        {
          attrs: { size: 10, show: loading },
          'class': [_input2.default.loadingPie] },
        []
      ), icon && !loading && !password && !showX ? h(
        _icon2.default,
        {
          attrs: { typ: icon[0], fill: icon[1] },
          'class': [_input2.default.icon] },
        []
      ) : '', password ? h(
        'span',
        {
          on: {
            'click': handlePwdStyle
          }
        },
        [h(
          _icon2.default,
          {
            attrs: { typ: 'eye', fill: pwdFill },
            'class': [_input2.default.specialIcon] },
          []
        )]
      ) : '', showX ? h(
        'span',
        {
          on: {
            'click': handleIconClick
          }
        },
        [h(
          _icon2.default,
          {
            attrs: { typ: 'x', fill: pwdFill },
            'class': [_input2.default.specialIcon] },
          []
        )]
      ) : '', required ? h(
        'span',
        { 'class': [_input2.default.mustFill] },
        ['*']
      ) : '', h(
        'input',
        { 'class': styles,
          attrs: { type: pwdInput,

            placeholder: placeholder,

            disabled: disabled,
            pattern: pattern },
          ref: name, domProps: {
            'value': value
          },
          on: {
            'input': handleInput
          }
        },
        []
      )]
    );
  }
};

module.exports = Input;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _babelHelperVueJsxMergeProps = __webpack_require__(4);

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _label = __webpack_require__(216);

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Label = {
  name: 'Label',
  props: {
    typ: {
      type: String,
      default: 'label' },
    status: {
      type: String,
      default: 'default' },
    badge: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style: function style() {
      var status = this.status,
          typ = this.typ,
          badge = this.badge,
          x = this.x;

      var style = [_label2.default.label, _label2.default[typ], _label2.default['' + status + typ]];
      if (badge) {
        style.push(_label2.default.badge);
      }
      if (x) {
        style.push(_label2.default.x);
        style.push(_label2.default['' + status + typ + 'x']);
      }
      return style;
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        style = this.style,
        x = this.x,
        handleCloseLabel = this.handleCloseLabel;

    return h(
      'span',
      { 'class': style },
      [$slots.default, x ? h(
        _icon2.default,
        {
          attrs: { typ: 'x', size: 12 },
          'class': [_label2.default.iconx] },
        []
      ) : '']
    );
  }
};
Label.Group = {
  name: 'LabelGroup',

  props: {
    options: {
      type: Array,
      required: true
    },
    focused: {
      type: Number,
      default: -1
    },
    displayKey: {
      type: String,
      required: true
    },
    typ: {
      type: String,
      default: 'label' },
    status: {
      type: String,
      default: 'default' },
    badge: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    },
    newTag: {
      type: Boolean,
      default: false
    },
    newTagMsg: {
      type: String,
      default: '+ New Tag'
    },
    preventDuplicate: {
      type: Boolean,
      default: true
    }
  },

  data: function data() {
    return {
      labelData: this.options,
      focusedLabel: this.focused,
      showInput: false
    };
  },


  watch: {
    options: function options(newVal) {
      this.labelData = newVal;
    },
    focused: function focused(newVal) {
      this.focusedLabel = newVal;
    },
    labelData: function labelData(newVal) {
      this.$emit('change', this.labelData);
    }
  },

  computed: {
    renderLabels: function renderLabels() {
      var _this = this;

      var h = this.$createElement;
      var labelData = this.labelData,
          x = this.x,
          displayKey = this.displayKey;


      var props = {
        typ: this.typ,
        status: this.status,
        badge: this.badge,
        x: this.x
      };
      var _labels = this.labelData.map(function (label, idx) {
        var style = _defineProperty({}, _label2.default.labelInGroup, true);
        style[_label2.default.focused] = _this.focusedLabel > -1 && _this.focusedLabel === idx && _this.hasFocusedStyle ? true : false;

        return h(
          Label,
          (0, _babelHelperVueJsxMergeProps2.default)([{ props: props }, {
            attrs: {
              'data-role': 'labelg',
              'data-val': label[displayKey],
              'data-id': idx
            },
            'class': style
          }]),
          [label[displayKey]]
        );
      });
      return _labels;
    },
    hasFocusedStyle: function hasFocusedStyle() {
      var typ = this.typ,
          status = this.status;

      return status === 'default' && typ === 'outline' ? true : false;
    },
    newTagInputStyle: function newTagInputStyle() {
      var showInput = this.showInput;

      var styles = [_label2.default.label, _label2.default.newTag, _label2.default.labelInGroup, _defineProperty({}, _label2.default.showInput, showInput)];
      return styles;
    }
  },

  methods: {
    _handleClickLabel: (0, _delegateTo2.default)('[data-role="labelg"]', function (e) {
      var delegateTarget = e.delegateTarget;

      var clickedLabel = delegateTarget.getAttribute('data-val');
      var clickedId = delegateTarget.getAttribute('data-id'); // newly given id, starts with 0
      if (this.x) {
        // if labelGroup all closable
        var removedLabel = this.labelData[clickedId];

        this.labelData = this.labelData.reduce(function (preVal, newVal, idx) {
          if (idx !== +clickedId) {
            preVal.push(newVal);
          }
          return preVal;
        }, []);

        this.$emit('remove', removedLabel);
      }
    }),

    handleNewTagClick: function handleNewTagClick(e) {
      var _this2 = this;

      this.showInput = true;
      this.$nextTick(function () {
        _this2.$refs.addNewTag.focus();
      });
    },
    handleNewTagInputBlur: function handleNewTagInputBlur(e) {
      this.showInput = false;
    },
    handleInputKeyDown: function handleInputKeyDown(e) {
      var _this3 = this;

      var displayKey = this.displayKey,
          preventDuplicate = this.preventDuplicate;


      if (e.keyCode === 13) {
        if (!this.$refs.addNewTag.value) {
          return;
        }

        if (preventDuplicate) {
          var duplicate = this.labelData.find(function (data, idx) {
            return data[displayKey] === _this3.$refs.addNewTag.value;
          });

          if (duplicate) {
            return;
          }
        }

        this.labelData.push(_defineProperty({}, displayKey, this.$refs.addNewTag.value));
        this.$refs.addNewTag.value = '';
        this.showInput = false;

        this.$emit('create', this.$refs.addNewTag.value);
      }
    }
  },

  render: function render(h) {
    var renderLabels = this.renderLabels,
        _handleClickLabel = this._handleClickLabel,
        newTagInputStyle = this.newTagInputStyle,
        newTag = this.newTag,
        newTagMsg = this.newTagMsg;

    var props = {
      typ: this.typ,
      status: this.status,
      badge: this.badge
    };
    return h(
      'div',
      {
        on: {
          'click': _handleClickLabel
        }
      },
      [renderLabels, newTag ? h(
        Label,
        (0, _babelHelperVueJsxMergeProps2.default)([{ props: props }, { 'class': newTagInputStyle, nativeOn: {
            'click': this.handleNewTagClick
          }
        }]),
        [h(
          'span',
          null,
          [newTagMsg]
        ), h(
          'input',
          { 'class': _label2.default.newTagInput,
            ref: 'addNewTag',
            on: {
              'blur': this.handleNewTagInputBlur,
              'keydown': this.handleInputKeyDown
            }
          },
          []
        )]
      ) : '']
    );
  }
};

module.exports = Label;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _switch = __webpack_require__(225);

var _switch2 = _interopRequireDefault(_switch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Switch = {
  name: 'Switch',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'data'
    },
    typ: {
      type: String,
      default: 'default' }
  },
  data: function data() {
    return {
      check: this.checked
    };
  },

  watch: {
    checked: function checked() {
      this.check = this.checked;
    }
  },
  methods: {
    handleClick: function handleClick() {
      var name = this.name;

      this.check = !this.check;
      var data = _defineProperty({}, name, this.check);
      this.$emit('change', data);
    }
  },
  computed: {
    style: function style() {
      var typ = this.typ;

      var style = {
        checkbox: [_switch2.default[typ + 'SwitchButton']],
        div: [_switch2.default[typ + 'Switch']]
      };
      return style;
    }
  },
  render: function render(h) {
    var handleClick = this.handleClick,
        check = this.check,
        $slots = this.$slots,
        style = this.style;

    return h(
      'div',
      { 'class': [_switch2.default.wrapper], on: {
          'click': handleClick
        }
      },
      [h(
        'input',
        {
          attrs: { type: 'checkbox', checked: check },
          'class': style.checkbox },
        []
      ), h(
        'div',
        { 'class': style.div },
        [h(
          'label',
          { 'class': [_switch2.default.toggle] },
          []
        ), $slots.default]
      )]
    );
  }
};

Switch.Open = {
  name: 'SwitchOpen',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'span',
      { 'class': [_switch2.default.labelOpen] },
      [$slots.default]
    );
  }
};

Switch.Close = {
  name: 'SwitchClose',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'span',
      { 'class': [_switch2.default.labelClose] },
      [$slots.default]
    );
  }
};
module.exports = Switch;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _timePicker = __webpack_require__(227);

var _timePicker2 = _interopRequireDefault(_timePicker);

var _isTimeFormat = __webpack_require__(186);

var _isTimeFormat2 = _interopRequireDefault(_isTimeFormat);

var _prefix = __webpack_require__(20);

var _prefix2 = _interopRequireDefault(_prefix);

var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _moment = __webpack_require__(0);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimePicker = {
  name: 'TimePicker',
  props: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '22:00'
    },
    step: {
      type: Number,
      default: 15 },

    open: {
      type: Boolean,
      default: false
    },

    defaultValue: {
      type: String,
      default: Date().match(/\d\d:\d\d/)[0] },

    incluedNow: {
      type: Boolean,
      default: false
    }
  },

  data: function data() {
    return {
      value: this.defaultValue,
      focused: false
    };
  },


  watch: {
    defaultValue: function defaultValue(time) {
      this.value = time;
    },
    open: function open(opened) {
      var $el = this.$el;


      if (opened) {
        $el.focus();
      } else {
        $el.blur();
      }
    }
  },

  created: function created() {
    var start = this.start,
        end = this.end;


    (0, _isTimeFormat2.default)(start);
    (0, _isTimeFormat2.default)(end);
  },


  methods: {
    onFocus: function onFocus() {
      this.focused = true;
      this.$emit('focus');
    },
    onBlur: function onBlur() {
      this.focused = false;
      this.$emit('blur');
    },


    pickTime: (0, _delegateTo2.default)('li', function (ev) {
      ev.stopPropagation();

      var delegateTarget = ev.delegateTarget;

      var value = '';
      var dataTimeText = delegateTarget.getAttribute('data-time');
      if (dataTimeText === 'now') {
        value = (0, _moment2.default)().format('H:mm');
      } else {
        value = dataTimeText;
      }
      if (this.value === value && dataTimeText !== 'now') {
        return;
      }

      this.$el.blur();
      this.value = value;

      var _value$split = value.split(':'),
          _value$split2 = _slicedToArray(_value$split, 2),
          h = _value$split2[0],
          m = _value$split2[1];

      this.$emit('change', {
        value: value,
        h: +h,
        m: +m
      });
    })
  },

  computed: {
    renderTime: function renderTime() {
      var h = this.$createElement;
      var start = this.start,
          end = this.end,
          step = this.step;

      var _start$split = start.split(':'),
          _start$split2 = _slicedToArray(_start$split, 2),
          startHour = _start$split2[0],
          startMin = _start$split2[1];

      var _end$split = end.split(':'),
          _end$split2 = _slicedToArray(_end$split, 2),
          endHour = _end$split2[0],
          endMin = _end$split2[1];

      startHour = +startHour;
      startMin = +startMin;
      endHour = +endHour;
      endMin = +endMin;

      var lis = [];
      if (this.incluedNow) {
        lis.push(h(
          'li',
          {
            attrs: { 'data-time': 'now' }
          },
          [h(
            'code',
            null,
            ['now']
          )]
        ));
      }
      lis.push(h(
        'li',
        {
          attrs: { 'data-time': start }
        },
        [h(
          'code',
          null,
          [start]
        )]
      ));
      while (startHour * 60 + startMin <= endHour * 60 + endMin - step) {
        startMin += step;
        if (startMin >= 60) {
          startMin = startMin - 60;
          startHour += 1;
        }

        var time = (0, _prefix2.default)(startHour) + ':' + (0, _prefix2.default)(startMin);
        lis.push(h(
          'li',
          {
            attrs: { 'data-time': time }
          },
          [h(
            'code',
            null,
            [time]
          )]
        ));
      }

      return lis;
    }
  },

  mounted: function mounted() {
    var open = this.open,
        $el = this.$el;


    if (open) {
      $el.focus();
    }
  },
  render: function render(h) {
    var renderTime = this.renderTime,
        pickTime = this.pickTime,
        value = this.value,
        onFocus = this.onFocus,
        onBlur = this.onBlur;

    return h(
      'div',
      { 'class': [_timePicker2.default.timepicker], attrs: { tabIndex: '-1'
        },
        on: {
          'focus': onFocus,
          'blur': onBlur
        }
      },
      [h(
        'div',
        { 'class': [_timePicker2.default.input] },
        [value, ' ', h(
          _icon2.default,
          {
            attrs: { typ: 'clock' },
            'class': [_timePicker2.default.clock] },
          []
        )]
      ), h(
        'ul',
        { 'class': [_timePicker2.default.timebox], on: {
            'click': pickTime
          }
        },
        [renderTime]
      )]
    );
  }
};

module.exports = TimePicker;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0';

  if (typeof s === 'number') {
    s = String(s);
  }
  if (s.length < 2) {
    return '0' + s;
  }

  return s;
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"cal":"ou-date-picker_cal","calBox":"ou-date-picker_calBox","focused":"ou-date-picker_focused","picker":"ou-date-picker_picker","hasTime":"ou-date-picker_hasTime","colorfulWeekend":"ou-date-picker_colorfulWeekend","calTable":"ou-date-picker_calTable","calTop":"ou-date-picker_calTop","date":"ou-date-picker_date","dateNull":"ou-date-picker_dateNull","dateIgnore":"ou-date-picker_dateIgnore","today":"ou-date-picker_today","calNext":"ou-date-picker_calNext","calPrev":"ou-date-picker_calPrev","value":"ou-date-picker_value"};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Afrikaans [af]
//! author : Werner Mollentze : https://github.com/wernerm

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var af = moment.defineLocale('af', {
    months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
    weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
    weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
    meridiemParse: /vm|nm/i,
    isPM : function (input) {
        return /^nm$/i.test(input);
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'vm' : 'VM';
        } else {
            return isLower ? 'nm' : 'NM';
        }
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Vandag om] LT',
        nextDay : '[Môre om] LT',
        nextWeek : 'dddd [om] LT',
        lastDay : '[Gister om] LT',
        lastWeek : '[Laas] dddd [om] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'oor %s',
        past : '%s gelede',
        s : '\'n paar sekondes',
        m : '\'n minuut',
        mm : '%d minute',
        h : '\'n uur',
        hh : '%d ure',
        d : '\'n dag',
        dd : '%d dae',
        M : '\'n maand',
        MM : '%d maande',
        y : '\'n jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
    },
    week : {
        dow : 1, // Maandag is die eerste dag van die week.
        doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
    }
});

return af;

})));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Algeria) [ar-dz]
//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var arDz = moment.defineLocale('ar-dz', {
    months : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 4  // The week that contains Jan 1st is the first week of the year.
    }
});

return arDz;

})));


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Kuwait) [ar-kw]
//! author : Nusret Parlak: https://github.com/nusretparlak

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var arKw = moment.defineLocale('ar-kw', {
    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return arKw;

})));


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Lybia) [ar-ly]
//! author : Ali Hmer: https://github.com/kikoanis

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '0': '0'
};
var pluralForm = function (n) {
    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};
var plurals = {
    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};
var pluralize = function (u) {
    return function (number, withoutSuffix, string, isFuture) {
        var f = pluralForm(number),
            str = plurals[u][pluralForm(number)];
        if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
        }
        return str.replace(/%d/i, number);
    };
};
var months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
];

var arLy = moment.defineLocale('ar-ly', {
    months : months,
    monthsShort : months,
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/\u200FM/\u200FYYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم عند الساعة] LT',
        nextDay: '[غدًا عند الساعة] LT',
        nextWeek: 'dddd [عند الساعة] LT',
        lastDay: '[أمس عند الساعة] LT',
        lastWeek: 'dddd [عند الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'بعد %s',
        past : 'منذ %s',
        s : pluralize('s'),
        m : pluralize('m'),
        mm : pluralize('m'),
        h : pluralize('h'),
        hh : pluralize('h'),
        d : pluralize('d'),
        dd : pluralize('d'),
        M : pluralize('M'),
        MM : pluralize('M'),
        y : pluralize('y'),
        yy : pluralize('y')
    },
    preparse: function (string) {
        return string.replace(/\u200f/g, '').replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return arLy;

})));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Morocco) [ar-ma]
//! author : ElFadili Yassine : https://github.com/ElFadiliY
//! author : Abdel Said : https://github.com/abdelsaid

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var arMa = moment.defineLocale('ar-ma', {
    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return arMa;

})));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic (Saudi Arabia) [ar-sa]
//! author : Suhail Alkowaileet : https://github.com/xsoh

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠'
};
var numberMap = {
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٠': '0'
};

var arSa = moment.defineLocale('ar-sa', {
    months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'في %s',
        past : 'منذ %s',
        s : 'ثوان',
        m : 'دقيقة',
        mm : '%d دقائق',
        h : 'ساعة',
        hh : '%d ساعات',
        d : 'يوم',
        dd : '%d أيام',
        M : 'شهر',
        MM : '%d أشهر',
        y : 'سنة',
        yy : '%d سنوات'
    },
    preparse: function (string) {
        return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
            return numberMap[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return arSa;

})));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale  :  Arabic (Tunisia) [ar-tn]
//! author : Nader Toukabri : https://github.com/naderio

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var arTn = moment.defineLocale('ar-tn', {
    months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
    weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[اليوم على الساعة] LT',
        nextDay: '[غدا على الساعة] LT',
        nextWeek: 'dddd [على الساعة] LT',
        lastDay: '[أمس على الساعة] LT',
        lastWeek: 'dddd [على الساعة] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'في %s',
        past: 'منذ %s',
        s: 'ثوان',
        m: 'دقيقة',
        mm: '%d دقائق',
        h: 'ساعة',
        hh: '%d ساعات',
        d: 'يوم',
        dd: '%d أيام',
        M: 'شهر',
        MM: '%d أشهر',
        y: 'سنة',
        yy: '%d سنوات'
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

return arTn;

})));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Arabic [ar]
//! author : Abdel Said: https://github.com/abdelsaid
//! author : Ahmed Elkhatib
//! author : forabi https://github.com/forabi

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠'
};
var numberMap = {
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٠': '0'
};
var pluralForm = function (n) {
    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};
var plurals = {
    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
};
var pluralize = function (u) {
    return function (number, withoutSuffix, string, isFuture) {
        var f = pluralForm(number),
            str = plurals[u][pluralForm(number)];
        if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
        }
        return str.replace(/%d/i, number);
    };
};
var months = [
    'كانون الثاني يناير',
    'شباط فبراير',
    'آذار مارس',
    'نيسان أبريل',
    'أيار مايو',
    'حزيران يونيو',
    'تموز يوليو',
    'آب أغسطس',
    'أيلول سبتمبر',
    'تشرين الأول أكتوبر',
    'تشرين الثاني نوفمبر',
    'كانون الأول ديسمبر'
];

var ar = moment.defineLocale('ar', {
    months : months,
    monthsShort : months,
    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/\u200FM/\u200FYYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM : function (input) {
        return 'م' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        } else {
            return 'م';
        }
    },
    calendar : {
        sameDay: '[اليوم عند الساعة] LT',
        nextDay: '[غدًا عند الساعة] LT',
        nextWeek: 'dddd [عند الساعة] LT',
        lastDay: '[أمس عند الساعة] LT',
        lastWeek: 'dddd [عند الساعة] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'بعد %s',
        past : 'منذ %s',
        s : pluralize('s'),
        m : pluralize('m'),
        mm : pluralize('m'),
        h : pluralize('h'),
        hh : pluralize('h'),
        d : pluralize('d'),
        dd : pluralize('d'),
        M : pluralize('M'),
        MM : pluralize('M'),
        y : pluralize('y'),
        yy : pluralize('y')
    },
    preparse: function (string) {
        return string.replace(/\u200f/g, '').replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
            return numberMap[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        }).replace(/,/g, '،');
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return ar;

})));


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Azerbaijani [az]
//! author : topchiyev : https://github.com/topchiyev

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var suffixes = {
    1: '-inci',
    5: '-inci',
    8: '-inci',
    70: '-inci',
    80: '-inci',
    2: '-nci',
    7: '-nci',
    20: '-nci',
    50: '-nci',
    3: '-üncü',
    4: '-üncü',
    100: '-üncü',
    6: '-ncı',
    9: '-uncu',
    10: '-uncu',
    30: '-uncu',
    60: '-ıncı',
    90: '-ıncı'
};

var az = moment.defineLocale('az', {
    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
    weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
    weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
    weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[bugün saat] LT',
        nextDay : '[sabah saat] LT',
        nextWeek : '[gələn həftə] dddd [saat] LT',
        lastDay : '[dünən] LT',
        lastWeek : '[keçən həftə] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s əvvəl',
        s : 'birneçə saniyyə',
        m : 'bir dəqiqə',
        mm : '%d dəqiqə',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gün',
        dd : '%d gün',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir il',
        yy : '%d il'
    },
    meridiemParse: /gecə|səhər|gündüz|axşam/,
    isPM : function (input) {
        return /^(gündüz|axşam)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'gecə';
        } else if (hour < 12) {
            return 'səhər';
        } else if (hour < 17) {
            return 'gündüz';
        } else {
            return 'axşam';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '-ıncı';
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;
        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return az;

})));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Belarusian [be]
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
        'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
        'dd': 'дзень_дні_дзён',
        'MM': 'месяц_месяцы_месяцаў',
        'yy': 'год_гады_гадоў'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвіліна' : 'хвіліну';
    }
    else if (key === 'h') {
        return withoutSuffix ? 'гадзіна' : 'гадзіну';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}

var be = moment.defineLocale('be', {
    months : {
        format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
        standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
    },
    monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
    weekdays : {
        format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
        standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
    },
    weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[Сёння ў] LT',
        nextDay: '[Заўтра ў] LT',
        lastDay: '[Учора ў] LT',
        nextWeek: function () {
            return '[У] dddd [ў] LT';
        },
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return '[У мінулую] dddd [ў] LT';
                case 1:
                case 2:
                case 4:
                    return '[У мінулы] dddd [ў] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'праз %s',
        past : '%s таму',
        s : 'некалькі секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : relativeTimeWithPlural,
        hh : relativeTimeWithPlural,
        d : 'дзень',
        dd : relativeTimeWithPlural,
        M : 'месяц',
        MM : relativeTimeWithPlural,
        y : 'год',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /ночы|раніцы|дня|вечара/,
    isPM : function (input) {
        return /^(дня|вечара)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночы';
        } else if (hour < 12) {
            return 'раніцы';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечара';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
            case 'w':
            case 'W':
                return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
            case 'D':
                return number + '-га';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return be;

})));


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bulgarian [bg]
//! author : Krasen Borisov : https://github.com/kraz

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var bg = moment.defineLocale('bg', {
    months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
    monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
    weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
    weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'D.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay : '[Днес в] LT',
        nextDay : '[Утре в] LT',
        nextWeek : 'dddd [в] LT',
        lastDay : '[Вчера в] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return '[В изминалата] dddd [в] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[В изминалия] dddd [в] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'след %s',
        past : 'преди %s',
        s : 'няколко секунди',
        m : 'минута',
        mm : '%d минути',
        h : 'час',
        hh : '%d часа',
        d : 'ден',
        dd : '%d дни',
        M : 'месец',
        MM : '%d месеца',
        y : 'година',
        yy : '%d години'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    ordinal : function (number) {
        var lastDigit = number % 10,
            last2Digits = number % 100;
        if (number === 0) {
            return number + '-ев';
        } else if (last2Digits === 0) {
            return number + '-ен';
        } else if (last2Digits > 10 && last2Digits < 20) {
            return number + '-ти';
        } else if (lastDigit === 1) {
            return number + '-ви';
        } else if (lastDigit === 2) {
            return number + '-ри';
        } else if (lastDigit === 7 || lastDigit === 8) {
            return number + '-ми';
        } else {
            return number + '-ти';
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return bg;

})));


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bengali [bn]
//! author : Kaushik Gandhi : https://github.com/kaushikgandhi

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '0': '০'
};
var numberMap = {
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
    '০': '0'
};

var bn = moment.defineLocale('bn', {
    months : 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
    monthsShort : 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
    weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
    weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
    weekdaysMin : 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
    longDateFormat : {
        LT : 'A h:mm সময়',
        LTS : 'A h:mm:ss সময়',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm সময়',
        LLLL : 'dddd, D MMMM YYYY, A h:mm সময়'
    },
    calendar : {
        sameDay : '[আজ] LT',
        nextDay : '[আগামীকাল] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[গতকাল] LT',
        lastWeek : '[গত] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s পরে',
        past : '%s আগে',
        s : 'কয়েক সেকেন্ড',
        m : 'এক মিনিট',
        mm : '%d মিনিট',
        h : 'এক ঘন্টা',
        hh : '%d ঘন্টা',
        d : 'এক দিন',
        dd : '%d দিন',
        M : 'এক মাস',
        MM : '%d মাস',
        y : 'এক বছর',
        yy : '%d বছর'
    },
    preparse: function (string) {
        return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'রাত' && hour >= 4) ||
                (meridiem === 'দুপুর' && hour < 5) ||
                meridiem === 'বিকাল') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'রাত';
        } else if (hour < 10) {
            return 'সকাল';
        } else if (hour < 17) {
            return 'দুপুর';
        } else if (hour < 20) {
            return 'বিকাল';
        } else {
            return 'রাত';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return bn;

})));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tibetan [bo]
//! author : Thupten N. Chakrishar : https://github.com/vajradog

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '༡',
    '2': '༢',
    '3': '༣',
    '4': '༤',
    '5': '༥',
    '6': '༦',
    '7': '༧',
    '8': '༨',
    '9': '༩',
    '0': '༠'
};
var numberMap = {
    '༡': '1',
    '༢': '2',
    '༣': '3',
    '༤': '4',
    '༥': '5',
    '༦': '6',
    '༧': '7',
    '༨': '8',
    '༩': '9',
    '༠': '0'
};

var bo = moment.defineLocale('bo', {
    months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
    monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
    weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
    weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
    weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[དི་རིང] LT',
        nextDay : '[སང་ཉིན] LT',
        nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
        lastDay : '[ཁ་སང] LT',
        lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ལ་',
        past : '%s སྔན་ལ',
        s : 'ལམ་སང',
        m : 'སྐར་མ་གཅིག',
        mm : '%d སྐར་མ',
        h : 'ཆུ་ཚོད་གཅིག',
        hh : '%d ཆུ་ཚོད',
        d : 'ཉིན་གཅིག',
        dd : '%d ཉིན་',
        M : 'ཟླ་བ་གཅིག',
        MM : '%d ཟླ་བ',
        y : 'ལོ་གཅིག',
        yy : '%d ལོ'
    },
    preparse: function (string) {
        return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
                (meridiem === 'ཉིན་གུང' && hour < 5) ||
                meridiem === 'དགོང་དག') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'མཚན་མོ';
        } else if (hour < 10) {
            return 'ཞོགས་ཀས';
        } else if (hour < 17) {
            return 'ཉིན་གུང';
        } else if (hour < 20) {
            return 'དགོང་དག';
        } else {
            return 'མཚན་མོ';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return bo;

})));


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Breton [br]
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function relativeTimeWithMutation(number, withoutSuffix, key) {
    var format = {
        'mm': 'munutenn',
        'MM': 'miz',
        'dd': 'devezh'
    };
    return number + ' ' + mutation(format[key], number);
}
function specialMutationForYears(number) {
    switch (lastNumber(number)) {
        case 1:
        case 3:
        case 4:
        case 5:
        case 9:
            return number + ' bloaz';
        default:
            return number + ' vloaz';
    }
}
function lastNumber(number) {
    if (number > 9) {
        return lastNumber(number % 10);
    }
    return number;
}
function mutation(text, number) {
    if (number === 2) {
        return softMutation(text);
    }
    return text;
}
function softMutation(text) {
    var mutationTable = {
        'm': 'v',
        'b': 'v',
        'd': 'z'
    };
    if (mutationTable[text.charAt(0)] === undefined) {
        return text;
    }
    return mutationTable[text.charAt(0)] + text.substring(1);
}

var br = moment.defineLocale('br', {
    months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
    monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
    weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
    weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
    weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h[e]mm A',
        LTS : 'h[e]mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D [a viz] MMMM YYYY',
        LLL : 'D [a viz] MMMM YYYY h[e]mm A',
        LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
    },
    calendar : {
        sameDay : '[Hiziv da] LT',
        nextDay : '[Warc\'hoazh da] LT',
        nextWeek : 'dddd [da] LT',
        lastDay : '[Dec\'h da] LT',
        lastWeek : 'dddd [paset da] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'a-benn %s',
        past : '%s \'zo',
        s : 'un nebeud segondennoù',
        m : 'ur vunutenn',
        mm : relativeTimeWithMutation,
        h : 'un eur',
        hh : '%d eur',
        d : 'un devezh',
        dd : relativeTimeWithMutation,
        M : 'ur miz',
        MM : relativeTimeWithMutation,
        y : 'ur bloaz',
        yy : specialMutationForYears
    },
    dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
    ordinal : function (number) {
        var output = (number === 1) ? 'añ' : 'vet';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return br;

})));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Bosnian [bs]
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function translate(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
        case 'mm':
            if (number === 1) {
                result += 'minuta';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'minute';
            } else {
                result += 'minuta';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'jedan sat' : 'jednog sata';
        case 'hh':
            if (number === 1) {
                result += 'sat';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'sata';
            } else {
                result += 'sati';
            }
            return result;
        case 'dd':
            if (number === 1) {
                result += 'dan';
            } else {
                result += 'dana';
            }
            return result;
        case 'MM':
            if (number === 1) {
                result += 'mjesec';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'mjeseca';
            } else {
                result += 'mjeseci';
            }
            return result;
        case 'yy':
            if (number === 1) {
                result += 'godina';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'godine';
            } else {
                result += 'godina';
            }
            return result;
    }
}

var bs = moment.defineLocale('bs', {
    months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danas u] LT',
        nextDay  : '[sutra u] LT',
        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[jučer u] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return '[prošlu] dddd [u] LT';
                case 6:
                    return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prošli] dddd [u] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'par sekundi',
        m      : translate,
        mm     : translate,
        h      : translate,
        hh     : translate,
        d      : 'dan',
        dd     : translate,
        M      : 'mjesec',
        MM     : translate,
        y      : 'godinu',
        yy     : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return bs;

})));


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Catalan [ca]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ca = moment.defineLocale('ca', {
    months : {
        standalone: 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
        format: 'de gener_de febrer_de març_d\'abril_de maig_de juny_de juliol_d\'agost_de setembre_d\'octubre_de novembre_de desembre'.split('_'),
        isFormat: /D[oD]?(\s)+MMMM/
    },
    monthsShort : 'gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.'.split('_'),
    monthsParseExact : true,
    weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
    weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
    weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : '[el] D MMMM [de] YYYY',
        ll : 'D MMM YYYY',
        LLL : '[el] D MMMM [de] YYYY [a les] H:mm',
        lll : 'D MMM YYYY, H:mm',
        LLLL : '[el] dddd D MMMM [de] YYYY [a les] H:mm',
        llll : 'ddd D MMM YYYY, H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextDay : function () {
            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastDay : function () {
            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'd\'aquí %s',
        past : 'fa %s',
        s : 'uns segons',
        m : 'un minut',
        mm : '%d minuts',
        h : 'una hora',
        hh : '%d hores',
        d : 'un dia',
        dd : '%d dies',
        M : 'un mes',
        MM : '%d mesos',
        y : 'un any',
        yy : '%d anys'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
    ordinal : function (number, period) {
        var output = (number === 1) ? 'r' :
            (number === 2) ? 'n' :
            (number === 3) ? 'r' :
            (number === 4) ? 't' : 'è';
        if (period === 'w' || period === 'W') {
            output = 'a';
        }
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return ca;

})));


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Czech [cs]
//! author : petrbela : https://github.com/petrbela

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');
function plural(n) {
    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
}
function translate(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':  // a few seconds / in a few seconds / a few seconds ago
            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
        case 'm':  // a minute / in a minute / a minute ago
            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'minuty' : 'minut');
            } else {
                return result + 'minutami';
            }
            break;
        case 'h':  // an hour / in an hour / an hour ago
            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
        case 'hh': // 9 hours / in 9 hours / 9 hours ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'hodiny' : 'hodin');
            } else {
                return result + 'hodinami';
            }
            break;
        case 'd':  // a day / in a day / a day ago
            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
        case 'dd': // 9 days / in 9 days / 9 days ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'dny' : 'dní');
            } else {
                return result + 'dny';
            }
            break;
        case 'M':  // a month / in a month / a month ago
            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
        case 'MM': // 9 months / in 9 months / 9 months ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'měsíce' : 'měsíců');
            } else {
                return result + 'měsíci';
            }
            break;
        case 'y':  // a year / in a year / a year ago
            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
        case 'yy': // 9 years / in 9 years / 9 years ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'roky' : 'let');
            } else {
                return result + 'lety';
            }
            break;
    }
}

var cs = moment.defineLocale('cs', {
    months : months,
    monthsShort : monthsShort,
    monthsParse : (function (months, monthsShort) {
        var i, _monthsParse = [];
        for (i = 0; i < 12; i++) {
            // use custom parser to solve problem with July (červenec)
            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
        }
        return _monthsParse;
    }(months, monthsShort)),
    shortMonthsParse : (function (monthsShort) {
        var i, _shortMonthsParse = [];
        for (i = 0; i < 12; i++) {
            _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
        }
        return _shortMonthsParse;
    }(monthsShort)),
    longMonthsParse : (function (months) {
        var i, _longMonthsParse = [];
        for (i = 0; i < 12; i++) {
            _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
        }
        return _longMonthsParse;
    }(months)),
    weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
    weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
    weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
    longDateFormat : {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd D. MMMM YYYY H:mm',
        l : 'D. M. YYYY'
    },
    calendar : {
        sameDay: '[dnes v] LT',
        nextDay: '[zítra v] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[v neděli v] LT';
                case 1:
                case 2:
                    return '[v] dddd [v] LT';
                case 3:
                    return '[ve středu v] LT';
                case 4:
                    return '[ve čtvrtek v] LT';
                case 5:
                    return '[v pátek v] LT';
                case 6:
                    return '[v sobotu v] LT';
            }
        },
        lastDay: '[včera v] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[minulou neděli v] LT';
                case 1:
                case 2:
                    return '[minulé] dddd [v] LT';
                case 3:
                    return '[minulou středu v] LT';
                case 4:
                case 5:
                    return '[minulý] dddd [v] LT';
                case 6:
                    return '[minulou sobotu v] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : 'před %s',
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    dayOfMonthOrdinalParse : /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return cs;

})));


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chuvash [cv]
//! author : Anatoly Mironov : https://github.com/mirontoli

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var cv = moment.defineLocale('cv', {
    months : 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
    monthsShort : 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
    weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
    weekdaysShort : 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
    weekdaysMin : 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
        LLL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
        LLLL : 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
    },
    calendar : {
        sameDay: '[Паян] LT [сехетре]',
        nextDay: '[Ыран] LT [сехетре]',
        lastDay: '[Ӗнер] LT [сехетре]',
        nextWeek: '[Ҫитес] dddd LT [сехетре]',
        lastWeek: '[Иртнӗ] dddd LT [сехетре]',
        sameElse: 'L'
    },
    relativeTime : {
        future : function (output) {
            var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
            return output + affix;
        },
        past : '%s каялла',
        s : 'пӗр-ик ҫеккунт',
        m : 'пӗр минут',
        mm : '%d минут',
        h : 'пӗр сехет',
        hh : '%d сехет',
        d : 'пӗр кун',
        dd : '%d кун',
        M : 'пӗр уйӑх',
        MM : '%d уйӑх',
        y : 'пӗр ҫул',
        yy : '%d ҫул'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
    ordinal : '%d-мӗш',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return cv;

})));


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Welsh [cy]
//! author : Robert Allen : https://github.com/robgallen
//! author : https://github.com/ryangreaves

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var cy = moment.defineLocale('cy', {
    months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
    monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
    weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
    weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
    weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
    weekdaysParseExact : true,
    // time formats are the same as en-gb
    longDateFormat: {
        LT: 'HH:mm',
        LTS : 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Heddiw am] LT',
        nextDay: '[Yfory am] LT',
        nextWeek: 'dddd [am] LT',
        lastDay: '[Ddoe am] LT',
        lastWeek: 'dddd [diwethaf am] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'mewn %s',
        past: '%s yn ôl',
        s: 'ychydig eiliadau',
        m: 'munud',
        mm: '%d munud',
        h: 'awr',
        hh: '%d awr',
        d: 'diwrnod',
        dd: '%d diwrnod',
        M: 'mis',
        MM: '%d mis',
        y: 'blwyddyn',
        yy: '%d flynedd'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
    // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
    ordinal: function (number) {
        var b = number,
            output = '',
            lookup = [
                '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
                'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
            ];
        if (b > 20) {
            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
                output = 'fed'; // not 30ain, 70ain or 90ain
            } else {
                output = 'ain';
            }
        } else if (b > 0) {
            output = lookup[b];
        }
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return cy;

})));


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Danish [da]
//! author : Ulrik Nielsen : https://github.com/mrbase

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var da = moment.defineLocale('da', {
    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd [d.] D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay : '[i dag kl.] LT',
        nextDay : '[i morgen kl.] LT',
        nextWeek : 'på dddd [kl.] LT',
        lastDay : '[i går kl.] LT',
        lastWeek : '[i] dddd[s kl.] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s siden',
        s : 'få sekunder',
        m : 'et minut',
        mm : '%d minutter',
        h : 'en time',
        hh : '%d timer',
        d : 'en dag',
        dd : '%d dage',
        M : 'en måned',
        MM : '%d måneder',
        y : 'et år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return da;

})));


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German (Austria) [de-at]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
//! author : Mikolaj Dadela : https://github.com/mik01aj

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

var deAt = moment.defineLocale('de-at', {
    months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd, D. MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime,
        mm : '%d Minuten',
        h : processRelativeTime,
        hh : '%d Stunden',
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return deAt;

})));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German (Switzerland) [de-ch]
//! author : sschueller : https://github.com/sschueller

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


// based on: https://www.bk.admin.ch/dokumentation/sprachen/04915/05016/index.html?lang=de#

function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

var deCh = moment.defineLocale('de-ch', {
    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jan._Febr._März_April_Mai_Juni_Juli_Aug._Sept._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH.mm',
        LTS: 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH.mm',
        LLLL : 'dddd, D. MMMM YYYY HH.mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime,
        mm : '%d Minuten',
        h : processRelativeTime,
        hh : '%d Stunden',
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return deCh;

})));


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eine Minute', 'einer Minute'],
        'h': ['eine Stunde', 'einer Stunde'],
        'd': ['ein Tag', 'einem Tag'],
        'dd': [number + ' Tage', number + ' Tagen'],
        'M': ['ein Monat', 'einem Monat'],
        'MM': [number + ' Monate', number + ' Monaten'],
        'y': ['ein Jahr', 'einem Jahr'],
        'yy': [number + ' Jahre', number + ' Jahren']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

var de = moment.defineLocale('de', {
    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY HH:mm',
        LLLL : 'dddd, D. MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime : {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        m : processRelativeTime,
        mm : '%d Minuten',
        h : processRelativeTime,
        hh : '%d Stunden',
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return de;

})));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Maldivian [dv]
//! author : Jawish Hameed : https://github.com/jawish

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = [
    'ޖެނުއަރީ',
    'ފެބްރުއަރީ',
    'މާރިޗު',
    'އޭޕްރީލު',
    'މޭ',
    'ޖޫން',
    'ޖުލައި',
    'އޯގަސްޓު',
    'ސެޕްޓެމްބަރު',
    'އޮކްޓޯބަރު',
    'ނޮވެމްބަރު',
    'ޑިސެމްބަރު'
];
var weekdays = [
    'އާދިއްތަ',
    'ހޯމަ',
    'އަންގާރަ',
    'ބުދަ',
    'ބުރާސްފަތި',
    'ހުކުރު',
    'ހޮނިހިރު'
];

var dv = moment.defineLocale('dv', {
    months : months,
    monthsShort : months,
    weekdays : weekdays,
    weekdaysShort : weekdays,
    weekdaysMin : 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
    longDateFormat : {

        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'D/M/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /މކ|މފ/,
    isPM : function (input) {
        return 'މފ' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'މކ';
        } else {
            return 'މފ';
        }
    },
    calendar : {
        sameDay : '[މިއަދު] LT',
        nextDay : '[މާދަމާ] LT',
        nextWeek : 'dddd LT',
        lastDay : '[އިއްޔެ] LT',
        lastWeek : '[ފާއިތުވި] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ތެރޭގައި %s',
        past : 'ކުރިން %s',
        s : 'ސިކުންތުކޮޅެއް',
        m : 'މިނިޓެއް',
        mm : 'މިނިޓު %d',
        h : 'ގަޑިއިރެއް',
        hh : 'ގަޑިއިރު %d',
        d : 'ދުވަހެއް',
        dd : 'ދުވަސް %d',
        M : 'މަހެއް',
        MM : 'މަސް %d',
        y : 'އަހަރެއް',
        yy : 'އަހަރު %d'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 7,  // Sunday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return dv;

})));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Greek [el]
//! author : Aggelos Karalias : https://github.com/mehiel

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}


var el = moment.defineLocale('el', {
    monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
    monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
    months : function (momentToFormat, format) {
        if (!momentToFormat) {
            return this._monthsNominativeEl;
        } else if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
            return this._monthsGenitiveEl[momentToFormat.month()];
        } else {
            return this._monthsNominativeEl[momentToFormat.month()];
        }
    },
    monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
    weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
    weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
    weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'μμ' : 'ΜΜ';
        } else {
            return isLower ? 'πμ' : 'ΠΜ';
        }
    },
    isPM : function (input) {
        return ((input + '').toLowerCase()[0] === 'μ');
    },
    meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendarEl : {
        sameDay : '[Σήμερα {}] LT',
        nextDay : '[Αύριο {}] LT',
        nextWeek : 'dddd [{}] LT',
        lastDay : '[Χθες {}] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 6:
                    return '[το προηγούμενο] dddd [{}] LT';
                default:
                    return '[την προηγούμενη] dddd [{}] LT';
            }
        },
        sameElse : 'L'
    },
    calendar : function (key, mom) {
        var output = this._calendarEl[key],
            hours = mom && mom.hours();
        if (isFunction(output)) {
            output = output.apply(mom);
        }
        return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
    },
    relativeTime : {
        future : 'σε %s',
        past : '%s πριν',
        s : 'λίγα δευτερόλεπτα',
        m : 'ένα λεπτό',
        mm : '%d λεπτά',
        h : 'μία ώρα',
        hh : '%d ώρες',
        d : 'μία μέρα',
        dd : '%d μέρες',
        M : 'ένας μήνας',
        MM : '%d μήνες',
        y : 'ένας χρόνος',
        yy : '%d χρόνια'
    },
    dayOfMonthOrdinalParse: /\d{1,2}η/,
    ordinal: '%dη',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4st is the first week of the year.
    }
});

return el;

})));


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Australia) [en-au]
//! author : Jared Morse : https://github.com/jarcoal

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enAu = moment.defineLocale('en-au', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return enAu;

})));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Canada) [en-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enCa = moment.defineLocale('en-ca', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'YYYY-MM-DD',
        LL : 'MMMM D, YYYY',
        LLL : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

return enCa;

})));


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enGb = moment.defineLocale('en-gb', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return enGb;

})));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (Ireland) [en-ie]
//! author : Chris Cartlidge : https://github.com/chriscartlidge

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enIe = moment.defineLocale('en-ie', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return enIe;

})));


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (New Zealand) [en-nz]
//! author : Luke McGregor : https://github.com/lukemcgregor

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enNz = moment.defineLocale('en-nz', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return enNz;

})));


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Esperanto [eo]
//! author : Colin Dean : https://github.com/colindean
//! author : Mia Nordentoft Imperatori : https://github.com/miestasmia
//! comment : miestasmia corrected the translation by colindean

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var eo = moment.defineLocale('eo', {
    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
    weekdays : 'dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato'.split('_'),
    weekdaysShort : 'dim_lun_mard_merk_ĵaŭ_ven_sab'.split('_'),
    weekdaysMin : 'di_lu_ma_me_ĵa_ve_sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D[-a de] MMMM, YYYY',
        LLL : 'D[-a de] MMMM, YYYY HH:mm',
        LLLL : 'dddd, [la] D[-a de] MMMM, YYYY HH:mm'
    },
    meridiemParse: /[ap]\.t\.m/i,
    isPM: function (input) {
        return input.charAt(0).toLowerCase() === 'p';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'p.t.m.' : 'P.T.M.';
        } else {
            return isLower ? 'a.t.m.' : 'A.T.M.';
        }
    },
    calendar : {
        sameDay : '[Hodiaŭ je] LT',
        nextDay : '[Morgaŭ je] LT',
        nextWeek : 'dddd [je] LT',
        lastDay : '[Hieraŭ je] LT',
        lastWeek : '[pasinta] dddd [je] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'post %s',
        past : 'antaŭ %s',
        s : 'sekundoj',
        m : 'minuto',
        mm : '%d minutoj',
        h : 'horo',
        hh : '%d horoj',
        d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
        dd : '%d tagoj',
        M : 'monato',
        MM : '%d monatoj',
        y : 'jaro',
        yy : '%d jaroj'
    },
    dayOfMonthOrdinalParse: /\d{1,2}a/,
    ordinal : '%da',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return eo;

})));


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Spanish (Dominican Republic) [es-do]

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var esDo = moment.defineLocale('es-do', {
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortDot;
        } else if (/-MMM-/.test(format)) {
            return monthsShort[m.month()];
        } else {
            return monthsShortDot[m.month()];
        }
    },
    monthsParseExact : true,
    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY h:mm A',
        LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'en %s',
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return esDo;

})));


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Spanish [es]
//! author : Julio Napurí : https://github.com/julionc

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

var es = moment.defineLocale('es', {
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortDot;
        } else if (/-MMM-/.test(format)) {
            return monthsShort[m.month()];
        } else {
            return monthsShortDot[m.month()];
        }
    },
    monthsParseExact : true,
    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY H:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay : function () {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay : function () {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek : function () {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'en %s',
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return es;

})));


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Estonian [et]
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
        'm' : ['ühe minuti', 'üks minut'],
        'mm': [number + ' minuti', number + ' minutit'],
        'h' : ['ühe tunni', 'tund aega', 'üks tund'],
        'hh': [number + ' tunni', number + ' tundi'],
        'd' : ['ühe päeva', 'üks päev'],
        'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
        'MM': [number + ' kuu', number + ' kuud'],
        'y' : ['ühe aasta', 'aasta', 'üks aasta'],
        'yy': [number + ' aasta', number + ' aastat']
    };
    if (withoutSuffix) {
        return format[key][2] ? format[key][2] : format[key][1];
    }
    return isFuture ? format[key][0] : format[key][1];
}

var et = moment.defineLocale('et', {
    months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
    monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
    weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
    weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
    weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
    longDateFormat : {
        LT   : 'H:mm',
        LTS : 'H:mm:ss',
        L    : 'DD.MM.YYYY',
        LL   : 'D. MMMM YYYY',
        LLL  : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[Täna,] LT',
        nextDay  : '[Homme,] LT',
        nextWeek : '[Järgmine] dddd LT',
        lastDay  : '[Eile,] LT',
        lastWeek : '[Eelmine] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s pärast',
        past   : '%s tagasi',
        s      : processRelativeTime,
        m      : processRelativeTime,
        mm     : processRelativeTime,
        h      : processRelativeTime,
        hh     : processRelativeTime,
        d      : processRelativeTime,
        dd     : '%d päeva',
        M      : processRelativeTime,
        MM     : processRelativeTime,
        y      : processRelativeTime,
        yy     : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return et;

})));


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var eu = moment.defineLocale('eu', {
    months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
    monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
    monthsParseExact : true,
    weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
    weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
    weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'YYYY[ko] MMMM[ren] D[a]',
        LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
        LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
        l : 'YYYY-M-D',
        ll : 'YYYY[ko] MMM D[a]',
        lll : 'YYYY[ko] MMM D[a] HH:mm',
        llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
    },
    calendar : {
        sameDay : '[gaur] LT[etan]',
        nextDay : '[bihar] LT[etan]',
        nextWeek : 'dddd LT[etan]',
        lastDay : '[atzo] LT[etan]',
        lastWeek : '[aurreko] dddd LT[etan]',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s barru',
        past : 'duela %s',
        s : 'segundo batzuk',
        m : 'minutu bat',
        mm : '%d minutu',
        h : 'ordu bat',
        hh : '%d ordu',
        d : 'egun bat',
        dd : '%d egun',
        M : 'hilabete bat',
        MM : '%d hilabete',
        y : 'urte bat',
        yy : '%d urte'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return eu;

})));


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰'
};
var numberMap = {
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '۰': '0'
};

var fa = moment.defineLocale('fa', {
    months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
    monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
    weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
    weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
    weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    meridiemParse: /قبل از ظهر|بعد از ظهر/,
    isPM: function (input) {
        return /بعد از ظهر/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'قبل از ظهر';
        } else {
            return 'بعد از ظهر';
        }
    },
    calendar : {
        sameDay : '[امروز ساعت] LT',
        nextDay : '[فردا ساعت] LT',
        nextWeek : 'dddd [ساعت] LT',
        lastDay : '[دیروز ساعت] LT',
        lastWeek : 'dddd [پیش] [ساعت] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'در %s',
        past : '%s پیش',
        s : 'چند ثانیه',
        m : 'یک دقیقه',
        mm : '%d دقیقه',
        h : 'یک ساعت',
        hh : '%d ساعت',
        d : 'یک روز',
        dd : '%d روز',
        M : 'یک ماه',
        MM : '%d ماه',
        y : 'یک سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/[۰-۹]/g, function (match) {
            return numberMap[match];
        }).replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        }).replace(/,/g, '،');
    },
    dayOfMonthOrdinalParse: /\d{1,2}م/,
    ordinal : '%dم',
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12 // The week that contains Jan 1st is the first week of the year.
    }
});

return fa;

})));


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Finnish [fi]
//! author : Tarmo Aidantausta : https://github.com/bleadof

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
var numbersFuture = [
        'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
        numbersPast[7], numbersPast[8], numbersPast[9]
    ];
function translate(number, withoutSuffix, key, isFuture) {
    var result = '';
    switch (key) {
        case 's':
            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
        case 'm':
            return isFuture ? 'minuutin' : 'minuutti';
        case 'mm':
            result = isFuture ? 'minuutin' : 'minuuttia';
            break;
        case 'h':
            return isFuture ? 'tunnin' : 'tunti';
        case 'hh':
            result = isFuture ? 'tunnin' : 'tuntia';
            break;
        case 'd':
            return isFuture ? 'päivän' : 'päivä';
        case 'dd':
            result = isFuture ? 'päivän' : 'päivää';
            break;
        case 'M':
            return isFuture ? 'kuukauden' : 'kuukausi';
        case 'MM':
            result = isFuture ? 'kuukauden' : 'kuukautta';
            break;
        case 'y':
            return isFuture ? 'vuoden' : 'vuosi';
        case 'yy':
            result = isFuture ? 'vuoden' : 'vuotta';
            break;
    }
    result = verbalNumber(number, isFuture) + ' ' + result;
    return result;
}
function verbalNumber(number, isFuture) {
    return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
}

var fi = moment.defineLocale('fi', {
    months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
    monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
    weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
    weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
    weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'Do MMMM[ta] YYYY',
        LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
        l : 'D.M.YYYY',
        ll : 'Do MMM YYYY',
        lll : 'Do MMM YYYY, [klo] HH.mm',
        llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
    },
    calendar : {
        sameDay : '[tänään] [klo] LT',
        nextDay : '[huomenna] [klo] LT',
        nextWeek : 'dddd [klo] LT',
        lastDay : '[eilen] [klo] LT',
        lastWeek : '[viime] dddd[na] [klo] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s päästä',
        past : '%s sitten',
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return fi;

})));


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Faroese [fo]
//! author : Ragnar Johannesen : https://github.com/ragnar123

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var fo = moment.defineLocale('fo', {
    months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
    weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
    weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D. MMMM, YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Í dag kl.] LT',
        nextDay : '[Í morgin kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[Í gjár kl.] LT',
        lastWeek : '[síðstu] dddd [kl] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'um %s',
        past : '%s síðani',
        s : 'fá sekund',
        m : 'ein minutt',
        mm : '%d minuttir',
        h : 'ein tími',
        hh : '%d tímar',
        d : 'ein dagur',
        dd : '%d dagar',
        M : 'ein mánaði',
        MM : '%d mánaðir',
        y : 'eitt ár',
        yy : '%d ár'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return fo;

})));


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French (Canada) [fr-ca]
//! author : Jonathan Abourbih : https://github.com/jonbca

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var frCa = moment.defineLocale('fr-ca', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal : function (number, period) {
        switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'D':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    }
});

return frCa;

})));


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French (Switzerland) [fr-ch]
//! author : Gaspard Bucher : https://github.com/gaspard

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var frCh = moment.defineLocale('fr-ch', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal : function (number, period) {
        switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'D':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return frCh;

})));


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : French [fr]
//! author : John Fischer : https://github.com/jfroffice

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var fr = moment.defineLocale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
    ordinal : function (number, period) {
        switch (period) {
            // TODO: Return 'e' when day of month > 1. Move this case inside
            // block for masculine words below.
            // See https://github.com/moment/moment/issues/3375
            case 'D':
                return number + (number === 1 ? 'er' : '');

            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return fr;

})));


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Frisian [fy]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

var fy = moment.defineLocale('fy', {
    months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots[m.month()];
        } else {
            return monthsShortWithDots[m.month()];
        }
    },
    monthsParseExact : true,
    weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
    weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
    weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[hjoed om] LT',
        nextDay: '[moarn om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[juster om] LT',
        lastWeek: '[ôfrûne] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'oer %s',
        past : '%s lyn',
        s : 'in pear sekonden',
        m : 'ien minút',
        mm : '%d minuten',
        h : 'ien oere',
        hh : '%d oeren',
        d : 'ien dei',
        dd : '%d dagen',
        M : 'ien moanne',
        MM : '%d moannen',
        y : 'ien jier',
        yy : '%d jierren'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return fy;

})));


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Scottish Gaelic [gd]
//! author : Jon Ashdown : https://github.com/jonashdown

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = [
    'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
];

var monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

var weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

var gd = moment.defineLocale('gd', {
    months : months,
    monthsShort : monthsShort,
    monthsParseExact : true,
    weekdays : weekdays,
    weekdaysShort : weekdaysShort,
    weekdaysMin : weekdaysMin,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[An-diugh aig] LT',
        nextDay : '[A-màireach aig] LT',
        nextWeek : 'dddd [aig] LT',
        lastDay : '[An-dè aig] LT',
        lastWeek : 'dddd [seo chaidh] [aig] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ann an %s',
        past : 'bho chionn %s',
        s : 'beagan diogan',
        m : 'mionaid',
        mm : '%d mionaidean',
        h : 'uair',
        hh : '%d uairean',
        d : 'latha',
        dd : '%d latha',
        M : 'mìos',
        MM : '%d mìosan',
        y : 'bliadhna',
        yy : '%d bliadhna'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(d|na|mh)/,
    ordinal : function (number) {
        var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return gd;

})));


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Galician [gl]
//! author : Juan G. Hurtado : https://github.com/juanghurtado

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var gl = moment.defineLocale('gl', {
    months : 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
    monthsShort : 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
    weekdaysShort : 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
    weekdaysMin : 'do_lu_ma_mé_xo_ve_sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY H:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar : {
        sameDay : function () {
            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
        },
        nextDay : function () {
            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
        },
        nextWeek : function () {
            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        lastDay : function () {
            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
        },
        lastWeek : function () {
            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : function (str) {
            if (str.indexOf('un') === 0) {
                return 'n' + str;
            }
            return 'en ' + str;
        },
        past : 'hai %s',
        s : 'uns segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'unha hora',
        hh : '%d horas',
        d : 'un día',
        dd : '%d días',
        M : 'un mes',
        MM : '%d meses',
        y : 'un ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return gl;

})));


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Konkani Latin script [gom-latn]
//! author : The Discoverer : https://github.com/WikiDiscoverer

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        's': ['thodde secondanim', 'thodde second'],
        'm': ['eka mintan', 'ek minute'],
        'mm': [number + ' mintanim', number + ' mintam'],
        'h': ['eka horan', 'ek hor'],
        'hh': [number + ' horanim', number + ' hor'],
        'd': ['eka disan', 'ek dis'],
        'dd': [number + ' disanim', number + ' dis'],
        'M': ['eka mhoinean', 'ek mhoino'],
        'MM': [number + ' mhoineanim', number + ' mhoine'],
        'y': ['eka vorsan', 'ek voros'],
        'yy': [number + ' vorsanim', number + ' vorsam']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}

var gomLatn = moment.defineLocale('gom-latn', {
    months : 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
    monthsShort : 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son\'var'.split('_'),
    weekdaysShort : 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
    weekdaysMin : 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'A h:mm [vazta]',
        LTS : 'A h:mm:ss [vazta]',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY A h:mm [vazta]',
        LLLL : 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
        llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
    },
    calendar : {
        sameDay: '[Aiz] LT',
        nextDay: '[Faleam] LT',
        nextWeek: '[Ieta to] dddd[,] LT',
        lastDay: '[Kal] LT',
        lastWeek: '[Fatlo] dddd[,] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s',
        past : '%s adim',
        s : processRelativeTime,
        m : processRelativeTime,
        mm : processRelativeTime,
        h : processRelativeTime,
        hh : processRelativeTime,
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er)/,
    ordinal : function (number, period) {
        switch (period) {
            // the ordinal 'er' only applies to day of the month
            case 'D':
                return number + 'er';
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
            case 'w':
            case 'W':
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    },
    meridiemParse: /rati|sokalli|donparam|sanje/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'rati') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'sokalli') {
            return hour;
        } else if (meridiem === 'donparam') {
            return hour > 12 ? hour : hour + 12;
        } else if (meridiem === 'sanje') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'rati';
        } else if (hour < 12) {
            return 'sokalli';
        } else if (hour < 16) {
            return 'donparam';
        } else if (hour < 20) {
            return 'sanje';
        } else {
            return 'rati';
        }
    }
});

return gomLatn;

})));


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hebrew [he]
//! author : Tomer Cohen : https://github.com/tomer
//! author : Moshe Simantov : https://github.com/DevelopmentIL
//! author : Tal Ater : https://github.com/TalAter

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var he = moment.defineLocale('he', {
    months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
    monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
    weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
    weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
    weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [ב]MMMM YYYY',
        LLL : 'D [ב]MMMM YYYY HH:mm',
        LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
        l : 'D/M/YYYY',
        ll : 'D MMM YYYY',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd, D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[היום ב־]LT',
        nextDay : '[מחר ב־]LT',
        nextWeek : 'dddd [בשעה] LT',
        lastDay : '[אתמול ב־]LT',
        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'בעוד %s',
        past : 'לפני %s',
        s : 'מספר שניות',
        m : 'דקה',
        mm : '%d דקות',
        h : 'שעה',
        hh : function (number) {
            if (number === 2) {
                return 'שעתיים';
            }
            return number + ' שעות';
        },
        d : 'יום',
        dd : function (number) {
            if (number === 2) {
                return 'יומיים';
            }
            return number + ' ימים';
        },
        M : 'חודש',
        MM : function (number) {
            if (number === 2) {
                return 'חודשיים';
            }
            return number + ' חודשים';
        },
        y : 'שנה',
        yy : function (number) {
            if (number === 2) {
                return 'שנתיים';
            } else if (number % 10 === 0 && number !== 10) {
                return number + ' שנה';
            }
            return number + ' שנים';
        }
    },
    meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
    isPM : function (input) {
        return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 5) {
            return 'לפנות בוקר';
        } else if (hour < 10) {
            return 'בבוקר';
        } else if (hour < 12) {
            return isLower ? 'לפנה"צ' : 'לפני הצהריים';
        } else if (hour < 18) {
            return isLower ? 'אחה"צ' : 'אחרי הצהריים';
        } else {
            return 'בערב';
        }
    }
});

return he;

})));


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hindi [hi]
//! author : Mayank Singhal : https://github.com/mayanksinghal

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

var hi = moment.defineLocale('hi', {
    months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
    monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
    monthsParseExact: true,
    weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
    longDateFormat : {
        LT : 'A h:mm बजे',
        LTS : 'A h:mm:ss बजे',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm बजे',
        LLLL : 'dddd, D MMMM YYYY, A h:mm बजे'
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[कल] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[कल] LT',
        lastWeek : '[पिछले] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s में',
        past : '%s पहले',
        s : 'कुछ ही क्षण',
        m : 'एक मिनट',
        mm : '%d मिनट',
        h : 'एक घंटा',
        hh : '%d घंटे',
        d : 'एक दिन',
        dd : '%d दिन',
        M : 'एक महीने',
        MM : '%d महीने',
        y : 'एक वर्ष',
        yy : '%d वर्ष'
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
    meridiemParse: /रात|सुबह|दोपहर|शाम/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'रात') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'सुबह') {
            return hour;
        } else if (meridiem === 'दोपहर') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'शाम') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'रात';
        } else if (hour < 10) {
            return 'सुबह';
        } else if (hour < 17) {
            return 'दोपहर';
        } else if (hour < 20) {
            return 'शाम';
        } else {
            return 'रात';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return hi;

})));


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Croatian [hr]
//! author : Bojan Marković : https://github.com/bmarkovic

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function translate(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
        case 'mm':
            if (number === 1) {
                result += 'minuta';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'minute';
            } else {
                result += 'minuta';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'jedan sat' : 'jednog sata';
        case 'hh':
            if (number === 1) {
                result += 'sat';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'sata';
            } else {
                result += 'sati';
            }
            return result;
        case 'dd':
            if (number === 1) {
                result += 'dan';
            } else {
                result += 'dana';
            }
            return result;
        case 'MM':
            if (number === 1) {
                result += 'mjesec';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'mjeseca';
            } else {
                result += 'mjeseci';
            }
            return result;
        case 'yy':
            if (number === 1) {
                result += 'godina';
            } else if (number === 2 || number === 3 || number === 4) {
                result += 'godine';
            } else {
                result += 'godina';
            }
            return result;
    }
}

var hr = moment.defineLocale('hr', {
    months : {
        format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
        standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
    },
    monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danas u] LT',
        nextDay  : '[sutra u] LT',
        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[jučer u] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return '[prošlu] dddd [u] LT';
                case 6:
                    return '[prošle] [subote] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prošli] dddd [u] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'par sekundi',
        m      : translate,
        mm     : translate,
        h      : translate,
        hh     : translate,
        d      : 'dan',
        dd     : translate,
        M      : 'mjesec',
        MM     : translate,
        y      : 'godinu',
        yy     : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return hr;

})));


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
function translate(number, withoutSuffix, key, isFuture) {
    var num = number,
        suffix;
    switch (key) {
        case 's':
            return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
        case 'm':
            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
        case 'mm':
            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
        case 'h':
            return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
        case 'hh':
            return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
        case 'd':
            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
        case 'dd':
            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
        case 'M':
            return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
        case 'MM':
            return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
        case 'y':
            return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
        case 'yy':
            return num + (isFuture || withoutSuffix ? ' év' : ' éve');
    }
    return '';
}
function week(isFuture) {
    return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
}

var hu = moment.defineLocale('hu', {
    months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
    monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
    weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
    weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
    weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'YYYY.MM.DD.',
        LL : 'YYYY. MMMM D.',
        LLL : 'YYYY. MMMM D. H:mm',
        LLLL : 'YYYY. MMMM D., dddd H:mm'
    },
    meridiemParse: /de|du/i,
    isPM: function (input) {
        return input.charAt(1).toLowerCase() === 'u';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower === true ? 'de' : 'DE';
        } else {
            return isLower === true ? 'du' : 'DU';
        }
    },
    calendar : {
        sameDay : '[ma] LT[-kor]',
        nextDay : '[holnap] LT[-kor]',
        nextWeek : function () {
            return week.call(this, true);
        },
        lastDay : '[tegnap] LT[-kor]',
        lastWeek : function () {
            return week.call(this, false);
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s múlva',
        past : '%s',
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return hu;

})));


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Armenian [hy-am]
//! author : Armendarabyan : https://github.com/armendarabyan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var hyAm = moment.defineLocale('hy-am', {
    months : {
        format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
        standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
    },
    monthsShort : 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
    weekdays : 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
    weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY թ.',
        LLL : 'D MMMM YYYY թ., HH:mm',
        LLLL : 'dddd, D MMMM YYYY թ., HH:mm'
    },
    calendar : {
        sameDay: '[այսօր] LT',
        nextDay: '[վաղը] LT',
        lastDay: '[երեկ] LT',
        nextWeek: function () {
            return 'dddd [օրը ժամը] LT';
        },
        lastWeek: function () {
            return '[անցած] dddd [օրը ժամը] LT';
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s հետո',
        past : '%s առաջ',
        s : 'մի քանի վայրկյան',
        m : 'րոպե',
        mm : '%d րոպե',
        h : 'ժամ',
        hh : '%d ժամ',
        d : 'օր',
        dd : '%d օր',
        M : 'ամիս',
        MM : '%d ամիս',
        y : 'տարի',
        yy : '%d տարի'
    },
    meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
    isPM: function (input) {
        return /^(ցերեկվա|երեկոյան)$/.test(input);
    },
    meridiem : function (hour) {
        if (hour < 4) {
            return 'գիշերվա';
        } else if (hour < 12) {
            return 'առավոտվա';
        } else if (hour < 17) {
            return 'ցերեկվա';
        } else {
            return 'երեկոյան';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'DDD':
            case 'w':
            case 'W':
            case 'DDDo':
                if (number === 1) {
                    return number + '-ին';
                }
                return number + '-րդ';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return hyAm;

})));


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Indonesian [id]
//! author : Mohammad Satrio Utomo : https://github.com/tyok
//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var id = moment.defineLocale('id', {
    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
    weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|siang|sore|malam/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'siang') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'sore' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'siang';
        } else if (hours < 19) {
            return 'sore';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Besok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kemarin pukul] LT',
        lastWeek : 'dddd [lalu pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lalu',
        s : 'beberapa detik',
        m : 'semenit',
        mm : '%d menit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return id;

})));


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Icelandic [is]
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(n) {
    if (n % 100 === 11) {
        return true;
    } else if (n % 10 === 1) {
        return false;
    }
    return true;
}
function translate(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':
            return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
        case 'm':
            return withoutSuffix ? 'mínúta' : 'mínútu';
        case 'mm':
            if (plural(number)) {
                return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
            } else if (withoutSuffix) {
                return result + 'mínúta';
            }
            return result + 'mínútu';
        case 'hh':
            if (plural(number)) {
                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
            }
            return result + 'klukkustund';
        case 'd':
            if (withoutSuffix) {
                return 'dagur';
            }
            return isFuture ? 'dag' : 'degi';
        case 'dd':
            if (plural(number)) {
                if (withoutSuffix) {
                    return result + 'dagar';
                }
                return result + (isFuture ? 'daga' : 'dögum');
            } else if (withoutSuffix) {
                return result + 'dagur';
            }
            return result + (isFuture ? 'dag' : 'degi');
        case 'M':
            if (withoutSuffix) {
                return 'mánuður';
            }
            return isFuture ? 'mánuð' : 'mánuði';
        case 'MM':
            if (plural(number)) {
                if (withoutSuffix) {
                    return result + 'mánuðir';
                }
                return result + (isFuture ? 'mánuði' : 'mánuðum');
            } else if (withoutSuffix) {
                return result + 'mánuður';
            }
            return result + (isFuture ? 'mánuð' : 'mánuði');
        case 'y':
            return withoutSuffix || isFuture ? 'ár' : 'ári';
        case 'yy':
            if (plural(number)) {
                return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
            }
            return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
    }
}

var is = moment.defineLocale('is', {
    months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
    weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
    weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
    weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] H:mm',
        LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
    },
    calendar : {
        sameDay : '[í dag kl.] LT',
        nextDay : '[á morgun kl.] LT',
        nextWeek : 'dddd [kl.] LT',
        lastDay : '[í gær kl.] LT',
        lastWeek : '[síðasta] dddd [kl.] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'eftir %s',
        past : 'fyrir %s síðan',
        s : translate,
        m : translate,
        mm : translate,
        h : 'klukkustund',
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return is;

})));


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Italian [it]
//! author : Lorenzo : https://github.com/aliem
//! author: Mattia Larentis: https://github.com/nostalgiaz

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var it = moment.defineLocale('it', {
    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
    weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
    weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Oggi alle] LT',
        nextDay: '[Domani alle] LT',
        nextWeek: 'dddd [alle] LT',
        lastDay: '[Ieri alle] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[la scorsa] dddd [alle] LT';
                default:
                    return '[lo scorso] dddd [alle] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : function (s) {
            return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
        },
        past : '%s fa',
        s : 'alcuni secondi',
        m : 'un minuto',
        mm : '%d minuti',
        h : 'un\'ora',
        hh : '%d ore',
        d : 'un giorno',
        dd : '%d giorni',
        M : 'un mese',
        MM : '%d mesi',
        y : 'un anno',
        yy : '%d anni'
    },
    dayOfMonthOrdinalParse : /\d{1,2}º/,
    ordinal: '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return it;

})));


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Japanese [ja]
//! author : LI Long : https://github.com/baryon

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ja = moment.defineLocale('ja', {
    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY/MM/DD',
        LL : 'YYYY年M月D日',
        LLL : 'YYYY年M月D日 HH:mm',
        LLLL : 'YYYY年M月D日 HH:mm dddd',
        l : 'YYYY/MM/DD',
        ll : 'YYYY年M月D日',
        lll : 'YYYY年M月D日 HH:mm',
        llll : 'YYYY年M月D日 HH:mm dddd'
    },
    meridiemParse: /午前|午後/i,
    isPM : function (input) {
        return input === '午後';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return '午前';
        } else {
            return '午後';
        }
    },
    calendar : {
        sameDay : '[今日] LT',
        nextDay : '[明日] LT',
        nextWeek : '[来週]dddd LT',
        lastDay : '[昨日] LT',
        lastWeek : '[前週]dddd LT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse : /\d{1,2}日/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            default:
                return number;
        }
    },
    relativeTime : {
        future : '%s後',
        past : '%s前',
        s : '数秒',
        m : '1分',
        mm : '%d分',
        h : '1時間',
        hh : '%d時間',
        d : '1日',
        dd : '%d日',
        M : '1ヶ月',
        MM : '%dヶ月',
        y : '1年',
        yy : '%d年'
    }
});

return ja;

})));


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Javanese [jv]
//! author : Rony Lantip : https://github.com/lantip
//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var jv = moment.defineLocale('jv', {
    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
    weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
    weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /enjing|siyang|sonten|ndalu/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'enjing') {
            return hour;
        } else if (meridiem === 'siyang') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'enjing';
        } else if (hours < 15) {
            return 'siyang';
        } else if (hours < 19) {
            return 'sonten';
        } else {
            return 'ndalu';
        }
    },
    calendar : {
        sameDay : '[Dinten puniko pukul] LT',
        nextDay : '[Mbenjang pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kala wingi pukul] LT',
        lastWeek : 'dddd [kepengker pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'wonten ing %s',
        past : '%s ingkang kepengker',
        s : 'sawetawis detik',
        m : 'setunggal menit',
        mm : '%d menit',
        h : 'setunggal jam',
        hh : '%d jam',
        d : 'sedinten',
        dd : '%d dinten',
        M : 'sewulan',
        MM : '%d wulan',
        y : 'setaun',
        yy : '%d taun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return jv;

})));


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Georgian [ka]
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ka = moment.defineLocale('ka', {
    months : {
        standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
        format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
    },
    monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
    weekdays : {
        standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
        format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
        isFormat: /(წინა|შემდეგ)/
    },
    weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
    weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[დღეს] LT[-ზე]',
        nextDay : '[ხვალ] LT[-ზე]',
        lastDay : '[გუშინ] LT[-ზე]',
        nextWeek : '[შემდეგ] dddd LT[-ზე]',
        lastWeek : '[წინა] dddd LT-ზე',
        sameElse : 'L'
    },
    relativeTime : {
        future : function (s) {
            return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
                s.replace(/ი$/, 'ში') :
                s + 'ში';
        },
        past : function (s) {
            if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
                return s.replace(/(ი|ე)$/, 'ის უკან');
            }
            if ((/წელი/).test(s)) {
                return s.replace(/წელი$/, 'წლის უკან');
            }
        },
        s : 'რამდენიმე წამი',
        m : 'წუთი',
        mm : '%d წუთი',
        h : 'საათი',
        hh : '%d საათი',
        d : 'დღე',
        dd : '%d დღე',
        M : 'თვე',
        MM : '%d თვე',
        y : 'წელი',
        yy : '%d წელი'
    },
    dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
    ordinal : function (number) {
        if (number === 0) {
            return number;
        }
        if (number === 1) {
            return number + '-ლი';
        }
        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
            return 'მე-' + number;
        }
        return number + '-ე';
    },
    week : {
        dow : 1,
        doy : 7
    }
});

return ka;

})));


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kazakh [kk]
//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var suffixes = {
    0: '-ші',
    1: '-ші',
    2: '-ші',
    3: '-ші',
    4: '-ші',
    5: '-ші',
    6: '-шы',
    7: '-ші',
    8: '-ші',
    9: '-шы',
    10: '-шы',
    20: '-шы',
    30: '-шы',
    40: '-шы',
    50: '-ші',
    60: '-шы',
    70: '-ші',
    80: '-ші',
    90: '-шы',
    100: '-ші'
};

var kk = moment.defineLocale('kk', {
    months : 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
    monthsShort : 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
    weekdays : 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
    weekdaysShort : 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
    weekdaysMin : 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Бүгін сағат] LT',
        nextDay : '[Ертең сағат] LT',
        nextWeek : 'dddd [сағат] LT',
        lastDay : '[Кеше сағат] LT',
        lastWeek : '[Өткен аптаның] dddd [сағат] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ішінде',
        past : '%s бұрын',
        s : 'бірнеше секунд',
        m : 'бір минут',
        mm : '%d минут',
        h : 'бір сағат',
        hh : '%d сағат',
        d : 'бір күн',
        dd : '%d күн',
        M : 'бір ай',
        MM : '%d ай',
        y : 'бір жыл',
        yy : '%d жыл'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
    ordinal : function (number) {
        var a = number % 10,
            b = number >= 100 ? 100 : null;
        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return kk;

})));


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Cambodian [km]
//! author : Kruy Vanna : https://github.com/kruyvanna

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var km = moment.defineLocale('km', {
    months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
    weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS : 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
        nextDay: '[ស្អែក ម៉ោង] LT',
        nextWeek: 'dddd [ម៉ោង] LT',
        lastDay: '[ម្សិលមិញ ម៉ោង] LT',
        lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%sទៀត',
        past: '%sមុន',
        s: 'ប៉ុន្មានវិនាទី',
        m: 'មួយនាទី',
        mm: '%d នាទី',
        h: 'មួយម៉ោង',
        hh: '%d ម៉ោង',
        d: 'មួយថ្ងៃ',
        dd: '%d ថ្ងៃ',
        M: 'មួយខែ',
        MM: '%d ខែ',
        y: 'មួយឆ្នាំ',
        yy: '%d ឆ្នាំ'
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

return km;

})));


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kannada [kn]
//! author : Rajeev Naik : https://github.com/rajeevnaikte

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '೧',
    '2': '೨',
    '3': '೩',
    '4': '೪',
    '5': '೫',
    '6': '೬',
    '7': '೭',
    '8': '೮',
    '9': '೯',
    '0': '೦'
};
var numberMap = {
    '೧': '1',
    '೨': '2',
    '೩': '3',
    '೪': '4',
    '೫': '5',
    '೬': '6',
    '೭': '7',
    '೮': '8',
    '೯': '9',
    '೦': '0'
};

var kn = moment.defineLocale('kn', {
    months : 'ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್'.split('_'),
    monthsShort : 'ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ'.split('_'),
    monthsParseExact: true,
    weekdays : 'ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ'.split('_'),
    weekdaysShort : 'ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ'.split('_'),
    weekdaysMin : 'ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[ಇಂದು] LT',
        nextDay : '[ನಾಳೆ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ನಿನ್ನೆ] LT',
        lastWeek : '[ಕೊನೆಯ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ನಂತರ',
        past : '%s ಹಿಂದೆ',
        s : 'ಕೆಲವು ಕ್ಷಣಗಳು',
        m : 'ಒಂದು ನಿಮಿಷ',
        mm : '%d ನಿಮಿಷ',
        h : 'ಒಂದು ಗಂಟೆ',
        hh : '%d ಗಂಟೆ',
        d : 'ಒಂದು ದಿನ',
        dd : '%d ದಿನ',
        M : 'ಒಂದು ತಿಂಗಳು',
        MM : '%d ತಿಂಗಳು',
        y : 'ಒಂದು ವರ್ಷ',
        yy : '%d ವರ್ಷ'
    },
    preparse: function (string) {
        return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ರಾತ್ರಿ') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ಬೆಳಿಗ್ಗೆ') {
            return hour;
        } else if (meridiem === 'ಮಧ್ಯಾಹ್ನ') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'ಸಂಜೆ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ರಾತ್ರಿ';
        } else if (hour < 10) {
            return 'ಬೆಳಿಗ್ಗೆ';
        } else if (hour < 17) {
            return 'ಮಧ್ಯಾಹ್ನ';
        } else if (hour < 20) {
            return 'ಸಂಜೆ';
        } else {
            return 'ರಾತ್ರಿ';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
    ordinal : function (number) {
        return number + 'ನೇ';
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return kn;

})));


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Korean [ko]
//! author : Kyungwook, Park : https://github.com/kyungw00k
//! author : Jeeeyul Lee <jeeeyul@gmail.com>

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ko = moment.defineLocale('ko', {
    months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
    weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'YYYY.MM.DD',
        LL : 'YYYY년 MMMM D일',
        LLL : 'YYYY년 MMMM D일 A h:mm',
        LLLL : 'YYYY년 MMMM D일 dddd A h:mm',
        l : 'YYYY.MM.DD',
        ll : 'YYYY년 MMMM D일',
        lll : 'YYYY년 MMMM D일 A h:mm',
        llll : 'YYYY년 MMMM D일 dddd A h:mm'
    },
    calendar : {
        sameDay : '오늘 LT',
        nextDay : '내일 LT',
        nextWeek : 'dddd LT',
        lastDay : '어제 LT',
        lastWeek : '지난주 dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s 후',
        past : '%s 전',
        s : '몇 초',
        ss : '%d초',
        m : '1분',
        mm : '%d분',
        h : '한 시간',
        hh : '%d시간',
        d : '하루',
        dd : '%d일',
        M : '한 달',
        MM : '%d달',
        y : '일 년',
        yy : '%d년'
    },
    dayOfMonthOrdinalParse : /\d{1,2}일/,
    ordinal : '%d일',
    meridiemParse : /오전|오후/,
    isPM : function (token) {
        return token === '오후';
    },
    meridiem : function (hour, minute, isUpper) {
        return hour < 12 ? '오전' : '오후';
    }
});

return ko;

})));


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Kyrgyz [ky]
//! author : Chyngyz Arystan uulu : https://github.com/chyngyz

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';



var suffixes = {
    0: '-чү',
    1: '-чи',
    2: '-чи',
    3: '-чү',
    4: '-чү',
    5: '-чи',
    6: '-чы',
    7: '-чи',
    8: '-чи',
    9: '-чу',
    10: '-чу',
    20: '-чы',
    30: '-чу',
    40: '-чы',
    50: '-чү',
    60: '-чы',
    70: '-чи',
    80: '-чи',
    90: '-чу',
    100: '-чү'
};

var ky = moment.defineLocale('ky', {
    months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
    monthsShort : 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
    weekdays : 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
    weekdaysShort : 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
    weekdaysMin : 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Бүгүн саат] LT',
        nextDay : '[Эртең саат] LT',
        nextWeek : 'dddd [саат] LT',
        lastDay : '[Кече саат] LT',
        lastWeek : '[Өткен аптанын] dddd [күнү] [саат] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ичинде',
        past : '%s мурун',
        s : 'бирнече секунд',
        m : 'бир мүнөт',
        mm : '%d мүнөт',
        h : 'бир саат',
        hh : '%d саат',
        d : 'бир күн',
        dd : '%d күн',
        M : 'бир ай',
        MM : '%d ай',
        y : 'бир жыл',
        yy : '%d жыл'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
    ordinal : function (number) {
        var a = number % 10,
            b = number >= 100 ? 100 : null;
        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return ky;

})));


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Luxembourgish [lb]
//! author : mweimerskirch : https://github.com/mweimerskirch
//! author : David Raison : https://github.com/kwisatz

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        'm': ['eng Minutt', 'enger Minutt'],
        'h': ['eng Stonn', 'enger Stonn'],
        'd': ['een Dag', 'engem Dag'],
        'M': ['ee Mount', 'engem Mount'],
        'y': ['ee Joer', 'engem Joer']
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}
function processFutureTime(string) {
    var number = string.substr(0, string.indexOf(' '));
    if (eifelerRegelAppliesToNumber(number)) {
        return 'a ' + string;
    }
    return 'an ' + string;
}
function processPastTime(string) {
    var number = string.substr(0, string.indexOf(' '));
    if (eifelerRegelAppliesToNumber(number)) {
        return 'viru ' + string;
    }
    return 'virun ' + string;
}
/**
 * Returns true if the word before the given number loses the '-n' ending.
 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
 *
 * @param number {integer}
 * @returns {boolean}
 */
function eifelerRegelAppliesToNumber(number) {
    number = parseInt(number, 10);
    if (isNaN(number)) {
        return false;
    }
    if (number < 0) {
        // Negative Number --> always true
        return true;
    } else if (number < 10) {
        // Only 1 digit
        if (4 <= number && number <= 7) {
            return true;
        }
        return false;
    } else if (number < 100) {
        // 2 digits
        var lastDigit = number % 10, firstDigit = number / 10;
        if (lastDigit === 0) {
            return eifelerRegelAppliesToNumber(firstDigit);
        }
        return eifelerRegelAppliesToNumber(lastDigit);
    } else if (number < 10000) {
        // 3 or 4 digits --> recursively check first digit
        while (number >= 10) {
            number = number / 10;
        }
        return eifelerRegelAppliesToNumber(number);
    } else {
        // Anything larger than 4 digits: recursively check first n-3 digits
        number = number / 1000;
        return eifelerRegelAppliesToNumber(number);
    }
}

var lb = moment.defineLocale('lb', {
    months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
    monthsParseExact : true,
    weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
    weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
    weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm [Auer]',
        LTS: 'H:mm:ss [Auer]',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm [Auer]',
        LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
    },
    calendar: {
        sameDay: '[Haut um] LT',
        sameElse: 'L',
        nextDay: '[Muer um] LT',
        nextWeek: 'dddd [um] LT',
        lastDay: '[Gëschter um] LT',
        lastWeek: function () {
            // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
            switch (this.day()) {
                case 2:
                case 4:
                    return '[Leschten] dddd [um] LT';
                default:
                    return '[Leschte] dddd [um] LT';
            }
        }
    },
    relativeTime : {
        future : processFutureTime,
        past : processPastTime,
        s : 'e puer Sekonnen',
        m : processRelativeTime,
        mm : '%d Minutten',
        h : processRelativeTime,
        hh : '%d Stonnen',
        d : processRelativeTime,
        dd : '%d Deeg',
        M : processRelativeTime,
        MM : '%d Méint',
        y : processRelativeTime,
        yy : '%d Joer'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: '%d.',
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return lb;

})));


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Lao [lo]
//! author : Ryan Hart : https://github.com/ryanhart2

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var lo = moment.defineLocale('lo', {
    months : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
    monthsShort : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
    weekdays : 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    weekdaysShort : 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
    weekdaysMin : 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'ວັນdddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
    isPM: function (input) {
        return input === 'ຕອນແລງ';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ຕອນເຊົ້າ';
        } else {
            return 'ຕອນແລງ';
        }
    },
    calendar : {
        sameDay : '[ມື້ນີ້ເວລາ] LT',
        nextDay : '[ມື້ອື່ນເວລາ] LT',
        nextWeek : '[ວັນ]dddd[ໜ້າເວລາ] LT',
        lastDay : '[ມື້ວານນີ້ເວລາ] LT',
        lastWeek : '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ອີກ %s',
        past : '%sຜ່ານມາ',
        s : 'ບໍ່ເທົ່າໃດວິນາທີ',
        m : '1 ນາທີ',
        mm : '%d ນາທີ',
        h : '1 ຊົ່ວໂມງ',
        hh : '%d ຊົ່ວໂມງ',
        d : '1 ມື້',
        dd : '%d ມື້',
        M : '1 ເດືອນ',
        MM : '%d ເດືອນ',
        y : '1 ປີ',
        yy : '%d ປີ'
    },
    dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
    ordinal : function (number) {
        return 'ທີ່' + number;
    }
});

return lo;

})));


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Lithuanian [lt]
//! author : Mindaugas Mozūras : https://github.com/mmozuras

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var units = {
    'm' : 'minutė_minutės_minutę',
    'mm': 'minutės_minučių_minutes',
    'h' : 'valanda_valandos_valandą',
    'hh': 'valandos_valandų_valandas',
    'd' : 'diena_dienos_dieną',
    'dd': 'dienos_dienų_dienas',
    'M' : 'mėnuo_mėnesio_mėnesį',
    'MM': 'mėnesiai_mėnesių_mėnesius',
    'y' : 'metai_metų_metus',
    'yy': 'metai_metų_metus'
};
function translateSeconds(number, withoutSuffix, key, isFuture) {
    if (withoutSuffix) {
        return 'kelios sekundės';
    } else {
        return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
    }
}
function translateSingular(number, withoutSuffix, key, isFuture) {
    return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
}
function special(number) {
    return number % 10 === 0 || (number > 10 && number < 20);
}
function forms(key) {
    return units[key].split('_');
}
function translate(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    if (number === 1) {
        return result + translateSingular(number, withoutSuffix, key[0], isFuture);
    } else if (withoutSuffix) {
        return result + (special(number) ? forms(key)[1] : forms(key)[0]);
    } else {
        if (isFuture) {
            return result + forms(key)[1];
        } else {
            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
        }
    }
}
var lt = moment.defineLocale('lt', {
    months : {
        format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
        standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
        isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
    },
    monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
    weekdays : {
        format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
        standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
        isFormat: /dddd HH:mm/
    },
    weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
    weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'YYYY [m.] MMMM D [d.]',
        LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
        LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
        l : 'YYYY-MM-DD',
        ll : 'YYYY [m.] MMMM D [d.]',
        lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
        llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
    },
    calendar : {
        sameDay : '[Šiandien] LT',
        nextDay : '[Rytoj] LT',
        nextWeek : 'dddd LT',
        lastDay : '[Vakar] LT',
        lastWeek : '[Praėjusį] dddd LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'po %s',
        past : 'prieš %s',
        s : translateSeconds,
        m : translateSingular,
        mm : translate,
        h : translateSingular,
        hh : translate,
        d : translateSingular,
        dd : translate,
        M : translateSingular,
        MM : translate,
        y : translateSingular,
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}-oji/,
    ordinal : function (number) {
        return number + '-oji';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return lt;

})));


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Latvian [lv]
//! author : Kristaps Karlsons : https://github.com/skakri
//! author : Jānis Elmeris : https://github.com/JanisE

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var units = {
    'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
    'h': 'stundas_stundām_stunda_stundas'.split('_'),
    'hh': 'stundas_stundām_stunda_stundas'.split('_'),
    'd': 'dienas_dienām_diena_dienas'.split('_'),
    'dd': 'dienas_dienām_diena_dienas'.split('_'),
    'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
    'y': 'gada_gadiem_gads_gadi'.split('_'),
    'yy': 'gada_gadiem_gads_gadi'.split('_')
};
/**
 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
 */
function format(forms, number, withoutSuffix) {
    if (withoutSuffix) {
        // E.g. "21 minūte", "3 minūtes".
        return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
    } else {
        // E.g. "21 minūtes" as in "pēc 21 minūtes".
        // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
        return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
    }
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    return number + ' ' + format(units[key], number, withoutSuffix);
}
function relativeTimeWithSingular(number, withoutSuffix, key) {
    return format(units[key], number, withoutSuffix);
}
function relativeSeconds(number, withoutSuffix) {
    return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
}

var lv = moment.defineLocale('lv', {
    months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
    weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
    weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY.',
        LL : 'YYYY. [gada] D. MMMM',
        LLL : 'YYYY. [gada] D. MMMM, HH:mm',
        LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
    },
    calendar : {
        sameDay : '[Šodien pulksten] LT',
        nextDay : '[Rīt pulksten] LT',
        nextWeek : 'dddd [pulksten] LT',
        lastDay : '[Vakar pulksten] LT',
        lastWeek : '[Pagājušā] dddd [pulksten] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'pēc %s',
        past : 'pirms %s',
        s : relativeSeconds,
        m : relativeTimeWithSingular,
        mm : relativeTimeWithPlural,
        h : relativeTimeWithSingular,
        hh : relativeTimeWithPlural,
        d : relativeTimeWithSingular,
        dd : relativeTimeWithPlural,
        M : relativeTimeWithSingular,
        MM : relativeTimeWithPlural,
        y : relativeTimeWithSingular,
        yy : relativeTimeWithPlural
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return lv;

})));


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Montenegrin [me]
//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var translator = {
    words: { //Different grammatical cases
        m: ['jedan minut', 'jednog minuta'],
        mm: ['minut', 'minuta', 'minuta'],
        h: ['jedan sat', 'jednog sata'],
        hh: ['sat', 'sata', 'sati'],
        dd: ['dan', 'dana', 'dana'],
        MM: ['mjesec', 'mjeseca', 'mjeseci'],
        yy: ['godina', 'godine', 'godina']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
        }
    }
};

var me = moment.defineLocale('me', {
    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact : true,
    weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
    weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[danas u] LT',
        nextDay: '[sjutra u] LT',

        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedjelju] [u] LT';
                case 3:
                    return '[u] [srijedu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[juče u] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[prošle] [nedjelje] [u] LT',
                '[prošlog] [ponedjeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srijede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'prije %s',
        s      : 'nekoliko sekundi',
        m      : translator.translate,
        mm     : translator.translate,
        h      : translator.translate,
        hh     : translator.translate,
        d      : 'dan',
        dd     : translator.translate,
        M      : 'mjesec',
        MM     : translator.translate,
        y      : 'godinu',
        yy     : translator.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return me;

})));


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Maori [mi]
//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var mi = moment.defineLocale('mi', {
    months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
    monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
    monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
    monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
    weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
    weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY [i] HH:mm',
        LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
    },
    calendar: {
        sameDay: '[i teie mahana, i] LT',
        nextDay: '[apopo i] LT',
        nextWeek: 'dddd [i] LT',
        lastDay: '[inanahi i] LT',
        lastWeek: 'dddd [whakamutunga i] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'i roto i %s',
        past: '%s i mua',
        s: 'te hēkona ruarua',
        m: 'he meneti',
        mm: '%d meneti',
        h: 'te haora',
        hh: '%d haora',
        d: 'he ra',
        dd: '%d ra',
        M: 'he marama',
        MM: '%d marama',
        y: 'he tau',
        yy: '%d tau'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return mi;

})));


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Macedonian [mk]
//! author : Borislav Mickov : https://github.com/B0k0

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var mk = moment.defineLocale('mk', {
    months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
    monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
    weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
    weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
    weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'D.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay : '[Денес во] LT',
        nextDay : '[Утре во] LT',
        nextWeek : '[Во] dddd [во] LT',
        lastDay : '[Вчера во] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return '[Изминатата] dddd [во] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[Изминатиот] dddd [во] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'после %s',
        past : 'пред %s',
        s : 'неколку секунди',
        m : 'минута',
        mm : '%d минути',
        h : 'час',
        hh : '%d часа',
        d : 'ден',
        dd : '%d дена',
        M : 'месец',
        MM : '%d месеци',
        y : 'година',
        yy : '%d години'
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
    ordinal : function (number) {
        var lastDigit = number % 10,
            last2Digits = number % 100;
        if (number === 0) {
            return number + '-ев';
        } else if (last2Digits === 0) {
            return number + '-ен';
        } else if (last2Digits > 10 && last2Digits < 20) {
            return number + '-ти';
        } else if (lastDigit === 1) {
            return number + '-ви';
        } else if (lastDigit === 2) {
            return number + '-ри';
        } else if (lastDigit === 7 || lastDigit === 8) {
            return number + '-ми';
        } else {
            return number + '-ти';
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return mk;

})));


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malayalam [ml]
//! author : Floyd Pink : https://github.com/floydpink

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ml = moment.defineLocale('ml', {
    months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
    monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
    monthsParseExact : true,
    weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
    weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
    weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm -നു',
        LTS : 'A h:mm:ss -നു',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm -നു',
        LLLL : 'dddd, D MMMM YYYY, A h:mm -നു'
    },
    calendar : {
        sameDay : '[ഇന്ന്] LT',
        nextDay : '[നാളെ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ഇന്നലെ] LT',
        lastWeek : '[കഴിഞ്ഞ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s കഴിഞ്ഞ്',
        past : '%s മുൻപ്',
        s : 'അൽപ നിമിഷങ്ങൾ',
        m : 'ഒരു മിനിറ്റ്',
        mm : '%d മിനിറ്റ്',
        h : 'ഒരു മണിക്കൂർ',
        hh : '%d മണിക്കൂർ',
        d : 'ഒരു ദിവസം',
        dd : '%d ദിവസം',
        M : 'ഒരു മാസം',
        MM : '%d മാസം',
        y : 'ഒരു വർഷം',
        yy : '%d വർഷം'
    },
    meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if ((meridiem === 'രാത്രി' && hour >= 4) ||
                meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
                meridiem === 'വൈകുന്നേരം') {
            return hour + 12;
        } else {
            return hour;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'രാത്രി';
        } else if (hour < 12) {
            return 'രാവിലെ';
        } else if (hour < 17) {
            return 'ഉച്ച കഴിഞ്ഞ്';
        } else if (hour < 20) {
            return 'വൈകുന്നേരം';
        } else {
            return 'രാത്രി';
        }
    }
});

return ml;

})));


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Marathi [mr]
//! author : Harshad Kale : https://github.com/kalehv
//! author : Vivek Athalye : https://github.com/vnathalye

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

function relativeTimeMr(number, withoutSuffix, string, isFuture)
{
    var output = '';
    if (withoutSuffix) {
        switch (string) {
            case 's': output = 'काही सेकंद'; break;
            case 'm': output = 'एक मिनिट'; break;
            case 'mm': output = '%d मिनिटे'; break;
            case 'h': output = 'एक तास'; break;
            case 'hh': output = '%d तास'; break;
            case 'd': output = 'एक दिवस'; break;
            case 'dd': output = '%d दिवस'; break;
            case 'M': output = 'एक महिना'; break;
            case 'MM': output = '%d महिने'; break;
            case 'y': output = 'एक वर्ष'; break;
            case 'yy': output = '%d वर्षे'; break;
        }
    }
    else {
        switch (string) {
            case 's': output = 'काही सेकंदां'; break;
            case 'm': output = 'एका मिनिटा'; break;
            case 'mm': output = '%d मिनिटां'; break;
            case 'h': output = 'एका तासा'; break;
            case 'hh': output = '%d तासां'; break;
            case 'd': output = 'एका दिवसा'; break;
            case 'dd': output = '%d दिवसां'; break;
            case 'M': output = 'एका महिन्या'; break;
            case 'MM': output = '%d महिन्यां'; break;
            case 'y': output = 'एका वर्षा'; break;
            case 'yy': output = '%d वर्षां'; break;
        }
    }
    return output.replace(/%d/i, number);
}

var mr = moment.defineLocale('mr', {
    months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
    monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
    monthsParseExact : true,
    weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
    longDateFormat : {
        LT : 'A h:mm वाजता',
        LTS : 'A h:mm:ss वाजता',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm वाजता',
        LLLL : 'dddd, D MMMM YYYY, A h:mm वाजता'
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[उद्या] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[काल] LT',
        lastWeek: '[मागील] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future: '%sमध्ये',
        past: '%sपूर्वी',
        s: relativeTimeMr,
        m: relativeTimeMr,
        mm: relativeTimeMr,
        h: relativeTimeMr,
        hh: relativeTimeMr,
        d: relativeTimeMr,
        dd: relativeTimeMr,
        M: relativeTimeMr,
        MM: relativeTimeMr,
        y: relativeTimeMr,
        yy: relativeTimeMr
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'रात्री') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'सकाळी') {
            return hour;
        } else if (meridiem === 'दुपारी') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'सायंकाळी') {
            return hour + 12;
        }
    },
    meridiem: function (hour, minute, isLower) {
        if (hour < 4) {
            return 'रात्री';
        } else if (hour < 10) {
            return 'सकाळी';
        } else if (hour < 17) {
            return 'दुपारी';
        } else if (hour < 20) {
            return 'सायंकाळी';
        } else {
            return 'रात्री';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return mr;

})));


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malay [ms-my]
//! note : DEPRECATED, the correct one is [ms]
//! author : Weldan Jamili : https://github.com/weldan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var msMy = moment.defineLocale('ms-my', {
    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|tengahari|petang|malam/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'tengahari') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'petang' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'tengahari';
        } else if (hours < 19) {
            return 'petang';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Esok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kelmarin pukul] LT',
        lastWeek : 'dddd [lepas pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lepas',
        s : 'beberapa saat',
        m : 'seminit',
        mm : '%d minit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return msMy;

})));


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Malay [ms]
//! author : Weldan Jamili : https://github.com/weldan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ms = moment.defineLocale('ms', {
    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [pukul] HH.mm',
        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
    },
    meridiemParse: /pagi|tengahari|petang|malam/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'pagi') {
            return hour;
        } else if (meridiem === 'tengahari') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'petang' || meridiem === 'malam') {
            return hour + 12;
        }
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'pagi';
        } else if (hours < 15) {
            return 'tengahari';
        } else if (hours < 19) {
            return 'petang';
        } else {
            return 'malam';
        }
    },
    calendar : {
        sameDay : '[Hari ini pukul] LT',
        nextDay : '[Esok pukul] LT',
        nextWeek : 'dddd [pukul] LT',
        lastDay : '[Kelmarin pukul] LT',
        lastWeek : 'dddd [lepas pukul] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dalam %s',
        past : '%s yang lepas',
        s : 'beberapa saat',
        m : 'seminit',
        mm : '%d minit',
        h : 'sejam',
        hh : '%d jam',
        d : 'sehari',
        dd : '%d hari',
        M : 'sebulan',
        MM : '%d bulan',
        y : 'setahun',
        yy : '%d tahun'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return ms;

})));


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Burmese [my]
//! author : Squar team, mysquar.com
//! author : David Rossellat : https://github.com/gholadr
//! author : Tin Aung Lin : https://github.com/thanyawzinmin

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉',
    '0': '၀'
};
var numberMap = {
    '၁': '1',
    '၂': '2',
    '၃': '3',
    '၄': '4',
    '၅': '5',
    '၆': '6',
    '၇': '7',
    '၈': '8',
    '၉': '9',
    '၀': '0'
};

var my = moment.defineLocale('my', {
    months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
    monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
    weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
    weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
    weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[ယနေ.] LT [မှာ]',
        nextDay: '[မနက်ဖြန်] LT [မှာ]',
        nextWeek: 'dddd LT [မှာ]',
        lastDay: '[မနေ.က] LT [မှာ]',
        lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'လာမည့် %s မှာ',
        past: 'လွန်ခဲ့သော %s က',
        s: 'စက္ကန်.အနည်းငယ်',
        m: 'တစ်မိနစ်',
        mm: '%d မိနစ်',
        h: 'တစ်နာရီ',
        hh: '%d နာရီ',
        d: 'တစ်ရက်',
        dd: '%d ရက်',
        M: 'တစ်လ',
        MM: '%d လ',
        y: 'တစ်နှစ်',
        yy: '%d နှစ်'
    },
    preparse: function (string) {
        return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 1st is the first week of the year.
    }
});

return my;

})));


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Norwegian Bokmål [nb]
//! authors : Espen Hovlandsdal : https://github.com/rexxars
//!           Sigurd Gartmann : https://github.com/sigurdga

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var nb = moment.defineLocale('nb', {
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
    monthsParseExact : true,
    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
    weekdaysShort : 'sø._ma._ti._on._to._fr._lø.'.split('_'),
    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] HH:mm',
        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay: '[i dag kl.] LT',
        nextDay: '[i morgen kl.] LT',
        nextWeek: 'dddd [kl.] LT',
        lastDay: '[i går kl.] LT',
        lastWeek: '[forrige] dddd [kl.] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s siden',
        s : 'noen sekunder',
        m : 'ett minutt',
        mm : '%d minutter',
        h : 'en time',
        hh : '%d timer',
        d : 'en dag',
        dd : '%d dager',
        M : 'en måned',
        MM : '%d måneder',
        y : 'ett år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return nb;

})));


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Nepalese [ne]
//! author : suvash : https://github.com/suvash

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',
    '0': '०'
};
var numberMap = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};

var ne = moment.defineLocale('ne', {
    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
    monthsParseExact : true,
    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
    weekdaysMin : 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'Aको h:mm बजे',
        LTS : 'Aको h:mm:ss बजे',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, Aको h:mm बजे',
        LLLL : 'dddd, D MMMM YYYY, Aको h:mm बजे'
    },
    preparse: function (string) {
        return string.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'राति') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'बिहान') {
            return hour;
        } else if (meridiem === 'दिउँसो') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'साँझ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 3) {
            return 'राति';
        } else if (hour < 12) {
            return 'बिहान';
        } else if (hour < 16) {
            return 'दिउँसो';
        } else if (hour < 20) {
            return 'साँझ';
        } else {
            return 'राति';
        }
    },
    calendar : {
        sameDay : '[आज] LT',
        nextDay : '[भोलि] LT',
        nextWeek : '[आउँदो] dddd[,] LT',
        lastDay : '[हिजो] LT',
        lastWeek : '[गएको] dddd[,] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%sमा',
        past : '%s अगाडि',
        s : 'केही क्षण',
        m : 'एक मिनेट',
        mm : '%d मिनेट',
        h : 'एक घण्टा',
        hh : '%d घण्टा',
        d : 'एक दिन',
        dd : '%d दिन',
        M : 'एक महिना',
        MM : '%d महिना',
        y : 'एक बर्ष',
        yy : '%d बर्ष'
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return ne;

})));


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Dutch (Belgium) [nl-be]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

var nlBe = moment.defineLocale('nl-be', {
    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots[m.month()];
        } else {
            return monthsShortWithDots[m.month()];
        }
    },

    monthsRegex: monthsRegex,
    monthsShortRegex: monthsRegex,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'over %s',
        past : '%s geleden',
        s : 'een paar seconden',
        m : 'één minuut',
        mm : '%d minuten',
        h : 'één uur',
        hh : '%d uur',
        d : 'één dag',
        dd : '%d dagen',
        M : 'één maand',
        MM : '%d maanden',
        y : 'één jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return nlBe;

})));


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Dutch [nl]
//! author : Joris Röling : https://github.com/jorisroling
//! author : Jacob Middag : https://github.com/middagj

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

var nl = moment.defineLocale('nl', {
    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort : function (m, format) {
        if (!m) {
            return monthsShortWithDots;
        } else if (/-MMM-/.test(format)) {
            return monthsShortWithoutDots[m.month()];
        } else {
            return monthsShortWithDots[m.month()];
        }
    },

    monthsRegex: monthsRegex,
    monthsShortRegex: monthsRegex,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD-MM-YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'over %s',
        past : '%s geleden',
        s : 'een paar seconden',
        m : 'één minuut',
        mm : '%d minuten',
        h : 'één uur',
        hh : '%d uur',
        d : 'één dag',
        dd : '%d dagen',
        M : 'één maand',
        MM : '%d maanden',
        y : 'één jaar',
        yy : '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal : function (number) {
        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return nl;

})));


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Nynorsk [nn]
//! author : https://github.com/mechuwind

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var nn = moment.defineLocale('nn', {
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
    weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
    weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
    weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY [kl.] H:mm',
        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
    },
    calendar : {
        sameDay: '[I dag klokka] LT',
        nextDay: '[I morgon klokka] LT',
        nextWeek: 'dddd [klokka] LT',
        lastDay: '[I går klokka] LT',
        lastWeek: '[Føregåande] dddd [klokka] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : '%s sidan',
        s : 'nokre sekund',
        m : 'eit minutt',
        mm : '%d minutt',
        h : 'ein time',
        hh : '%d timar',
        d : 'ein dag',
        dd : '%d dagar',
        M : 'ein månad',
        MM : '%d månader',
        y : 'eit år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return nn;

})));


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Punjabi (India) [pa-in]
//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '੧',
    '2': '੨',
    '3': '੩',
    '4': '੪',
    '5': '੫',
    '6': '੬',
    '7': '੭',
    '8': '੮',
    '9': '੯',
    '0': '੦'
};
var numberMap = {
    '੧': '1',
    '੨': '2',
    '੩': '3',
    '੪': '4',
    '੫': '5',
    '੬': '6',
    '੭': '7',
    '੮': '8',
    '੯': '9',
    '੦': '0'
};

var paIn = moment.defineLocale('pa-in', {
    // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
    months : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
    monthsShort : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
    weekdays : 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
    weekdaysShort : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    weekdaysMin : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm ਵਜੇ',
        LTS : 'A h:mm:ss ਵਜੇ',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm ਵਜੇ',
        LLLL : 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
    },
    calendar : {
        sameDay : '[ਅਜ] LT',
        nextDay : '[ਕਲ] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[ਕਲ] LT',
        lastWeek : '[ਪਿਛਲੇ] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s ਵਿੱਚ',
        past : '%s ਪਿਛਲੇ',
        s : 'ਕੁਝ ਸਕਿੰਟ',
        m : 'ਇਕ ਮਿੰਟ',
        mm : '%d ਮਿੰਟ',
        h : 'ਇੱਕ ਘੰਟਾ',
        hh : '%d ਘੰਟੇ',
        d : 'ਇੱਕ ਦਿਨ',
        dd : '%d ਦਿਨ',
        M : 'ਇੱਕ ਮਹੀਨਾ',
        MM : '%d ਮਹੀਨੇ',
        y : 'ਇੱਕ ਸਾਲ',
        yy : '%d ਸਾਲ'
    },
    preparse: function (string) {
        return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
    meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ਰਾਤ') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ਸਵੇਰ') {
            return hour;
        } else if (meridiem === 'ਦੁਪਹਿਰ') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'ਸ਼ਾਮ') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ਰਾਤ';
        } else if (hour < 10) {
            return 'ਸਵੇਰ';
        } else if (hour < 17) {
            return 'ਦੁਪਹਿਰ';
        } else if (hour < 20) {
            return 'ਸ਼ਾਮ';
        } else {
            return 'ਰਾਤ';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return paIn;

})));


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Polish [pl]
//! author : Rafal Hirsz : https://github.com/evoL

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
function plural(n) {
    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
}
function translate(number, withoutSuffix, key) {
    var result = number + ' ';
    switch (key) {
        case 'm':
            return withoutSuffix ? 'minuta' : 'minutę';
        case 'mm':
            return result + (plural(number) ? 'minuty' : 'minut');
        case 'h':
            return withoutSuffix  ? 'godzina'  : 'godzinę';
        case 'hh':
            return result + (plural(number) ? 'godziny' : 'godzin');
        case 'MM':
            return result + (plural(number) ? 'miesiące' : 'miesięcy');
        case 'yy':
            return result + (plural(number) ? 'lata' : 'lat');
    }
}

var pl = moment.defineLocale('pl', {
    months : function (momentToFormat, format) {
        if (!momentToFormat) {
            return monthsNominative;
        } else if (format === '') {
            // Hack: if format empty we know this is used to generate
            // RegExp by moment. Give then back both valid forms of months
            // in RegExp ready format.
            return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
        } else if (/D MMMM/.test(format)) {
            return monthsSubjective[momentToFormat.month()];
        } else {
            return monthsNominative[momentToFormat.month()];
        }
    },
    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
    weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
    weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Dziś o] LT',
        nextDay: '[Jutro o] LT',
        nextWeek: '[W] dddd [o] LT',
        lastDay: '[Wczoraj o] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[W zeszłą niedzielę o] LT';
                case 3:
                    return '[W zeszłą środę o] LT';
                case 6:
                    return '[W zeszłą sobotę o] LT';
                default:
                    return '[W zeszły] dddd [o] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : '%s temu',
        s : 'kilka sekund',
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : '1 dzień',
        dd : '%d dni',
        M : 'miesiąc',
        MM : translate,
        y : 'rok',
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return pl;

})));


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var ptBr = moment.defineLocale('pt-br', {
    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'em %s',
        past : '%s atrás',
        s : 'poucos segundos',
        m : 'um minuto',
        mm : '%d minutos',
        h : 'uma hora',
        hh : '%d horas',
        d : 'um dia',
        dd : '%d dias',
        M : 'um mês',
        MM : '%d meses',
        y : 'um ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal : '%dº'
});

return ptBr;

})));


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Portuguese [pt]
//! author : Jefferson : https://github.com/jalex79

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var pt = moment.defineLocale('pt', {
    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    weekdays : 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin : 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D [de] MMMM [de] YYYY',
        LLL : 'D [de] MMMM [de] YYYY HH:mm',
        LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'em %s',
        past : 'há %s',
        s : 'segundos',
        m : 'um minuto',
        mm : '%d minutos',
        h : 'uma hora',
        hh : '%d horas',
        d : 'um dia',
        dd : '%d dias',
        M : 'um mês',
        MM : '%d meses',
        y : 'um ano',
        yy : '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal : '%dº',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return pt;

})));


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Romanian [ro]
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
            'mm': 'minute',
            'hh': 'ore',
            'dd': 'zile',
            'MM': 'luni',
            'yy': 'ani'
        },
        separator = ' ';
    if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
        separator = ' de ';
    }
    return number + separator + format[key];
}

var ro = moment.defineLocale('ro', {
    months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
    monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
    weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
    weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY H:mm',
        LLLL : 'dddd, D MMMM YYYY H:mm'
    },
    calendar : {
        sameDay: '[azi la] LT',
        nextDay: '[mâine la] LT',
        nextWeek: 'dddd [la] LT',
        lastDay: '[ieri la] LT',
        lastWeek: '[fosta] dddd [la] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'peste %s',
        past : '%s în urmă',
        s : 'câteva secunde',
        m : 'un minut',
        mm : relativeTimeWithPlural,
        h : 'o oră',
        hh : relativeTimeWithPlural,
        d : 'o zi',
        dd : relativeTimeWithPlural,
        M : 'o lună',
        MM : relativeTimeWithPlural,
        y : 'un an',
        yy : relativeTimeWithPlural
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return ro;

})));


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дня_дней',
        'MM': 'месяц_месяца_месяцев',
        'yy': 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}
var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = moment.defineLocale('ru', {
    months : {
        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
    },
    monthsShort : {
        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
    },
    weekdays : {
        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // копия предыдущего
    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // полные названия с падежами
    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

    // Выражение, которое соотвествует только сокращённым формам
    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[Сегодня в] LT',
        nextDay: '[Завтра в] LT',
        lastDay: '[Вчера в] LT',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В следующее] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В следующий] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В следующую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В прошлое] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В прошлый] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В прошлую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'через %s',
        past : '%s назад',
        s : 'несколько секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : 'час',
        hh : relativeTimeWithPlural,
        d : 'день',
        dd : relativeTimeWithPlural,
        M : 'месяц',
        MM : relativeTimeWithPlural,
        y : 'год',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /ночи|утра|дня|вечера/i,
    isPM : function (input) {
        return /^(дня|вечера)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночи';
        } else if (hour < 12) {
            return 'утра';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечера';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-й';
            case 'D':
                return number + '-го';
            case 'w':
            case 'W':
                return number + '-я';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return ru;

})));


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Sindhi [sd]
//! author : Narain Sagar : https://github.com/narainsagar

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = [
    'جنوري',
    'فيبروري',
    'مارچ',
    'اپريل',
    'مئي',
    'جون',
    'جولاءِ',
    'آگسٽ',
    'سيپٽمبر',
    'آڪٽوبر',
    'نومبر',
    'ڊسمبر'
];
var days = [
    'آچر',
    'سومر',
    'اڱارو',
    'اربع',
    'خميس',
    'جمع',
    'ڇنڇر'
];

var sd = moment.defineLocale('sd', {
    months : months,
    monthsShort : months,
    weekdays : days,
    weekdaysShort : days,
    weekdaysMin : days,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd، D MMMM YYYY HH:mm'
    },
    meridiemParse: /صبح|شام/,
    isPM : function (input) {
        return 'شام' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'صبح';
        }
        return 'شام';
    },
    calendar : {
        sameDay : '[اڄ] LT',
        nextDay : '[سڀاڻي] LT',
        nextWeek : 'dddd [اڳين هفتي تي] LT',
        lastDay : '[ڪالهه] LT',
        lastWeek : '[گزريل هفتي] dddd [تي] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s پوء',
        past : '%s اڳ',
        s : 'چند سيڪنڊ',
        m : 'هڪ منٽ',
        mm : '%d منٽ',
        h : 'هڪ ڪلاڪ',
        hh : '%d ڪلاڪ',
        d : 'هڪ ڏينهن',
        dd : '%d ڏينهن',
        M : 'هڪ مهينو',
        MM : '%d مهينا',
        y : 'هڪ سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return sd;

})));


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Northern Sami [se]
//! authors : Bård Rolstad Henriksen : https://github.com/karamell

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';



var se = moment.defineLocale('se', {
    months : 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
    monthsShort : 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
    weekdays : 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
    weekdaysShort : 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
    weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'MMMM D. [b.] YYYY',
        LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
        LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
    },
    calendar : {
        sameDay: '[otne ti] LT',
        nextDay: '[ihttin ti] LT',
        nextWeek: 'dddd [ti] LT',
        lastDay: '[ikte ti] LT',
        lastWeek: '[ovddit] dddd [ti] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s geažes',
        past : 'maŋit %s',
        s : 'moadde sekunddat',
        m : 'okta minuhta',
        mm : '%d minuhtat',
        h : 'okta diimmu',
        hh : '%d diimmut',
        d : 'okta beaivi',
        dd : '%d beaivvit',
        M : 'okta mánnu',
        MM : '%d mánut',
        y : 'okta jahki',
        yy : '%d jagit'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return se;

})));


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Sinhalese [si]
//! author : Sampath Sitinamaluwa : https://github.com/sampathsris

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


/*jshint -W100*/
var si = moment.defineLocale('si', {
    months : 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
    monthsShort : 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
    weekdays : 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
    weekdaysShort : 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
    weekdaysMin : 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'a h:mm',
        LTS : 'a h:mm:ss',
        L : 'YYYY/MM/DD',
        LL : 'YYYY MMMM D',
        LLL : 'YYYY MMMM D, a h:mm',
        LLLL : 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
    },
    calendar : {
        sameDay : '[අද] LT[ට]',
        nextDay : '[හෙට] LT[ට]',
        nextWeek : 'dddd LT[ට]',
        lastDay : '[ඊයේ] LT[ට]',
        lastWeek : '[පසුගිය] dddd LT[ට]',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%sකින්',
        past : '%sකට පෙර',
        s : 'තත්පර කිහිපය',
        m : 'මිනිත්තුව',
        mm : 'මිනිත්තු %d',
        h : 'පැය',
        hh : 'පැය %d',
        d : 'දිනය',
        dd : 'දින %d',
        M : 'මාසය',
        MM : 'මාස %d',
        y : 'වසර',
        yy : 'වසර %d'
    },
    dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
    ordinal : function (number) {
        return number + ' වැනි';
    },
    meridiemParse : /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
    isPM : function (input) {
        return input === 'ප.ව.' || input === 'පස් වරු';
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'ප.ව.' : 'පස් වරු';
        } else {
            return isLower ? 'පෙ.ව.' : 'පෙර වරු';
        }
    }
});

return si;

})));


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Slovak [sk]
//! author : Martin Minka : https://github.com/k2s
//! based on work of petrbela : https://github.com/petrbela

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
var monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
function plural(n) {
    return (n > 1) && (n < 5);
}
function translate(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':  // a few seconds / in a few seconds / a few seconds ago
            return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
        case 'm':  // a minute / in a minute / a minute ago
            return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'minúty' : 'minút');
            } else {
                return result + 'minútami';
            }
            break;
        case 'h':  // an hour / in an hour / an hour ago
            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
        case 'hh': // 9 hours / in 9 hours / 9 hours ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'hodiny' : 'hodín');
            } else {
                return result + 'hodinami';
            }
            break;
        case 'd':  // a day / in a day / a day ago
            return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
        case 'dd': // 9 days / in 9 days / 9 days ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'dni' : 'dní');
            } else {
                return result + 'dňami';
            }
            break;
        case 'M':  // a month / in a month / a month ago
            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
        case 'MM': // 9 months / in 9 months / 9 months ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'mesiace' : 'mesiacov');
            } else {
                return result + 'mesiacmi';
            }
            break;
        case 'y':  // a year / in a year / a year ago
            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
        case 'yy': // 9 years / in 9 years / 9 years ago
            if (withoutSuffix || isFuture) {
                return result + (plural(number) ? 'roky' : 'rokov');
            } else {
                return result + 'rokmi';
            }
            break;
    }
}

var sk = moment.defineLocale('sk', {
    months : months,
    monthsShort : monthsShort,
    weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
    weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
    weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
    longDateFormat : {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay: '[dnes o] LT',
        nextDay: '[zajtra o] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[v nedeľu o] LT';
                case 1:
                case 2:
                    return '[v] dddd [o] LT';
                case 3:
                    return '[v stredu o] LT';
                case 4:
                    return '[vo štvrtok o] LT';
                case 5:
                    return '[v piatok o] LT';
                case 6:
                    return '[v sobotu o] LT';
            }
        },
        lastDay: '[včera o] LT',
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[minulú nedeľu o] LT';
                case 1:
                case 2:
                    return '[minulý] dddd [o] LT';
                case 3:
                    return '[minulú stredu o] LT';
                case 4:
                case 5:
                    return '[minulý] dddd [o] LT';
                case 6:
                    return '[minulú sobotu o] LT';
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'za %s',
        past : 'pred %s',
        s : translate,
        m : translate,
        mm : translate,
        h : translate,
        hh : translate,
        d : translate,
        dd : translate,
        M : translate,
        MM : translate,
        y : translate,
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return sk;

})));


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Slovenian [sl]
//! author : Robert Sedovšek : https://github.com/sedovsek

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var result = number + ' ';
    switch (key) {
        case 's':
            return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
        case 'm':
            return withoutSuffix ? 'ena minuta' : 'eno minuto';
        case 'mm':
            if (number === 1) {
                result += withoutSuffix ? 'minuta' : 'minuto';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'minute' : 'minutami';
            } else {
                result += withoutSuffix || isFuture ? 'minut' : 'minutami';
            }
            return result;
        case 'h':
            return withoutSuffix ? 'ena ura' : 'eno uro';
        case 'hh':
            if (number === 1) {
                result += withoutSuffix ? 'ura' : 'uro';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'uri' : 'urama';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'ure' : 'urami';
            } else {
                result += withoutSuffix || isFuture ? 'ur' : 'urami';
            }
            return result;
        case 'd':
            return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
        case 'dd':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'dan' : 'dnem';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
            } else {
                result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
            }
            return result;
        case 'M':
            return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
        case 'MM':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
            } else {
                result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
            }
            return result;
        case 'y':
            return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
        case 'yy':
            if (number === 1) {
                result += withoutSuffix || isFuture ? 'leto' : 'letom';
            } else if (number === 2) {
                result += withoutSuffix || isFuture ? 'leti' : 'letoma';
            } else if (number < 5) {
                result += withoutSuffix || isFuture ? 'leta' : 'leti';
            } else {
                result += withoutSuffix || isFuture ? 'let' : 'leti';
            }
            return result;
    }
}

var sl = moment.defineLocale('sl', {
    months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
    weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
    weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM YYYY',
        LLL : 'D. MMMM YYYY H:mm',
        LLLL : 'dddd, D. MMMM YYYY H:mm'
    },
    calendar : {
        sameDay  : '[danes ob] LT',
        nextDay  : '[jutri ob] LT',

        nextWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[v] [nedeljo] [ob] LT';
                case 3:
                    return '[v] [sredo] [ob] LT';
                case 6:
                    return '[v] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[v] dddd [ob] LT';
            }
        },
        lastDay  : '[včeraj ob] LT',
        lastWeek : function () {
            switch (this.day()) {
                case 0:
                    return '[prejšnjo] [nedeljo] [ob] LT';
                case 3:
                    return '[prejšnjo] [sredo] [ob] LT';
                case 6:
                    return '[prejšnjo] [soboto] [ob] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[prejšnji] dddd [ob] LT';
            }
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'čez %s',
        past   : 'pred %s',
        s      : processRelativeTime,
        m      : processRelativeTime,
        mm     : processRelativeTime,
        h      : processRelativeTime,
        hh     : processRelativeTime,
        d      : processRelativeTime,
        dd     : processRelativeTime,
        M      : processRelativeTime,
        MM     : processRelativeTime,
        y      : processRelativeTime,
        yy     : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return sl;

})));


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Albanian [sq]
//! author : Flakërim Ismani : https://github.com/flakerimi
//! author : Menelion Elensúle : https://github.com/Oire
//! author : Oerd Cukalla : https://github.com/oerd

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var sq = moment.defineLocale('sq', {
    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
    weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
    weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
    weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Sot në] LT',
        nextDay : '[Nesër në] LT',
        nextWeek : 'dddd [në] LT',
        lastDay : '[Dje në] LT',
        lastWeek : 'dddd [e kaluar në] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'në %s',
        past : '%s më parë',
        s : 'disa sekonda',
        m : 'një minutë',
        mm : '%d minuta',
        h : 'një orë',
        hh : '%d orë',
        d : 'një ditë',
        dd : '%d ditë',
        M : 'një muaj',
        MM : '%d muaj',
        y : 'një vit',
        yy : '%d vite'
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return sq;

})));


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Serbian Cyrillic [sr-cyrl]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var translator = {
    words: { //Different grammatical cases
        m: ['један минут', 'једне минуте'],
        mm: ['минут', 'минуте', 'минута'],
        h: ['један сат', 'једног сата'],
        hh: ['сат', 'сата', 'сати'],
        dd: ['дан', 'дана', 'дана'],
        MM: ['месец', 'месеца', 'месеци'],
        yy: ['година', 'године', 'година']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
        }
    }
};

var srCyrl = moment.defineLocale('sr-cyrl', {
    months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
    monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
    monthsParseExact: true,
    weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
    weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
    weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[данас у] LT',
        nextDay: '[сутра у] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[у] [недељу] [у] LT';
                case 3:
                    return '[у] [среду] [у] LT';
                case 6:
                    return '[у] [суботу] [у] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[у] dddd [у] LT';
            }
        },
        lastDay  : '[јуче у] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[прошле] [недеље] [у] LT',
                '[прошлог] [понедељка] [у] LT',
                '[прошлог] [уторка] [у] LT',
                '[прошле] [среде] [у] LT',
                '[прошлог] [четвртка] [у] LT',
                '[прошлог] [петка] [у] LT',
                '[прошле] [суботе] [у] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'за %s',
        past   : 'пре %s',
        s      : 'неколико секунди',
        m      : translator.translate,
        mm     : translator.translate,
        h      : translator.translate,
        hh     : translator.translate,
        d      : 'дан',
        dd     : translator.translate,
        M      : 'месец',
        MM     : translator.translate,
        y      : 'годину',
        yy     : translator.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return srCyrl;

})));


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Serbian [sr]
//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var translator = {
    words: { //Different grammatical cases
        m: ['jedan minut', 'jedne minute'],
        mm: ['minut', 'minute', 'minuta'],
        h: ['jedan sat', 'jednog sata'],
        hh: ['sat', 'sata', 'sati'],
        dd: ['dan', 'dana', 'dana'],
        MM: ['mesec', 'meseca', 'meseci'],
        yy: ['godina', 'godine', 'godina']
    },
    correctGrammaticalCase: function (number, wordKey) {
        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
    },
    translate: function (number, withoutSuffix, key) {
        var wordKey = translator.words[key];
        if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
        } else {
            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
        }
    }
};

var sr = moment.defineLocale('sr', {
    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
    monthsParseExact: true,
    weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
    weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
    weekdaysParseExact : true,
    longDateFormat: {
        LT: 'H:mm',
        LTS : 'H:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY H:mm',
        LLLL: 'dddd, D. MMMM YYYY H:mm'
    },
    calendar: {
        sameDay: '[danas u] LT',
        nextDay: '[sutra u] LT',
        nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return '[u] [nedelju] [u] LT';
                case 3:
                    return '[u] [sredu] [u] LT';
                case 6:
                    return '[u] [subotu] [u] LT';
                case 1:
                case 2:
                case 4:
                case 5:
                    return '[u] dddd [u] LT';
            }
        },
        lastDay  : '[juče u] LT',
        lastWeek : function () {
            var lastWeekDays = [
                '[prošle] [nedelje] [u] LT',
                '[prošlog] [ponedeljka] [u] LT',
                '[prošlog] [utorka] [u] LT',
                '[prošle] [srede] [u] LT',
                '[prošlog] [četvrtka] [u] LT',
                '[prošlog] [petka] [u] LT',
                '[prošle] [subote] [u] LT'
            ];
            return lastWeekDays[this.day()];
        },
        sameElse : 'L'
    },
    relativeTime : {
        future : 'za %s',
        past   : 'pre %s',
        s      : 'nekoliko sekundi',
        m      : translator.translate,
        mm     : translator.translate,
        h      : translator.translate,
        hh     : translator.translate,
        d      : 'dan',
        dd     : translator.translate,
        M      : 'mesec',
        MM     : translator.translate,
        y      : 'godinu',
        yy     : translator.translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return sr;

})));


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : siSwati [ss]
//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';



var ss = moment.defineLocale('ss', {
    months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
    monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
    weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
    weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
    weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Namuhla nga] LT',
        nextDay : '[Kusasa nga] LT',
        nextWeek : 'dddd [nga] LT',
        lastDay : '[Itolo nga] LT',
        lastWeek : 'dddd [leliphelile] [nga] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'nga %s',
        past : 'wenteka nga %s',
        s : 'emizuzwana lomcane',
        m : 'umzuzu',
        mm : '%d emizuzu',
        h : 'lihora',
        hh : '%d emahora',
        d : 'lilanga',
        dd : '%d emalanga',
        M : 'inyanga',
        MM : '%d tinyanga',
        y : 'umnyaka',
        yy : '%d iminyaka'
    },
    meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
    meridiem : function (hours, minutes, isLower) {
        if (hours < 11) {
            return 'ekuseni';
        } else if (hours < 15) {
            return 'emini';
        } else if (hours < 19) {
            return 'entsambama';
        } else {
            return 'ebusuku';
        }
    },
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'ekuseni') {
            return hour;
        } else if (meridiem === 'emini') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
            if (hour === 0) {
                return 0;
            }
            return hour + 12;
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : '%d',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return ss;

})));


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Swedish [sv]
//! author : Jens Alm : https://github.com/ulmus

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var sv = moment.defineLocale('sv', {
    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
    weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY-MM-DD',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY [kl.] HH:mm',
        LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Idag] LT',
        nextDay: '[Imorgon] LT',
        lastDay: '[Igår] LT',
        nextWeek: '[På] dddd LT',
        lastWeek: '[I] dddd[s] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'om %s',
        past : 'för %s sedan',
        s : 'några sekunder',
        m : 'en minut',
        mm : '%d minuter',
        h : 'en timme',
        hh : '%d timmar',
        d : 'en dag',
        dd : '%d dagar',
        M : 'en månad',
        MM : '%d månader',
        y : 'ett år',
        yy : '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'e' :
            (b === 1) ? 'a' :
            (b === 2) ? 'a' :
            (b === 3) ? 'e' : 'e';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return sv;

})));


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Swahili [sw]
//! author : Fahad Kassim : https://github.com/fadsel

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var sw = moment.defineLocale('sw', {
    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
    weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
    weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[leo saa] LT',
        nextDay : '[kesho saa] LT',
        nextWeek : '[wiki ijayo] dddd [saat] LT',
        lastDay : '[jana] LT',
        lastWeek : '[wiki iliyopita] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s baadaye',
        past : 'tokea %s',
        s : 'hivi punde',
        m : 'dakika moja',
        mm : 'dakika %d',
        h : 'saa limoja',
        hh : 'masaa %d',
        d : 'siku moja',
        dd : 'masiku %d',
        M : 'mwezi mmoja',
        MM : 'miezi %d',
        y : 'mwaka mmoja',
        yy : 'miaka %d'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return sw;

})));


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tamil [ta]
//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var symbolMap = {
    '1': '௧',
    '2': '௨',
    '3': '௩',
    '4': '௪',
    '5': '௫',
    '6': '௬',
    '7': '௭',
    '8': '௮',
    '9': '௯',
    '0': '௦'
};
var numberMap = {
    '௧': '1',
    '௨': '2',
    '௩': '3',
    '௪': '4',
    '௫': '5',
    '௬': '6',
    '௭': '7',
    '௮': '8',
    '௯': '9',
    '௦': '0'
};

var ta = moment.defineLocale('ta', {
    months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
    monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
    weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
    weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
    weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, HH:mm',
        LLLL : 'dddd, D MMMM YYYY, HH:mm'
    },
    calendar : {
        sameDay : '[இன்று] LT',
        nextDay : '[நாளை] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[நேற்று] LT',
        lastWeek : '[கடந்த வாரம்] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s இல்',
        past : '%s முன்',
        s : 'ஒரு சில விநாடிகள்',
        m : 'ஒரு நிமிடம்',
        mm : '%d நிமிடங்கள்',
        h : 'ஒரு மணி நேரம்',
        hh : '%d மணி நேரம்',
        d : 'ஒரு நாள்',
        dd : '%d நாட்கள்',
        M : 'ஒரு மாதம்',
        MM : '%d மாதங்கள்',
        y : 'ஒரு வருடம்',
        yy : '%d ஆண்டுகள்'
    },
    dayOfMonthOrdinalParse: /\d{1,2}வது/,
    ordinal : function (number) {
        return number + 'வது';
    },
    preparse: function (string) {
        return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
            return numberMap[match];
        });
    },
    postformat: function (string) {
        return string.replace(/\d/g, function (match) {
            return symbolMap[match];
        });
    },
    // refer http://ta.wikipedia.org/s/1er1
    meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
    meridiem : function (hour, minute, isLower) {
        if (hour < 2) {
            return ' யாமம்';
        } else if (hour < 6) {
            return ' வைகறை';  // வைகறை
        } else if (hour < 10) {
            return ' காலை'; // காலை
        } else if (hour < 14) {
            return ' நண்பகல்'; // நண்பகல்
        } else if (hour < 18) {
            return ' எற்பாடு'; // எற்பாடு
        } else if (hour < 22) {
            return ' மாலை'; // மாலை
        } else {
            return ' யாமம்';
        }
    },
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'யாமம்') {
            return hour < 2 ? hour : hour + 12;
        } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
            return hour;
        } else if (meridiem === 'நண்பகல்') {
            return hour >= 10 ? hour : hour + 12;
        } else {
            return hour + 12;
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return ta;

})));


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Telugu [te]
//! author : Krishna Chaitanya Thota : https://github.com/kcthota

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var te = moment.defineLocale('te', {
    months : 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
    monthsShort : 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
    monthsParseExact : true,
    weekdays : 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
    weekdaysShort : 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
    weekdaysMin : 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
    longDateFormat : {
        LT : 'A h:mm',
        LTS : 'A h:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY, A h:mm',
        LLLL : 'dddd, D MMMM YYYY, A h:mm'
    },
    calendar : {
        sameDay : '[నేడు] LT',
        nextDay : '[రేపు] LT',
        nextWeek : 'dddd, LT',
        lastDay : '[నిన్న] LT',
        lastWeek : '[గత] dddd, LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s లో',
        past : '%s క్రితం',
        s : 'కొన్ని క్షణాలు',
        m : 'ఒక నిమిషం',
        mm : '%d నిమిషాలు',
        h : 'ఒక గంట',
        hh : '%d గంటలు',
        d : 'ఒక రోజు',
        dd : '%d రోజులు',
        M : 'ఒక నెల',
        MM : '%d నెలలు',
        y : 'ఒక సంవత్సరం',
        yy : '%d సంవత్సరాలు'
    },
    dayOfMonthOrdinalParse : /\d{1,2}వ/,
    ordinal : '%dవ',
    meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === 'రాత్రి') {
            return hour < 4 ? hour : hour + 12;
        } else if (meridiem === 'ఉదయం') {
            return hour;
        } else if (meridiem === 'మధ్యాహ్నం') {
            return hour >= 10 ? hour : hour + 12;
        } else if (meridiem === 'సాయంత్రం') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'రాత్రి';
        } else if (hour < 10) {
            return 'ఉదయం';
        } else if (hour < 17) {
            return 'మధ్యాహ్నం';
        } else if (hour < 20) {
            return 'సాయంత్రం';
        } else {
            return 'రాత్రి';
        }
    },
    week : {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    }
});

return te;

})));


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tetun Dili (East Timor) [tet]
//! author : Joshua Brooks : https://github.com/joshbrooks
//! author : Onorio De J. Afonso : https://github.com/marobo

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var tet = moment.defineLocale('tet', {
    months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
    weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
    weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
    weekdaysMin : 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Ohin iha] LT',
        nextDay: '[Aban iha] LT',
        nextWeek: 'dddd [iha] LT',
        lastDay: '[Horiseik iha] LT',
        lastWeek: 'dddd [semana kotuk] [iha] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'iha %s',
        past : '%s liuba',
        s : 'minutu balun',
        m : 'minutu ida',
        mm : 'minutus %d',
        h : 'horas ida',
        hh : 'horas %d',
        d : 'loron ida',
        dd : 'loron %d',
        M : 'fulan ida',
        MM : 'fulan %d',
        y : 'tinan ida',
        yy : 'tinan %d'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return tet;

})));


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Thai [th]
//! author : Kridsada Thanabulpong : https://github.com/sirn

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var th = moment.defineLocale('th', {
    months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
    monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
    monthsParseExact: true,
    weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
    weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
    weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'H:mm',
        LTS : 'H:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY เวลา H:mm',
        LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
    },
    meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
    isPM: function (input) {
        return input === 'หลังเที่ยง';
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ก่อนเที่ยง';
        } else {
            return 'หลังเที่ยง';
        }
    },
    calendar : {
        sameDay : '[วันนี้ เวลา] LT',
        nextDay : '[พรุ่งนี้ เวลา] LT',
        nextWeek : 'dddd[หน้า เวลา] LT',
        lastDay : '[เมื่อวานนี้ เวลา] LT',
        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'อีก %s',
        past : '%sที่แล้ว',
        s : 'ไม่กี่วินาที',
        m : '1 นาที',
        mm : '%d นาที',
        h : '1 ชั่วโมง',
        hh : '%d ชั่วโมง',
        d : '1 วัน',
        dd : '%d วัน',
        M : '1 เดือน',
        MM : '%d เดือน',
        y : '1 ปี',
        yy : '%d ปี'
    }
});

return th;

})));


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Tagalog (Philippines) [tl-ph]
//! author : Dan Hagman : https://github.com/hagmandan

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var tlPh = moment.defineLocale('tl-ph', {
    months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
    monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
    weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
    weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
    weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'MM/D/YYYY',
        LL : 'MMMM D, YYYY',
        LLL : 'MMMM D, YYYY HH:mm',
        LLLL : 'dddd, MMMM DD, YYYY HH:mm'
    },
    calendar : {
        sameDay: 'LT [ngayong araw]',
        nextDay: '[Bukas ng] LT',
        nextWeek: 'LT [sa susunod na] dddd',
        lastDay: 'LT [kahapon]',
        lastWeek: 'LT [noong nakaraang] dddd',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'sa loob ng %s',
        past : '%s ang nakalipas',
        s : 'ilang segundo',
        m : 'isang minuto',
        mm : '%d minuto',
        h : 'isang oras',
        hh : '%d oras',
        d : 'isang araw',
        dd : '%d araw',
        M : 'isang buwan',
        MM : '%d buwan',
        y : 'isang taon',
        yy : '%d taon'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : function (number) {
        return number;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return tlPh;

})));


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Klingon [tlh]
//! author : Dominika Kruk : https://github.com/amaranthrose

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

function translateFuture(output) {
    var time = output;
    time = (output.indexOf('jaj') !== -1) ?
    time.slice(0, -3) + 'leS' :
    (output.indexOf('jar') !== -1) ?
    time.slice(0, -3) + 'waQ' :
    (output.indexOf('DIS') !== -1) ?
    time.slice(0, -3) + 'nem' :
    time + ' pIq';
    return time;
}

function translatePast(output) {
    var time = output;
    time = (output.indexOf('jaj') !== -1) ?
    time.slice(0, -3) + 'Hu’' :
    (output.indexOf('jar') !== -1) ?
    time.slice(0, -3) + 'wen' :
    (output.indexOf('DIS') !== -1) ?
    time.slice(0, -3) + 'ben' :
    time + ' ret';
    return time;
}

function translate(number, withoutSuffix, string, isFuture) {
    var numberNoun = numberAsNoun(number);
    switch (string) {
        case 'mm':
            return numberNoun + ' tup';
        case 'hh':
            return numberNoun + ' rep';
        case 'dd':
            return numberNoun + ' jaj';
        case 'MM':
            return numberNoun + ' jar';
        case 'yy':
            return numberNoun + ' DIS';
    }
}

function numberAsNoun(number) {
    var hundred = Math.floor((number % 1000) / 100),
    ten = Math.floor((number % 100) / 10),
    one = number % 10,
    word = '';
    if (hundred > 0) {
        word += numbersNouns[hundred] + 'vatlh';
    }
    if (ten > 0) {
        word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
    }
    if (one > 0) {
        word += ((word !== '') ? ' ' : '') + numbersNouns[one];
    }
    return (word === '') ? 'pagh' : word;
}

var tlh = moment.defineLocale('tlh', {
    months : 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
    monthsShort : 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
    monthsParseExact : true,
    weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[DaHjaj] LT',
        nextDay: '[wa’leS] LT',
        nextWeek: 'LLL',
        lastDay: '[wa’Hu’] LT',
        lastWeek: 'LLL',
        sameElse: 'L'
    },
    relativeTime : {
        future : translateFuture,
        past : translatePast,
        s : 'puS lup',
        m : 'wa’ tup',
        mm : translate,
        h : 'wa’ rep',
        hh : translate,
        d : 'wa’ jaj',
        dd : translate,
        M : 'wa’ jar',
        MM : translate,
        y : 'wa’ DIS',
        yy : translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return tlh;

})));


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Turkish [tr]
//! authors : Erhan Gundogan : https://github.com/erhangundogan,
//!           Burak Yiğit Kaya: https://github.com/BYK

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var suffixes = {
    1: '\'inci',
    5: '\'inci',
    8: '\'inci',
    70: '\'inci',
    80: '\'inci',
    2: '\'nci',
    7: '\'nci',
    20: '\'nci',
    50: '\'nci',
    3: '\'üncü',
    4: '\'üncü',
    100: '\'üncü',
    6: '\'ncı',
    9: '\'uncu',
    10: '\'uncu',
    30: '\'uncu',
    60: '\'ıncı',
    90: '\'ıncı'
};

var tr = moment.defineLocale('tr', {
    months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
    monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
    weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
    weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
    weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[bugün saat] LT',
        nextDay : '[yarın saat] LT',
        nextWeek : '[haftaya] dddd [saat] LT',
        lastDay : '[dün] LT',
        lastWeek : '[geçen hafta] dddd [saat] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s sonra',
        past : '%s önce',
        s : 'birkaç saniye',
        m : 'bir dakika',
        mm : '%d dakika',
        h : 'bir saat',
        hh : '%d saat',
        d : 'bir gün',
        dd : '%d gün',
        M : 'bir ay',
        MM : '%d ay',
        y : 'bir yıl',
        yy : '%d yıl'
    },
    dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
    ordinal : function (number) {
        if (number === 0) {  // special case for zero
            return number + '\'ıncı';
        }
        var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;
        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return tr;

})));


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Talossan [tzl]
//! author : Robin van der Vliet : https://github.com/robin0van0der0v
//! author : Iustì Canun

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
// This is currently too difficult (maybe even impossible) to add.
var tzl = moment.defineLocale('tzl', {
    months : 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
    monthsShort : 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
    weekdays : 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
    weekdaysShort : 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
    weekdaysMin : 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
    longDateFormat : {
        LT : 'HH.mm',
        LTS : 'HH.mm.ss',
        L : 'DD.MM.YYYY',
        LL : 'D. MMMM [dallas] YYYY',
        LLL : 'D. MMMM [dallas] YYYY HH.mm',
        LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
    },
    meridiemParse: /d\'o|d\'a/i,
    isPM : function (input) {
        return 'd\'o' === input.toLowerCase();
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'd\'o' : 'D\'O';
        } else {
            return isLower ? 'd\'a' : 'D\'A';
        }
    },
    calendar : {
        sameDay : '[oxhi à] LT',
        nextDay : '[demà à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[ieiri à] LT',
        lastWeek : '[sür el] dddd [lasteu à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'osprei %s',
        past : 'ja%s',
        s : processRelativeTime,
        m : processRelativeTime,
        mm : processRelativeTime,
        h : processRelativeTime,
        hh : processRelativeTime,
        d : processRelativeTime,
        dd : processRelativeTime,
        M : processRelativeTime,
        MM : processRelativeTime,
        y : processRelativeTime,
        yy : processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal : '%d.',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

function processRelativeTime(number, withoutSuffix, key, isFuture) {
    var format = {
        's': ['viensas secunds', '\'iensas secunds'],
        'm': ['\'n míut', '\'iens míut'],
        'mm': [number + ' míuts', '' + number + ' míuts'],
        'h': ['\'n þora', '\'iensa þora'],
        'hh': [number + ' þoras', '' + number + ' þoras'],
        'd': ['\'n ziua', '\'iensa ziua'],
        'dd': [number + ' ziuas', '' + number + ' ziuas'],
        'M': ['\'n mes', '\'iens mes'],
        'MM': [number + ' mesen', '' + number + ' mesen'],
        'y': ['\'n ar', '\'iens ar'],
        'yy': [number + ' ars', '' + number + ' ars']
    };
    return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
}

return tzl;

})));


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Central Atlas Tamazight Latin [tzm-latn]
//! author : Abdel Said : https://github.com/abdelsaid

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var tzmLatn = moment.defineLocale('tzm-latn', {
    months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
    monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
    weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[asdkh g] LT',
        nextDay: '[aska g] LT',
        nextWeek: 'dddd [g] LT',
        lastDay: '[assant g] LT',
        lastWeek: 'dddd [g] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'dadkh s yan %s',
        past : 'yan %s',
        s : 'imik',
        m : 'minuḍ',
        mm : '%d minuḍ',
        h : 'saɛa',
        hh : '%d tassaɛin',
        d : 'ass',
        dd : '%d ossan',
        M : 'ayowr',
        MM : '%d iyyirn',
        y : 'asgas',
        yy : '%d isgasn'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return tzmLatn;

})));


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Central Atlas Tamazight [tzm]
//! author : Abdel Said : https://github.com/abdelsaid

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var tzm = moment.defineLocale('tzm', {
    months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
    monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
    weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS: 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
        nextWeek: 'dddd [ⴴ] LT',
        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
        lastWeek: 'dddd [ⴴ] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
        past : 'ⵢⴰⵏ %s',
        s : 'ⵉⵎⵉⴽ',
        m : 'ⵎⵉⵏⵓⴺ',
        mm : '%d ⵎⵉⵏⵓⴺ',
        h : 'ⵙⴰⵄⴰ',
        hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
        d : 'ⴰⵙⵙ',
        dd : '%d oⵙⵙⴰⵏ',
        M : 'ⴰⵢoⵓⵔ',
        MM : '%d ⵉⵢⵢⵉⵔⵏ',
        y : 'ⴰⵙⴳⴰⵙ',
        yy : '%d ⵉⵙⴳⴰⵙⵏ'
    },
    week : {
        dow : 6, // Saturday is the first day of the week.
        doy : 12  // The week that contains Jan 1st is the first week of the year.
    }
});

return tzm;

})));


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Ukrainian [uk]
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
        'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
        'dd': 'день_дні_днів',
        'MM': 'місяць_місяці_місяців',
        'yy': 'рік_роки_років'
    };
    if (key === 'm') {
        return withoutSuffix ? 'хвилина' : 'хвилину';
    }
    else if (key === 'h') {
        return withoutSuffix ? 'година' : 'годину';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}
function weekdaysCaseReplace(m, format) {
    var weekdays = {
        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
        'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
    };

    if (!m) {
        return weekdays['nominative'];
    }

    var nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
        'accusative' :
        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
            'genitive' :
            'nominative');
    return weekdays[nounCase][m.day()];
}
function processHoursFunction(str) {
    return function () {
        return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
    };
}

var uk = moment.defineLocale('uk', {
    months : {
        'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
        'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
    },
    monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
    weekdays : weekdaysCaseReplace,
    weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY р.',
        LLL : 'D MMMM YYYY р., HH:mm',
        LLLL : 'dddd, D MMMM YYYY р., HH:mm'
    },
    calendar : {
        sameDay: processHoursFunction('[Сьогодні '),
        nextDay: processHoursFunction('[Завтра '),
        lastDay: processHoursFunction('[Вчора '),
        nextWeek: processHoursFunction('[У] dddd ['),
        lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return processHoursFunction('[Минулої] dddd [').call(this);
                case 1:
                case 2:
                case 4:
                    return processHoursFunction('[Минулого] dddd [').call(this);
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'за %s',
        past : '%s тому',
        s : 'декілька секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : 'годину',
        hh : relativeTimeWithPlural,
        d : 'день',
        dd : relativeTimeWithPlural,
        M : 'місяць',
        MM : relativeTimeWithPlural,
        y : 'рік',
        yy : relativeTimeWithPlural
    },
    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
    meridiemParse: /ночі|ранку|дня|вечора/,
    isPM: function (input) {
        return /^(дня|вечора)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночі';
        } else if (hour < 12) {
            return 'ранку';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечора';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
            case 'w':
            case 'W':
                return number + '-й';
            case 'D':
                return number + '-го';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return uk;

})));


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Urdu [ur]
//! author : Sawood Alam : https://github.com/ibnesayeed
//! author : Zack : https://github.com/ZackVision

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var months = [
    'جنوری',
    'فروری',
    'مارچ',
    'اپریل',
    'مئی',
    'جون',
    'جولائی',
    'اگست',
    'ستمبر',
    'اکتوبر',
    'نومبر',
    'دسمبر'
];
var days = [
    'اتوار',
    'پیر',
    'منگل',
    'بدھ',
    'جمعرات',
    'جمعہ',
    'ہفتہ'
];

var ur = moment.defineLocale('ur', {
    months : months,
    monthsShort : months,
    weekdays : days,
    weekdaysShort : days,
    weekdaysMin : days,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd، D MMMM YYYY HH:mm'
    },
    meridiemParse: /صبح|شام/,
    isPM : function (input) {
        return 'شام' === input;
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 12) {
            return 'صبح';
        }
        return 'شام';
    },
    calendar : {
        sameDay : '[آج بوقت] LT',
        nextDay : '[کل بوقت] LT',
        nextWeek : 'dddd [بوقت] LT',
        lastDay : '[گذشتہ روز بوقت] LT',
        lastWeek : '[گذشتہ] dddd [بوقت] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s بعد',
        past : '%s قبل',
        s : 'چند سیکنڈ',
        m : 'ایک منٹ',
        mm : '%d منٹ',
        h : 'ایک گھنٹہ',
        hh : '%d گھنٹے',
        d : 'ایک دن',
        dd : '%d دن',
        M : 'ایک ماہ',
        MM : '%d ماہ',
        y : 'ایک سال',
        yy : '%d سال'
    },
    preparse: function (string) {
        return string.replace(/،/g, ',');
    },
    postformat: function (string) {
        return string.replace(/,/g, '،');
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return ur;

})));


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Uzbek Latin [uz-latn]
//! author : Rasulbek Mirzayev : github.com/Rasulbeeek

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var uzLatn = moment.defineLocale('uz-latn', {
    months : 'Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr'.split('_'),
    monthsShort : 'Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek'.split('_'),
    weekdays : 'Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba'.split('_'),
    weekdaysShort : 'Yak_Dush_Sesh_Chor_Pay_Jum_Shan'.split('_'),
    weekdaysMin : 'Ya_Du_Se_Cho_Pa_Ju_Sha'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'D MMMM YYYY, dddd HH:mm'
    },
    calendar : {
        sameDay : '[Bugun soat] LT [da]',
        nextDay : '[Ertaga] LT [da]',
        nextWeek : 'dddd [kuni soat] LT [da]',
        lastDay : '[Kecha soat] LT [da]',
        lastWeek : '[O\'tgan] dddd [kuni soat] LT [da]',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'Yaqin %s ichida',
        past : 'Bir necha %s oldin',
        s : 'soniya',
        m : 'bir daqiqa',
        mm : '%d daqiqa',
        h : 'bir soat',
        hh : '%d soat',
        d : 'bir kun',
        dd : '%d kun',
        M : 'bir oy',
        MM : '%d oy',
        y : 'bir yil',
        yy : '%d yil'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return uzLatn;

})));


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Uzbek [uz]
//! author : Sardor Muminov : https://github.com/muminoff

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var uz = moment.defineLocale('uz', {
    months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
    monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
    weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
    weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
    weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'D MMMM YYYY, dddd HH:mm'
    },
    calendar : {
        sameDay : '[Бугун соат] LT [да]',
        nextDay : '[Эртага] LT [да]',
        nextWeek : 'dddd [куни соат] LT [да]',
        lastDay : '[Кеча соат] LT [да]',
        lastWeek : '[Утган] dddd [куни соат] LT [да]',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'Якин %s ичида',
        past : 'Бир неча %s олдин',
        s : 'фурсат',
        m : 'бир дакика',
        mm : '%d дакика',
        h : 'бир соат',
        hh : '%d соат',
        d : 'бир кун',
        dd : '%d кун',
        M : 'бир ой',
        MM : '%d ой',
        y : 'бир йил',
        yy : '%d йил'
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 4th is the first week of the year.
    }
});

return uz;

})));


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Vietnamese [vi]
//! author : Bang Nguyen : https://github.com/bangnk

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var vi = moment.defineLocale('vi', {
    months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
    monthsParseExact : true,
    weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /sa|ch/i,
    isPM : function (input) {
        return /^ch$/i.test(input);
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'sa' : 'SA';
        } else {
            return isLower ? 'ch' : 'CH';
        }
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM [năm] YYYY',
        LLL : 'D MMMM [năm] YYYY HH:mm',
        LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
        l : 'DD/M/YYYY',
        ll : 'D MMM YYYY',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd, D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Hôm nay lúc] LT',
        nextDay: '[Ngày mai lúc] LT',
        nextWeek: 'dddd [tuần tới lúc] LT',
        lastDay: '[Hôm qua lúc] LT',
        lastWeek: 'dddd [tuần rồi lúc] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s tới',
        past : '%s trước',
        s : 'vài giây',
        m : 'một phút',
        mm : '%d phút',
        h : 'một giờ',
        hh : '%d giờ',
        d : 'một ngày',
        dd : '%d ngày',
        M : 'một tháng',
        MM : '%d tháng',
        y : 'một năm',
        yy : '%d năm'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : function (number) {
        return number;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return vi;

})));


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Pseudo [x-pseudo]
//! author : Andrew Hood : https://github.com/andrewhood125

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var xPseudo = moment.defineLocale('x-pseudo', {
    months : 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
    monthsShort : 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
    monthsParseExact : true,
    weekdays : 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
    weekdaysShort : 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
    weekdaysMin : 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[T~ódá~ý át] LT',
        nextDay : '[T~ómó~rró~w át] LT',
        nextWeek : 'dddd [át] LT',
        lastDay : '[Ý~ést~érdá~ý át] LT',
        lastWeek : '[L~ást] dddd [át] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'í~ñ %s',
        past : '%s á~gó',
        s : 'á ~féw ~sécó~ñds',
        m : 'á ~míñ~úté',
        mm : '%d m~íñú~tés',
        h : 'á~ñ hó~úr',
        hh : '%d h~óúrs',
        d : 'á ~dáý',
        dd : '%d d~áýs',
        M : 'á ~móñ~th',
        MM : '%d m~óñt~hs',
        y : 'á ~ýéár',
        yy : '%d ý~éárs'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return xPseudo;

})));


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Yoruba Nigeria [yo]
//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var yo = moment.defineLocale('yo', {
    months : 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
    monthsShort : 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
    weekdays : 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
    weekdaysShort : 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
    weekdaysMin : 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
    longDateFormat : {
        LT : 'h:mm A',
        LTS : 'h:mm:ss A',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY h:mm A',
        LLLL : 'dddd, D MMMM YYYY h:mm A'
    },
    calendar : {
        sameDay : '[Ònì ni] LT',
        nextDay : '[Ọ̀la ni] LT',
        nextWeek : 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
        lastDay : '[Àna ni] LT',
        lastWeek : 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'ní %s',
        past : '%s kọjá',
        s : 'ìsẹjú aayá die',
        m : 'ìsẹjú kan',
        mm : 'ìsẹjú %d',
        h : 'wákati kan',
        hh : 'wákati %d',
        d : 'ọjọ́ kan',
        dd : 'ọjọ́ %d',
        M : 'osù kan',
        MM : 'osù %d',
        y : 'ọdún kan',
        yy : 'ọdún %d'
    },
    dayOfMonthOrdinalParse : /ọjọ́\s\d{1,2}/,
    ordinal : 'ọjọ́ %d',
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4 // The week that contains Jan 4th is the first week of the year.
    }
});

return yo;

})));


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (China) [zh-cn]
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var zhCn = moment.defineLocale('zh-cn', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日Ah点mm分',
        LLLL : 'YYYY年MMMD日ddddAh点mm分',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
                meridiem === '上午') {
            return hour;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
        }
    },
    relativeTime : {
        future : '%s内',
        past : '%s前',
        s : '几秒',
        m : '1 分钟',
        mm : '%d 分钟',
        h : '1 小时',
        hh : '%d 小时',
        d : '1 天',
        dd : '%d 天',
        M : '1 个月',
        MM : '%d 个月',
        y : '1 年',
        yy : '%d 年'
    },
    week : {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return zhCn;

})));


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (Hong Kong) [zh-hk]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris
//! author : Konstantin : https://github.com/skfd

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var zhHk = moment.defineLocale('zh-hk', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日 HH:mm',
        LLLL : 'YYYY年MMMD日dddd HH:mm',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour;
        } else if (meridiem === '中午') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd' :
            case 'D' :
            case 'DDD' :
                return number + '日';
            case 'M' :
                return number + '月';
            case 'w' :
            case 'W' :
                return number + '週';
            default :
                return number;
        }
    },
    relativeTime : {
        future : '%s內',
        past : '%s前',
        s : '幾秒',
        m : '1 分鐘',
        mm : '%d 分鐘',
        h : '1 小時',
        hh : '%d 小時',
        d : '1 天',
        dd : '%d 天',
        M : '1 個月',
        MM : '%d 個月',
        y : '1 年',
        yy : '%d 年'
    }
});

return zhHk;

})));


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Chinese (Taiwan) [zh-tw]
//! author : Ben : https://github.com/ben-lin
//! author : Chris Lam : https://github.com/hehachris

;(function (global, factory) {
    true ? factory(__webpack_require__(0)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var zhTw = moment.defineLocale('zh-tw', {
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'YYYY年MMMD日',
        LL : 'YYYY年MMMD日',
        LLL : 'YYYY年MMMD日 HH:mm',
        LLLL : 'YYYY年MMMD日dddd HH:mm',
        l : 'YYYY年MMMD日',
        ll : 'YYYY年MMMD日',
        lll : 'YYYY年MMMD日 HH:mm',
        llll : 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour : function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour;
        } else if (meridiem === '中午') {
            return hour >= 11 ? hour : hour + 12;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        }
    },
    meridiem : function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar : {
        sameDay : '[今天]LT',
        nextDay : '[明天]LT',
        nextWeek : '[下]ddddLT',
        lastDay : '[昨天]LT',
        lastWeek : '[上]ddddLT',
        sameElse : 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
    ordinal : function (number, period) {
        switch (period) {
            case 'd' :
            case 'D' :
            case 'DDD' :
                return number + '日';
            case 'M' :
                return number + '月';
            case 'w' :
            case 'W' :
                return number + '週';
            default :
                return number;
        }
    },
    relativeTime : {
        future : '%s內',
        past : '%s前',
        s : '幾秒',
        m : '1 分鐘',
        mm : '%d 分鐘',
        h : '1 小時',
        hh : '%d 小時',
        d : '1 天',
        dd : '%d 天',
        M : '1 個月',
        MM : '%d 個月',
        y : '1 年',
        yy : '%d 年'
    }
});

return zhTw;

})));


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(138);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app2.default.$mount('#app');

if (false) {
  module.hot.accept();
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(7);

var _vue2 = _interopRequireDefault(_vue);

var _router = __webpack_require__(141);

var _router2 = _interopRequireDefault(_router);

var _app = __webpack_require__(193);

var _app2 = _interopRequireDefault(_app);

var _footer = __webpack_require__(139);

var _footer2 = _interopRequireDefault(_footer);

var _header = __webpack_require__(140);

var _header2 = _interopRequireDefault(_header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _vue2.default({
  router: _router2.default,

  mounted: function mounted() {},
  data: function data() {
    return {};
  },


  computed: {},

  render: function render(h) {
    var $route = this.$route;


    return h(
      'div',
      {
        attrs: { id: 'app', 'data-path': $route.path }
      },
      [h(
        _header2.default,
        null,
        []
      ), h(
        'keep-alive',
        null,
        [h(
          'router-view',
          { 'class': 'main' },
          []
        )]
      ), h(
        _footer2.default,
        null,
        []
      )]
    );
  }
});

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _cepaveLogo = __webpack_require__(376);

var _cepaveLogo2 = _interopRequireDefault(_cepaveLogo);

var _footer = __webpack_require__(194);

var _footer2 = _interopRequireDefault(_footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = {
  name: 'Footer',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'footer',
      null,
      [h(
        'div',
        { 'class': 'w1120' },
        [h(
          'div',
          { 'class': 'fbox -around' },
          [h(
            'div',
            null,
            [h(
              'a',
              {
                attrs: { target: '_blank', href: '//cepave.com/' }
              },
              [h(
                'img',
                { 'class': [_footer2.default.logo], attrs: { src: _cepaveLogo2.default }
                },
                []
              )]
            )]
          ), h(
            'div',
            null,
            [h(
              'ul',
              { 'class': 'fbox' },
              [h(
                'li',
                null,
                [h(
                  'a',
                  null,
                  [h(
                    'svg',
                    {
                      attrs: { name: 'twitter', fill: '#4AA0EB', viewBox: '0 0 1024 1024', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', 'p-id': '2135' }
                    },
                    [h(
                      'path',
                      {
                        attrs: { d: 'M512.027093 93.146738c-245.645847 0-444.781543 199.17182-444.781543 444.781543 0 245.645847 199.135696 444.745418 444.781543 444.745418 245.645847 0 444.745418-199.099571 444.745418-444.745418C956.772512 292.318558 757.654878 93.146738 512.027093 93.146738zM736.070555 448.249484c0.234809 4.804544 0.32512 9.62715 0.32512 14.503942 0 148.128058-112.744219 318.906108-318.906108 318.906108-63.28993 0-122.226871-18.549874-171.825657-50.339336 8.778227 1.029545 17.682889 1.553349 26.732048 1.553349 52.524862 0 100.859295-17.917697 139.205334-47.973189-49.038858-0.921172-90.419346-33.342811-104.68848-77.866121 6.82751 1.336602 13.853703 2.004904 21.078581 2.004904 10.223202 0 20.121285-1.336602 29.531688-3.919496-51.296633-10.295451-89.931667-55.631559-89.931667-109.890392 0-0.487679 0-0.957296 0.018062-1.444976 15.099995 8.398921 32.385515 13.438273 50.772829 14.034325-30.091616-20.139347-49.869719-54.40333-49.869719-93.309297 0-20.536715 5.527032-39.809077 15.172243-56.354047 55.288378 67.805479 137.886794 112.437162 231.051594 117.097208-1.914593-8.182174-2.908013-16.761717-2.908013-25.539943 0-61.881079 50.176777-112.075918 112.09398-112.075918 32.241017 0 61.357275 13.618895 81.803679 35.383839 25.539943-5.003228 49.526538-14.359445 71.183109-27.201665-8.398921 26.190182-26.154058 48.153811-49.309791 62.007514 22.704179-2.709329 44.306563-8.742102 64.391724-17.646764C776.999488 412.703085 757.979998 432.445064 736.070555 448.249484z', 'p-id': '2136' }
                      },
                      []
                    )]
                  )]
                ), h(
                  'a',
                  {
                    attrs: { href: 'https://www.facebook.com/CepaveInc', target: '_blank' }
                  },
                  [h(
                    'svg',
                    {
                      attrs: { name: 'facebook', viewBox: '0 0 1024 1024', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', 'p-id': '1531' }
                    },
                    [h(
                      'path',
                      {
                        attrs: { d: 'M613.76 948.423C811.881 902.352 959.5 724.687 959.5 512.544c0-247.147-200.353-447.5-447.5-447.5S64.5 265.396 64.5 512.544c0 236.578 183.582 430.277 416.059 446.413V647.463H422.5l0.91-117.424h57.149v-61.832c0-149.262 140.491-134.242 140.491-134.242h89.839l-0.91 107.935h-57.044c-47.378 0-39.175 40.364-39.175 40.364v47.762h95.641L690.69 647.462h-76.93v300.961z', fill: '#38569A', 'p-id': '1532' }
                      },
                      []
                    )]
                  )]
                )]
              ), h(
                'li',
                null,
                [h(
                  'a',
                  {
                    attrs: { href: '//github.com/Cepave', target: '_blank' }
                  },
                  ['Cepave Open Source']
                )]
              )]
            )]
          )]
        )]
      )]
    );
  }
};

module.exports = Footer;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _header = __webpack_require__(195);

var _header2 = _interopRequireDefault(_header);

var _logo = __webpack_require__(13);

var _logo2 = _interopRequireDefault(_logo);

var _link = __webpack_require__(10);

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = {
  name: 'Header',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'header',
      null,
      [h(
        'div',
        { 'class': 'w1120' },
        [h(
          'div',
          { 'class': 'fbox -around' },
          [h(
            'div',
            null,
            [h(
              'h1',
              null,
              [h(
                _link2.default,
                {
                  attrs: { to: '/' }
                },
                [h(
                  _logo2.default,
                  {
                    attrs: { fill: '#fff', size: 25 }
                  },
                  []
                ), ' OWL UI']
              ), h(
                'span',
                { 'class': [_header2.default.ver] },
                ['v', '0.10.6']
              )]
            )]
          ), h(
            'ul',
            { 'class': [_header2.default.link] },
            [h(
              'li',
              null,
              [h(
                _link2.default,
                {
                  attrs: { to: '/' }
                },
                ['Docs']
              )]
            ), h(
              'li',
              null,
              [h(
                _link2.default,
                {
                  attrs: { to: '/components' }
                },
                ['Components']
              )]
            ), h(
              'li',
              null,
              [h(
                'a',
                {
                  attrs: { href: '//github.com/cepave-f2e/vue-owl-ui', target: '_blank' }
                },
                ['GitHub']
              )]
            ), h(
              'li',
              null,
              [h(
                'a',
                {
                  attrs: { href: '//github.com/cepave-f2e', target: '_blank' }
                },
                ['Cepave F2E']
              )]
            )]
          )]
        )]
      )]
    );
  }
};

module.exports = Header;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(7);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(12);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

module.exports = new _vueRouter2.default({
  mode: 'hash',
  scrollBehavior: function scrollBehavior() {
    return { y: 0 };
  },
  routes: [{ path: '/home', component: __webpack_require__(151) }, { path: '/components', component: __webpack_require__(146),
    children: [{ path: 'legacy', component: __webpack_require__(156) }, { path: 'legacy/grid', component: __webpack_require__(155) }, { path: '', component: __webpack_require__(145) }, { path: 'loading', component: __webpack_require__(158) }, { path: 'select', component: __webpack_require__(163) }, { path: 'switch', component: __webpack_require__(164) }, { path: 'icons', component: __webpack_require__(152) }, { path: 'tip', component: __webpack_require__(167) }, { path: 'checkbox', component: __webpack_require__(143) }, { path: 'radio', component: __webpack_require__(162) }, { path: 'input', component: __webpack_require__(153) }, { path: 'button', component: __webpack_require__(142) }, { path: 'lightbox', component: __webpack_require__(157) }, { path: 'grid', component: __webpack_require__(150) }, { path: 'label', component: __webpack_require__(154) }, { path: 'dual-list', component: __webpack_require__(148) }, { path: 'tab', component: __webpack_require__(165) }, { path: 'page', component: __webpack_require__(161) }, { path: 'flex', component: __webpack_require__(149) }, { path: 'multi-select', component: __webpack_require__(160) }, { path: 'complex-query', component: __webpack_require__(144) }, { path: 'date-picker', component: __webpack_require__(147) }, { path: 'time-picker', component: __webpack_require__(166) }, { path: 'message', component: __webpack_require__(159) }]
  }, { path: '*', redirect: '/home' }]
});

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _button = __webpack_require__(14);

var _button2 = _interopRequireDefault(_button);

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _button3 = __webpack_require__(197);

var _button4 = _interopRequireDefault(_button3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ButtonPage = {
  name: 'ButtonPage',
  data: function data() {
    return {
      options: [{ value: 'winnie', title: 'Winnie The Pooh' }, { value: 'piglet', title: 'Piglet' }, { value: 'tigger', title: 'Tigger', selected: true }],
      buttonGroupData: {
        value: 'tigger',
        idx: 2
      }
    };
  },

  methods: {
    getButtonGroupData: function getButtonGroupData(data) {
      this.buttonGroupData = data;
    }
  },

  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(348) }
        },
        []
      ), h(
        'div',
        { 'class': [_button4.default.buttonWrapper] },
        [h(
          _button2.default,
          { 'class': [_button4.default.buttonIcon] },
          [h(
            _icon2.default,
            {
              attrs: { typ: 'plus', size: 16 }
            },
            []
          ), '\u65B0\u589E\u516C\u544A']
        ), h(
          _button2.default,
          {
            attrs: { status: 'primary' }
          },
          ['\u9001\u51FA']
        ), h(
          _button2.default,
          {
            attrs: { status: 'outline' }
          },
          ['\u641C\u5C0B']
        ), h(
          _button2.default,
          {
            attrs: { status: 'primaryOutline' }
          },
          ['\u95DC\u9589']
        )]
      ), h(
        'span',
        null,
        ['Disabled buttons']
      ), h(
        'div',
        { 'class': [_button4.default.buttonWrapper] },
        [h(
          _button2.default,
          {
            attrs: { disabled: true }
          },
          ['Submit']
        ), h(
          _button2.default,
          {
            attrs: { status: 'primary', disabled: true }
          },
          ['Submit']
        ), h(
          _button2.default,
          {
            attrs: { status: 'primaryOutline', disabled: true }
          },
          ['Submit']
        )]
      ), h(
        'span',
        null,
        ['Width-50% button']
      ), h(
        'div',
        { 'class': [_button4.default.buttonWrapper] },
        [h(
          _button2.default,
          {
            attrs: { status: 'primary' },
            'class': [_button4.default.buttonBig] },
          ['Submit']
        )]
      ), h(
        'span',
        null,
        ['Button Group']
      ), h(
        'div',
        { 'class': [_button4.default.buttonGroupWrapper] },
        [h(
          _button2.default.Group,
          {
            attrs: { options: this.options },
            'class': [_button4.default.buttonGroup], on: {
              'change': this.getButtonGroupData
            }
          },
          []
        ), h(
          'code',
          null,
          [JSON.stringify(this.buttonGroupData)]
        )]
      )]
    );
  }
};

module.exports = ButtonPage;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _checkbox = __webpack_require__(15);

var _checkbox2 = _interopRequireDefault(_checkbox);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CheckboxPage = {
  name: 'CheckboxPage',
  data: function data() {
    return {
      checkedDatum: { 1: true, 2: true, all: true }
    };
  },

  methods: {
    getCheckedDatum: function getCheckedDatum(data) {
      this.checkedDatum = data;
    }
  },
  render: function render(h) {
    var getCheckedDatum = this.getCheckedDatum,
        checkedDatum = this.checkedDatum;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(349) }
        },
        []
      ), h(
        'div',
        null,
        [h(
          'code',
          null,
          [JSON.stringify(checkedDatum)]
        )]
      ), h(
        'br',
        null,
        []
      ), h(
        'div',
        null,
        [h(
          _checkbox2.default.Group,
          {
            on: {
              'change': getCheckedDatum
            }
          },
          [h(
            _checkbox2.default,
            {
              attrs: { name: 'all', checked: true }
            },
            ['All']
          ), h(
            _checkbox2.default,
            {
              attrs: { name: '1' }
            },
            ['Pikachu']
          ), h(
            _checkbox2.default,
            {
              attrs: { name: '2' }
            },
            ['Eevee']
          )]
        )]
      )]
    );
  }
};

module.exports = CheckboxPage;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _complexQuery = __webpack_require__(168);

var _complexQuery2 = _interopRequireDefault(_complexQuery);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComplexQueryDoc = {
  name: 'ComplexQueryDoc',
  data: function data() {
    return {
      categories: [{
        name: 'cat1',
        value: 'cat1'
      }, {
        name: 'cat2',
        value: 'cat2'
      }, {
        name: 'cat3',
        value: 'cat3'
      }],

      items: [{
        name: 'cat1',
        children: [{
          name: 'cat1 - item1',
          value: 'item1'
        }, {
          name: 'cat1 - item2',
          value: 'item2'
        }, {
          name: 'cat1 - item3',
          value: 'item3'
        }]
      }, {
        name: 'cat2',
        children: [{
          name: 'cat2 - item1',
          value: 'item1.1'
        }, {
          name: 'cat2 - item2',
          value: 'item2.1'
        }, {
          name: 'cat2 - item3',
          value: 'item3.1'
        }]
      }],

      outs: {}
    };
  },


  methods: {
    onChange: function onChange(_ref) {
      var selectedItems = _ref.selectedItems;

      this.outs = selectedItems;
    }
  },
  render: function render(h) {
    var $slots = this.$slots,
        categories = this.categories,
        items = this.items,
        outs = this.outs;


    return h(
      'div',
      null,
      [h(
        'h1',
        null,
        ['ComplexQuery']
      ), h(
        'h2',
        null,
        ['Examples']
      ), h(
        _complexQuery2.default,
        {
          attrs: { categories: categories, items: items },
          on: {
            'change': this.onChange
          }
        },
        []
      ), h(
        'pre',
        null,
        [h(
          'code',
          null,
          ['data: ', JSON.stringify(outs, null, 2)]
        )]
      ), h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(350) }
        },
        []
      )]
    );
  }
};
module.exports = ComplexQueryDoc;

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CompnentHomePage = {
  name: 'CompnentHomePage',
  data: function data() {
    return {
      loading: true,
      owlSrc: ''
    };
  },


  methods: {},

  mounted: function mounted() {},
  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(351) }
        },
        []
      )]
    );
  }
};

module.exports = CompnentHomePage;

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _link = __webpack_require__(10);

var _link2 = _interopRequireDefault(_link);

var _components = __webpack_require__(198);

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ComponentPage = {
  name: 'ComponentPage',
  render: function render(h) {
    var $route = this.$route;

    return h(
      'div',
      { 'class': _components2.default.main },
      [h(
        'div',
        { 'class': ['w1120', 'fbox'] },
        [h(
          'aside',
          { 'class': [_components2.default.side] },
          [h(
            'div',
            {
              attrs: { id: 'sticky-menu' }
            },
            [h(
              'dl',
              null,
              [h(
                'dt',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/legacy' }
                  },
                  ['Legacy']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/legacy/grid' }
                  },
                  ['Grid']
                )]
              )]
            ), h(
              'dl',
              null,
              [h(
                'dt',
                null,
                ['Layout']
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/flex' }
                  },
                  ['Flex (Grid System)']
                )]
              )]
            ), h(
              'dl',
              null,
              [h(
                'dt',
                null,
                ['General']
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/icons' }
                  },
                  ['Icon']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/loading' }
                  },
                  ['Loading']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/tip' }
                  },
                  ['Tip']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/lightbox' }
                  },
                  ['LightBox']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/label' }
                  },
                  ['Label']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/dual-list' }
                  },
                  ['DualList']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/tab' }
                  },
                  ['Tab']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/page' }
                  },
                  ['Page']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/grid' }
                  },
                  ['Grid']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/message' }
                  },
                  ['Message']
                )]
              )]
            ), h(
              'dl',
              null,
              [h(
                'dt',
                null,
                [' Form ']
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/complex-query' }
                  },
                  ['ComplexQuery']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/select' }
                  },
                  ['Select']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/multi-select' }
                  },
                  ['MultiSelect']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/checkbox' }
                  },
                  ['Checkbox']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/switch' }
                  },
                  ['Switch']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/radio' }
                  },
                  ['Radio']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/button' }
                  },
                  ['Button']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/input' }
                  },
                  ['Input']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/date-picker' }
                  },
                  ['DatePicker']
                )]
              ), h(
                'dd',
                null,
                [h(
                  _link2.default,
                  {
                    attrs: { to: '/components/time-picker' }
                  },
                  ['TimePicker']
                )]
              )]
            )]
          )]
        ), h(
          'div',
          { 'class': [_components2.default.view] },
          [h(
            'router-view',
            null,
            []
          )]
        )]
      )]
    );
  }
};

module.exports = ComponentPage;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _datePicker = __webpack_require__(172);

var _datePicker2 = _interopRequireDefault(_datePicker);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatePickerDoc = {
  name: 'DatePickerDoc',
  data: function data() {
    return {
      outs: {}
    };
  },

  methods: {
    onPick: function onPick(d) {
      this.outs = d;
    }
  },
  render: function render(h) {
    var outs = this.outs,
        onPick = this.onPick;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(352) }
        },
        []
      ), h(
        'pre',
        null,
        [h(
          'code',
          null,
          ['data: ', JSON.stringify(outs, null, 2)]
        )]
      ), h(
        _datePicker2.default,
        {
          on: {
            'pick': onPick
          }
        },
        []
      )]
    );
  }
};

module.exports = DatePickerDoc;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dualList = __webpack_require__(174);

var _dualList2 = _interopRequireDefault(_dualList);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _dualList3 = __webpack_require__(199);

var _dualList4 = _interopRequireDefault(_dualList3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DualListPage = {
  name: 'DualListPage',

  data: function data() {
    return {
      output: {
        10: { name: 'Hippopotmonstrosesquipadaliophobiahipo', id: '20' }, 11: { name: 'Abra', id: '21' },
        12: { name: 'Doduo', id: '22' }, 13: { name: 'Dodrio', id: '23' }
      },
      labels: [{ name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' }, { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' }, { name: 'Clefairy', id: '5' }, { name: 'Venonat', id: '6' }, { name: 'Psyduck', id: '7' }, { name: 'Pikachu', id: '8' }, { name: 'Vulpix', id: '9' }, { name: 'Raichu', id: '10' }],
      selectedLabel: [{ name: 'Hippopotmonstrosesquipadaliophobiahipo', id: '20' }, { name: 'Abra', id: '21' }, { name: 'Doduo', id: '22' }, { name: 'Dodrio', id: '23' }]
    };
  },


  methods: {
    getDualData: function getDualData(data) {
      this.output = Object.assign({}, data);
    },
    getInputValue: function getInputValue(data) {}
  },

  mounted: function mounted() {
    var _this = this;

    window.setTimeout(function () {
      _this.labels = [{ name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' }, { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' }, { name: 'Clefairy', id: '5' }, { name: 'Venonat', id: '6' }];
    }, 6000);
  },
  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(353) }
        },
        []
      ), h(
        _dualList2.default,
        {
          attrs: { items: this.labels, selectedItems: this.selectedLabel, displayKey: 'name', caseInsensitive: true },
          'class': [_dualList4.default.dualGroup], on: {
            'change': this.getDualData
          }
        },
        []
      ), h(
        'div',
        { 'class': [_dualList4.default.code] },
        [h(
          'pre',
          null,
          [h(
            'code',
            null,
            [JSON.stringify(this.output, null, 2)]
          )]
        )]
      )]
    );
  }
};

module.exports = DualListPage;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _flex = __webpack_require__(8);

var _flex2 = _interopRequireDefault(_flex);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _flex3 = __webpack_require__(200);

var _flex4 = _interopRequireDefault(_flex3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var FlexPage = {
  name: 'FlexPage',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(354) }
        },
        []
      ), h(
        'h2',
        null,
        ['Auto']
      ), h(
        _flex2.default,
        null,
        [h(
          _flex2.default.Col,
          {
            attrs: { size: 'auto' }
          },
          [h(
            'p',
            { 'class': [_flex4.default.p] },
            ['size="auto"']
          )]
        ), h(
          _flex2.default.Col,
          {
            attrs: { size: 'auto' }
          },
          [h(
            'p',
            { 'class': [_flex4.default.p] },
            ['size="auto"']
          )]
        ), h(
          _flex2.default.Col,
          {
            attrs: { size: 'auto' }
          },
          [h(
            'p',
            { 'class': [_flex4.default.p] },
            ['size="auto"']
          )]
        )]
      ), h(
        'h2',
        null,
        ['12 Grids']
      ), h(
        'div',
        { 'class': _flex4.default.boxs },
        [[].concat(_toConsumableArray(Array(6))).map(function (v, i) {
          var left = i + 1;
          var right = 12 - left;
          return h(
            _flex2.default,
            null,
            [h(
              _flex2.default.Col,
              {
                attrs: { size: left }
              },
              [h(
                'p',
                { 'class': [_flex4.default.p] },
                ['size="', left, '"']
              )]
            ), h(
              _flex2.default.Col,
              {
                attrs: { size: right }
              },
              [h(
                'p',
                { 'class': [_flex4.default.p] },
                ['size="', right, '"']
              )]
            )]
          );
        })]
      ), h(
        'h2',
        null,
        ['Offset']
      ), h(
        'div',
        { 'class': _flex4.default.boxs },
        [[].concat(_toConsumableArray(Array(6))).map(function (v, i) {
          var left = i + 1;
          var offset = 12 - 5 - left;
          return h(
            _flex2.default,
            null,
            [h(
              _flex2.default.Col,
              {
                attrs: { size: left }
              },
              [h(
                'p',
                { 'class': [_flex4.default.p] },
                ['size="', left, '"']
              )]
            ), h(
              _flex2.default.Col,
              {
                attrs: { size: 5, offset: offset }
              },
              [h(
                'p',
                { 'class': [_flex4.default.p] },
                ['size="5", offset="', offset, '"']
              )]
            )]
          );
        })]
      ), h(
        'h2',
        null,
        ['Split']
      ), h(
        _flex2.default,
        {
          attrs: { split: true }
        },
        [h(
          _flex2.default.Col,
          null,
          [h(
            'p',
            { 'class': [_flex4.default.p] },
            ['Left']
          )]
        ), h(
          _flex2.default.Col,
          null,
          [h(
            'p',
            { 'class': [_flex4.default.p] },
            ['Right']
          )]
        )]
      ), h(
        'h2',
        null,
        ['Mid']
      ), h(
        _flex2.default,
        {
          attrs: { mid: true },
          'class': [_flex4.default.midContent] },
        ['Mid Content']
      ), h(
        'h2',
        null,
        ['Social Example']
      ), h(
        _flex2.default,
        { 'class': [_flex4.default.social], attrs: { margin: 12 }
        },
        [h(
          _flex2.default.Col,
          null,
          [h(
            'div',
            { 'class': [_flex4.default.avatar] },
            [h(
              _flex2.default,
              {
                attrs: { mid: true }
              },
              ['avatar ', h(
                'br',
                null,
                []
              ), ' 76 x 76']
            )]
          )]
        ), h(
          _flex2.default.Col,
          {
            attrs: { size: 'auto' }
          },
          [h(
            'p',
            null,
            ['Cepave @cepave said:']
          ), h(
            'p',
            null,
            ['OWL UI is No.1. :)']
          )]
        )]
      )]
    );
  }
};

module.exports = FlexPage;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _grid = __webpack_require__(175);

var _grid2 = _interopRequireDefault(_grid);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _switch = __webpack_require__(18);

var _switch2 = _interopRequireDefault(_switch);

var _flex = __webpack_require__(8);

var _flex2 = _interopRequireDefault(_flex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridPage = {
  name: 'GridPage',
  data: function data() {
    var h = this.$createElement;

    return {
      gridData: {
        heads: [{
          name: h(
            'b',
            null,
            ['Name']
          ),
          key: 'name',
          sort: -1,
          width: '30%'
        }, {
          key: 'email',
          width: '50%',
          name: 'Email'
        }, {
          key: 'id',
          width: '20%',
          name: '#ID',
          sort: -1
        }],

        rows: [{
          name: 'Rocky',
          email: 'rwu@cepave.com',
          id: 2
        }, {
          name: 'Timmy',
          email: 'timmy@cepave.com',
          id: 1
        }, {
          name: 'Kelly',
          email: 'kelly@cepave.com',
          id: 3
        }],

        loading: false
      }

    };
  },


  methods: {
    toggleLoading: function toggleLoading(_ref) {
      var data = _ref.data;

      this.gridData.loading = data;
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        gridData = this.gridData;

    var props = _extends({}, gridData);

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(355) }
        },
        []
      ), h(
        _flex2.default,
        { style: { marginBottom: '20px' } },
        [h(
          _flex2.default.Col,
          null,
          [h(
            _switch2.default,
            {
              on: {
                'change': this.toggleLoading
              }
            },
            []
          )]
        ), h(
          _flex2.default.Col,
          {
            attrs: { mid: true },
            style: { height: 'auto' } },
          ['Toggle Loading']
        )]
      ), h(
        _grid2.default,
        { props: props },
        []
      )]
    );
  }
};

module.exports = GridPage;

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _home = __webpack_require__(201);

var _home2 = _interopRequireDefault(_home);

var _logo = __webpack_require__(13);

var _logo2 = _interopRequireDefault(_logo);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _link = __webpack_require__(10);

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = {
  name: 'Home',

  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        'section',
        { 'class': [_home2.default.des] },
        [h(
          'div',
          { 'class': 'w1120' },
          [h(
            'div',
            { 'class': 'fbox -around' },
            [h(
              'div',
              null,
              [h(
                'h2',
                null,
                ['Component Design System']
              ), h(
                'p',
                null,
                ['OWL UI is a Component Design System based on VueJS 2, used by Cepave to run in monitoring system of OWL Light.']
              ), h(
                'p',
                { 'class': [_home2.default.badges] },
                [h(
                  'a',
                  {
                    attrs: { href: 'https://travis-ci.org/cepave-f2e/vue-owl-ui', alt: 'Build Status', target: '_blank' }
                  },
                  [h(
                    'img',
                    {
                      attrs: { src: 'https://img.shields.io/travis/cepave-f2e/vue-owl-ui/dev.svg' }
                    },
                    []
                  )]
                ), h(
                  'a',
                  {
                    attrs: { href: 'https://codecov.io/gh/cepave-f2e/vue-owl-ui', alt: 'Coverage', target: '_blank' }
                  },
                  [h(
                    'img',
                    {
                      attrs: { src: 'https://img.shields.io/codecov/c/github/cepave-f2e/vue-owl-ui/dev.svg' }
                    },
                    []
                  )]
                ), h(
                  'a',
                  {
                    attrs: { href: '//www.bithound.io/github/cepave-f2e/vue-owl-ui', alt: 'BitHound', target: '_blank' }
                  },
                  [h(
                    'img',
                    {
                      attrs: { src: '//www.bithound.io/github/cepave-f2e/vue-owl-ui/badges/score.svg' }
                    },
                    []
                  )]
                ), h(
                  'img',
                  {
                    attrs: { src: '//img.shields.io/github/license/cepave-f2e/vue-owl-ui.svg' }
                  },
                  []
                ), h(
                  'a',
                  {
                    attrs: { href: '//github.com/cepave-f2e/vue-owl-ui', target: '_new' }
                  },
                  [h(
                    'img',
                    {
                      attrs: { src: 'https://img.shields.io/github/stars/cepave-f2e/vue-owl-ui.svg?style=social&label=Stars \u2605' }
                    },
                    []
                  )]
                )]
              ), h(
                _link2.default,
                {
                  attrs: { to: '/components' },
                  'class': 'btn' },
                ['COMPONENTS']
              ), h(
                'a',
                { 'class': 'btn', attrs: { href: '//github.com/cepave-f2e/owl-light', target: '_blank' }
                },
                ['OWL LIGHT']
              )]
            ), h(
              'div',
              null,
              [h(
                _logo2.default,
                {
                  attrs: { size: 150, fill: '#fff' },
                  style: { marginTop: '32px' } },
                []
              )]
            )]
          )]
        )]
      ), h(
        'section',
        { 'class': [_home2.default.points] },
        [h(
          'div',
          { 'class': 'w1120' },
          [h(
            'div',
            { 'class': 'fbox -sb' },
            [h(
              'div',
              { 'class': [_home2.default.point] },
              [h(
                'div',
                { 'class': [_home2.default.img] },
                [h(
                  'svg',
                  {
                    attrs: { viewBox: '0 0 1025 1024', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', 'p-id': '1147' }
                  },
                  [h(
                    'path',
                    {
                      attrs: { d: 'M6.826667 79.189333C16.384 95.232 62.464 175.445333 75.776 199.68c6.144 11.264 13.994667 24.234667 17.066667 29.013333 3.413333 4.778667 11.946667 19.114667 19.456 32.426667 18.432 32.085333 66.901333 116.736 75.434666 131.413333 4.096 6.485333 9.216 15.701333 11.946667 20.48 2.389333 4.778667 17.066667 30.037333 32.426667 55.978667 15.36 25.941333 27.989333 47.786667 27.989333 48.469333 0 0.682667 38.570667 67.242667 44.373333 76.458667 1.706667 2.730667 11.264 18.773333 21.162667 35.84 9.898667 16.725333 19.797333 33.450667 21.504 36.522667 2.048 3.072 6.826667 11.605333 10.581333 18.773333 14.677333 25.941333 21.504 38.570667 61.781334 106.837333 22.528 38.570667 46.08 79.189333 52.565333 90.453334 6.144 11.264 15.018667 26.624 19.456 34.133333 4.096 7.509333 10.24 18.773333 13.312 24.917333 3.072 5.802667 6.826667 10.922667 7.850667 10.922667 1.024 0 4.778667-5.12 7.850666-11.264 3.072-5.802667 9.898667-18.773333 15.36-27.989333 5.461333-9.557333 17.066667-30.037333 26.282667-46.08 8.874667-16.042667 31.402667-54.272 49.493333-85.333334 31.744-53.589333 39.594667-66.901333 55.978667-96.597333 3.754667-7.168 8.874667-15.701333 10.581333-18.773333 2.048-3.072 11.605333-19.797333 21.504-36.522667 9.898667-17.066667 19.456-33.109333 21.162667-35.84 7.509333-11.605333 44.373333-75.776 44.373333-77.141333 0-0.682667 6.144-11.264 13.653334-23.552 7.509333-12.288 13.653333-22.869333 13.653333-23.552 0-1.024 7.509333-13.653333 16.384-28.330667 8.874667-14.677333 17.408-29.013333 18.773333-31.744 1.365333-2.730667 4.437333-8.192 6.826667-11.946667s18.432-32.085333 36.181333-63.146666c17.749333-31.061333 40.277333-69.290667 49.834667-85.333334 9.557333-16.042667 18.432-31.402667 19.797333-34.133333 1.365333-2.730667 5.802667-10.581333 9.557334-17.066667 4.096-6.485333 19.456-33.450667 34.474666-59.733333 15.018667-26.282667 30.378667-52.906667 34.133334-59.050667l6.826666-10.922666H630.442667l-17.066667 30.037333c-15.018667 26.624-53.589333 92.501333-80.896 138.922667-5.461333 9.216-11.605333 21.162667-13.994667 26.282666-2.048 5.461333-4.778667 9.557333-5.802666 9.557334-1.024 0-3.754667-4.096-5.802667-9.557334-2.389333-5.12-8.533333-17.066667-13.994667-26.282666-27.306667-46.421333-65.877333-112.298667-80.896-138.922667l-17.066666-30.037333H0l6.826667 10.922666zM249.856 145.066667c19.456 33.792 56.32 97.621333 81.92 141.653333 25.6 44.032 76.117333 131.754667 112.64 194.56s66.901333 115.029333 67.584 116.053333c1.024 1.024 2.048 0 2.730667-1.706666 1.024-2.048 30.037333-52.565333 64.853333-112.64 35.157333-60.074667 88.746667-152.234667 119.125333-204.8 30.72-52.565333 59.392-102.4 64.170667-110.933334 4.778667-8.533333 18.432-32.085333 30.378667-52.224l21.504-36.864 96.597333-0.682666c52.906667-0.341333 96.256 0.341333 96.256 2.048 0 1.365333-11.946667 22.869333-26.282667 47.786666-14.336 24.576-45.738667 78.848-69.632 120.149334-23.893333 41.301333-53.248 91.818667-65.536 112.64-11.946667 20.48-39.594667 68.266667-61.098666 105.813333-21.845333 37.546667-50.517333 87.381333-64.512 110.933333-13.653333 23.552-36.181333 62.464-50.176 87.04-13.994667 24.234667-30.378667 52.906667-36.522667 63.146667-6.144 10.24-31.061333 52.565333-54.954667 93.866667-23.893333 41.301333-48.128 83.285333-53.930666 92.842666-5.461333 9.898667-11.264 18.090667-12.629334 18.090667-2.048 0-53.930667-87.722667-80.554666-135.850667-4.778667-8.874667-9.898667-17.749333-11.264-19.456-1.365333-2.048-5.802667-8.874667-9.557334-15.36-3.413333-6.485333-20.821333-36.522667-38.229333-66.56s-43.349333-74.752-57.344-98.986666c-14.336-24.576-39.253333-67.584-55.637333-95.573334-16.384-28.330667-42.666667-73.386667-58.368-100.693333-15.36-26.965333-32.426667-56.32-37.205334-64.853333-24.917333-42.666667-34.133333-58.709333-50.858666-87.04-9.557333-17.066667-22.528-39.253333-28.330667-49.493334-5.461333-10.24-14.336-24.917333-19.114667-32.426666-4.778667-7.509333-12.288-20.48-16.725333-29.013334-8.874667-17.066667-12.629333-23.552-23.893333-41.301333-4.096-6.826667-7.509333-13.653333-7.509334-15.36s40.618667-2.730667 92.16-2.389333c67.925333 0.341333 92.16-0.341333 92.16-3.413334 0-8.533333 14.336 12.288 47.786667 70.997334z m151.893333-47.786667c6.485333 10.24 11.946667 19.114667 11.946667 20.138667 0 1.024 5.802667 11.605333 12.970667 23.210666 7.168 11.946667 13.994667 23.893333 15.36 26.624 1.365333 2.730667 6.144 11.264 10.581333 18.773334 4.778667 7.509333 17.749333 30.037333 29.013333 49.834666 24.576 43.349333 29.013333 47.786667 37.546667 38.570667 3.754667-3.413333 20.821333-31.744 38.912-62.805333 17.749333-31.061333 41.984-73.386667 53.930667-93.866667l21.845333-37.546667 86.357333-1.024c47.104-0.341333 86.016 0.341333 86.016 2.048 0 1.365333-4.437333 9.898667-10.24 18.773334-5.461333 8.874667-10.24 17.066667-10.24 18.090666 0 1.024-6.826667 12.629333-15.36 25.6s-15.36 24.576-15.36 25.258667c0 3.072-42.325333 75.093333-46.762666 79.530667-2.389333 2.389333-4.437333 5.802667-4.437334 7.509333 0 1.706667-10.24 20.48-22.528 41.642667-36.522667 62.122667-83.285333 143.018667-94.549333 163.157333-5.802667 10.24-15.701333 26.965333-22.186667 37.205333-6.144 10.24-12.629333 21.162667-13.653333 24.234667-5.12 11.946667-35.84 61.44-38.570667 61.44-1.706667 0-5.461333-5.12-8.533333-11.264-3.072-5.802667-13.653333-23.893333-23.210667-39.936-9.898667-16.042667-23.210667-38.912-29.696-51.2-6.485333-12.288-12.629333-22.869333-13.653333-23.893333-3.754667-3.413333-50.858667-87.381333-50.858667-91.136 0-2.048-1.365333-4.437333-3.072-5.12-2.730667-1.024-13.653333-18.773333-46.421333-76.117334-4.096-7.509333-26.624-46.08-49.493333-85.333333-57.344-97.621333-68.266667-117.077333-68.266667-120.149333 0-0.341333 38.570667-1.024 85.333333-1.024h85.333334l11.946666 18.773333z', 'p-id': '1148' }
                    },
                    []
                  )]
                )]
              ), h(
                'h3',
                null,
                ['Base on Vue.JS 2']
              ), h(
                'p',
                null,
                ['Writes base on VueJS 2 and jsx syntax.']
              ), h(
                'p',
                null,
                ['The low-level render functions.']
              )]
            ), h(
              'div',
              { 'class': [_home2.default.point] },
              [h(
                'div',
                { 'class': [_home2.default.img] },
                [h(
                  'svg',
                  { style: 'transform:rotate(45deg)', attrs: { viewBox: '0 0 1024 1024', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', 'p-id': '1895' }
                  },
                  [h(
                    'path',
                    {
                      attrs: { d: 'M512 238.944c-47.776 0-85.344 37.536-85.344 85.344s37.536 85.344 85.344 85.344c47.776 0 85.344-37.536 85.344-85.344s-37.536-85.344-85.344-85.344zM512 375.456c-29.024 0-51.2-22.176-51.2-51.2s22.176-51.2 51.2-51.2c29.024 0 51.2 22.176 51.2 51.2s-22.176 51.2-51.2 51.2zM682.656 605.856c0-122.88 0-262.816 0-314.016 0-95.584-63.136-225.28-170.656-291.84-107.52 66.56-170.656 196.256-170.656 293.536 0 51.2 0 191.136 0 314.016l-170.656 211.616 682.656 0-170.656-213.344zM341.312 785.056l-98.976 0 98.976-124.576 0 124.576zM648.512 785.056l-273.056 0 0-491.52c0-76.8 47.776-187.744 136.544-252.576 88.736 64.864 136.544 174.08 136.544 252.576l0 491.52zM682.656 660.48l98.976 124.576-98.976 0c0-29.024 0-73.376 0-124.576zM494.912 853.344l34.144 0 0 170.656-34.144 0 0-170.656zM580.256 853.344l34.144 0 0 102.4-34.144 0 0-102.4zM409.6 853.344l34.144 0 0 102.4-34.144 0 0-102.4z', 'p-id': '1896' }
                    },
                    []
                  )]
                )]
              ), h(
                'h3',
                null,
                ['Lightweight and Fast']
              ), h(
                'p',
                null,
                ['There is only one js file.']
              ), h(
                'p',
                null,
                ['It gziped: 15kb']
              )]
            ), h(
              'div',
              { 'class': [_home2.default.point] },
              [h(
                'div',
                { 'class': [_home2.default.img] },
                [h(
                  'svg',
                  {
                    attrs: { viewBox: '0 0 1024 1024', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', 'p-id': '1127' }
                  },
                  [h(
                    'path',
                    {
                      attrs: { d: 'M945.178 271.168 714 178.009l0-6.259c0-49.706-90.438-90-202-90s-202 40.294-202 90l0 8.284-223.37 85.19C73 269.5 64 277.208 64 291.343l0 442.569c0 14.507 10.11 29.623 23.516 35.162l411.617 167.917c6.14 2.505 16.12 2.584 22.291 0.179l421.062-164.149C952.635 769.1 960 758.349 960 747.459l0.019-454.308C960.02 284.313 953.381 274.474 945.178 271.168zM512.481 112.75c93.87 0 169.966 25.967 169.966 58s-76.096 58-169.966 58c-89.525 0-162.882-23.619-169.481-53.593l0-3.407-0.448 0c-0.017-0.333-0.037-0.666-0.037-1C342.515 138.717 418.611 112.75 512.481 112.75zM682.678 219.901l0 64.474c0 0-27.994 56.22-170.678 56.616L512 261.75C583.808 261.75 646.856 245.054 682.678 219.901zM492.383 896.085 110.501 739.967c-8.181-3.344-14.812-13.221-14.812-22.063l0-412.31L492.383 463.64 492.383 896.085zM518.071 436.857 134.401 280.92 310 213.95l0 73.801c0 1.1 0.248 2.857 0.555 3.917 0 0 17.445 80.582 199.945 80.582 179.5 0 202.823-80.622 202.823-80.622 0.394-1.035 0.677-2.772 0.677-3.876l0-75.704 189.785 75.869-170.472 67.557L518.071 436.857zM928.311 744.527l-400.073 154.64L528.238 470.45c1.416-0.331 2.861-0.755 4.297-1.323l212.305-84.133 183.472-70.486L928.312 744.527z', 'p-id': '1128' }
                    },
                    []
                  )]
                )]
              ), h(
                'h3',
                null,
                ['Composable and Clever API']
              ), h(
                'p',
                null,
                ['Each component can be composed very easy.']
              ), h(
                'p',
                null,
                ['All components had passed test specs.']
              )]
            )]
          )]
        )]
      ), h(
        'section',
        { 'class': ['w1120', _home2.default.mainContent] },
        [h(
          _markdown2.default,
          {
            attrs: { src: __webpack_require__(356) }
          },
          []
        )]
      )]
    );
  }
};

module.exports = Home;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _icon3 = __webpack_require__(202);

var _icon4 = _interopRequireDefault(_icon3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var icons = __webpack_require__(9).match(/symbol id="([^"]*)/g).map(function (id) {
  return id.match(/symbol id="([^"]*)/)[1];
});

icons = ['owl-icons-arrow-left', 'owl-icons-arrow-right'].concat(_toConsumableArray(icons));

var IconPage = {
  name: 'IconPage',
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(357) }
        },
        []
      ), icons.map(function (typ) {
        typ = typ.replace(/^owl-icons-/, '');
        return h(
          'div',
          { 'class': [_icon4.default.icons] },
          [h(
            _icon2.default,
            {
              attrs: { typ: typ, size: 30 }
            },
            []
          ), h(
            'p',
            null,
            [typ]
          )]
        );
      })]
    );
  }
};

module.exports = IconPage;

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _input = __webpack_require__(16);

var _input2 = _interopRequireDefault(_input);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _input3 = __webpack_require__(203);

var _input4 = _interopRequireDefault(_input3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputPage = {
  name: 'InputPage',
  data: function data() {
    return {
      outputs: ''
    };
  },
  mounted: function mounted() {
    this.$refs.disabledInput.setValue('cepave');
  },

  methods: {
    handleInput: function handleInput(data) {
      this.outputs = this.$refs.inputRef.value;
    }
  },
  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(358) }
        },
        []
      ), h(
        'div',
        { 'class': [_input4.default.wrapper] },
        [h(
          _input2.default,
          {
            attrs: { name: 'demo',
              icon: ['search', '#919799'],
              status: 'normal',
              placeholder: 'type some words..'
            },
            ref: 'inputRef',
            on: {
              'input': this.handleInput
            }
          },
          []
        ), h(
          'div',
          { 'class': [_input4.default.demo] },
          ['demo : ', this.outputs]
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { loading: true }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { password: true }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { x: true }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { status: 'success' }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { status: 'error' }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { required: true }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { disabled: true },
            ref: 'disabledInput' },
          []
        )]
      ), h(
        'div',
        { 'class': [_input4.default.pwdInputwrapper] },
        [h(
          _input2.default,
          {
            attrs: { pattern: '\\d+([a-zA-Z])?' }
          },
          []
        )]
      )]
    );
  }
};

module.exports = InputPage;

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _label = __webpack_require__(17);

var _label2 = _interopRequireDefault(_label);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _label3 = __webpack_require__(204);

var _label4 = _interopRequireDefault(_label3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelPage = {
  name: 'LabelPage',
  data: function data() {
    return {
      testData: [{ value: 'Winnie The Pooh' }, { value: 'Piglet' }, { value: 'Tigger' }]
    };
  },

  methods: {
    handleLabelGroup: function handleLabelGroup(data) {
      this.testData = data;
    }
  },
  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(359) }
        },
        []
      ), 'Labels', h(
        'div',
        { 'class': [_label4.default.group] },
        [h(
          _label2.default,
          null,
          ['Default']
        ), h(
          _label2.default,
          {
            attrs: { status: 'primary' }
          },
          ['Primary']
        ), h(
          _label2.default,
          {
            attrs: { status: 'error' }
          },
          ['Error']
        ), h(
          _label2.default,
          {
            attrs: { status: 'success' }
          },
          ['Success']
        ), h(
          _label2.default,
          {
            attrs: { status: 'warning' }
          },
          ['Warning']
        ), h(
          'span',
          { 'class': [_label4.default.dark] },
          [h(
            _label2.default,
            {
              attrs: { status: 'inverted' }
            },
            ['Inverted']
          )]
        )]
      ), 'Outline', h(
        'div',
        { 'class': [_label4.default.group] },
        [h(
          _label2.default,
          {
            attrs: { typ: 'outline' }
          },
          ['Default']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'outline', status: 'primary' }
          },
          ['Primary']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'outline', status: 'error' }
          },
          ['Error']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'outline', status: 'success' }
          },
          ['Success']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'outline', status: 'warning' }
          },
          ['Warning']
        ), h(
          'span',
          { 'class': [_label4.default.dark] },
          [h(
            _label2.default,
            {
              attrs: { typ: 'outline', status: 'inverted' }
            },
            ['Inverted']
          )]
        )]
      ), 'Tags', h(
        'div',
        { 'class': [_label4.default.group] },
        [h(
          _label2.default,
          {
            attrs: { typ: 'tag' }
          },
          ['Default']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'tag', status: 'primary' }
          },
          ['Primary']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'tag', status: 'error' }
          },
          ['Error']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'tag', status: 'success' }
          },
          ['Success']
        ), h(
          _label2.default,
          {
            attrs: { typ: 'tag', status: 'warning' }
          },
          ['Warning']
        ), h(
          'span',
          { 'class': [_label4.default.dark] },
          [h(
            _label2.default,
            {
              attrs: { typ: 'tag', status: 'inverted' }
            },
            ['Inverted']
          )]
        )]
      ), 'Badges', h(
        'div',
        { 'class': [_label4.default.group] },
        [h(
          _label2.default,
          {
            attrs: { badge: true }
          },
          ['Default']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, status: 'primary' }
          },
          ['1']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, status: 'error' }
          },
          ['2']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, status: 'success' }
          },
          ['3']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, status: 'warning' }
          },
          ['4']
        ), h(
          'span',
          { 'class': [_label4.default.dark] },
          [h(
            _label2.default,
            {
              attrs: { badge: true, status: 'inverted' }
            },
            ['5']
          )]
        )]
      ), 'Badge Outline', h(
        'div',
        { 'class': [_label4.default.group] },
        [h(
          _label2.default,
          {
            attrs: { badge: true, typ: 'outline' }
          },
          ['Default']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, typ: 'outline', status: 'primary' }
          },
          ['1']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, typ: 'outline', status: 'error' }
          },
          ['2']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, typ: 'outline', status: 'success' }
          },
          ['3']
        ), h(
          _label2.default,
          {
            attrs: { badge: true, typ: 'outline', status: 'warning' }
          },
          ['4']
        ), h(
          'span',
          { 'class': [_label4.default.dark] },
          [h(
            _label2.default,
            {
              attrs: { badge: true, typ: 'outline', status: 'inverted' }
            },
            ['5']
          )]
        )]
      ), 'Closable Label', h(
        'div',
        { 'class': [_label4.default.closableTagGroup] },
        [h(
          _label2.default,
          {
            attrs: { x: true, badge: true, status: 'success' },
            'class': [_label4.default.closableTag] },
          ['hello']
        ), h(
          _label2.default,
          {
            attrs: { x: true, badge: true, status: 'primary', typ: 'outline' },
            'class': [_label4.default.closableTag] },
          ['This']
        ), h(
          _label2.default,
          {
            attrs: { x: true, status: 'default' },
            'class': [_label4.default.closableTag] },
          ['is']
        ), h(
          _label2.default,
          {
            attrs: { x: true, badge: true, status: 'error', typ: 'outline' },
            'class': [_label4.default.closableTag] },
          ['Closable']
        ), h(
          _label2.default,
          {
            attrs: { x: true, status: 'default', typ: 'outline' },
            'class': [_label4.default.closableTag] },
          ['Tag']
        )]
      ), 'Label Group (Piglet is focused)', h(
        'div',
        { 'class': [_label4.default.labelGroup] },
        [h(
          _label2.default.Group,
          {
            attrs: { displayKey: 'value',
              options: this.testData,
              x: true,
              badge: true,
              typ: 'outline',

              focused: 1,
              newTag: true
            },
            on: {
              'change': this.handleLabelGroup
            }
          },
          []
        )]
      ), h(
        'pre',
        null,
        [h(
          'code',
          null,
          [JSON.stringify(this.testData, null, 2)]
        )]
      )]
    );
  }
};

module.exports = LabelPage;

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _legacy = __webpack_require__(178);

var _legacy2 = _interopRequireDefault(_legacy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LegacyGridDoc = {
  name: 'LegacyGridDoc',
  data: function data() {
    var h = this.$createElement;

    return {
      gridProps: {
        heads: [{
          col: h(
            'b',
            null,
            ['Name']
          ),
          width: '50%'
        }, {
          col: 'HP',
          width: '50%'
        }],
        rows: [[{ col: 'Pikachu' }, { col: 13 }]]
      }
    };
  },
  render: function render(h) {
    var gridProps = this.gridProps;


    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(361) }
        },
        []
      ), h(
        _legacy2.default.Grid,
        { props: gridProps },
        []
      )]
    );
  }
};
module.exports = LegacyGridDoc;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LegacyDoc = {
  name: 'LegacyDoc',
  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(360) }
        },
        []
      )]
    );
  }
};
module.exports = LegacyDoc;

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lightBox = __webpack_require__(179);

var _lightBox2 = _interopRequireDefault(_lightBox);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LightBoxPage = {
  name: 'LightBoxPage',
  methods: {},
  render: function render(h) {
    var content = h(
      'div',
      null,
      [h(
        'h2',
        null,
        ['LightBox']
      ), h(
        'p',
        null,
        ['Lightbox is a JavaScript library that displays images and videos by filling the screen, and dimming out the rest of the web page.[1]']
      ), h(
        'p',
        null,
        ['The original JavaScript library was written by Lokesh Dhakar with the help of riphath.[2] The term Lightbox may also refer to other similar JavaScript libraries. The technique gained widespread popularity due to its simple and elegant style.']
      ), h(
        'p',
        null,
        ['The original Lightbox library used two JavaScript libraries, Prototype Javascript Framework[3] and script.aculo.us,[4] for its animations and positioning. In April 2012, the plugin was rewritten for jQuery.[5] The open-source nature of Lightbox encouraged developers to modify and fork the code, resulting in plugins such as Colorbox, Magnific Popup, Slimbox or Thickbox.']
      ), h(
        'p',
        null,
        ['Lightbox scripts are dependent upon a browser\'s JavaScript support,.[6] Many Lightbox scripts use unobtrusive JavaScript. Browsers that do not load the script for whatever reason can instead simply load the image as a separate page load, losing the Lightbox effect but still retaining the ability to display the image.[7]']
      ), h(
        'h3',
        null,
        ['Bypassing']
      ), h(
        'p',
        null,
        ['The user may use a developer tool such as Chrome\'s Inspect Element, to remove and add the code for it from the DOM. [8] Adblock Plus as an example, has the ability to block these elements using Element Hiding Helper or manually written rules. [9]']
      )]
    );

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(362) }
        },
        []
      ), h(
        _lightBox2.default,
        {
          attrs: { closeOnClickMask: true, closeOnESC: true, width: 600 }
        },
        [h(
          _lightBox2.default.Open,
          null,
          [h(
            'a',
            {
              attrs: { href: '#' }
            },
            ['Open lightbox']
          )]
        ), h(
          _lightBox2.default.View,
          null,
          [h(
            'h1',
            null,
            ['LightBox long content demo']
          ), content, content]
        )]
      )]
    );
  }
};

module.exports = LightBoxPage;

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _loading = __webpack_require__(5);

var _loading2 = _interopRequireDefault(_loading);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _loading3 = __webpack_require__(205);

var _loading4 = _interopRequireDefault(_loading3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoadingPage = {
  name: 'LoadingPage',

  render: function render(h) {
    var $slots = this.$slots;


    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(363) }
        },
        []
      ), h(
        'h2',
        null,
        ['typ="pie"']
      ), h(
        'div',
        { 'class': [_loading4.default.exampleWrapper] },
        [h(
          _loading2.default,
          null,
          []
        )]
      ), h(
        'h2',
        null,
        ['typ="bar"']
      ), h(
        'div',
        { 'class': [_loading4.default.exampleWrapper] },
        [h(
          _loading2.default,
          {
            attrs: { typ: 'bar' }
          },
          []
        )]
      )]
    );
  }
};

module.exports = LoadingPage;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _message = __webpack_require__(180);

var _message2 = _interopRequireDefault(_message);

var _button = __webpack_require__(14);

var _button2 = _interopRequireDefault(_button);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessagePage = {
  name: 'MessagePage',
  methods: {
    open: function open() {
      (0, _message2.default)('Hello!');
    },
    open_warning: function open_warning(event) {
      event.preventDefault();
      var vm = (0, _message2.default)({
        message: 'Warning!',
        type: 'warning',
        duration: 0,
        showClose: true
      });
    }
  },

  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(364) }
        },
        []
      ), h(
        _button2.default,
        {
          attrs: { status: 'primaryOutline' },
          nativeOn: {
            'click': this.open
          }
        },
        ['Hello message!']
      ), h(
        'br',
        null,
        []
      ), h(
        'a',
        {
          attrs: { href: '#' },
          on: {
            'click': this.open_warning
          }
        },
        ['Warning']
      )]
    );
  }
};

module.exports = MessagePage;

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _multiSelect = __webpack_require__(181);

var _multiSelect2 = _interopRequireDefault(_multiSelect);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _multiSelect3 = __webpack_require__(206);

var _multiSelect4 = _interopRequireDefault(_multiSelect3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MultiSelectPage = {
  name: 'MultiSelectPage',
  data: function data() {
    return {
      selectedItems: [0, 1],
      options: [{ value: 'vulpix', id: 23 }, { value: 'caterpie', id: 26 }, { value: 'Pikachu', id: 24 }, { value: 'charmander', id: 25 }, { value: 'bulbasaur', id: 20 }, { value: 'Squirtle', id: 19 }, { value: 'raticate', id: 18 }, { value: 'fearow', id: 17 }, { value: 'psyduck', id: 16 }, { value: 'duduo', id: 1 }],
      output: [{ value: 'vulpix', id: 23 }, { value: 'caterpie', id: 26 }]
    };
  },


  methods: {
    getMultiSelectData: function getMultiSelectData(data) {
      this.output = data;
    }
  },

  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(365) }
        },
        []
      ), h(
        'div',
        { 'class': [_multiSelect4.default.demoGroup] },
        [h(
          'div',
          { 'class': [_multiSelect4.default.multiSelect] },
          [h(
            _multiSelect2.default,
            {
              attrs: { selectedOpts: this.selectedItems,
                options: this.options,

                displayKey: 'value',
                caseInsensitive: true,
                loading: true
              },
              on: {
                'change': this.getMultiSelectData
              }
            },
            []
          )]
        ), h(
          'div',
          { 'class': [_multiSelect4.default.code] },
          [h(
            'pre',
            null,
            [h(
              'code',
              null,
              [JSON.stringify(this.output, null, 2)]
            )]
          )]
        )]
      )]
    );
  }
};

module.exports = MultiSelectPage;

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _page = __webpack_require__(182);

var _page2 = _interopRequireDefault(_page);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageDoc = {
  name: 'PageDoc',
  render: function render(h) {
    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(366) }
        },
        []
      ), h(
        'h3',
        null,
        ['typ="pages"']
      ), h(
        _page2.default,
        {
          attrs: { total: 500, limit: 20, align: 'left' }
        },
        []
      ), h(
        'h3',
        null,
        ['typ="number"']
      ), h(
        _page2.default,
        {
          attrs: { total: 500, limit: 20, typ: 'number', align: 'left' }
        },
        []
      )]
    );
  }
};

module.exports = PageDoc;

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _radio = __webpack_require__(183);

var _radio2 = _interopRequireDefault(_radio);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RadioPage = {
  name: 'RadioPage',
  data: function data() {
    return {
      radioDatum: { piglet: false, tigger: false, winnieThePooh: true }
    };
  },

  methods: {
    getRadioData: function getRadioData(data) {
      this.radioDatum = data;
    }
  },
  render: function render(h) {
    var getRadioData = this.getRadioData,
        radioDatum = this.radioDatum;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(367) }
        },
        []
      ), h(
        'div',
        null,
        [h(
          'code',
          null,
          [JSON.stringify(radioDatum)]
        )]
      ), h(
        'br',
        null,
        []
      ), h(
        _radio2.default.Group,
        {
          on: {
            'change': getRadioData
          }
        },
        [h(
          _radio2.default,
          {
            attrs: { name: 'piglet' }
          },
          ['Piglet']
        ), h(
          _radio2.default,
          {
            attrs: { name: 'tigger' }
          },
          ['Tigger']
        ), h(
          _radio2.default,
          {
            attrs: { name: 'winnieThePooh', on: true }
          },
          ['Winnie the Pooh']
        )]
      )]
    );
  }
};

module.exports = RadioPage;

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _babelHelperVueJsxMergeProps = __webpack_require__(4);

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _select = __webpack_require__(184);

var _select2 = _interopRequireDefault(_select);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectPage = {
  name: 'SelectPage',
  data: function data() {
    return {
      outputs: {
        value: '3d',
        idx: 1
      },
      selectProps: {
        options: [{ value: '1d', title: '1 day' }, { value: '3d', title: '3 days', selected: true }, { value: '5d', title: '5 days' }]
      }
    };
  },


  methods: {
    selectOnChange: function selectOnChange(d) {
      this.outputs = d;
    }
  },

  render: function render(h) {
    var selectProps = this.selectProps,
        outputs = this.outputs,
        selectOnChange = this.selectOnChange;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(368) }
        },
        []
      ), h(
        'pre',
        null,
        [h(
          'code',
          null,
          [JSON.stringify(outputs)]
        )]
      ), h(
        _select2.default,
        (0, _babelHelperVueJsxMergeProps2.default)([{ props: selectProps }, {
          on: {
            'change': selectOnChange
          }
        }]),
        []
      )]
    );
  }
};

module.exports = SelectPage;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _switch = __webpack_require__(18);

var _switch2 = _interopRequireDefault(_switch);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

var _switch3 = __webpack_require__(207);

var _switch4 = _interopRequireDefault(_switch3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SwitchPage = {
  name: 'SwitchPage',
  data: function data() {
    return {
      switch1Data: { demo1: true },
      switch2Data: { demo2: true }
    };
  },

  methods: {
    getSwitch1Data: function getSwitch1Data(data) {
      this.switch1Data = data;
    },
    getSwitch2Data: function getSwitch2Data(data) {
      this.switch2Data = data;
    }
  },

  render: function render(h) {
    var getSwitch1Data = this.getSwitch1Data,
        switch1Data = this.switch1Data,
        getSwitch2Data = this.getSwitch2Data,
        switch2Data = this.switch2Data;


    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(369) }
        },
        []
      ), h(
        'div',
        { 'class': [_switch4.default.title] },
        ['Default Switch Button']
      ), h(
        'div',
        { 'class': [_switch4.default.demo] },
        [h(
          _switch2.default,
          {
            attrs: { checked: true, name: 'demo1' },
            on: {
              'change': getSwitch1Data
            }
          },
          []
        ), h(
          'span',
          { 'class': [_switch4.default.demoMsg] },
          [h(
            'code',
            null,
            [JSON.stringify(switch1Data, null, 2)]
          )]
        )]
      ), h(
        'div',
        { 'class': [_switch4.default.title] },
        ['Special Switch Button']
      ), h(
        'div',
        { 'class': [_switch4.default.demo] },
        [h(
          _switch2.default,
          {
            attrs: { checked: true, name: 'demo2', typ: 'special' },
            on: {
              'change': getSwitch2Data
            }
          },
          [h(
            _switch2.default.Open,
            null,
            ['\u958B']
          ), h(
            _switch2.default.Close,
            null,
            ['\u95DC']
          )]
        ), h(
          'span',
          { 'class': [_switch4.default.demoMsg] },
          [h(
            'code',
            null,
            [JSON.stringify(switch2Data, null, 2)]
          )]
        )]
      )]
    );
  }
};

module.exports = SwitchPage;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tab = __webpack_require__(185);

var _tab2 = _interopRequireDefault(_tab);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabPage = {
  name: 'TabPage',
  data: function data() {
    return {
      tabData: { idx: 1, name: '2' }
    };
  },

  methods: {
    getTabData: function getTabData(data) {
      this.tabData = data;
    }
  },

  render: function render(h) {
    var tabData = this.tabData,
        getTabData = this.getTabData;

    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(370) }
        },
        []
      ), h(
        'div',
        null,
        [h(
          _tab2.default,
          {
            on: {
              'change': getTabData
            }
          },
          [h(
            _tab2.default.Head,
            { slot: 'tabHead', attrs: { name: '1' }
            },
            ['Tab1']
          ), h(
            _tab2.default.Head,
            { slot: 'tabHead', attrs: { isSelected: true, name: '2' }
            },
            ['Tab2']
          ), h(
            _tab2.default.Content,
            { slot: 'tabContent', attrs: { name: '1' }
            },
            [h(
              'br',
              null,
              []
            ), 'Hello, I am tab one']
          ), h(
            _tab2.default.Content,
            { slot: 'tabContent', attrs: { name: '2' }
            },
            [h(
              'br',
              null,
              []
            ), 'This is tab two']
          )]
        ), h(
          'br',
          null,
          []
        ), h(
          'code',
          null,
          [JSON.stringify(tabData)]
        )]
      )]
    );
  }
};

module.exports = TabPage;

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TimePickerDoc;

var _timePicker = __webpack_require__(19);

var _timePicker2 = _interopRequireDefault(_timePicker);

var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TimePickerDoc = (_TimePickerDoc = {
  name: 'TimePickerDoc',
  methods: {},
  data: function data() {
    return {
      outs: {}
    };
  }
}, _defineProperty(_TimePickerDoc, 'methods', {
  onChange: function onChange(data) {
    this.outs = data;
  }
}), _defineProperty(_TimePickerDoc, 'render', function render(h) {
  var onChange = this.onChange,
      outs = this.outs;


  return h(
    'div',
    null,
    [h(
      _markdown2.default,
      {
        attrs: { src: __webpack_require__(371) }
      },
      []
    ), h(
      'pre',
      null,
      [h(
        'code',
        null,
        [JSON.stringify(outs)]
      )]
    ), h(
      _timePicker2.default,
      {
        on: {
          'change': onChange
        },
        ref: 'time1' },
      []
    )]
  );
}), _TimePickerDoc);

module.exports = TimePickerDoc;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tip = __webpack_require__(187);

var _tip2 = _interopRequireDefault(_tip);

var _markdown = __webpack_require__(1);

var _markdown2 = _interopRequireDefault(_markdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TipPage = {
  name: 'TipPage',

  render: function render(h) {
    var $slots = this.$slots;


    return h(
      'div',
      null,
      [h(
        _markdown2.default,
        {
          attrs: { src: __webpack_require__(372) }
        },
        []
      ), h(
        'h2',
        null,
        ['pos="right"']
      ), h(
        _tip2.default,
        {
          attrs: { pos: 'right' }
        },
        ['hover me', h(
          _tip2.default.Context,
          null,
          ['I am a tip']
        )]
      ), h(
        'h2',
        null,
        ['pos="up"']
      ), h(
        _tip2.default,
        {
          attrs: { pos: 'up' }
        },
        ['hover me', h(
          _tip2.default.Context,
          null,
          ['I am a tip']
        )]
      ), h(
        'h2',
        null,
        ['pos="left"']
      ), h(
        _tip2.default,
        {
          attrs: { pos: 'left' }
        },
        ['hover me', h(
          _tip2.default.Context,
          null,
          ['I am a tip']
        )]
      ), h(
        'h2',
        null,
        ['pos="down"']
      ), h(
        _tip2.default,
        {
          attrs: { pos: 'down' }
        },
        ['hover me', h(
          _tip2.default.Context,
          null,
          ['I am a tip']
        )]
      )]
    );
  }
};

module.exports = TipPage;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _flex = __webpack_require__(8);

var _flex2 = _interopRequireDefault(_flex);

var _loading = __webpack_require__(5);

var _loading2 = _interopRequireDefault(_loading);

var _checkbox = __webpack_require__(15);

var _checkbox2 = _interopRequireDefault(_checkbox);

var _complexQuery = __webpack_require__(210);

var _complexQuery2 = _interopRequireDefault(_complexQuery);

var _lodash = __webpack_require__(232);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ComplexQuery = {
  name: 'ComplexQuery',
  props: {
    categories: {
      type: Array,
      default: function _default() {
        return [{
          name: 'cat1',
          value: 'cat1',
          on: true
        }];
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: function _default() {
        return [{
          name: '',
          checked: false,
          children: [{
            name: '',
            value: 'uniq',
            checked: false
          }]
        }];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: Object,
      default: function _default() {
        return {
          selectAll: 'select all',
          clearAll: 'clear all',
          selected: 'selected',
          selectedItems: 'selected items',
          removeAll: 'remove all'
        };
      }
    }
  },

  data: function data() {
    var categories = this.categories,
        items = this.items;


    var cat = '';
    if (categories.length) {
      cat = (categories.find(function (cat) {
        return cat.on;
      }) || categories[0]).value;
    }

    return {
      cat: cat,
      focus: false,
      selectedItems: {},
      storeSelectedItems: {},
      highlightText: '',
      isEdit: false
    };
  },

  watch: {
    storeSelectedItems: function storeSelectedItems() {
      this.$emit('change', {
        selectedItems: this.storeSelectedItems
      });
    },
    focus: function focus(isFocused) {
      var event = isFocused ? 'focus' : 'blur';
      this.$emit(event);
    }
  },
  methods: {
    editRemoveAll: function editRemoveAll(ev) {
      this.storeSelectedItems = {};
    },
    editItemRemove: function editItemRemove(_ref) {
      var _this = this;

      var item = _ref.item;
      var storeSelectedItems = this.storeSelectedItems;

      return function (ev) {
        _this.$delete(storeSelectedItems, item);
      };
    },
    onQuery: function onQuery(ev) {
      var which = ev.which;
      var $refs = this.$refs,
          cat = this.cat;


      if (which !== 13) {
        return;
      }
      this.highlightText = $refs.query.value;
      this.$emit('query', {
        value: $refs.query.value,
        category: cat
      });
    },
    handleSelect: function handleSelect(_ref2) {
      var _this2 = this;

      var itemIdx = _ref2.itemIdx,
          itemChildIdx = _ref2.itemChildIdx;
      var items = this.items,
          $set = this.$set,
          $delete = this.$delete;


      return function (d) {
        var _Object$keys = Object.keys(d),
            _Object$keys2 = _slicedToArray(_Object$keys, 1),
            name = _Object$keys2[0];

        var checked = d[name];

        if (name === '@@dt@@') {
          items[itemIdx].checkedCounts = checked ? items[itemIdx].children.length : 0;
          $set(items[itemIdx], 'checked', checked);

          items[itemIdx].children.forEach(function (itemChild) {
            $set(itemChild, 'checked', checked);

            _this2[checked ? '$set' : '$delete'](_this2.selectedItems, itemChild.value, true);

            // store
            if (checked) {
              if (!_this2.storeSelectedItems[itemChild.value]) {
                $set(_this2.storeSelectedItems, itemChild.value, _extends({}, itemChild));
              }
            }
          });
        } else {
          if (items[itemIdx].checkedCounts === undefined) {
            items[itemIdx].checkedCounts = 0;
          }

          $set(items[itemIdx].children[itemChildIdx], 'checked', checked);
          items[itemIdx].checkedCounts += checked ? 1 : -1;
          _this2[checked ? '$set' : '$delete'](_this2.selectedItems, name, true);

          if (checked) {
            if (!_this2.storeSelectedItems[items[itemIdx].children[itemChildIdx].value]) {
              $set(_this2.storeSelectedItems, items[itemIdx].children[itemChildIdx].value, _extends({}, items[itemIdx].children[itemChildIdx]));
            }
          }
          $set(items[itemIdx], 'checked', items[itemIdx].checkedCounts >= items[itemIdx].children.length);
        }
      };
    },
    handleFocus: function handleFocus() {
      this.focus = true;
    },
    handleBlur: function handleBlur() {
      if (this.lockBlur) {
        return;
      }
      this.focus = false;
    },
    handleFold: function handleFold(eq) {
      var _this3 = this;

      var items = this.items;


      return function (ev) {
        _this3.$set(items[eq], 'isFold', !items[eq].isFold);
      };
    },
    changeCategory: function changeCategory(eq) {
      var _this4 = this;

      var categories = this.categories,
          $refs = this.$refs;


      return function (ev) {
        categories.forEach(function (cat, i) {
          if (i === eq) {
            _this4.cat = cat.value;
            _this4.$emit('clickCategory', {
              value: $refs.query.value,
              category: cat.value
            });
          }
        });
      };
    },
    selectAll: function selectAll() {
      var _this5 = this;

      var items = this.items,
          $set = this.$set,
          totalCounts = this.totalCounts,
          sum = this.sum;


      if (sum >= totalCounts) {
        return;
      }

      items.forEach(function (item) {
        $set(item, 'checked', true);
        item.checkedCounts = item.children.length;
        item.children.forEach(function (child) {
          $set(child, 'checked', true);
          $set(_this5.selectedItems, child.name, true);

          if (!_this5.storeSelectedItems[child.value]) {
            _this5.$set(_this5.storeSelectedItems, child.value, _extends({}, child));
          }
        });
      });
    },
    clearAll: function clearAll() {
      var items = this.items,
          $set = this.$set,
          sum = this.sum;

      if (sum === 0) {
        return;
      }

      items.forEach(function (item) {
        $set(item, 'checked', false);
        item.checkedCounts = 0;
        item.children.forEach(function (child) {
          $set(child, 'checked', false);
        });
      });

      this.selectedItems = {};
    },
    editItems: function editItems(ev) {
      var storeSelectedItems = this.storeSelectedItems;

      this.isEdit = true;
    }
  },

  computed: {
    totalCounts: function totalCounts() {
      var items = this.items;


      return items.reduce(function (sum, item) {
        return sum += item.children.length;
      }, 0);
    },
    sum: function sum() {
      var selectedItems = this.selectedItems;

      return Object.keys(selectedItems).length;
    },
    css: function css() {
      var _ref3;

      var focus = this.focus,
          isEdit = this.isEdit,
          items = this.items;

      return _ref3 = {}, _defineProperty(_ref3, _complexQuery2.default.focus, focus), _defineProperty(_ref3, _complexQuery2.default.isEdit, isEdit), _defineProperty(_ref3, _complexQuery2.default.hasItems, items.length), _ref3;
    },
    renderCategories: function renderCategories() {
      var _this6 = this;

      var h = this.$createElement;
      var categories = this.categories,
          changeCategory = this.changeCategory;


      return h(
        'ul',
        { 'class': [_complexQuery2.default.categories] },
        [categories.map(function (cat, index) {
          return h(
            'li',
            {
              attrs: { 'data-value': cat.value, 'data-on': _this6.cat === cat.value },
              on: {
                'click': changeCategory(index)
              }
            },
            [cat.name]
          );
        })]
      );
    },
    renderItems: function renderItems() {
      var h = this.$createElement;
      var items = this.items,
          handleFold = this.handleFold,
          handleSelect = this.handleSelect,
          $refs = this.$refs,
          highlightText = this.highlightText;


      return h(
        'div',
        { 'class': [_complexQuery2.default.itemView] },
        [items.map(function (item, itemIdx) {
          var classes = _defineProperty({}, _complexQuery2.default.isFold, item.isFold);

          return !!item.children.length && h(
            'dl',
            { 'class': classes },
            [h(
              'dt',
              {
                on: {
                  'click': handleFold(itemIdx)
                }
              },
              [h(
                _flex2.default,
                {
                  attrs: { split: true }
                },
                [h(
                  _flex2.default.Col,
                  null,
                  [h(
                    _checkbox2.default,
                    {
                      attrs: { checked: item.checked, 'data-itemidx': itemIdx,
                        name: '@@dt@@' },
                      on: {
                        'change': handleSelect({ itemIdx: itemIdx })
                      },
                      'class': [_complexQuery2.default.itemViewCheckbox] },
                    [item.name, ' (', item.children.length, ')']
                  )]
                ), h(
                  _flex2.default.Col,
                  null,
                  [h(
                    _icon2.default,
                    {
                      attrs: { typ: 'arrow-up', 'is-fold': item.isFold }
                    },
                    []
                  )]
                )]
              )]
            ), item.children.map(function (itemChild, itemChildIdx) {
              var hasChildren = itemChild.children && itemChild.children.length;
              var name = itemChild.name;

              if (highlightText.trim()) {
                name = name.replace(new RegExp('(' + (0, _lodash2.default)(highlightText) + ')', 'ig'), function (m) {
                  return '<span class="' + _complexQuery2.default.highlight + '">' + m + '</span>';
                });
              }

              return h(
                'dd',
                { 'class': [_complexQuery2.default.itemdd] },
                [h(
                  _checkbox2.default,
                  {
                    attrs: { checked: itemChild.checked,
                      name: itemChild.value },
                    on: {
                      'change': handleSelect({ itemIdx: itemIdx, itemChildIdx: itemChildIdx })
                    },
                    'class': [_complexQuery2.default.itemViewCheckbox, _complexQuery2.default.itemCheckbox] },
                  [h(
                    'div',
                    { 'class': [_complexQuery2.default.item], domProps: {
                        'innerHTML': name
                      }
                    },
                    []
                  )]
                )]
              );
            })]
          );
        })]
      );
    },
    renderEditItems: function renderEditItems() {
      var h = this.$createElement;
      var storeSelectedItems = this.storeSelectedItems,
          editItemRemove = this.editItemRemove;


      return h(
        'ul',
        null,
        [Object.keys(storeSelectedItems).map(function (item) {
          return h(
            'li',
            { 'class': [_complexQuery2.default.editItemLi], on: {
                'click': editItemRemove({ item: item })
              }
            },
            [h(
              _icon2.default,
              {
                attrs: { typ: 'circle-minus' }
              },
              []
            ), ' ', storeSelectedItems[item].name]
          );
        })]
      );
    },
    storeSUM: function storeSUM() {
      var storeSelectedItems = this.storeSelectedItems,
          items = this.items;


      var sum = Object.keys(storeSelectedItems).length;

      if (!sum) {
        this.isEdit = false;
      }

      return sum;
    }
  },
  render: function render(h) {
    var _this7 = this;

    var renderCategories = this.renderCategories,
        categories = this.categories,
        handleFocus = this.handleFocus,
        handleBlur = this.handleBlur,
        css = this.css,
        renderItems = this.renderItems,
        sum = this.sum,
        selectAll = this.selectAll,
        clearAll = this.clearAll,
        totalCounts = this.totalCounts,
        text = this.text,
        onQuery = this.onQuery,
        storeSUM = this.storeSUM,
        editItems = this.editItems,
        renderEditItems = this.renderEditItems,
        editRemoveAll = this.editRemoveAll,
        lockBlur = this.lockBlur,
        loading = this.loading,
        placeholder = this.placeholder;


    return h(
      'div',
      { 'class': [_complexQuery2.default.com, css], on: {
          'mouseup': function mouseup() {
            return _this7.$refs.query.focus();
          },
          'mouseenter': function mouseenter() {
            return _this7.lockBlur = true;
          },
          'mouseleave': function mouseleave() {
            return _this7.lockBlur = false;
          }
        }
      },
      [h(
        _flex2.default,
        {
          attrs: { split: true, mid: true }
        },
        [storeSUM ? h(
          _flex2.default.Col,
          null,
          [h(
            'a',
            {
              on: {
                'click': editItems
              },
              'class': [_complexQuery2.default.selectedItems] },
            [text.selectedItems, ' (', storeSUM, ')']
          )]
        ) : h(
          'div',
          null,
          []
        ), h(
          _flex2.default.Col,
          {
            attrs: { size: 'auto' }
          },
          [h(
            'input',
            {
              attrs: { type: 'text', placeholder: placeholder },
              ref: 'query', 'class': [_complexQuery2.default.input], on: {
                'blur': handleBlur,
                'focus': handleFocus,
                'keyup': onQuery
              }
            },
            []
          )]
        ), h(
          _flex2.default.Col,
          null,
          [loading ? h(
            _loading2.default,
            {
              attrs: { size: 10 },
              'class': [_complexQuery2.default.loading] },
            []
          ) : null, categories.length ? h(
            _icon2.default,
            {
              attrs: { typ: 'filter', size: 20 },
              'class': [_complexQuery2.default.iconFilter] },
            []
          ) : null, renderCategories]
        )]
      ), h(
        'div',
        { 'class': [_complexQuery2.default.items] },
        [renderItems, h(
          _flex2.default,
          {
            attrs: { split: true },
            'class': [_complexQuery2.default.selectAll] },
          [h(
            _flex2.default.Col,
            null,
            [h(
              'a',
              {
                on: {
                  'click': clearAll
                }
              },
              [text.clearAll]
            ), h(
              'a',
              {
                on: {
                  'click': selectAll
                }
              },
              [text.selectAll]
            )]
          ), h(
            _flex2.default.Col,
            null,
            [text.selected, ': ', sum]
          )]
        )]
      ), h(
        'div',
        { 'class': [_complexQuery2.default.editItems] },
        [h(
          'div',
          { 'class': [_complexQuery2.default.backTo], on: {
              'click': function click(ev) {
                return _this7.isEdit = false;
              }
            }
          },
          [h(
            _icon2.default,
            {
              attrs: { typ: 'fold' }
            },
            []
          )]
        ), renderEditItems, h(
          'div',
          { 'class': [_complexQuery2.default.editRemoveAll], on: {
              'click': editRemoveAll
            }
          },
          [h(
            'a',
            null,
            [text.removeAll]
          )]
        )]
      )]
    );
  }
};

module.exports = ComplexQuery;

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _babelHelperVueJsxMergeProps = __webpack_require__(4);

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _datePicker = __webpack_require__(21);

var _datePicker2 = _interopRequireDefault(_datePicker);

var _flex = __webpack_require__(8);

var _flex2 = _interopRequireDefault(_flex);

var _lng = __webpack_require__(173);

var _lng2 = _interopRequireDefault(_lng);

var _getDay2 = __webpack_require__(171);

var _getDay3 = _interopRequireDefault(_getDay2);

var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _timePicker = __webpack_require__(19);

var _timePicker2 = _interopRequireDefault(_timePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DatePickerCal = {
  name: 'DatePickerCal',
  props: {
    yearMonth: {
      type: Array,
      default: function _default() {
        return [new Date().getFullYear(), new Date().getMonth() + 1];
      }
    },

    min: {
      type: Date
    },

    max: {
      type: Date
    },

    firstDayOfWeek: {
      type: Number,
      default: 1
    },

    colorfulWeekend: {
      type: Boolean,
      default: false
    },

    hasTime: {
      type: Boolean
    },

    timeProps: {
      type: Object
    }
  },

  data: function data() {
    var _yearMonth = _slicedToArray(this.yearMonth, 2),
        year = _yearMonth[0],
        month = _yearMonth[1];

    return {
      value: '',
      year: year,
      month: month
    };
  },


  watch: {
    yearMonth: function yearMonth(newYearMonth) {
      var _newYearMonth = _slicedToArray(newYearMonth, 2),
          year = _newYearMonth[0],
          month = _newYearMonth[1];

      this.year = year;
      this.month = month;
    }
  },

  methods: {
    pick: (0, _delegateTo2.default)('.' + _datePicker2.default.date, function (ev) {
      var delegateTarget = ev.delegateTarget;

      var isToday = delegateTarget.classList.contains(_datePicker2.default.today);
      if (isToday) {
        return;
      }

      var year = this.year,
          month = this.month,
          $refs = this.$refs,
          hasTime = this.hasTime;

      var date = delegateTarget.getAttribute('data-date');
      var day = delegateTarget.getAttribute('data-day');

      var h = 0,
          m = 0,
          time = '';

      if (hasTime) {
        time = $refs.time.value;
        var _time$split = time.split(':');

        var _time$split2 = _slicedToArray(_time$split, 2);

        h = _time$split2[0];
        m = _time$split2[1];
      }

      var D = new Date(year, month - 1, date, h, m);

      this.pickerDate = {
        date: +date,
        day: +day,
        year: year,
        month: month,
        Date: D,
        ts: +D / 1000,
        hour: +h,
        minute: +m,
        time: time
      };
      this.$emit('pick', this.pickerDate);
    }),

    prev: function prev(ev) {
      if (ev && ev.currentTarget.getAttribute('ignore')) {
        return;
      }

      var month = this.month,
          year = this.year;

      var prevMonth = month - 1;
      if (prevMonth < 1) {
        this.year = year - 1;

        prevMonth = 12;
      }
      this.month = prevMonth;

      this.$emit('prev', {
        year: this.year,
        month: this.month
      });
    },
    next: function next(ev) {
      if (ev && ev.currentTarget.getAttribute('ignore')) {
        return;
      }

      var month = this.month,
          year = this.year;

      var nextMonth = month + 1;

      if (nextMonth > 12) {
        this.year = year + 1;

        nextMonth = 1;
      }
      this.month = nextMonth;

      this.$emit('next', {
        year: this.year,
        month: this.month
      });
    },
    inTime: function inTime() {
      this.$emit('time', 'in');
    },
    outTime: function outTime() {
      this.$emit('time', 'out');
    },
    onTimeChange: function onTimeChange(d) {
      if (this.pickerDate) {
        this.$emit('timeChange', _extends({}, this.pickerDate, {
          time: d.value
        }));
      } else {
        var year = this.year,
            month = this.month;
        var h = d.h,
            m = d.m;

        var date = new Date().getDate();

        var D = new Date(year, month - 1, date, h, m);

        this.$emit('timeChange', {
          year: year,
          month: month,
          date: date,
          day: D.getDay(),
          Date: D,
          ts: +D / 1000,
          hour: h,
          minute: m,
          time: d.value
        });
      }
    },
    onTimeBlur: function onTimeBlur() {
      this.$emit('timeBlur');
    }
  },

  computed: {
    days: function days() {
      var h = this.$createElement;
      var firstDayOfWeek = this.firstDayOfWeek;

      var days = Object.keys(_lng2.default.days);

      return days.map(function (day, i) {
        day = firstDayOfWeek ? (i + firstDayOfWeek) % days.length : day;

        return h(
          'th',
          {
            attrs: { 'data-day': day }
          },
          [_lng2.default.days[day].slice(0, 2)]
        );
      });
    },
    calendar: function calendar() {
      var h = this.$createElement;

      /**
       * very heavy logic here!! Be careful to modify.
       */
      var year = this.year,
          month = this.month,
          firstDayOfWeek = this.firstDayOfWeek,
          min = this.min,
          max = this.max;

      var _getDay = (0, _getDay3.default)(year, month),
          firstDay = _getDay.firstDay,
          lastDate = _getDay.lastDate;

      var now = new Date();

      var start = 0;
      var day = firstDayOfWeek - 1;
      return [].concat(_toConsumableArray(Array(6))).map(function (n, rowIdx) {
        return h(
          'tr',
          null,
          [[].concat(_toConsumableArray(Array(7))).map(function (n, dayIdx) {
            var _classes;

            var date = void 0;
            day += 1;
            if (rowIdx === 0) {
              var range = firstDay || 7;

              date = firstDayOfWeek !== firstDay && range - firstDayOfWeek > dayIdx ? null : start += 1;
            } else {
              start += 1;
              date = start > lastDate ? null : start;
            }

            var isToday = date === now.getDate() && now.getFullYear() === year && now.getMonth() === month - 1;

            var DD = new Date(year, month - 1, date);

            var classes = (_classes = {}, _defineProperty(_classes, _datePicker2.default.today, isToday), _defineProperty(_classes, _datePicker2.default.dateNull, date === null), _defineProperty(_classes, _datePicker2.default.dateIgnore, min && DD <= min || max && DD >= max), _classes);

            return h(
              'td',
              null,
              [h(
                'span',
                { 'class': [_datePicker2.default.date, classes], attrs: { 'data-date': date, 'data-day': day % 7 }
                },
                [date]
              )]
            );
          })]
        );
      });
    },
    css: function css() {
      var colorfulWeekend = this.colorfulWeekend;


      return _defineProperty({}, _datePicker2.default.colorfulWeekend, colorfulWeekend);
    }
  },

  render: function render(h) {
    var prev = this.prev,
        next = this.next,
        pick = this.pick,
        year = this.year,
        month = this.month,
        days = this.days,
        calendar = this.calendar,
        min = this.min,
        max = this.max,
        css = this.css,
        inTime = this.inTime,
        outTime = this.outTime,
        onTimeChange = this.onTimeChange,
        timeProps = this.timeProps,
        hasTime = this.hasTime,
        onTimeBlur = this.onTimeBlur;


    return h(
      'div',
      { 'class': [_datePicker2.default.calBox, css] },
      [h(
        _flex2.default,
        {
          attrs: { split: true },
          'class': [_datePicker2.default.calTop] },
        [h(
          _flex2.default.Col,
          null,
          [year, h(
            'strong',
            null,
            [_lng2.default.months[month - 1]]
          )]
        ), h(
          _flex2.default.Col,
          null,
          [h(
            _flex2.default,
            null,
            [hasTime && h(
              _flex2.default.Col,
              null,
              [h(
                'div',
                {
                  on: {
                    'mouseenter': inTime,
                    'mouseleave': outTime
                  }
                },
                [h(
                  _timePicker2.default,
                  (0, _babelHelperVueJsxMergeProps2.default)([{ ref: 'time', on: {
                      'change': onTimeChange,
                      'blur': onTimeBlur
                    },

                    style: { width: '70px' } }, { props: timeProps }]),
                  []
                )]
              )]
            ), h(
              _flex2.default.Col,
              null,
              [h(
                'span',
                {
                  attrs: { ignore: min && year <= min.getFullYear() && month <= min.getMonth() + 1
                  },
                  'class': [_datePicker2.default.calPrev],
                  on: {
                    'click': prev
                  }
                },
                ['<']
              ), h(
                'span',
                {
                  attrs: { ignore: max && year >= max.getFullYear() && month >= max.getMonth() + 1
                  },
                  'class': [_datePicker2.default.calNext],
                  on: {
                    'click': next
                  }
                },
                ['>']
              )]
            )]
          )]
        )]
      ), h(
        'table',
        { 'class': [_datePicker2.default.calTable] },
        [h(
          'thead',
          null,
          [h(
            'tr',
            null,
            [days]
          )]
        ), h(
          'tbody',
          {
            on: {
              'click': pick
            }
          },
          [calendar]
        )]
      )]
    );
  }
};

module.exports = DatePickerCal;

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _prefix = __webpack_require__(20);

var _prefix2 = _interopRequireDefault(_prefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var Date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var fmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return fmt.replace(/(y|m|d)+/ig, function (m) {
    m = m.toLocaleLowerCase();

    if (m.startsWith('y')) {
      return String(Date.getFullYear()).substr(0 - m.length);
    }

    var md = void 0;
    if (m.startsWith('m')) {
      md = Date.getMonth() + 1;
    }

    if (m.startsWith('d')) {
      md = Date.getDate();
    }

    return m.length > 1 ? (0, _prefix2.default)(md) : md;
  });
};

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (year, month) {
  var lastDate = new Date(year, month, 0);
  var firstDate = new Date(year, month - 1, 1);

  return {
    lastDate: lastDate.getDate(),
    firstDay: firstDate.getDay()
  };
};

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _datePicker = __webpack_require__(21);

var _datePicker2 = _interopRequireDefault(_datePicker);

var _cal = __webpack_require__(169);

var _cal2 = _interopRequireDefault(_cal);

var _dateFormat = __webpack_require__(170);

var _dateFormat2 = _interopRequireDefault(_dateFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DatePicker = {
  name: 'DatePicker',
  props: {
    yearMonth: {
      type: Array,
      default: function _default() {
        return [new Date().getFullYear(), new Date().getMonth() + 1];
      }
    },

    format: {
      type: String,
      default: 'yyyy/mm/dd'
    },

    min: {
      type: Date
    },

    max: {
      type: Date
    },

    firstDayOfWeek: {
      type: Number,
      default: 1
    },

    colorfulWeekend: {
      type: Boolean,
      default: false
    },

    open: {
      type: Boolean,
      default: false
    },

    defaultValue: {
      type: String,
      default: ''
    },

    hasTime: {
      type: Boolean,
      default: false
    },

    timeProps: {
      type: Object
    }
  },

  watch: {
    yearMonth: function yearMonth(newYearMonth) {
      var _newYearMonth = _slicedToArray(newYearMonth, 2),
          year = _newYearMonth[0],
          month = _newYearMonth[1];

      this.year = year;
      this.month = month;
    },
    open: function open(_open) {
      var $el = this.$el;

      if (_open) {
        $el.focus();
      } else {
        $el.blur();
      }
    },
    defaultValue: function defaultValue(value) {
      this.value = value;
    }
  },

  data: function data() {
    var _yearMonth = _slicedToArray(this.yearMonth, 2),
        year = _yearMonth[0],
        month = _yearMonth[1];

    var defaultValue = this.defaultValue,
        format = this.format,
        hasTime = this.hasTime;

    var value = defaultValue || (0, _dateFormat2.default)(new Date(), this.format);

    if (hasTime) {
      value = value + ' ' + Date().match(/\d\d:\d\d/)[0];
    }
    return {
      year: year,
      month: month,
      value: value,
      focused: false
    };
  },


  methods: {
    handlePick: function handlePick(d) {
      var format = this.format,
          $el = this.$el,
          hasTime = this.hasTime;

      var value = (0, _dateFormat2.default)(d.Date, format);

      if (hasTime) {
        value = value + ' ' + d.time;
      }

      $el.blur();
      this.$emit('pick', _extends({
        value: value
      }, d));

      this.value = value;
    },
    onNext: function onNext(d) {
      this.$emit('next', d);
    },
    onPrev: function onPrev(d) {
      this.$emit('prev', d);
    },
    onBlur: function onBlur() {
      if (this.lockBlur) {
        return;
      }

      this.focused = false;
    },
    onFocus: function onFocus() {
      this.focused = true;
    },
    onTime: function onTime(stat) {
      this.lockBlur = stat === 'in';
    },
    onTimeChange: function onTimeChange(d) {
      this.$el.focus();

      this.value = this.value.replace(/\d\d:\d\d/, d.time);

      this.$emit('pick', _extends({
        value: this.value
      }, d));
    },
    onTimeBlur: function onTimeBlur() {
      this.focused = false;
    }
  },

  computed: {
    classes: function classes() {
      var _ref;

      var colorfulWeekend = this.colorfulWeekend,
          focused = this.focused,
          hasTime = this.hasTime;


      return _ref = {}, _defineProperty(_ref, _datePicker2.default.colorfulWeekend, colorfulWeekend), _defineProperty(_ref, _datePicker2.default.focused, focused), _defineProperty(_ref, _datePicker2.default.hasTime, hasTime), _ref;
    }
  },

  render: function render(h) {
    var classes = this.classes,
        yearMonth = this.yearMonth,
        min = this.min,
        max = this.max,
        firstDayOfWeek = this.firstDayOfWeek,
        colorfulWeekend = this.colorfulWeekend,
        value = this.value,
        handlePick = this.handlePick,
        onNext = this.onNext,
        onPrev = this.onPrev,
        onBlur = this.onBlur,
        onFocus = this.onFocus,
        onTime = this.onTime,
        onTimeChange = this.onTimeChange,
        onTimeBlur = this.onTimeBlur,
        timeProps = this.timeProps,
        hasTime = this.hasTime;


    return h(
      'div',
      { 'class': [_datePicker2.default.picker, classes], attrs: { tabIndex: '-1' },
        on: {
          'blur': onBlur,
          'focus': onFocus
        }
      },
      [h(
        'div',
        { 'class': [_datePicker2.default.input] },
        [h(
          _icon2.default,
          {
            attrs: { typ: 'date' },
            'class': [_datePicker2.default.cal] },
          []
        ), h(
          'span',
          { 'class': [_datePicker2.default.value] },
          [value]
        )]
      ), h(
        'div',
        null,
        [h(
          _cal2.default,
          {
            attrs: { yearMonth: yearMonth, min: min, max: max,
              firstDayOfWeek: firstDayOfWeek,

              hasTime: hasTime,
              timeProps: timeProps,
              colorfulWeekend: colorfulWeekend },
            on: {
              'pick': handlePick,
              'next': onNext,
              'prev': onPrev,
              'time': onTime,
              'timeChange': onTimeChange,
              'timeBlur': onTimeBlur
            }
          },
          []
        )]
      )]
    );
  }
};

module.exports = DatePicker;

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },

  days: {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
};

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _input = __webpack_require__(16);

var _input2 = _interopRequireDefault(_input);

var _dualList = __webpack_require__(211);

var _dualList2 = _interopRequireDefault(_dualList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DualList = {
  name: 'DualList',
  props: {
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    selectedItems: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    displayKey: {
      type: String,
      required: true
    },
    caseInsensitive: {
      type: Boolean,
      default: false
    },
    apiMode: {
      type: Boolean,
      default: false
    },
    leftLoading: {
      type: Boolean,
      default: false
    },
    rightLoading: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      listToAdd: {},
      listToRemove: {},
      highlightLeft: '',
      highlightRight: '',
      leftList: {},
      rightList: {}
    };
  },
  mounted: function mounted() {
    var handleChange = this.handleChange,
        handleClickOnX = this.handleClickOnX;

    var items = this.items.reduce(function (preVal, curVal, idx) {
      return _extends({}, preVal, _defineProperty({}, idx, curVal));
    }, {});
    this.listToAdd = _extends({}, items);
    this.leftList = _extends({}, items);

    var leftNum = this.items.length;
    var selectedItems = this.selectedItems.reduce(function (preVal, curVal, idx) {
      return _extends({}, preVal, _defineProperty({}, idx + leftNum, curVal));
    }, {});
    this.rightList = _extends({}, selectedItems);
    this.listToRemove = _extends({}, selectedItems);
    this.$on('handleSingleDualListChange', handleChange);
    this.$on('handleClickOnX', handleClickOnX);
  },

  watch: {
    items: function items() {
      var items = this.items.reduce(function (preVal, curVal, idx) {
        return _extends({}, preVal, _defineProperty({}, idx, curVal));
      }, {});
      this.listToAdd = _extends({}, items);
      this.leftList = _extends({}, items);
    },
    selectedItems: function selectedItems() {
      var leftNum = this.items.length;
      var selectedItems = this.selectedItems.reduce(function (preVal, curVal, idx) {
        return _extends({}, preVal, _defineProperty({}, idx + leftNum, curVal));
      }, {});
      this.listToRemove = _extends({}, selectedItems);
      this.rightList = _extends({}, selectedItems);
    }
  },
  methods: {
    handleChange: function handleChange(list) {
      if (list[0] === 'add') {
        var shiftItem = this.leftList[list[2]];
        delete this.leftList[list[2]];
        this.rightList = _extends({}, this.rightList, _defineProperty({}, list[2], shiftItem));
        delete this.listToAdd[list[2]];
        this.listToRemove = _extends({}, this.listToRemove, _defineProperty({}, list[2], shiftItem));
      } else if (list[0] === 'remove') {
        var _shiftItem = this.rightList[list[2]];
        delete this.rightList[list[2]];
        this.leftList = _extends({}, this.leftList, _defineProperty({}, list[2], _shiftItem));
        delete this.listToRemove[list[2]];
        this.listToAdd = _extends({}, this.listToAdd, _defineProperty({}, list[2], _shiftItem));
      }
      this.$emit('change', this.rightList);
    },
    handleClickOnX: function handleClickOnX(data) {
      if (data === 'left') {
        var apiMode = this.apiMode;

        if (apiMode) {
          this.$emit('remove');
        } else {
          this.listToAdd = this.leftList;
          this.highlightLeft = '';
        }
      } else if (data === 'right') {
        this.listToRemove = this.rightList;
        this.highlightRight = '';
      }
    },
    handleSelectAll: function handleSelectAll() {
      var _this = this;

      var keys = Object.keys(this.listToAdd);
      keys.map(function (key) {
        delete _this.leftList[key];
      });
      this.rightList = _extends({}, this.rightList, this.listToAdd);
      this.listToRemove = _extends({}, this.listToRemove, this.listToAdd);
      this.listToAdd = {};
      this.$emit('change', this.rightList);
    },
    handleUnselectAll: function handleUnselectAll() {
      var _this2 = this;

      var keys = Object.keys(this.listToRemove);
      keys.map(function (key) {
        delete _this2.rightList[key];
      });
      this.leftList = _extends({}, this.leftList, this.listToRemove);
      this.listToAdd = _extends({}, this.listToAdd, this.listToRemove);
      this.listToRemove = {};
      this.$emit('change', this.rightList);
    },
    handleSearchListLeft: function handleSearchListLeft(e) {
      var _this3 = this;

      var apiMode = this.apiMode,
          caseInsensitive = this.caseInsensitive,
          displayKey = this.displayKey;

      if (e.charCode === 13) {
        if (apiMode) {
          this.$emit('inputchange', this.$refs.searchListToAdd.value);
        } else {
          var keys = caseInsensitive ? Object.keys(this.leftList).filter(function (key) {
            return _this3.leftList[key][displayKey].toLowerCase().includes(_this3.$refs.searchListToAdd.value.toLowerCase());
          }) : Object.keys(this.leftList).filter(function (key) {
            return _this3.leftList[key][displayKey].includes(_this3.$refs.searchListToAdd.value);
          });

          this.listToAdd = keys.reduce(function (preVal, curVal) {
            return _extends({}, preVal, _defineProperty({}, curVal, _this3.leftList[curVal]));
          }, {});
          this.highlightLeft = this.$refs.searchListToAdd.value;
        }
      }
    },
    handleSearchListRight: function handleSearchListRight(e) {
      var _this4 = this;

      if (e.charCode === 13) {
        var caseInsensitive = this.caseInsensitive,
            displayKey = this.displayKey;

        var keys = caseInsensitive ? Object.keys(this.rightList).filter(function (key) {
          return _this4.rightList[key][displayKey].toLowerCase().includes(_this4.$refs.searchListToRemove.value.toLowerCase());
        }) : Object.keys(this.rightList).filter(function (key) {
          return _this4.rightList[key][displayKey].includes(_this4.$refs.searchListToRemove.value);
        });
        this.listToRemove = keys.reduce(function (preVal, curVal) {
          return _extends({}, preVal, _defineProperty({}, curVal, _this4.rightList[curVal]));
        }, {});
        this.highlightRight = this.$refs.searchListToRemove.value;
      }
    }
  },
  render: function render(h) {
    var _this5 = this;

    var handleSelectAll = this.handleSelectAll,
        handleUnselectAll = this.handleUnselectAll,
        handleSearchListLeft = this.handleSearchListLeft,
        handleSearchListRight = this.handleSearchListRight,
        highlightLeft = this.highlightLeft,
        highlightRight = this.highlightRight,
        leftLoading = this.leftLoading,
        displayKey = this.displayKey,
        rightLoading = this.rightLoading;

    return h(
      'div',
      { 'class': [_dualList2.default.dualWrapper] },
      [h(
        'div',
        { 'class': [_dualList2.default.dual] },
        [h(
          _input2.default,
          {
            nativeOn: {
              'keypress': handleSearchListLeft
            },
            attrs: { name: 'left', icon: ['search', '#919799'], x: true, loading: leftLoading },
            'class': [_dualList2.default.input], ref: 'searchListToAdd' },
          []
        ), h(
          'div',
          { 'class': [_dualList2.default.lists] },
          [Object.keys(this.listToAdd).map(function (label) {
            return h(
              List,
              {
                attrs: { id: label, name: _this5.listToAdd[label][displayKey], highlight: highlightLeft, icon: ['circle-add', '#b9e617'] }
              },
              []
            );
          })]
        )]
      ), h(
        'div',
        { 'class': [_dualList2.default.arrow] },
        [h(
          _icon2.default,
          {
            nativeOn: {
              'click': handleSelectAll
            },
            'class': [_dualList2.default.doubleRight], attrs: { typ: 'double-right', size: 20, fill: '#b8bdbf' }
          },
          []
        ), h(
          _icon2.default,
          {
            nativeOn: {
              'click': handleUnselectAll
            },
            'class': [_dualList2.default.doubleLeft], attrs: { typ: 'double-left', size: 20, fill: '#b8bdbf' }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_dualList2.default.dual] },
        [h(
          _input2.default,
          {
            nativeOn: {
              'keypress': handleSearchListRight
            },
            attrs: { name: 'right', icon: ['search', '#919799'], x: true, loading: rightLoading },
            'class': [_dualList2.default.input], ref: 'searchListToRemove' },
          []
        ), h(
          'div',
          { 'class': [_dualList2.default.lists] },
          [Object.keys(this.listToRemove).map(function (label) {
            return h(
              List,
              {
                attrs: { id: label, name: _this5.listToRemove[label][displayKey], highlight: highlightRight, icon: ['circle-minus', '#e6175c'] }
              },
              []
            );
          })]
        )]
      )]
    );
  }
};

var List = {
  name: 'List',
  props: {
    highlight: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: Array,
      default: ['circle-add', '#b9e617']
    }
  },

  computed: {
    highlightText: function highlightText() {
      var highlight = this.highlight,
          name = this.name;

      var highlightText = '';
      if (highlight) {
        var highlightReg = new RegExp('' + highlight, 'gi');
        highlightText = ('' + name).replace(highlightReg, function (replacement) {
          return '<span class="' + _dualList2.default.highlight + '">' + replacement + '</span>';
        });
      }
      return highlightText;
    }
  },

  methods: {
    handleClick: function handleClick() {
      var $parent = this.$parent,
          name = this.name,
          id = this.id;

      var manipulation = this.icon[0] === 'circle-add' ? 'add' : 'remove';
      var data = [manipulation, name, id];
      $parent.$emit('handleSingleDualListChange', data);
    }
  },

  render: function render(h) {
    var name = this.name,
        icon = this.icon,
        highlight = this.highlight,
        handleClick = this.handleClick,
        highlightText = this.highlightText;

    return h(
      'div',
      { 'class': [_dualList2.default.listWrapper], on: {
          'click': handleClick
        }
      },
      [highlight ? h(
        'span',
        { 'class': [_dualList2.default.list], domProps: {
            'innerHTML': highlightText
          },
          attrs: { title: name }
        },
        []
      ) : h(
        'span',
        { 'class': [_dualList2.default.list], domProps: {
            'innerHTML': name
          },
          attrs: { title: name }
        },
        []
      ), h(
        _icon2.default,
        { 'class': [_dualList2.default.icon], attrs: { typ: icon[0], size: 18, fill: icon[1] }
        },
        []
      )]
    );
  }
};

module.exports = DualList;

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _grid = __webpack_require__(213);

var _grid2 = _interopRequireDefault(_grid);

var _loading = __webpack_require__(5);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit = function unit(u) {
  u = String(u);
  if (!u.includes('%')) {
    u = u + 'px';
  }
  return u;
};

var Grid = {
  name: 'Grid',

  props: {
    heads: {
      type: Array,
      required: true,
      default: function _default() {
        return [{
          name: 'Head',
          key: '',
          sort: -1,
          sortKey: '',
          width: '20%'
        }];
      }
    },

    rows: {
      type: Array,
      default: function _default() {
        return [];
      }
    },

    rowsRender: {
      type: Function
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    rows: function rows(newRows) {
      this.drows = Array.from(newRows);
    }
  },

  data: function data() {
    this._createID = 'owl-ui-grid_' + Date.now();

    var rows = this.rows;

    return {
      updating: true,
      drows: Array.from(rows)
    };
  },
  mounted: function mounted() {
    var widths = this.widths,
        $el = this.$el,
        _createID = this._createID;

    var style = document.createElement('style');
    style.textContent = widths.map(function (width, i) {
      return '#' + _createID + ' [data-role="row"] [data-role="col"]:nth-of-type(' + (i + 1) + ') {\n          width: ' + width + '\n      }';
    }).join('');

    $el.appendChild(style);
  },


  computed: {
    widths: function widths() {
      var heads = this.heads;


      return heads.map(function (head) {
        return unit(head.width);
      });
    }
  },

  methods: {
    resetSort: function resetSort() {
      this.heads.forEach(function (head) {
        if (head.sort !== undefined) {
          head.sort = -1;
        }
      });
    },
    renderRows: function renderRows(_ref) {
      var row = _ref.row;
      var h = this.$createElement;
      var heads = this.heads;


      return heads.map(function (head, idx) {
        return h(
          'div',
          {
            attrs: { 'data-role': 'col' }
          },
          [row[head.key]]
        );
      });
    },


    sorting: (0, _delegateTo2.default)('[data-sort]', function (ev) {
      var delegateTarget = ev.delegateTarget;

      var idx = delegateTarget.getAttribute('data-idx');
      var drows = this.drows,
          heads = this.heads;
      var _heads$idx = heads[idx],
          sort = _heads$idx.sort,
          key = _heads$idx.key,
          sortKey = _heads$idx.sortKey;


      if (sort !== -1) {
        heads[idx].sort = 1 - sort;

        if (this._events.sort) {
          this.$emit('sort', {
            sort: heads[idx].sort,
            key: key
          });
        } else {
          drows.reverse();
        }
      } else {
        heads.forEach(function (head) {
          if (head.sort !== undefined) {
            head.sort = -1;
          }
        });
        heads[idx].sort = 1;

        if (this._events.sort) {
          this.$emit('sort', {
            sort: heads[idx].sort,
            key: key
          });
        } else {
          drows.sort(function (a, b) {
            a = a[sortKey || key];
            b = b[sortKey || key];

            if (typeof a === 'number' && typeof b === 'number') {
              return b - a;
            } else {
              return b.localeCompare(a);
            }
          });
        }
      }
    })
  },

  render: function render(h) {
    var sorting = this.sorting,
        heads = this.heads,
        drows = this.drows,
        rowsRender = this.rowsRender,
        renderRows = this.renderRows,
        _createID = this._createID,
        loading = this.loading;


    return h(
      'div',
      { 'class': [_grid2.default.gridFixed], attrs: { id: _createID }
      },
      [h(
        'div',
        { 'class': [_grid2.default.ghead], on: {
            'click': sorting
          }
        },
        [h(
          'div',
          {
            attrs: { 'data-role': 'row' }
          },
          [heads.map(function (head, i) {
            return h(
              'div',
              {
                attrs: { 'data-role': 'col', 'data-idx': i, 'data-sort': head.sort }
              },
              [head.name]
            );
          })]
        )]
      ), h(
        'div',
        { 'class': [_grid2.default.gbody] },
        [loading ? h(
          'div',
          { 'class': [_grid2.default.loading] },
          [h(
            _loading2.default,
            null,
            []
          )]
        ) : null, drows.map(function (row, index) {
          return h(
            'div',
            {
              attrs: { 'data-role': 'row' }
            },
            [rowsRender ? rowsRender({ row: row, index: index }) : renderRows({ row: row, index: index })]
          );
        })]
      )]
    );
  }
};

Grid.Col = {
  name: 'GridCol',
  props: {
    width: {
      type: [String, Number],
      default: ''
    }
  },

  computed: {
    style: function style() {
      var width = this.width;


      return {
        width: unit(width)
      };
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        style = this.style;


    return h(
      'div',
      {
        attrs: { 'data-role': 'col' },
        style: style },
      [$slots.default]
    );
  }
};

module.exports = Grid;

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var isBrowser = typeof window !== 'undefined' && window.document && document.createElement;
var isNode = !isBrowser && typeof global !== 'undefined';

module.exports = {
  isBrowser: isBrowser, isNode: isNode
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _grid = __webpack_require__(217);

var _grid2 = _interopRequireDefault(_grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit = function unit(u) {
  u = String(u);
  if (!u.includes('%')) {
    u = u + 'px';
  }
  return u;
};

var Grid = {
  name: 'Grid',

  props: {
    heads: {
      type: Array,
      default: function _default() {
        return [];
      }
    },

    rows: {
      type: Array,
      default: function _default() {
        return [];
      }
    },

    rowsRender: {
      type: Function
    }
  },

  watch: {
    rows: function rows(newRows) {
      this.heads.forEach(function (head) {
        if (head.sort !== undefined) {
          head.sort = -1;
        }
      });
      this.drows = Array.from(newRows);
    }
  },

  data: function data() {
    this._createID = 'owl-ui-grid_' + Date.now();

    var rows = this.rows;

    return {
      updating: true,
      drows: Array.from(rows)
    };
  },
  mounted: function mounted() {
    var widths = this.widths,
        $el = this.$el,
        _createID = this._createID;

    var style = document.createElement('style');
    style.textContent = widths.map(function (width, i) {
      return '#' + _createID + ' [data-role="row"] [data-role="col"]:nth-of-type(' + (i + 1) + ') {\n          width: ' + width + '\n      }';
    }).join('');

    $el.appendChild(style);
  },


  computed: {
    widths: function widths() {
      var heads = this.heads;


      return heads.map(function (head) {
        return unit(head.width);
      });
    }
  },

  methods: {
    sorting: (0, _delegateTo2.default)('[data-sort]', function (ev) {
      var idx = ev.delegateTarget.dataset.idx;
      var drows = this.drows,
          heads = this.heads;

      var sort = +heads[idx].sort;

      if (sort !== -1) {
        drows.reverse();
        heads[idx].sort = sort === 1 ? 0 : 1;
      } else {
        heads.forEach(function (head) {
          if (head.sort !== undefined) {
            head.sort = -1;
          }
        });
        heads[idx].sort = 1;

        drows.sort(function (a, b) {
          a = a[idx].col;
          b = b[idx].col;

          if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          } else {
            return a.localeCompare(b);
          }
        });
      }
    })
  },

  render: function render(h) {
    var sorting = this.sorting,
        heads = this.heads,
        drows = this.drows,
        rowsRender = this.rowsRender,
        _createID = this._createID;


    return h(
      'div',
      { 'class': [_grid2.default.gridFixed], attrs: { id: _createID }
      },
      [h(
        'div',
        { 'class': [_grid2.default.ghead], on: {
            'click': sorting
          }
        },
        [h(
          'div',
          {
            attrs: { 'data-role': 'row' }
          },
          [heads.map(function (head, i) {
            return h(
              'div',
              {
                attrs: { 'data-role': 'col', 'data-idx': i, 'data-sort': head.sort }
              },
              [head.render ? head.render(h, head) : head.col]
            );
          })]
        )]
      ), h(
        'div',
        { 'class': [_grid2.default.gbody] },
        [drows.map(function (row, index) {
          return h(
            'div',
            {
              attrs: { 'data-role': 'row' }
            },
            [rowsRender ? rowsRender(h, { row: row, index: index }) : row.map(function (col, i) {
              return h(
                'div',
                {
                  attrs: { 'data-role': 'col', 'data-idx': i }
                },
                [col.render ? col.render(h, col) : col.col]
              );
            })]
          );
        })]
      )]
    );
  }
};

Grid.Col = {
  name: 'GridCol',
  props: {
    width: {
      type: [String, Number],
      default: ''
    }
  },

  computed: {
    style: function style() {
      var width = this.width;


      return {
        width: unit(width)
      };
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        style = this.style;


    return h(
      'div',
      {
        attrs: { 'data-role': 'col' },
        style: style },
      [$slots.default]
    );
  }
};

module.exports = Grid;

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Legacy = {
  Grid: __webpack_require__(177)
};

module.exports = Legacy;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _babelHelperVueJsxMergeProps = __webpack_require__(4);

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _isEnv = __webpack_require__(176);

var _lightbox = __webpack_require__(218);

var _lightbox2 = _interopRequireDefault(_lightbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var lbDiv = void 0;
var lbDivID = 'owl-ui-lb';
if (_isEnv.isBrowser && !document.getElementById('' + lbDivID)) {
  lbDiv = document.createElement('div');
  lbDiv.id = lbDivID;

  document.body.appendChild(lbDiv);
}

var LightBox = {
  name: 'LightBox',
  props: {
    width: {
      type: [String, Number],
      default: 700
    },
    closeOnESC: {
      type: Boolean,
      default: false
    },
    closeOnClickMask: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: 'rgba(255, 255, 255, .8)'
    },
    closeHook: {
      type: [Boolean, Function],
      default: false
    },
    openHook: {
      type: [Boolean, Function],
      default: false
    }
  },

  data: function data() {
    return {
      opened: false,
      libDiv: document.getElementById('' + lbDivID)
    };
  },


  watch: {
    opened: function opened(bool) {
      if (bool) {
        var view = this.view;

        this.libDiv.appendChild(view.$el);
        document.body.style.overflow = 'hidden';
        this.$nextTick(function () {
          view.$el.focus();
        });
        if (this.openHook && typeof this.openHook === 'function') {
          this.openHook();
        }
      } else {
        this.libDiv.innerHTML = '';
        document.body.style.overflow = 'visible';
        if (this.closeHook && typeof this.closeHook === 'function') {
          this.closeHook();
        }
      }
    }
  },

  methods: {
    open: function open(ev) {
      if (ev) {
        ev.preventDefault();
      }

      this.opened = true;
      this.$emit('open');
    },
    close: function close(ev) {
      if (ev) {
        ev.preventDefault();
      }

      this.opened = false;
      this.$emit('close');
    }
  },

  computed: {
    view: function view() {
      return this.$children.find(function (vm) {
        return vm.$el.getAttribute('data-role') === 'lb-view';
      });
    }
  },

  render: function render(h) {
    var $slots = this.$slots;

    return h(
      'div',
      { 'class': [_lightbox2.default.lbWrap] },
      [$slots.default]
    );
  }
};

LightBox.Close = {
  name: 'LightBoxClose',
  props: {
    event: {
      type: String,
      default: 'click'
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        event = this.event,
        $parent = this.$parent;


    var opts = {
      on: _defineProperty({}, event, $parent.$parent.close)
    };
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2.default)([opts, {
        attrs: { 'data-role': 'lb-close' },
        'class': [_lightbox2.default.close] }]),
      [$slots.default]
    );
  }
};

LightBox.Open = {
  name: 'LightBoxOpen',
  props: {
    event: {
      type: String,
      default: 'click'
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        event = this.event;

    var opts = {
      on: _defineProperty({}, event, this.$parent.open)
    };
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2.default)([opts, {
        attrs: { 'data-role': 'lb-open' },
        'class': [_lightbox2.default.open] }]),
      [$slots.default]
    );
  }
};

LightBox.View = {
  name: 'LightBoxView',
  props: {},

  computed: {
    viewStyle: function viewStyle() {
      var width = this.$parent.width;


      if (!isNaN(+width)) {
        width = width + 'px';
      }
      return {
        width: width
      };
    },
    style: function style() {
      var _$parent = this.$parent,
          bgColor = _$parent.bgColor,
          opened = _$parent.opened;


      return {
        backgroundColor: bgColor,
        display: opened ? 'block' : 'none'
      };
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        viewStyle = this.viewStyle,
        style = this.style;
    var _$parent2 = this.$parent,
        closeOnESC = _$parent2.closeOnESC,
        closeOnClickMask = _$parent2.closeOnClickMask,
        close = _$parent2.close;


    var on = {};

    if (closeOnClickMask) {
      on.click = close;
    }

    if (closeOnESC) {
      on.keydown = function (ev) {
        if (ev.keyCode !== 27) {
          return;
        }

        close(ev);
      };
    }

    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2.default)([{
        attrs: { 'data-role': 'lb-view', tabindex: '-1' },
        'class': [_lightbox2.default.lb], style: style }, { on: on }]),
      [h(
        'div',
        { 'class': [_lightbox2.default.view], on: {
            'click': function click(ev) {
              return ev.stopPropagation();
            }
          },
          style: viewStyle },
        [h(
          'span',
          { 'class': [_lightbox2.default.x], on: {
              'click': close
            }
          },
          []
        ), $slots.default]
      )]
    );
  }
};

module.exports = LightBox;

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _message = __webpack_require__(220);

var _message2 = _interopRequireDefault(_message);

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _vue = __webpack_require__(7);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var iconImg = {
  primary: 'alarm',
  warning: 'alarm-1',
  success: 'check-circle',
  error: 'x'
};

var MessageComponent = {
  name: 'MessageComponent',

  data: function data() {
    return {
      timer: null,
      animation: 'slideDown'
    };
  },


  props: {
    message: {
      type: String
    },

    type: {
      type: String,
      default: 'primary'
    },

    duration: {
      type: Number,
      default: 3000
    },

    showClose: {
      type: Boolean,
      default: false
    },

    iconClass: {
      type: String
    },

    customClass: {
      type: String
    },

    onClose: {
      type: Function
    }
  },

  mounted: function mounted() {
    this.startTimer();
  },
  destroyed: function destroyed() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    } else {
      this.$el.remove();
    }
  },


  methods: {
    close: function close() {
      var _this = this;

      this.animation = 'slideUp';

      setTimeout(function () {
        _this.$destroy();
      }, 300);

      if (this.onClose) {
        this.onClose();
      }
    },
    clearTimer: function clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    startTimer: function startTimer() {
      var duration = this.duration,
          close = this.close;

      if (duration > 0) {
        this.timer = setTimeout(function () {
          close();
        }, duration);
      }
    }
  },

  render: function render(h) {
    var animation = this.animation,
        startTimer = this.startTimer,
        clearTimer = this.clearTimer,
        message = this.message,
        type = this.type,
        showClose = this.showClose,
        iconClass = this.iconClass,
        close = this.close;


    return h(
      'div',
      { 'class': [_message2.default.message, _message2.default[animation]], on: {
          'mouseenter': clearTimer,
          'mouseleave': startTimer
        }
      },
      [!iconClass && h(
        _icon2.default,
        {
          attrs: { typ: iconImg[type], size: 20 },
          'class': [_message2.default.messageIcon, _message2.default[type]] },
        []
      ), h(
        'div',
        { 'class': [_message2.default.messageContent, _defineProperty({}, _message2.default.hasIcon, iconClass)] },
        [h(
          'p',
          null,
          [!!iconClass && h(
            'i',
            { 'class': [_message2.default.customIcon, iconClass] },
            []
          ), message]
        ), showClose && h(
          _icon2.default,
          {
            attrs: { fill: '#bfcbd9', typ: 'x', size: 20 },
            'class': _message2.default.closeBtn, nativeOn: {
              'click': close
            }
          },
          []
        )]
      )]
    );
  }
};

var Message = function Message() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  var MessageConstructor = _vue2.default.extend(MessageComponent);
  var instance = new MessageConstructor({
    propsData: options
  });
  var message = instance.$mount();
  document.body.appendChild(message.$el);
  return message;
};

module.exports = Message;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _multiSelect = __webpack_require__(221);

var _multiSelect2 = _interopRequireDefault(_multiSelect);

var _label = __webpack_require__(17);

var _label2 = _interopRequireDefault(_label);

var _loading = __webpack_require__(5);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MultiSelect = {
  props: {
    options: {
      type: Array,
      required: true
    },

    selectedOpts: {
      type: Array,
      required: true
    },

    displayKey: {
      type: String,
      required: true
    },

    isOpened: {
      type: Boolean,
      default: false
    },

    isDisabled: {
      type: Boolean,
      default: false
    },

    caseInsensitive: {
      type: Boolean,
      default: false
    },

    // apiMode: {
    //   type: Boolean,
    //   default: false
    // },

    loading: {
      type: Boolean,
      default: false
    },

    loadingMsg: {
      type: String,
      default: 'loading...'
    }
  },

  data: function data() {
    return {
      labels: [],
      opened: this.isOpened,
      disable: this.isDisabled,
      loadingPie: this.loading,
      displayIdx: [],
      optionsHovered: false,
      disablePointer: false,
      inputWidth: 1,
      focusedIdx: -1,
      focusedLabelIdx: -1,
      selectedIdx: this.selectedOpts
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.options.length) {
      this.displayIdx = [].concat(_toConsumableArray(Array(this.options.length).keys()));
      this.labels = this.selectedIdx.reduce(function (preVal, curVal, idx) {
        preVal.push(_this.options[curVal]);
        return preVal;
      }, []);
    }
  },


  watch: {
    selectedOpts: function selectedOpts(newVal) {
      this.selectedIdx = newVal;
    },
    options: function options(newVal) {
      this.displayIdx = [].concat(_toConsumableArray(Array(newVal.length).keys()));
      this.labels = this.selectedIdx.reduce(function (preVal, curVal, idx) {
        preVal.push(newVal[curVal]);
        return preVal;
      }, []);
    },
    selectedIdx: function selectedIdx(newVal) {
      var _this2 = this;

      this.labels = newVal.reduce(function (preVal, curVal, idx) {
        preVal.push(_this2.options[curVal]);
        return preVal;
      }, []);
    },
    isOpened: function isOpened(newVal) {
      this.opened = newVal;
    },
    isDisabled: function isDisabled(newVal) {
      this.disable = newVal;
    },
    loading: function loading(newVal) {
      this.loadingPie = newVal;
    }
  },

  computed: {
    renderOptions: function renderOptions() {
      var _this3 = this;

      var h = this.$createElement;
      var options = this.options,
          displayIdx = this.displayIdx,
          selectedIdx = this.selectedIdx,
          displayKey = this.displayKey,
          disablePointer = this.disablePointer;


      var _options = options.reduce(function (preVal, newVal, idx) {
        var _classes;

        var toDisplay = displayIdx.indexOf(idx);
        var isSelected = selectedIdx.indexOf(idx);

        var classes = (_classes = {}, _defineProperty(_classes, _multiSelect2.default.option, true), _defineProperty(_classes, _multiSelect2.default.selected, isSelected >= 0), _defineProperty(_classes, _multiSelect2.default.focused, idx === _this3.focusedIdx), _defineProperty(_classes, _multiSelect2.default.disablePointer, disablePointer), _classes);

        if (toDisplay >= 0) {
          preVal.push(h(
            'div',
            {
              attrs: { tabIndex: '0', 'data-role': 'select-option', 'data-idx': idx },
              'class': classes },
            [newVal[displayKey]]
          ));
        }
        return preVal;
      }, []);

      return _options;
    },
    renderLoading: function renderLoading() {
      var h = this.$createElement;
      var style = this.style,
          loadingMsg = this.loadingMsg;

      var _loadingOption = h(
        'div',
        { 'class': [_multiSelect2.default.loadingOption] },
        [h(
          _loading2.default,
          {
            attrs: { typ: 'pie', size: 10 },
            'class': [_multiSelect2.default.loading] },
          []
        ), loadingMsg]
      );
      return _loadingOption;
    },
    css: function css() {
      var _style;

      var opened = this.opened,
          disable = this.disable;

      var style = (_style = {}, _defineProperty(_style, _multiSelect2.default.selectOpen, opened), _defineProperty(_style, _multiSelect2.default.disabled, disable), _style);
      return style;
    }
  },

  methods: {
    outputResult: function outputResult() {
      var _this4 = this;

      var result = this.selectedIdx.reduce(function (preVal, curVal, idx) {
        preVal.push(_this4.options[curVal]);
        return preVal;
      }, []);
      this.$emit('change', result);
    },
    close: function close() {
      var optionsHovered = this.optionsHovered;

      this.opened = this.optionsHovered ? true : false;
      this.focusedIdx = -1;
      this.focusedLabelIdx = -1;
    },
    handleMouseEnter: function handleMouseEnter(e) {
      if (e.type === 'mouseenter') {
        this.optionsHovered = true;
      } else if (e.type === 'mouseleave') {
        this.optionsHovered = false;
      }
    },
    toggleMenu: function toggleMenu(ev) {
      ev.stopPropagation();
      if (this.disable) {
        return;
      }

      this.opened = !this.opened;

      if (this.opened) {
        this.$refs.searchField.focus();
      }
    },
    handleInput: function handleInput(e) {
      var _this5 = this;

      var displayKey = this.displayKey,
          caseInsensitive = this.caseInsensitive;

      // if (this.apiMode) {
      //   this.$emit('inputChange', this.$refs.searchField.value)
      // }

      var searchResult = caseInsensitive ? this.options.reduce(function (preVal, newVal, idx) {
        if (newVal[displayKey].toLowerCase().includes(_this5.$refs.searchField.value.trim().toLowerCase())) {
          preVal.push(idx);
        }
        return preVal;
      }, []) : this.options.reduce(function (preVal, newVal, idx) {
        if (newVal[displayKey].includes(_this5.$refs.searchField.value.trim())) {
          preVal.push(idx);
        }
        return preVal;
      }, []);

      this.displayIdx = searchResult;
      this.inputWidth = this.$refs.searchField.value.length ? this.$refs.searchField.value.length : 1;
      this.opened = true;
    },
    handleInputKeyDown: function handleInputKeyDown(e) {
      this.optionsHovered = true;
      this.disablePointer = true;

      if (e.keyCode === 38) {
        // arrowUp
        this.focusAdjacentOption(this.focusedIdx, 'pre');
      } else if (e.keyCode === 40) {
        // arrowDown
        this.focusAdjacentOption(this.focusedIdx, 'next');
      } else if (e.keyCode === 13) {
        // ENTER
        var selectedIdx = this.selectedIdx;

        var idx = selectedIdx.indexOf(this.focusedIdx);
        if (idx >= 0) {
          // unselect
          this.selectedIdx.splice(idx, 1);
          this.outputResult();
        } else {
          // select
          this.selectedIdx.push(this.focusedIdx);
          this.outputResult();
        }
      } else if (e.keyCode === 8 && this.$refs.searchField.value.length <= 0) {
        // backspace delete
        var selectedArrLen = this.selectedIdx.length;

        if (this.focusedLabelIdx === -1) {
          // empty input and focus on last label
          this.focusedLabelIdx = selectedArrLen - 1;
        } else if (this.focusedLabelIdx > -1) {
          // delete the focused label
          this.selectedIdx.pop();
          this.focusedLabelIdx = -1;
        }
      }
    },


    _handleOnChange: (0, _delegateTo2.default)('[data-role="select-option"]', function (ev) {
      var delegateTarget = ev.delegateTarget;

      delegateTarget.focus();
      var selectedIdx = this.selectedIdx;

      var changedId = delegateTarget.getAttribute('data-idx');
      var idx = selectedIdx.indexOf(+changedId);
      if (idx >= 0) {
        // unselect
        this.selectedIdx.splice(idx, 1);
        this.outputResult();
      } else {
        // select
        this.selectedIdx.push(+changedId);
        this.outputResult();
      }

      this.$refs.searchField.focus();
    }),

    _handleMouseOver: (0, _delegateTo2.default)('[data-role="select-option"]', function (ev) {
      var delegateTarget = ev.delegateTarget;

      var hoveredId = delegateTarget.getAttribute('data-idx');
      if (ev.type === 'mouseover') {
        this.optionsHovered = true;
      }

      this.focusedIdx = +hoveredId;
    }),

    handleMouseMove: function handleMouseMove(ev) {
      this.disablePointer = false;
    },
    handleLabelRemove: function handleLabelRemove(data) {
      // unselect
      var idxToRemove = this.options.indexOf(data);
      var idx = this.selectedIdx.indexOf(idxToRemove);
      this.selectedIdx.splice(idx, 1);
      this.outputResult();
      this.$refs.searchField.focus();
    },
    focusAdjacentOption: function focusAdjacentOption(curDataIdx, dir) {
      var targetDataIdx = void 0;
      var displayIdx = this.displayIdx;

      var idxOfCurDataIdx = this.displayIdx.indexOf(curDataIdx);
      var displayArrLength = this.displayIdx.length;

      if (curDataIdx === -1) {
        // current not focus on optionBox
        curDataIdx = displayIdx[0];
        targetDataIdx = displayIdx[0];
      } else {
        switch (dir) {
          case 'next':
            targetDataIdx = idxOfCurDataIdx + 1 >= displayArrLength ? displayIdx[(idxOfCurDataIdx + 1) % displayArrLength] : displayIdx[idxOfCurDataIdx + 1];
            break;
          case 'pre':
            targetDataIdx = idxOfCurDataIdx - 1 < 0 ? displayIdx[displayArrLength + idxOfCurDataIdx - 1] : displayIdx[idxOfCurDataIdx - 1];
            break;
        }
      }

      var currentTarget = this.$el.querySelector('[data-role="select-option"][data-idx="' + curDataIdx + '"]');
      var focusTarget = this.$el.querySelector('[data-role="select-option"][data-idx="' + targetDataIdx + '"]');

      focusTarget.focus();
      this.$refs.searchField.focus();

      this.focusedIdx = targetDataIdx;
      this.optionsHovered = false;
    }
  },

  render: function render(h) {
    var css = this.css,
        close = this.close,
        toggleMenu = this.toggleMenu,
        renderOptions = this.renderOptions,
        _handleMouseOver = this._handleMouseOver,
        handleMouseEnter = this.handleMouseEnter,
        handleMouseMove = this.handleMouseMove,
        _handleOnChange = this._handleOnChange,
        handleLabelRemove = this.handleLabelRemove,
        handleInputKeyDown = this.handleInputKeyDown,
        labels = this.labels,
        inputWidth = this.inputWidth,
        disable = this.disable,
        displayKey = this.displayKey;

    return h(
      'div',
      { 'class': [_multiSelect2.default.selecter, css] },
      [h(
        'div',
        { 'class': [_multiSelect2.default.searchField], on: {
            'click': toggleMenu
          }
        },
        [h(
          _label2.default.Group,
          {
            attrs: { x: true, badge: true,
              displayKey: displayKey,
              typ: 'outline',
              options: labels,

              focused: this.focusedLabelIdx
            },
            on: {
              'remove': handleLabelRemove
            },

            'class': disable ? [_multiSelect2.default.disabledLabelg] : [_multiSelect2.default.labelg] },
          []
        ), h(
          'input',
          { 'class': [_multiSelect2.default.invisibleInput],
            attrs: { size: inputWidth,

              disabled: disable
            },
            ref: 'searchField',
            on: {
              'input': this.handleInput,
              'blur': close,
              'keydown': this.handleInputKeyDown
            }
          },
          []
        )]
      ), h(
        'div',
        { 'class': [_multiSelect2.default.optionBox],
          on: {
            'click': _handleOnChange,
            'mouseenter': handleMouseEnter,
            'mouseleave': handleMouseEnter,
            'mouseover': _handleMouseOver,
            'mousemove': handleMouseMove
          }
        },
        [this.loadingPie ? this.renderLoading : '', renderOptions]
      )]
    );
  }
};

module.exports = MultiSelect;

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _page = __webpack_require__(222);

var _page2 = _interopRequireDefault(_page);

var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Page = {
  name: 'Page',
  props: {
    limit: {
      type: Number,
      default: 10,
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    typ: {
      type: String,
      default: 'pages' },

    align: {
      type: String,
      default: 'center' },

    toPage: {
      type: Number,
      default: 1
    }
  },

  data: function data() {
    return {
      page: this.toPage
    };
  },


  watch: {
    toPage: function toPage(p) {
      this.page = p;
    }
  },

  methods: {
    jumpTo: (0, _delegateTo2.default)('li', function (ev) {
      var delegateTarget = ev.delegateTarget;

      var page = delegateTarget.getAttribute('data-page');

      page = +page || page;

      if (this.page === page || page === '...' || !page) {
        return;
      }

      if (page === 'next') {
        this.page += 1;
      } else if (page === 'prev') {
        this.page -= 1;
      } else {
        this.page = page;
      }

      this.$emit('page', {
        page: this.page
      });
    })
  },

  computed: {
    totalPages: function totalPages() {
      var total = this.total,
          limit = this.limit;


      return Math.ceil(total / limit);
    },
    pageData: function pageData() {
      var keep = 5;

      var mid = Math.floor(keep / 2);
      var range = keep - 1;

      return { mid: mid, range: range };
    },
    pageLists: function pageLists() {
      var h = this.$createElement;
      var page = this.page,
          $createElement = this.$createElement,
          totalPages = this.totalPages,
          pageData = this.pageData;

      var pagesVNodes = [];

      var start = Math.max(1, page - pageData.mid);
      var end = Math.min(page + pageData.mid, totalPages);

      var hasStartSpread = start > 1;
      var hasEndSpread = end <= totalPages - 1;

      for (var i = start; i <= end; i++) {
        var css = _defineProperty({}, _page2.default.on, i === page);
        pagesVNodes.push(h(
          'li',
          {
            attrs: { 'data-page': i, 'data-role': 'page' },
            'class': [css] },
          []
        ));
      }

      return {
        pagesVNodes: pagesVNodes,
        hasStartSpread: hasStartSpread,
        hasEndSpread: hasEndSpread
      };
    },
    typeRender: function typeRender() {
      var h = this.$createElement;
      var typ = this.typ,
          page = this.page,
          pageLists = this.pageLists,
          totalPages = this.totalPages,
          $createElement = this.$createElement;


      var VNode = h(
        'ol',
        null,
        [h(
          'li',
          {
            attrs: { 'data-page': 'prev', hidden: page <= 1 },
            'class': [_page2.default.prev] },
          []
        ), h(
          'li',
          {
            attrs: { 'data-page': '1', hidden: !pageLists.hasStartSpread }
          },
          []
        ), h(
          'li',
          {
            attrs: { 'data-page': '...', hidden: !pageLists.hasStartSpread }
          },
          []
        ), pageLists.pagesVNodes, h(
          'li',
          {
            attrs: { 'data-page': '...', hidden: !pageLists.hasEndSpread }
          },
          []
        ), h(
          'li',
          {
            attrs: { 'data-page': totalPages, hidden: !pageLists.hasEndSpread }
          },
          []
        ), h(
          'li',
          {
            attrs: { 'data-page': 'next', hidden: page >= totalPages },
            'class': [_page2.default.next] },
          []
        )]
      );

      if (typ === 'number') {
        VNode = h(
          'ol',
          null,
          [h(
            'li',
            {
              attrs: { 'data-page': 'prev', hidden: page <= 1 },
              'class': [_page2.default.prev] },
            []
          ), h(
            'li',
            null,
            [page, ' of ', totalPages]
          ), h(
            'li',
            {
              attrs: { 'data-page': 'next', hidden: page >= totalPages },
              'class': [_page2.default.next] },
            []
          )]
        );
      }
      return VNode;
    }
  },

  render: function render(h) {
    var jumpTo = this.jumpTo,
        align = this.align,
        typeRender = this.typeRender;


    return h(
      'nav',
      { 'class': [_page2.default.page], attrs: { 'data-align': align },
        on: {
          'click': jumpTo
        }
      },
      [typeRender]
    );
  }
};

module.exports = Page;

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _icon = __webpack_require__(3);

var _icon2 = _interopRequireDefault(_icon);

var _radio = __webpack_require__(223);

var _radio2 = _interopRequireDefault(_radio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Radio = {
  name: 'Radio',
  props: {
    on: {
      type: Boolean,
      default: false
    },

    name: {
      type: String,
      default: ''
    }
  },

  data: function data() {
    return {
      active: this.on
    };
  },

  methods: {
    handleClick: function handleClick(e) {
      e.stopPropagation();
      var $parent = this.$parent,
          active = this.active,
          name = this.name;


      $parent.$children.forEach(function (child) {
        return child.active = false;
      });
      this.active = true;

      var data = _defineProperty({}, name, this.active);
      this.$emit('change', data);
      $parent.$emit('handleSingleRadioChange', data);
    }
  },

  watch: {
    on: function on(newVal) {
      var $parent = this.$parent,
          active = this.active,
          name = this.name;

      $parent.$children.forEach(function (child) {
        return child.active = false;
      });
      this.active = newVal;
      $parent.$emit('handleSingleRadioChange', _defineProperty({}, name, newVal));
    }
  },

  render: function render(h) {
    var active = this.active,
        handleClick = this.handleClick,
        $slots = this.$slots;

    return h(
      'div',
      {
        on: {
          'click': handleClick
        },
        'class': [_radio2.default.radio] },
      [active ? h(
        _icon2.default,
        {
          attrs: { typ: 'radio-on', fill: '#6c7173' }
        },
        []
      ) : h(
        _icon2.default,
        {
          attrs: { typ: 'radio', fill: '#b0b0b0', 'data-radio': true }
        },
        []
      ), $slots.default]
    );
  }
};

Radio.Group = {
  name: 'RadioGroup',

  data: function data() {
    return {
      radioData: {}
    };
  },


  methods: {
    radioGroupOnChange: function radioGroupOnChange(data) {
      this._radioData[this._on] = false;
      this._on = Object.keys(data)[0];

      this.$emit('change', _extends({}, this._radioData, data));
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._radioData = {};

    var getReduceData = function getReduceData() {
      return _this.$children.reduce(function (data, child) {
        var name = child.name,
            on = child.on;

        data[name] = on;
        if (on) {
          _this._on = name;
        }
        return data;
      }, {});
    };

    this._radioData = getReduceData();

    this.$on('handleSingleRadioChange', function (data) {
      _this.radioGroupOnChange(data);
    });
  },
  render: function render(h) {
    var $slots = this.$slots;


    return h(
      'div',
      { 'class': [_radio2.default.raGroup] },
      [$slots.default]
    );
  }
};

module.exports = Radio;

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _select = __webpack_require__(224);

var _select2 = _interopRequireDefault(_select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Select = {
  name: 'Select',

  props: {
    options: {
      type: Array,
      required: true
    },

    optionsRender: {
      type: Function
    },

    isOpened: {
      type: Boolean,
      default: false
    },

    isDisabled: {
      type: Boolean,
      default: false
    },

    name: {
      type: String,
      default: ''
    },

    nameKey: {
      type: String,
      default: 'title'
    },

    valueKey: {
      type: String,
      default: 'value'
    }
  },

  data: function data() {
    this._selectedIdx = 0;

    return {
      opened: this.isOpened,
      value: '',
      title: []
    };
  },


  watch: {
    isOpened: function isOpened(newVal) {
      this.opened = newVal;
    }
  },

  methods: {
    close: function close() {
      this.opened = false;
    },
    toggleMenu: function toggleMenu() {
      if (this.isDisabled) {
        return;
      }

      this.opened = !this.opened;
    },


    _handleOnChange: (0, _delegateTo2.default)('[data-role="select-option"]', function (ev) {
      var delegateTarget = ev.delegateTarget;
      var options = this.options,
          _selectedIdx = this._selectedIdx,
          renderOptions = this.renderOptions,
          nameKey = this.nameKey,
          valueKey = this.valueKey;

      var index = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget);

      if (index === _selectedIdx) {
        return;
      }

      this._selectedIdx = index;
      this.title = options[index][nameKey];
      this.value = options[index][valueKey || nameKey];
      this.opened = false;

      this.$emit('change', {
        value: this.value,
        index: index
      });
    })
  },

  computed: {
    css: function css() {
      var opened = this.opened,
          isDisabled = this.isDisabled;

      var style = {};
      style[_select2.default.selectOpen] = opened;
      style[_select2.default.disabled] = isDisabled;
      return style;
    },
    renderOptions: function renderOptions() {
      var _this = this;

      var h = this.$createElement;
      var options = this.options,
          optionsRender = this.optionsRender,
          nameKey = this.nameKey,
          valueKey = this.valueKey;


      var _options = options.map(function (option, index) {
        if (option.selected) {
          _this._selectedIdx = index;
        }

        return h(
          'div',
          {
            attrs: { 'data-role': 'select-option', 'data-idx': index }
          },
          [optionsRender ? optionsRender({ option: option, index: index }) : option[nameKey]]
        );
      });

      if (options[this._selectedIdx]) {
        this.title = options[this._selectedIdx][nameKey];
        this.value = options[this._selectedIdx][valueKey || nameKey];
      }

      return _options;
    }
  },

  render: function render(h) {
    var close = this.close,
        name = this.name,
        _handleOnChange = this._handleOnChange,
        renderOptions = this.renderOptions,
        css = this.css,
        toggleMenu = this.toggleMenu,
        value = this.value,
        title = this.title;


    return h(
      'div',
      { 'class': [_select2.default.selecter, css], on: {
          'blur': close
        },
        attrs: { tabindex: '-1' }
      },
      [h(
        'div',
        { 'class': [_select2.default.selectTitle], on: {
            'click': toggleMenu
          }
        },
        [h(
          'div',
          { 'class': [_select2.default.titleText] },
          [title]
        ), h(
          'div',
          { 'class': [_select2.default.titleRight] },
          [h(
            'div',
            { 'class': [_select2.default.arrow] },
            []
          )]
        )]
      ), h(
        'div',
        { 'class': [_select2.default.optionBox, css], on: {
            'click': _handleOnChange
          }
        },
        [renderOptions]
      ), h(
        'input',
        {
          attrs: { type: 'hidden', name: name, value: value }
        },
        []
      )]
    );
  }
};

module.exports = Select;

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _delegateTo = __webpack_require__(2);

var _delegateTo2 = _interopRequireDefault(_delegateTo);

var _tab = __webpack_require__(226);

var _tab2 = _interopRequireDefault(_tab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tab = {
  name: 'Tab',
  data: function data() {
    return {
      tabs: {},
      selectedIdx: 0,
      selectedName: ''
    };
  },
  mounted: function mounted() {
    // find selected
    var $slots = this.$slots;

    var selectedChild = $slots.tabHead.find(function (slot) {
      return slot.child.isSelected;
    });
    if (!selectedChild) {
      selectedChild = $slots.tabHead[0];
      $slots.tabHead[0].child.selected = '1';
    }
    this.selectedIdx = $slots.tabHead.indexOf(selectedChild);
    this.selectedName = selectedChild.child.name;
    this.switchContent();
  },


  methods: {
    switchContent: function switchContent() {
      var $slots = this.$slots,
          selectedIdx = this.selectedIdx,
          selectedName = this.selectedName;

      $slots.tabContent.forEach(function (slot) {
        slot.child.isSelected = false;
      });
      $slots.tabContent[selectedIdx].child.isSelected = true;
      this.$emit('change', {
        name: selectedName,
        idx: selectedIdx
      });
    },

    clickTab: (0, _delegateTo2.default)('[data-role="tab-head"]', function (e) {
      var delegateTarget = e.delegateTarget;

      var idx = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget);

      if (idx === this.selectedIdx) {
        return;
      }

      this.selectedIdx = idx;
      this.selectedName = this.$slots.tabHead[idx].child.name;
      this.$slots.tabHead.forEach(function (slot) {
        return slot.child.selected = '0';
      });
      this.$slots.tabHead[idx].child.selected = '1';
      this.switchContent();
    })
  },

  render: function render(h) {
    var $slots = this.$slots,
        clickTab = this.clickTab;

    return h(
      'div',
      null,
      [h(
        'div',
        { 'class': [_tab2.default.tHead], on: {
            'click': clickTab
          }
        },
        [$slots.tabHead]
      ), h(
        'div',
        null,
        [$slots.tabContent]
      )]
    );
  }
};

Tab.Head = {
  name: 'TabHead',
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  data: function data() {
    return {
      selected: this.isSelected ? '1' : '0'
    };
  },
  render: function render(h) {
    var $slots = this.$slots,
        selected = this.selected;

    return h(
      'div',
      {
        attrs: { 'data-selected': selected, 'data-role': 'tab-head' },
        'class': [_tab2.default.tHead] },
      [$slots.default]
    );
  }
};

Tab.Content = {
  name: 'TabContent',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  data: function data() {
    return {
      isSelected: false
    };
  },
  render: function render(h) {
    var $slots = this.$slots,
        isSelected = this.isSelected;

    var selected = isSelected ? '1' : '0';
    return h(
      'div',
      {
        attrs: { 'data-selected': selected, 'data-role': 'tab-content' }
      },
      [$slots.default]
    );
  }
};

module.exports = Tab;

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var timeRE = /^\d\d:\d\d$/;
var throwErr = function throwErr() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (timeRE.test(time)) {
    var _time$split = time.split(':'),
        _time$split2 = _slicedToArray(_time$split, 2),
        hh = _time$split2[0],
        mm = _time$split2[1];

    hh = +hh;
    mm = +mm;

    if (hh > 23) {
      throw new Error(hh + ' is greater than 23');
    }

    if (mm > 59) {
      throw new Error(mm + ' is greater than 59');
    }

    return true;
  }

  throw new Error(time + ' is not a valid time format. It should be `hh:mm`');
};

module.exports = throwErr;

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tip = __webpack_require__(228);

var _tip2 = _interopRequireDefault(_tip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var offset = function offset(el) {
  var top = 0,
      left = 0;

  while (el) {
    top += el.offsetTop;
    left += el.offsetLeft;

    el = el.offsetParent;
  }

  return { top: top, left: left };
};

var Tip = {
  name: 'Tip',
  props: {
    pos: {
      type: String,
      default: 'down'
    },

    event: {
      type: String,
      default: 'mouseenter'
    },

    delay: {
      type: Number,
      default: 50
    }
  },

  mounted: function mounted() {
    var event = this.event,
        $el = this.$el,
        pos = this.pos,
        $children = this.$children,
        delay = this.delay;

    var _body = document.body;

    var _context = void 0;
    $el.addEventListener(event, function (ev) {
      _context = $children[0].$el.cloneNode(true);
      _context.style.display = 'block';
      _context.setAttribute('id', 'tipContext2');
      _body.appendChild(_context);

      var currentTarget = ev.currentTarget;

      var _offset = offset(currentTarget),
          left = _offset.left,
          top = _offset.top;

      var oWidth = currentTarget.offsetWidth;
      var oHeight = currentTarget.offsetHeight;
      var cWidth = _context.offsetWidth;
      var cHeight = _context.offsetHeight;

      if (pos === 'down') {
        _context.style.left = left + oWidth / 2 - cWidth / 2 + 'px';
        _context.style.top = top + oHeight + 10 + 'px';
      } else if (pos === 'up') {
        _context.style.left = left + oWidth / 2 - cWidth / 2 + 'px';
        _context.style.top = top - oHeight - 10 + 'px';
      } else if (pos === 'left') {
        _context.style.left = left - cWidth - 10 + 'px';
        _context.style.top = top + oHeight / 2 - cHeight / 2 + 'px';
      } else if (pos === 'right') {
        _context.style.left = left + oWidth + 10 + 'px';
        _context.style.top = top + oHeight / 2 - cHeight / 2 + 'px';
      }

      setTimeout(function () {
        _context.style.opacity = 1;
      }, delay);
    }, false);

    $el.addEventListener('mouseleave', function (ev) {
      if (!_context) {
        return;
      }

      _context.style.opacity = 0;
      _body.removeChild(_context);
    }, false);
  },
  render: function render(h) {
    var pos = this.pos,
        $slots = this.$slots;

    return h(
      'div',
      { 'class': [_tip2.default.tip], attrs: { 'data-pos': pos }
      },
      [$slots.default]
    );
  }
};

Tip.Context = {
  name: 'TipContext',
  props: {
    width: {
      type: [String, Number],
      default: 'auto'
    }
  },

  computed: {
    setWidth: function setWidth() {
      var width = this.width;


      return {
        width: width + 'px'
      };
    }
  },

  render: function render(h) {
    var $slots = this.$slots,
        setWidth = this.setWidth,
        $parent = this.$parent;

    return h(
      'div',
      { 'class': [_tip2.default.tipContext], style: setWidth, attrs: { 'data-pos': $parent.pos }
      },
      [$slots.default]
    );
  }
};

module.exports = Tip;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

/*! cash-dom 1.3.5, https://github.com/kenwheeler/cash @license MIT */
;(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    module.exports = factory();
  } else {
    root.cash = root.$ = factory();
  }
})(this, function () {
  var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, filter = ArrayProto.filter, push = ArrayProto.push;

  var noop = function () {}, isFunction = function (item) {
    // @see https://crbug.com/568448
    return typeof item === typeof noop && item.call;
  }, isString = function (item) {
    return typeof item === typeof "";
  };

  var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;

  function find(selector, context) {
    context = context || doc;
    var elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    return elems;
  }

  var frag;
  function parseHTML(str) {
    if (!frag) {
      frag = doc.implementation.createHTMLDocument();
      var base = frag.createElement("base");
      base.href = doc.location.href;
      frag.head.appendChild(base);
    }

    frag.body.innerHTML = str;

    return frag.body.childNodes;
  }

  function onReady(fn) {
    if (doc.readyState !== "loading") {
      fn();
    } else {
      doc.addEventListener("DOMContentLoaded", fn);
    }
  }

  function Init(selector, context) {
    if (!selector) {
      return this;
    }

    // If already a cash collection, don't do any further processing
    if (selector.cash && selector !== win) {
      return selector;
    }

    var elems = selector, i = 0, length;

    if (isString(selector)) {
      elems = (idMatch.test(selector) ?
      // If an ID use the faster getElementById check
      doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
      // If HTML, parse it into real elements
      parseHTML(selector) :
      // else use `find`
      find(selector, context));

      // If function, use as shortcut for DOM ready
    } else if (isFunction(selector)) {
      onReady(selector);return this;
    }

    if (!elems) {
      return this;
    }

    // If a single DOM element is passed in or received via ID, return the single element
    if (elems.nodeType || elems === win) {
      this[0] = elems;
      this.length = 1;
    } else {
      // Treat like an array and loop through each item.
      length = this.length = elems.length;
      for (; i < length; i++) {
        this[i] = elems[i];
      }
    }

    return this;
  }

  function cash(selector, context) {
    return new Init(selector, context);
  }

  var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
    cash: true,
    length: 0,
    push: push,
    splice: ArrayProto.splice,
    map: ArrayProto.map,
    init: Init
  };

  Object.defineProperty(fn, "constructor", { value: cash });

  cash.parseHTML = parseHTML;
  cash.noop = noop;
  cash.isFunction = isFunction;
  cash.isString = isString;

  cash.extend = fn.extend = function (target) {
    target = target || {};

    var args = slice.call(arguments), length = args.length, i = 1;

    if (args.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!args[i]) {
        continue;
      }
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  function each(collection, callback) {
    var l = collection.length, i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  }

  function matches(el, selector) {
    var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
    return !!m && m.call(el, selector);
  }

  function getCompareFunction(selector) {
    return (
    /* Use browser's `matches` function if string */
    isString(selector) ? matches :
    /* Match a cash element */
    selector.cash ? function (el) {
      return selector.is(el);
    } :
    /* Direct comparison */
    function (el, selector) {
      return el === selector;
    });
  }

  function unique(collection) {
    return cash(slice.call(collection).filter(function (item, index, self) {
      return self.indexOf(item) === index;
    }));
  }

  cash.extend({
    merge: function (first, second) {
      var len = +second.length, i = first.length, j = 0;

      for (; j < len; i++, j++) {
        first[i] = second[j];
      }

      first.length = i;
      return first;
    },

    each: each,
    matches: matches,
    unique: unique,
    isArray: Array.isArray,
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

  });

  var uid = cash.uid = "_cash" + Date.now();

  function getDataCache(node) {
    return (node[uid] = node[uid] || {});
  }

  function setData(node, key, value) {
    return (getDataCache(node)[key] = value);
  }

  function getData(node, key) {
    var c = getDataCache(node);
    if (c[key] === undefined) {
      c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
    }
    return c[key];
  }

  function removeData(node, key) {
    var c = getDataCache(node);
    if (c) {
      delete c[key];
    } else if (node.dataset) {
      delete node.dataset[key];
    } else {
      cash(node).removeAttr("data-" + name);
    }
  }

  fn.extend({
    data: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? getData(this[0], name) : this.each(function (v) {
          return setData(v, name, value);
        }));
      }

      for (var key in name) {
        this.data(key, name[key]);
      }

      return this;
    },

    removeData: function (key) {
      return this.each(function (v) {
        return removeData(v, key);
      });
    }

  });

  var notWhiteMatch = /\S+/g;

  function getClasses(c) {
    return isString(c) && c.match(notWhiteMatch);
  }

  function hasClass(v, c) {
    return (v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className));
  }

  function addClass(v, c, spacedName) {
    if (v.classList) {
      v.classList.add(c);
    } else if (spacedName.indexOf(" " + c + " ")) {
      v.className += " " + c;
    }
  }

  function removeClass(v, c) {
    if (v.classList) {
      v.classList.remove(c);
    } else {
      v.className = v.className.replace(c, "");
    }
  }

  fn.extend({
    addClass: function (c) {
      var classes = getClasses(c);

      return (classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          addClass(v, c, spacedName);
        });
      }) : this);
    },

    attr: function (name, value) {
      if (!name) {
        return undefined;
      }

      if (isString(name)) {
        if (value === undefined) {
          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
        }

        return this.each(function (v) {
          if (v.setAttribute) {
            v.setAttribute(name, value);
          } else {
            v[name] = value;
          }
        });
      }

      for (var key in name) {
        this.attr(key, name[key]);
      }

      return this;
    },

    hasClass: function (c) {
      var check = false, classes = getClasses(c);
      if (classes && classes.length) {
        this.each(function (v) {
          check = hasClass(v, classes[0]);
          return !check;
        });
      }
      return check;
    },

    prop: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? this[0][name] : this.each(function (v) {
          v[name] = value;
        }));
      }

      for (var key in name) {
        this.prop(key, name[key]);
      }

      return this;
    },

    removeAttr: function (name) {
      return this.each(function (v) {
        if (v.removeAttribute) {
          v.removeAttribute(name);
        } else {
          delete v[name];
        }
      });
    },

    removeClass: function (c) {
      if (!arguments.length) {
        return this.attr("class", "");
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        each(classes, function (c) {
          removeClass(v, c);
        });
      }) : this);
    },

    removeProp: function (name) {
      return this.each(function (v) {
        delete v[name];
      });
    },

    toggleClass: function (c, state) {
      if (state !== undefined) {
        return this[state ? "addClass" : "removeClass"](c);
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          if (hasClass(v, c)) {
            removeClass(v, c);
          } else {
            addClass(v, c, spacedName);
          }
        });
      }) : this);
    } });

  fn.extend({
    add: function (selector, context) {
      return unique(cash.merge(this, cash(selector, context)));
    },

    each: function (callback) {
      each(this, callback);
      return this;
    },

    eq: function (index) {
      return cash(this.get(index));
    },

    filter: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = (isFunction(selector) ? selector : getCompareFunction(selector));

      return cash(filter.call(this, function (e) {
        return comparator(e, selector);
      }));
    },

    first: function () {
      return this.eq(0);
    },

    get: function (index) {
      if (index === undefined) {
        return slice.call(this);
      }
      return (index < 0 ? this[index + this.length] : this[index]);
    },

    index: function (elem) {
      var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
      return slice.call(collection).indexOf(child);
    },

    last: function () {
      return this.eq(-1);
    }

  });

  var camelCase = (function () {
    var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
    return function (str) {
      return str.replace(camelRegex, function (letter, index) {
        return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
      }).replace(whiteSpace, "");
    };
  }());

  var getPrefixedProp = (function () {
    var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;

    return function (prop) {
      prop = camelCase(prop);
      if (cache[prop]) {
        return cache[prop];
      }

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = ["webkit", "moz", "ms", "o"], props = (prop + " " + (prefixes).join(ucProp + " ") + ucProp).split(" ");

      each(props, function (p) {
        if (p in style) {
          cache[p] = prop = cache[prop] = p;
          return false;
        }
      });

      return cache[prop];
    };
  }());

  cash.prefixedProp = getPrefixedProp;
  cash.camelCase = camelCase;

  fn.extend({
    css: function (prop, value) {
      if (isString(prop)) {
        prop = getPrefixedProp(prop);
        return (arguments.length > 1 ? this.each(function (v) {
          return v.style[prop] = value;
        }) : win.getComputedStyle(this[0])[prop]);
      }

      for (var key in prop) {
        this.css(key, prop[key]);
      }

      return this;
    }

  });

  function compute(el, prop) {
    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
  }

  each(["Width", "Height"], function (v) {
    var lower = v.toLowerCase();

    fn[lower] = function () {
      return this[0].getBoundingClientRect()[lower];
    };

    fn["inner" + v] = function () {
      return this[0]["client" + v];
    };

    fn["outer" + v] = function (margins) {
      return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
    };
  });

  function registerEvent(node, eventName, callback) {
    var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
    eventCache[eventName] = eventCache[eventName] || [];
    eventCache[eventName].push(callback);
    node.addEventListener(eventName, callback);
  }

  function removeEvent(node, eventName, callback) {
    var events = getData(node, "_cashEvents"), eventCache = (events && events[eventName]), index;

    if (!eventCache) {
      return;
    }

    if (callback) {
      node.removeEventListener(eventName, callback);
      index = eventCache.indexOf(callback);
      if (index >= 0) {
        eventCache.splice(index, 1);
      }
    } else {
      each(eventCache, function (event) {
        node.removeEventListener(eventName, event);
      });
      eventCache = [];
    }
  }

  fn.extend({
    off: function (eventName, callback) {
      return this.each(function (v) {
        return removeEvent(v, eventName, callback);
      });
    },

    on: function (eventName, delegate, callback, runOnce) {
      // jshint ignore:line

      var originalCallback;

      if (!isString(eventName)) {
        for (var key in eventName) {
          this.on(key, delegate, eventName[key]);
        }
        return this;
      }

      if (isFunction(delegate)) {
        callback = delegate;
        delegate = null;
      }

      if (eventName === "ready") {
        onReady(callback);
        return this;
      }

      if (delegate) {
        originalCallback = callback;
        callback = function (e) {
          var t = e.target;

          while (!matches(t, delegate)) {
            if (t === this) {
              return (t = false);
            }
            t = t.parentNode;
          }

          if (t) {
            originalCallback.call(t, e);
          }
        };
      }

      return this.each(function (v) {
        var finalCallback = callback;
        if (runOnce) {
          finalCallback = function () {
            callback.apply(this, arguments);
            removeEvent(v, eventName, finalCallback);
          };
        }
        registerEvent(v, eventName, finalCallback);
      });
    },

    one: function (eventName, delegate, callback) {
      return this.on(eventName, delegate, callback, true);
    },

    ready: onReady,

    trigger: function (eventName, data) {
      var evt = doc.createEvent("HTMLEvents");
      evt.data = data;
      evt.initEvent(eventName, true, false);
      return this.each(function (v) {
        return v.dispatchEvent(evt);
      });
    }

  });

  function encode(name, value) {
    return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
  }

  function getSelectMultiple_(el) {
    var values = [];
    each(el.options, function (o) {
      if (o.selected) {
        values.push(o.value);
      }
    });
    return values.length ? values : null;
  }

  function getSelectSingle_(el) {
    var selectedIndex = el.selectedIndex;
    return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
  }

  function getValue(el) {
    var type = el.type;
    if (!type) {
      return null;
    }
    switch (type.toLowerCase()) {
      case "select-one":
        return getSelectSingle_(el);
      case "select-multiple":
        return getSelectMultiple_(el);
      case "radio":
        return (el.checked) ? el.value : null;
      case "checkbox":
        return (el.checked) ? el.value : null;
      default:
        return el.value ? el.value : null;
    }
  }

  fn.extend({
    serialize: function () {
      var query = "";

      each(this[0].elements || this, function (el) {
        if (el.disabled || el.tagName === "FIELDSET") {
          return;
        }
        var name = el.name;
        switch (el.type.toLowerCase()) {
          case "file":
          case "reset":
          case "submit":
          case "button":
            break;
          case "select-multiple":
            var values = getValue(el);
            if (values !== null) {
              each(values, function (value) {
                query += encode(name, value);
              });
            }
            break;
          default:
            var value = getValue(el);
            if (value !== null) {
              query += encode(name, value);
            }
        }
      });

      return query.substr(1);
    },

    val: function (value) {
      if (value === undefined) {
        return getValue(this[0]);
      } else {
        return this.each(function (v) {
          return v.value = value;
        });
      }
    }

  });

  function insertElement(el, child, prepend) {
    if (prepend) {
      var first = el.childNodes[0];
      el.insertBefore(child, first);
    } else {
      el.appendChild(child);
    }
  }

  function insertContent(parent, child, prepend) {
    var str = isString(child);

    if (!str && child.length) {
      each(child, function (v) {
        return insertContent(parent, v, prepend);
      });
      return;
    }

    each(parent, str ? function (v) {
      return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
    } : function (v, i) {
      return insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend);
    });
  }

  fn.extend({
    after: function (selector) {
      cash(selector).insertAfter(this);
      return this;
    },

    append: function (content) {
      insertContent(this, content);
      return this;
    },

    appendTo: function (parent) {
      insertContent(cash(parent), this);
      return this;
    },

    before: function (selector) {
      cash(selector).insertBefore(this);
      return this;
    },

    clone: function () {
      return cash(this.map(function (v) {
        return v.cloneNode(true);
      }));
    },

    empty: function () {
      this.html("");
      return this;
    },

    html: function (content) {
      if (content === undefined) {
        return this[0].innerHTML;
      }
      var source = (content.nodeType ? content[0].outerHTML : content);
      return this.each(function (v) {
        return v.innerHTML = source;
      });
    },

    insertAfter: function (selector) {
      var _this = this;


      cash(selector).each(function (el, i) {
        var parent = el.parentNode, sibling = el.nextSibling;
        _this.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
        });
      });

      return this;
    },

    insertBefore: function (selector) {
      var _this2 = this;
      cash(selector).each(function (el, i) {
        var parent = el.parentNode;
        _this2.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
        });
      });
      return this;
    },

    prepend: function (content) {
      insertContent(this, content, true);
      return this;
    },

    prependTo: function (parent) {
      insertContent(cash(parent), this, true);
      return this;
    },

    remove: function () {
      return this.each(function (v) {
        return v.parentNode.removeChild(v);
      });
    },

    text: function (content) {
      if (content === undefined) {
        return this[0].textContent;
      }
      return this.each(function (v) {
        return v.textContent = content;
      });
    }

  });

  var docEl = doc.documentElement;

  fn.extend({
    position: function () {
      var el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    offset: function () {
      var rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + win.pageYOffset - docEl.clientTop,
        left: rect.left + win.pageXOffset - docEl.clientLeft
      };
    },

    offsetParent: function () {
      return cash(this[0].offsetParent);
    }

  });

  fn.extend({
    children: function (selector) {
      var elems = [];
      this.each(function (el) {
        push.apply(elems, el.children);
      });
      elems = unique(elems);

      return (!selector ? elems : elems.filter(function (v) {
        return matches(v, selector);
      }));
    },

    closest: function (selector) {
      if (!selector || this.length < 1) {
        return cash();
      }
      if (this.is(selector)) {
        return this.filter(selector);
      }
      return this.parent().closest(selector);
    },

    is: function (selector) {
      if (!selector) {
        return false;
      }

      var match = false, comparator = getCompareFunction(selector);

      this.each(function (el) {
        match = comparator(el, selector);
        return !match;
      });

      return match;
    },

    find: function (selector) {
      if (!selector || selector.nodeType) {
        return cash(selector && this.has(selector).length ? selector : null);
      }

      var elems = [];
      this.each(function (el) {
        push.apply(elems, find(selector, el));
      });

      return unique(elems);
    },

    has: function (selector) {
      var comparator = (isString(selector) ? function (el) {
        return find(selector, el).length !== 0;
      } : function (el) {
        return el.contains(selector);
      });

      return this.filter(comparator);
    },

    next: function () {
      return cash(this[0].nextElementSibling);
    },

    not: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = getCompareFunction(selector);

      return this.filter(function (el) {
        return !comparator(el, selector);
      });
    },

    parent: function () {
      var result = [];

      this.each(function (item) {
        if (item && item.parentNode) {
          result.push(item.parentNode);
        }
      });

      return unique(result);
    },

    parents: function (selector) {
      var last, result = [];

      this.each(function (item) {
        last = item;

        while (last && last.parentNode && last !== doc.body.parentNode) {
          last = last.parentNode;

          if (!selector || (selector && matches(last, selector))) {
            result.push(last);
          }
        }
      });

      return unique(result);
    },

    prev: function () {
      return cash(this[0].previousElementSibling);
    },

    siblings: function () {
      var collection = this.parent().children(), el = this[0];

      return collection.filter(function (i) {
        return i !== el;
      });
    }

  });


  return cash;
});

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(373)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = document.body.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                document.body.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    document.body.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    document.body.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.target) {
                    this.target.blur();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(189), __webpack_require__(375), __webpack_require__(230)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

/***/ }),
/* 191 */
/***/ (function(module, exports) {

/**
 * A polyfill for Element.matches()
 */
if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element !== document) {
        if (element.matches(selector)) return element;
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(191);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),
/* 193 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"badges":"ou-app_badges"};

/***/ }),
/* 194 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"logo":"ou-footer_logo"};

/***/ }),
/* 195 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"link":"ou-header_link","ver":"ou-header_ver"};

/***/ }),
/* 196 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"cpBoard":"ou-markdown_cpBoard","cp":"ou-markdown_cp"};

/***/ }),
/* 197 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"buttonWrapper":"ou-button_buttonWrapper","buttonGroupWrapper":"ou-button_buttonGroupWrapper","buttonGroup":"ou-button_buttonGroup","buttonBig":"ou-button_buttonBig"};

/***/ }),
/* 198 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"side":"ou-components_side","view":"ou-components_view","hover":"ou-components_hover","main":"ou-components_main"};

/***/ }),
/* 199 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"dualGroup":"ou-dual-list_dualGroup","code":"ou-dual-list_code"};

/***/ }),
/* 200 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"p":"ou-flex_p","boxs":"ou-flex_boxs","midContent":"ou-flex_midContent","social":"ou-flex_social","avatar":"ou-flex_avatar"};

/***/ }),
/* 201 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"points":"ou-home_points","point":"ou-home_point","img":"ou-home_img","mainContent":"ou-home_mainContent","badges":"ou-home_badges","des":"ou-home_des"};

/***/ }),
/* 202 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"icons":"ou-icon_icons"};

/***/ }),
/* 203 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"wrapper":"ou-input_wrapper","demo":"ou-input_demo","pwdInputwrapper":"ou-input_pwdInputwrapper"};

/***/ }),
/* 204 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"group":"ou-label_group","dark":"ou-label_dark","closableTagGroup":"ou-label_closableTagGroup","closableTag":"ou-label_closableTag","labelGroup":"ou-label_labelGroup"};

/***/ }),
/* 205 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"exampleWrapper":"ou-loading_exampleWrapper"};

/***/ }),
/* 206 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"demoGroup":"ou-multi-select_demoGroup","multiSelect":"ou-multi-select_multiSelect","code":"ou-multi-select_code"};

/***/ }),
/* 207 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"demo":"ou-switch_demo","demoMsg":"ou-switch_demoMsg","title":"ou-switch_title"};

/***/ }),
/* 208 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"button":"ou-button_button","buttonGroup":"ou-button_buttonGroup","disabled":"ou-button_disabled","outline":"ou-button_outline","primary":"ou-button_primary","primaryOutline":"ou-button_primaryOutline"};

/***/ }),
/* 209 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"cbGroup":"ou-checkbox_cbGroup","cb":"ou-checkbox_cb"};

/***/ }),
/* 210 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"item":"ou-complex-query_item","editItemLi":"ou-complex-query_editItemLi","com":"ou-complex-query_com","input":"ou-complex-query_input","categories":"ou-complex-query_categories","iconFilter":"ou-complex-query_iconFilter","loading":"ou-complex-query_loading","focus":"ou-complex-query_focus","hasItems":"ou-complex-query_hasItems","items":"ou-complex-query_items","isEdit":"ou-complex-query_isEdit","editItems":"ou-complex-query_editItems","itemView":"ou-complex-query_itemView","itemViewCheckbox":"ou-complex-query_itemViewCheckbox","selectAll":"ou-complex-query_selectAll","isFold":"ou-complex-query_isFold","arrowRight":"ou-complex-query_arrowRight","itemHasChild":"ou-complex-query_itemHasChild","highlight":"ou-complex-query_highlight","itemCheckbox":"ou-complex-query_itemCheckbox","itemdd":"ou-complex-query_itemdd","selectedItems":"ou-complex-query_selectedItems","backTo":"ou-complex-query_backTo","editRemoveAll":"ou-complex-query_editRemoveAll"};

/***/ }),
/* 211 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"dual":"ou-dual-list_dual","input":"ou-dual-list_input","dualWrapper":"ou-dual-list_dualWrapper","lists":"ou-dual-list_lists","listWrapper":"ou-dual-list_listWrapper","list":"ou-dual-list_list","highlight":"ou-dual-list_highlight","arrow":"ou-dual-list_arrow","doubleRight":"ou-dual-list_doubleRight","doubleLeft":"ou-dual-list_doubleLeft"};

/***/ }),
/* 212 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"flex":"ou-flex_flex","flexMid":"ou-flex_flexMid","flexSplit":"ou-flex_flexSplit"};

/***/ }),
/* 213 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"gridFixed":"ou-grid_gridFixed","ghead":"ou-grid_ghead","loading-pie":"ou-grid_loading-pie","gbody":"ou-grid_gbody","loading":"ou-grid_loading"};

/***/ }),
/* 214 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"arrow-left":"ou-icon_arrow-left","arrow-right":"ou-icon_arrow-right"};

/***/ }),
/* 215 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"inputWrapper":"ou-input_inputWrapper","input":"ou-input_input","mustFill":"ou-input_mustFill","normal":"ou-input_normal","success":"ou-input_success","error":"ou-input_error","loadingPie":"ou-input_loadingPie","icon":"ou-input_icon","specialIcon":"ou-input_specialIcon","disabled":"ou-input_disabled"};

/***/ }),
/* 216 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"label":"ou-label_label","outline":"ou-label_outline","defaultlabel":"ou-label_defaultlabel","primarylabel":"ou-label_primarylabel","errorlabel":"ou-label_errorlabel","successlabel":"ou-label_successlabel","warninglabel":"ou-label_warninglabel","invertedlabel":"ou-label_invertedlabel","defaultoutline":"ou-label_defaultoutline","primaryoutline":"ou-label_primaryoutline","erroroutline":"ou-label_erroroutline","successoutline":"ou-label_successoutline","warningoutline":"ou-label_warningoutline","invertedoutline":"ou-label_invertedoutline","defaulttag":"ou-label_defaulttag","primarytag":"ou-label_primarytag","errortag":"ou-label_errortag","successtag":"ou-label_successtag","warningtag":"ou-label_warningtag","invertedtag":"ou-label_invertedtag","tag":"ou-label_tag","badge":"ou-label_badge","x":"ou-label_x","iconx":"ou-label_iconx","defaultlabelx":"ou-label_defaultlabelx","primarylabelx":"ou-label_primarylabelx","errorlabelx":"ou-label_errorlabelx","successlabelx":"ou-label_successlabelx","warninglabelx":"ou-label_warninglabelx","invertedlabelx":"ou-label_invertedlabelx","defaultoutlinex":"ou-label_defaultoutlinex","primaryoutlinex":"ou-label_primaryoutlinex","erroroutlinex":"ou-label_erroroutlinex","successoutlinex":"ou-label_successoutlinex","warningoutlinex":"ou-label_warningoutlinex","invertedoutlinex":"ou-label_invertedoutlinex","defaulttagx":"ou-label_defaulttagx","primarytagx":"ou-label_primarytagx","errortagx":"ou-label_errortagx","successtagx":"ou-label_successtagx","warningtagx":"ou-label_warningtagx","invertedtagx":"ou-label_invertedtagx","labelInGroup":"ou-label_labelInGroup","focused":"ou-label_focused","newTag":"ou-label_newTag","newTagInput":"ou-label_newTagInput","showInput":"ou-label_showInput"};

/***/ }),
/* 217 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"gridFixed":"ou-grid_gridFixed","ghead":"ou-grid_ghead","loading-pie":"ou-grid_loading-pie","gbody":"ou-grid_gbody"};

/***/ }),
/* 218 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"lbWrap":"ou-lightbox_lbWrap","lb":"ou-lightbox_lb","view":"ou-lightbox_view","x":"ou-lightbox_x","open":"ou-lightbox_open","close":"ou-lightbox_close"};

/***/ }),
/* 219 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"loadingpie":"ou-loading_loadingpie","loadingbar":"ou-loading_loadingbar"};

/***/ }),
/* 220 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"message":"ou-message_message","messageIcon":"ou-message_messageIcon","messageContent":"ou-message_messageContent","customIcon":"ou-message_customIcon","closeBtn":"ou-message_closeBtn","hasIcon":"ou-message_hasIcon","slideDown":"ou-message_slideDown","slideUp":"ou-message_slideUp","primary":"ou-message_primary","error":"ou-message_error","warning":"ou-message_warning","success":"ou-message_success"};

/***/ }),
/* 221 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"selecter":"ou-multi-select_selecter","searchField":"ou-multi-select_searchField","labelg":"ou-multi-select_labelg","invisibleInput":"ou-multi-select_invisibleInput","optionBox":"ou-multi-select_optionBox","option":"ou-multi-select_option","normal":"ou-multi-select_normal","focused":"ou-multi-select_focused","selected":"ou-multi-select_selected","disablePointer":"ou-multi-select_disablePointer","selectOpen":"ou-multi-select_selectOpen","disabled":"ou-multi-select_disabled","disabledLabelg":"ou-multi-select_disabledLabelg","loadingOption":"ou-multi-select_loadingOption","loading":"ou-multi-select_loading"};

/***/ }),
/* 222 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"page":"ou-page_page","on":"ou-page_on"};

/***/ }),
/* 223 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"radio":"ou-radio_radio","raGroup":"ou-radio_raGroup"};

/***/ }),
/* 224 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"selecter":"ou-select_selecter","arrow":"ou-select_arrow","optionBox":"ou-select_optionBox","selectOpen":"ou-select_selectOpen","disabled":"ou-select_disabled","titleText":"ou-select_titleText","selectTitle":"ou-select_selectTitle","titleRight":"ou-select_titleRight","body":"ou-select_body"};

/***/ }),
/* 225 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"wrapper":"ou-switch_wrapper","specialSwitch":"ou-switch_specialSwitch","labelOpen":"ou-switch_labelOpen","labelClose":"ou-switch_labelClose","toggle":"ou-switch_toggle","defaultSwitch":"ou-switch_defaultSwitch","specialSwitchButton":"ou-switch_specialSwitchButton","defaultSwitchButton":"ou-switch_defaultSwitchButton"};

/***/ }),
/* 226 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"tHead":"ou-tab_tHead"};

/***/ }),
/* 227 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"timebox":"ou-time-picker_timebox","clock":"ou-time-picker_clock","input":"ou-time-picker_input","timepicker":"ou-time-picker_timepicker"};

/***/ }),
/* 228 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"tip":"ou-tip_tip","tipContext":"ou-tip_tipContext"};

/***/ }),
/* 229 */
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(229);
var delegate = __webpack_require__(192);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the
 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

module.exports = escapeRegExp;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 22,
	"./af.js": 22,
	"./ar": 29,
	"./ar-dz": 23,
	"./ar-dz.js": 23,
	"./ar-kw": 24,
	"./ar-kw.js": 24,
	"./ar-ly": 25,
	"./ar-ly.js": 25,
	"./ar-ma": 26,
	"./ar-ma.js": 26,
	"./ar-sa": 27,
	"./ar-sa.js": 27,
	"./ar-tn": 28,
	"./ar-tn.js": 28,
	"./ar.js": 29,
	"./az": 30,
	"./az.js": 30,
	"./be": 31,
	"./be.js": 31,
	"./bg": 32,
	"./bg.js": 32,
	"./bn": 33,
	"./bn.js": 33,
	"./bo": 34,
	"./bo.js": 34,
	"./br": 35,
	"./br.js": 35,
	"./bs": 36,
	"./bs.js": 36,
	"./ca": 37,
	"./ca.js": 37,
	"./cs": 38,
	"./cs.js": 38,
	"./cv": 39,
	"./cv.js": 39,
	"./cy": 40,
	"./cy.js": 40,
	"./da": 41,
	"./da.js": 41,
	"./de": 44,
	"./de-at": 42,
	"./de-at.js": 42,
	"./de-ch": 43,
	"./de-ch.js": 43,
	"./de.js": 44,
	"./dv": 45,
	"./dv.js": 45,
	"./el": 46,
	"./el.js": 46,
	"./en-au": 47,
	"./en-au.js": 47,
	"./en-ca": 48,
	"./en-ca.js": 48,
	"./en-gb": 49,
	"./en-gb.js": 49,
	"./en-ie": 50,
	"./en-ie.js": 50,
	"./en-nz": 51,
	"./en-nz.js": 51,
	"./eo": 52,
	"./eo.js": 52,
	"./es": 54,
	"./es-do": 53,
	"./es-do.js": 53,
	"./es.js": 54,
	"./et": 55,
	"./et.js": 55,
	"./eu": 56,
	"./eu.js": 56,
	"./fa": 57,
	"./fa.js": 57,
	"./fi": 58,
	"./fi.js": 58,
	"./fo": 59,
	"./fo.js": 59,
	"./fr": 62,
	"./fr-ca": 60,
	"./fr-ca.js": 60,
	"./fr-ch": 61,
	"./fr-ch.js": 61,
	"./fr.js": 62,
	"./fy": 63,
	"./fy.js": 63,
	"./gd": 64,
	"./gd.js": 64,
	"./gl": 65,
	"./gl.js": 65,
	"./gom-latn": 66,
	"./gom-latn.js": 66,
	"./he": 67,
	"./he.js": 67,
	"./hi": 68,
	"./hi.js": 68,
	"./hr": 69,
	"./hr.js": 69,
	"./hu": 70,
	"./hu.js": 70,
	"./hy-am": 71,
	"./hy-am.js": 71,
	"./id": 72,
	"./id.js": 72,
	"./is": 73,
	"./is.js": 73,
	"./it": 74,
	"./it.js": 74,
	"./ja": 75,
	"./ja.js": 75,
	"./jv": 76,
	"./jv.js": 76,
	"./ka": 77,
	"./ka.js": 77,
	"./kk": 78,
	"./kk.js": 78,
	"./km": 79,
	"./km.js": 79,
	"./kn": 80,
	"./kn.js": 80,
	"./ko": 81,
	"./ko.js": 81,
	"./ky": 82,
	"./ky.js": 82,
	"./lb": 83,
	"./lb.js": 83,
	"./lo": 84,
	"./lo.js": 84,
	"./lt": 85,
	"./lt.js": 85,
	"./lv": 86,
	"./lv.js": 86,
	"./me": 87,
	"./me.js": 87,
	"./mi": 88,
	"./mi.js": 88,
	"./mk": 89,
	"./mk.js": 89,
	"./ml": 90,
	"./ml.js": 90,
	"./mr": 91,
	"./mr.js": 91,
	"./ms": 93,
	"./ms-my": 92,
	"./ms-my.js": 92,
	"./ms.js": 93,
	"./my": 94,
	"./my.js": 94,
	"./nb": 95,
	"./nb.js": 95,
	"./ne": 96,
	"./ne.js": 96,
	"./nl": 98,
	"./nl-be": 97,
	"./nl-be.js": 97,
	"./nl.js": 98,
	"./nn": 99,
	"./nn.js": 99,
	"./pa-in": 100,
	"./pa-in.js": 100,
	"./pl": 101,
	"./pl.js": 101,
	"./pt": 103,
	"./pt-br": 102,
	"./pt-br.js": 102,
	"./pt.js": 103,
	"./ro": 104,
	"./ro.js": 104,
	"./ru": 105,
	"./ru.js": 105,
	"./sd": 106,
	"./sd.js": 106,
	"./se": 107,
	"./se.js": 107,
	"./si": 108,
	"./si.js": 108,
	"./sk": 109,
	"./sk.js": 109,
	"./sl": 110,
	"./sl.js": 110,
	"./sq": 111,
	"./sq.js": 111,
	"./sr": 113,
	"./sr-cyrl": 112,
	"./sr-cyrl.js": 112,
	"./sr.js": 113,
	"./ss": 114,
	"./ss.js": 114,
	"./sv": 115,
	"./sv.js": 115,
	"./sw": 116,
	"./sw.js": 116,
	"./ta": 117,
	"./ta.js": 117,
	"./te": 118,
	"./te.js": 118,
	"./tet": 119,
	"./tet.js": 119,
	"./th": 120,
	"./th.js": 120,
	"./tl-ph": 121,
	"./tl-ph.js": 121,
	"./tlh": 122,
	"./tlh.js": 122,
	"./tr": 123,
	"./tr.js": 123,
	"./tzl": 124,
	"./tzl.js": 124,
	"./tzm": 126,
	"./tzm-latn": 125,
	"./tzm-latn.js": 125,
	"./tzm.js": 126,
	"./uk": 127,
	"./uk.js": 127,
	"./ur": 128,
	"./ur.js": 128,
	"./uz": 130,
	"./uz-latn": 129,
	"./uz-latn.js": 129,
	"./uz.js": 130,
	"./vi": 131,
	"./vi.js": 131,
	"./x-pseudo": 132,
	"./x-pseudo.js": 132,
	"./yo": 133,
	"./yo.js": 133,
	"./zh-cn": 134,
	"./zh-cn.js": 134,
	"./zh-hk": 135,
	"./zh-hk.js": 135,
	"./zh-tw": 136,
	"./zh-tw.js": 136
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 233;

/***/ }),
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */
/***/ (function(module, exports) {

module.exports = "# Button\n\n## Props\n\n```js\n{\n  name: 'Button',\n  props: {\n    status: {\n      type: String,\n      default: ''\n    },\n    disabled: {\n      type: Boolean,\n      default: false\n    }\n  }\n},\n{\n  name: 'ButtonGroup',\n  props: {\n    options: {\n      type: Array,\n      required: true\n    }\n  }\n}\n```\n\n## Options data structure for `<Button.Group>`\nThe `options` of props must be an `Array Object`.\n\n```json\n[\n  { value: 'winnie', title: 'Winnie The Pooh' },\n  { value: 'piglet', title: 'Piglet' },\n  { value: 'tigger', title: 'Tigger', selected: true }\n]\n```\n\n## Usage\n### Button\nThere are four kinds of button style: `default`, `primary`, `outline`, `primaryOutline`\n```jsx\n<Button>\n  <Icon typ=\"plus\" size={16} />\n  新增公告\n</Button>\n<Button status=\"primaryOutline\">關閉</Button>\n```\nSet width of the button to 50% relative to its upper layer\n```jsx\n<Button status=\"primary\" class={[s.buttonBig]}>Submit</Button>\n.buttonBig {\n  width: 50%;\n}\n```\nUse `nativeOn-click={this.handleClick}` to bind click event\n```jsx\n<Button nativeOn-click={this.handleClick}>Click me</Button>\n```\n### Button Group  \n\n#### Methods\n- `setOptions([newOptions])` for dynamic change options  \n- `setSelectedOption(index)` for dynamic change the selected options\n\n- Use `onChange` as a listener to get data from `$emit('change')`\n```jsx\ndata() {\n return {\n   options: [\n     { value: 'winnie', title: 'Winnie The Pooh' },\n     { value: 'piglet', title: 'Piglet' },\n     { value: 'tigger', title: 'Tigger', selected: true }\n   ]\n }\n},\n\nmethods: {\n  getButtonGroupData((data) => console.log(data))\n},\n\nrender(h) {\n  return (\n    <Button.Group options={this.options} onChange={this.getButtonGroupData} />\n  )\n}\n```\n## Demo\n"

/***/ }),
/* 349 */
/***/ (function(module, exports) {

module.exports = "# Checkbox and CheckboxGroup\n\n## Props\n\n```js\nconst Checkbox = {\n  props: {\n    checked: {\n      type: Boolean,\n      default: false\n    },\n    name: {\n      type: String,\n      default: ''\n    }\n  }\n}\n```\n\n## Usage\n\n```jsx\n<Checkbox.Group>\n  <Checkbox name=\"1\">Pikachu</Checkbox>\n  <Checkbox name=\"2\">Eevee</Checkbox>\n</Checkbox.Group>\n```\nMake a checkbox named `all`. It can control other checkboxes\n```jsx\n<Checkbox.Group>\n  <Checkbox name=\"all\" checked={true}>All</Checkbox>\n  <Checkbox name=\"1\">Pikachu</Checkbox>\n  <Checkbox name=\"2\">Eevee</Checkbox>\n</Checkbox.Group>\n```\nUse `onChange` as a listener to get data from `$emit('change')`\nIt works both on `<Checkbox>` and `<Checkbox.Group>`\n```jsx\n//Define a Function to handle onChange and get Checkbox.Group data\nconst getCheckboxData = (data) => {\n  console.log(data)\n}\n\n<Checkbox.Group onChange={getCheckboxData}>\n  <Checkbox name=\"1\">Pikachu</Checkbox>\n  <Checkbox name=\"2\">Eevee</Checkbox>\n</Checkbox.Group>\n```\n\n## Demo\n"

/***/ }),
/* 350 */
/***/ (function(module, exports) {

module.exports = "## Props\n```js\ncategories: {\n  type: Array,\n  default: () => [\n    {\n      name: 'cat1',\n      value: 'cat1',\n      on: true,\n    }\n  ]\n},\nplaceholder: {\n  type: String,\n  default: ''\n},\nitems: {\n  type: Array,\n  default: () => [\n    {\n      name: '',\n      checked: false,\n      children: [\n        {\n          name: '',\n          value: 'uniq',\n          checked: false,\n        }\n      ]\n    }\n  ]\n},\nloading: {\n  type: Boolean,\n  default: false,\n},\ntext: {\n  type: Object,\n  default() {\n    return {\n      selectAll: 'select all',\n      clearAll: 'clear all',\n      selected: 'selected',\n      selectedItems: 'selected items',\n      removeAll: 'remove all',\n    }\n  }\n}\n```\n## Events\n\n### query(data)\nTriggerd  by `enter`\n- `data.value` Get input value.\n- `data.category` Get the category of query.\n\n### change(data)\n- `data.selectedItems` Get selected items in store.\n\n### focus\nTriggerd  by `focus` on input.\n\n### blur\nTriggerd  by `blur` on input.\n\n### clickCategory\nTriggerd  by `click` a category.\n"

/***/ }),
/* 351 */
/***/ (function(module, exports) {

module.exports = "# Custom Primary Color\n\nThere are default colors of `OWL UI`, just overwrite it as you need.\n\n```css\n:root {\n  --OWL-UI-COLOR-PRIMARY: #8962d9;\n  --OWL-UI-COLOR-PRIMARY-LIGHT: #cab6f2;\n  --OWL-UI-COLOR-PRIMARY-DARK: #6b5499;\n}\n```\n"

/***/ }),
/* 352 */
/***/ (function(module, exports) {

module.exports = "# DatePicker\n\n## Props\n\n```js\nyearMonth: {\n  type: Array,\n  default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1]\n},\n\nformat: {\n  type: String,\n  default: 'yyyy/mm/dd',\n},\n\nmin: {\n  type: Date,\n},\n\nmax: {\n  type: Date,\n},\n\nfirstDayOfWeek: {\n  type: Number,\n  default: 1,\n},\n\ncolorfulWeekend: {\n  type: Boolean,\n  default: false,\n},\n\nopen: {\n  type: Boolean,\n  default: false\n},\n\ndefaultValue: {\n  type: String,\n  default: <Today>\n},\n\nhasTime: {\n  type: Boolean,\n  default: false,\n},\n\ntimeProps: {\n  type: Object, // same as TimePicker's props\n},\n```\n\n## Events\n### next(data)\n\n### prev(data)\n\n### pick(data) \n`data.value` \nGet value of input.\n\n`data.year` \nGet the year.\n\n`data.month` \nGet the month.\n\n`data.date` \nGet the date of month.\n\n`data.day`\nGet the day of week.\n\n`data.Date`\nGet Date instance.\n\n`data.ts`\n Get timestamp of unix.\n \n`date.hour`\nGet hours, if no TimePicker is `0`.\n\n`data.minute`\nGet minutes, if no TimePicker is `0`.\n\n`data.time`\nGet time value, if no TimePicker is `''`. \n\n## Demo\n"

/***/ }),
/* 353 */
/***/ (function(module, exports) {

module.exports = "# DualList\n\n## Props\n```js\nprops: {\n  items: { //list on the left\n    type: Array,\n    default: () => {\n      return []\n    }\n  },\n  selectedItems: { //list on the right\n    type: Array,\n    default: () => {\n      return []\n    }\n  },\n  displayKey: {\n    type: String,\n    required: true\n  },\n  caseInsensitive: {\n    type: Boolean,\n    default: false\n  },\n  apiMode: {\n    type: Boolean,\n    default: false\n  },\n  leftLoading: {\n    type: Boolean,\n    default: false\n  }\n}\n```\n\n## Usage\nThe props -- `items` and `selectedItems` must be `Array Object`.  \nGive `displayKey` to determine what should be display in a single list\n```jsx\nconst labels = [\n  { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },\n  { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' }\n]\n<DualList items={labels} selectedItems={selectedLabel} displayKey=\"name\" caseInsensitive />\n```\nUse `onChange `as a listener to get data from `$emit('change')`\n```jsx\n<DualList items={labels} onChange={this.getDualData} />\n```\nUse `caseInsensitive` props to determine whether the search feature is case insensitive\n```jsx\n<DualList items={labels} caseInsensitive />\n```\nAPI mode `<Dual />`:\n- additional props `apiMode` and `leftLoading`  \n- get left input box value by listener `onInputChange`\n- get remove input value event by listener `onRemove`\n```jsx\n<DualList apiMode onInputChange={this.getInputValue} onRemove={this.removeInput} leftLoading={true} />\n```\n\n## Demo\n"

/***/ }),
/* 354 */
/***/ (function(module, exports) {

module.exports = "# Flex\n\nFlex is a `flex-box` grid system component.\n\n## Props\n```js\nprops: {\n  grids: {\n    type: Number,\n    default: 12,\n  },\n\n  margin: {\n    type: Number,\n    default: 20,\n  },\n\n  mid: {\n    type: Boolean,\n    default: false,\n  },\n\n  split: {\n    type: Boolean,\n    default: false,\n  },\n},\n```\n\n## Flex.Col\n### Props\n\n```js\nprops: {\n  offset: {\n    type: [Number, String],\n  },\n  size: {\n    type: [Number, String],\n  },\n  width: {\n    type: [Number, String],\n  },\n  mid: {\n    type: Boolean,\n    default: false,\n  },\n},\n```\n\n## Usage\n\n```jsx\nimport { Flex } from 'owl-ui'\n\nrender(h) {\n  return (\n    <Flex>\n      <Flex.Col size=\"2\"></Flex.Col>\n      <Flex.Col size=\"10\"></Flex.Col>\n    </Flex>\n  )\n}\n```\n\n## Auto\n\n```jsx\nimport { Flex } from 'owl-ui'\n\nrender(h) {\n  return (\n    <Flex>\n      <Flex.Col size=\"auto\"></Flex.Col>\n      <Flex.Col size=\"auto\"></Flex.Col>\n    </Flex>\n  )\n}\n```\n\n## Grids\nSet your grid columns, default is `12`.\n\n```jsx\nrender(h) {\n  return (\n    <Flex grids={24}>\n\n    </Flex>\n  )\n}\n```\n\n## Margin\nSet the margin of each column, default is `20`.\n\n```jsx\nrender(h) {\n  return (\n    <Flex grids={24} margin={16}>\n\n    </Flex>\n  )\n}\n```\n\n## Split\n\n```jsx\nrender(h) {\n  return (\n    <Flex split>\n      <Flex.Col>left</Flex.Col>\n      <Flex.Col>right</Flex.Col>\n    </Flex>\n  )\n}\n```\n\n## Mid\n\n```jsx\nrender(h) {\n  return (\n    <Flex mid>\n      Mid Content\n    </Flex>\n  )\n}\n```\n\n## Social Example\n`Flex` also can support any typical layouts quickly and easy, for example is social media layout:\n\n```jsx\nrender(h) {\n  return (\n    <Flex margin={12}>\n      <Flex.Col >\n        <div class=\"avatar\">\n          <Flex mid>\n            avatar <br /> 76 x 76\n          </Flex>\n        </div>\n      </Flex.Col>\n      <Flex.Col size=\"auto\">\n        <p>Cepave @cepave said:</p>\n        <p>OWL UI is No.1. :)</p>\n      </Flex.Col>\n    </Flex>\n  )\n}\n```\n"

/***/ }),
/* 355 */
/***/ (function(module, exports) {

module.exports = "# Grid\n\n## Props\n\n```js\nheads: {\n  type: Array,\n  required: true,\n  default: () => [\n    {\n      name: 'Head',\n      key: '',\n      sort: -1,\n      sortKey: '',\n      width: '20%'\n    }\n  ],\n},\n\nrows: {\n  type: Array,\n  default: () => [],\n},\n\nrowsRender: {\n  type: Function\n},\n\nloading: {\n  type: Boolean,\n  default: false,\n}\n```\n\n### heads.name \nDisplayed table head's name.\n### *heads.key\nDefined unique key field of each column in row.\n### heads.sort\n`1` is sort by descending, `0` is sort by ascending.\n### heads.sortKey\nIf no defined it'll use `key`.\n### heads.width\nDefined the `width` of each column. Clould be `px` or `%` if omit unit it'll be `px`.\n\n### rowsRender \nCustom rows renderer.\n\n```jsx\nrowsRender({ row, index }) {\n  return [\n    <Grid.col><b>{row.name}</b></Grid.col>,\n    <Grid.col>{row.email}</Grid.col>,\n  ]\n}\n```\n\n## Methods\n\n### resetSort()\nReset head's sort status to default.\n\n## Event\n\n### sort(data)\nCustom sort.\n### data.sort\nGet sort way. \n### data.key \nGet sort key.\n\n## Usage\n"

/***/ }),
/* 356 */
/***/ (function(module, exports) {

module.exports = "## INSTALLATION\n\nYou can install quickly through `npm` or `yarn`:\n\n```sh\nnpm install @cepave/owl-ui --save\n```\n\nor\n\n```sh\nyarn add @cepave/owl-ui\n```\n\n\n## GET STARTED\nEach component in `OWL UI` was named `CamelCase`, and you can find the all naming from components lists.\n\n```js\nimport { Button, Select, ... } from '@cepave/owl-ui'\n```\n"

/***/ }),
/* 357 */
/***/ (function(module, exports) {

module.exports = "# Icon\n\n## Props\n```js\nprops: {\n  typ: {\n    default: '',\n    required: true,\n    type: String,\n  },\n\n  size: {\n    type: [String, Number],\n    default: '20x20'\n  },\n},\n```\n\n## Usage\n\n```jsx\n<Icon typ=\"add\" size={20} />\n\n// same as [width] x [height]\n<Icon typ=\"add\" size=\"20x20\" />\n```\n\n## Colorful\nThe Icon component export as a standard `SVG` tag, you can `fill` the color free.\n\n```js\nimport { Icon } from 'owl-ui'\n\n<Icon fill=\"#e08600\" typ=\"alarm\" size={45} />\n```\n\n## Demo\n"

/***/ }),
/* 358 */
/***/ (function(module, exports) {

module.exports = "# Input\n\n## Props\n\n```js\nprops: {\n    name: {\n      type: String,\n      default: 'input',\n    },\n    icon: {\n      type: Array,\n    },\n    status: {\n      type: String,\n      default: 'normal'\n    },\n    defaultValue: {\n      default: ''\n    },\n    placeholder: {\n      type: String,\n      default: ''\n    },\n    loading:{\n      type: Boolean,\n      default: false,\n    },\n    password: {\n      type: Boolean,\n      default: false\n    },\n    x: {\n      type: Boolean,\n      default: false\n    },\n    required: {\n      type: Boolean,\n      default: false\n    },\n    disabled: {\n      type: Boolean,\n      default: false\n    }\n}\n```\n## Methods\n- `\bsetValue([value])` for dynamic change value.\n\n## Events\n- `input` get value immediately after typing.\n\n\n## Usage\n\nget input value from `this.$refs.inputRef.value`\n```jsx\n<Input name=\"demo\" icon={['search', '#919799']} status=\"normal\" placeholder=\"type some words..\" ref=\"inputRef\" />\n```\nuse `loading` props to show loading pie\n```jsx\n<Input loading={true} />\n```\nuse `password` props to switch input type\n```jsx\n<Input password={true} />\n```\nuse props `x` and `x` icon to remove value when clicking on `x`\n```jsx\n<Input icon={['search', '#919799']} x={true} />\n```\nuse `required` props to add `*` beside `<Input>`\n```jsx\n<Input required={true} />\n```\n\nget `onClickX` event by `$on` and `$emit`\n```jsx\nmounted() {\n  this.$on('handleClickOnX', this.handleClickOnX)\n},\nmethods: {\n  handleClickOnX(data) {\n    console.log(data)\n  }\n}\n```\n\nUse `nativeOn-keypress={this.handleClick}` to bind keypress event\n```jsx\n<Input status=\"success\" nativeOn-keypress={this.handleKeyPress} />\n```\n\n## Demo\n"

/***/ }),
/* 359 */
/***/ (function(module, exports) {

module.exports = "# Label\n\n## Props\n\n```js\n{\n  name: 'Label',\n  props: {\n    typ: {\n      type: String,\n      default: 'label'\n      //label, outline, tag\n    },\n    status: {\n      type: String,\n      default: 'default'\n      //default, primary, success, error, warning, inverted\n    },\n    badge: {\n      type: Boolean,\n      default: false\n    },\n    x: {\n      type: Boolean,\n      default: false\n    }\n  }\n},\n{\n  name: 'LabelGroup',\n  props: {\n    options: {\n      type: Array,\n      required: true\n    },\n    focused: {\n      type: Number,\n      default: -1\n    },\n    displayKey: {\n      type: String,\n      required: true\n    },\n    newTag: {\n      type: Boolean,\n      default: false\n    },\n    newTagMsg: {\n      type: String,\n      default: '+ New Tag'\n    },\n    preventDuplicate: {\n      type: Boolean,\n      default: true\n    }\n    /* typ, status, badge, and x are the same as 'Label'*/\n  }\n}\n```\n\n## Options data structure for `<Label.Group>`\nThe `options` of props must be an `Array Object`.  \nGive `displayKey` to determine what should be display in a single list\n\nSuggested format:\n```json\n[\n  { value: 'winnie', title: 'Winnie The Pooh' },\n  { value: 'piglet', title: 'Piglet' },\n  { value: 'tigger', title: 'Tigger' }\n]\n```\n\n## Usage\n\n### Label\n\nLabels\n```jsx\n<Label>Default</Label>\n<Label status=\"primary\">Primary</Label>\n```\nOutline\n```\n<Label typ=\"outline\">Default</Label>\n<Label typ=\"outline\" status=\"primary\">Primary</Label>\n```\nTags\n```jsx\n<Label typ=\"tag\">Default</Label>\n<Label typ=\"tag\" status=\"primary\">Primary</Label>\n```\nBadges\n```jsx\n<Label badge={true}>Default</Label>\n<Label badge={true} status=\"primary\">1</Label>\n```\nBadge Outline\n```jsx\n<Label badge={true} typ=\"outline\">Default</Label>\n<Label badge={true} typ=\"outline\" status=\"primary\">1</Label>\n```\nClosable Label (the style)\n```jsx\n<Label x badge status=\"success\">hello</Label>\n<Label x badge status=\"primary\" typ=\"outline\">This</Label>\n```\n\n### Label Group  \n\n1. Use `onChange` as a listener to get existing label data from `$emit('change')`  \n2. Use `onRemove` as a listener to get removed data from `$emit('remove')`\n (supported when `<Label.Group>` with `x={true}`)  \n3. Use `onCreate` as a listener to get newly added data from `$emit('create')`\n(supported when `<Label.Group>` with `newTag={true}`)  \n4. get labelGroup data by `this.$refs.labelGroup.labelData`\n```jsx\ndata() {\n return {\n   options: [\n     { value: 'Winnie The Pooh' },\n     { value: 'Piglet' },\n     { value: 'Tigger' }\n   ]\n }\n},\n\nmethods: {\n  getLabelGroupData((data) => console.log(data))\n},\n\nrender(h) {\n  return (\n    <Label.Group  displayKey=\"value\" \n                  ref=\"labelGroup\"\n                  typ=\"outline\" \n                  x={true} \n                  badge={true} \n                  newTag={true}\n                  options={this.options} \n                  onChange={this.getLabelGroupData} \n                  focused={1}\n    />\n  )\n}\n```\n\n## Demo\n"

/***/ }),
/* 360 */
/***/ (function(module, exports) {

module.exports = "# Legacy Components\n\nThese legacy components are not recommend to use, it'll be `deprecated` in the future.\u001c\n\n\n### Usage\nAll the legacy components be put in `Legacy` namespace.\n\n```jsx\nimport { Legacy } from '@cepave/owl-ui'\n\nrender(h) {\n  return (\n    <Legacy.Grid />\n  )\n}\n```\n"

/***/ }),
/* 361 */
/***/ (function(module, exports) {

module.exports = "# Legacy.Grid\n\n## Props\n\n```js\nheads: {\n  type: Array,\n  default:() => [\n    {\n      col: 'Head',\n      sort: -1,\n      width: '20%'\n    }\n  ],\n},\n\nrows: {\n  type: Array,\n  default:() => [\n    [{ col: 'col1' }, { col: 'col2' }],\n  ],\n},\n\nrowsRender: {\n  type: Function\n}\n```\n\n\n## Demo\n"

/***/ }),
/* 362 */
/***/ (function(module, exports) {

module.exports = "# LightBox\n\n## Props\n\n```js \nprops: {\n  closeOnESC: {\n    type: Boolean,\n    default: false\n  },\n  closeOnClickMask: {\n    type: Boolean,\n    default: false,\n  },\n  bgColor: {\n    type: String,\n    default: 'rgba(255, 255, 255, .8)',\n  }\n},\n...\n```\n\n## LightBox.Open and LightBox.Close\nThis is a recommend way to open or close your lightbox, the default event type is `click`.\n\n## Events\n\n### open\nTriggers when LightBox is opened.\n\n### close\nTriggers when LightBox is closed.\n\n### Props\n```js\nprops: {\n  event: {\n    type: String,\n    default: 'click'\n  }\n},\n...\n```\n\n## Usage\n\n```jsx\n<LightBox>\n  <LightBox.Open>\n    Open LightBox\n  </LightBox.Open>\n  <LightBox.View>\n    ...\n  </LightBox.View>\n</LightBox>\n```\n"

/***/ }),
/* 363 */
/***/ (function(module, exports) {

module.exports = "# Loading\n\n## Props\n\n```js\nprops: {\n  typ: {\n    type: String,\n    default: 'pie',\n  },\n  size: {\n    type: [String, Number],\n  },\n  show: {\n    type: Boolean,\n    default: true\n  }\n}\n```\n\n## Usage\n\n```jsx\n<Loading typ=\"pie\" />\n\n//adding `width` x `height` to Loading Bar\n<Loading typ=\"bar\" size=\"100x10\" />\n\n//make Loading disappear\n<Loading show={false} />\n```\n\n## Demo\n"

/***/ }),
/* 364 */
/***/ (function(module, exports) {

module.exports = "# Message\n\n## Props\n\n```js\nprops: {\n  message: {\n    type: String,\n  },\n\n  type: {\n    type: String,\n    default: 'primary' // primary, error, warning, success\n  },\n\n  duration: {\n    type: Number,\n    default: 3000 // it will not be turned off automatically if set to 0\n  },\n\n  showClose: {\n    type: Boolean,\n    default: false\n  },\n\n  iconClass: {\n    type: String, // set a custom icon class, will override type attribute\n  },\n\n  onClose: {\n    type: Function // trigger a callback function when close the message\n  }\n}\n```\n\n## Usage\n```jsx\nexport default {\n  methods: {\n    open(event) {\n      Message('Hello!')\n    },\n    open_warning() {\n      event.preventDefault()\n      Message({\n        message: 'Warning!',\n        type: 'warning',\n        duration: 0,\n        showClose: true\n      })\n    }\n  }\n}\n\n<Button status=\"primaryOutline\" nativeOnClick={this.open}>Hello message!</Button>\n<a href=\"#\" onClick={this.open_warning}>Warning</a>\n```\n\n## Parameter\n### String\n`Message()` method is able to take a simple string as a parameter for basic usage.\n```jsx\nMessage('Hello!')\n```\n### Object\n`Message()` method is also able to take an object as a parameter for more customizations.\n```jsx\nMessage({\n  message: 'Warning!',\n  type: 'warning',\n  duration: 0,\n  showClose: true\n})\n```\n\n## Demo\n"

/***/ }),
/* 365 */
/***/ (function(module, exports) {

module.exports = "# MultiSelect\n\n## Props\n\n```js\nprops: {\n  options: {\n    type: Array,\n    required: true\n  },\n  selectedOpts: {\n    type: Array,\n    required: true\n  },\n  displayKey: {\n    type: String,\n    required: true\n  },\n  isOpened: {\n    type: Boolean,\n    default: false,\n  },\n  isDisabled: {\n    type: Boolean,\n    default: false\n  },\n  caseInsensitive: {\n    type: Boolean,\n    default: false\n  },\n  loading: {\n    type: Boolean,\n    default: false\n  }\n},\n```\n\n## Usage\nThe props `options` must be `Array Object` and `selectedOpts` must be an `Array of Numbers`  \nGive `displayKey` to determine what should be display in the option list\n```jsx\nconst options = [\n  { value: 'vulpix', id: 23 },\n  { value: 'caterpie', id: 26 },\n  { value: 'pikachu', id: 24 }\n]\nconst selectedOpts = [0, 1]\n<MultiSelect selectedOpts={this.selectedItems} options={this.options} displayKey=\"value\" />\n```\n1. Use `onChange `as a listener to get data from `$emit('change')`\n2. Use `caseInsensitive` props to determine whether the search feature is case insensitive\n3. Use `loading` to show loading status\n4. get `<MultiSelect />` data by `this.$refs.multiselect.selectedIdx`\n```jsx\n<MultiSelect selectedOpts={this.selectedItems} \n             options={this.options} \n             displayKey=\"value\"\n             onChange={this.getData} \n             caseInsensitive \n             loading\n             ref=\"multiselect\"\n/>\n```\n\n## Demo\n"

/***/ }),
/* 366 */
/***/ (function(module, exports) {

module.exports = "# Page\n\n## props\n\n```js\nprops: {\n  limit: {\n    type: Number,\n    default: 10,\n    required: true,\n  },\n\n  total: {\n    type: Number,\n    required: true,\n  },\n\n  typ: {\n    type: String,\n    default: 'pages', // `pages`, `button`, `text` and `number`.\n  },\n\n  align: {\n    type: String,\n    default: 'center' // `left`, `center`, `right` and `around`.\n  },\n\n  toPage: {\n    type: Number,\n    default: 1,\n  }\n},\n...\n```\n\n### props.typ\nThe pagination's type, default is `pages`. Otherwise is `button`, `text` and `number`.\n\n\n### props.align\nThe pagination's alignment, default is `center`. Otherwise is `left`, `right` and `around`.\n\n## Usage\n\n```jsx\n<Page total={500} limit={20} />\n```\n\n## Events\n### page({ page })\nIt'll be triggered when switch page.\n\n## Get Current Page\nYou can access the `page` directly through `ref`.\n\n```jsx\nmounted() {\n  this.$refs.myPager.page // get page\n},\n\nrender(h) {\n  return (\n    <Page total={500} limit={20} ref=\"myPager\" />\n  )\n}\n```\n\n## The all  looks of Page's type\n\n"

/***/ }),
/* 367 */
/***/ (function(module, exports) {

module.exports = "# Radio and RadioGroup\n\n## props\n\n```js\nconst Radio = {\n  props: {\n    on: {\n      type: Boolean,\n      default: false\n    },\n    name: {\n      type: String,\n      default: ''\n    }\n  },\n}\n```\n\n## Usage\n```jsx\n<Radio.Group>\n  <Radio name=\"winnieThePooh\" on={true}>Winnie the Pooh</Radio>\n  <Radio name=\"piglet\">Piglet</Radio>\n  <Radio name=\"tigger\">Tigger</Radio>\n</Radio.Group>\n```\nUse `onChange` as a listener to get data from `$emit('change')`\nIt works both on `<Radio>` and `<Radio.Group>`\n```jsx\n//Define a Function to handle onChange and get Raio.Group data\nconst getRadioData = (data) => {\n  console.log(data)\n}\n\n<Radio.Group onChange={getRadioData}>\n  <Radio name=\"piglet\">Piglet</Radio>\n  <Radio name=\"tigger\">Tigger</Radio>\n  <Radio name=\"winnieThePooh\" on={true}>Winnie the Pooh</Radio>\n</Radio.Group>\n```\n\n## Demo\n"

/***/ }),
/* 368 */
/***/ (function(module, exports) {

module.exports = "# Select\n\n## Props\n\n```js\nprops: {\n  options: {\n    type: Array,\n    required: true,\n  },\n\n  optionsRender: {\n    type: Function\n  },\n\n  isOpened: {\n    type: Boolean,\n    default: false,\n  },\n\n  isDisabled: {\n    type: Boolean,\n    default: false,\n  },\n\n  name: {\n    type: String,\n    default: ''\n  }\n},\n...\n```\n\n## Options data structure\nThe `options` of props must be an `Array Object`.\n\n```json\n[\n  { value: '1d', title: '1 day' },\n  { value: '3d', title: '3 days', selected: true },\n  { value: '5d', title: '5 days' },\n]\n```\n### options.value [String]\nOption's value\n\n### options.title [String]\nDisplayed title\n\n### options.selected [Boolean]\nSet the default selected option\n\n### options.render [Function]\nCustom render template.\n\n## Events\n### change({ value, idx })\nGets value after changes.\n\n## Usage\n```jsx\ndata() {\n  options: [\n    { value: '1d', title: '1 day' },\n    { value: '3d', title: '3 days', selected: true },\n    { value: '5d', title: '5 days' },\n  ]\n},\n\nmethods: {\n  selectOnChange(data) {\n    console.log(data)\n  }\n},\n\nrender(h) {\n  const { selectOnChange, options } = this\n  return (\n    <Select onChange={selectOnChange} options={options} />\n  )\n}\n```\n\n## The Value\nYou also can get value directly thro `ref`\n\n```jsx\nmounted() {\n  // gets value\n  this.$refs.mySelect.value\n},\n\nrender(h) {\n  <Select ref=\"mySelect\" />\n}\n```\n\n## Custom Options Render\n\n```jsx\n\ndata() {\n  options: [\n    { value: '1d', title: '1 day' },\n    { value: '3d', title: '3 days', selected: true },\n    { value: '5d', title: '5 days' },\n  ]\n},\nrender(h) {\n  return (\n    <Select options={this.options} optionsRender={({ option })=>(\n      <b>{options.title}</b>\n    )}/>\n  )\n}\n```\n"

/***/ }),
/* 369 */
/***/ (function(module, exports) {

module.exports = "#Switch\n\n##props\n\n```js\nprops: {\n  checked: {\n    type: Boolean,\n    default: false\n  },\n  name: {\n    type: String,\n    default: 'data'\n  },\n  typ: {\n    type: String,\n    default: 'default'\n    //two different type: 'default' and 'special'\n  }\n}\n```\n\n##Switch.Open and Switch.Close\nThis is the recommended way to put words in Switch Button\n\n##Usage\n\nget `<Switch />` value from `this.$refs.switchref.check`\n```jsx\n<Switch checked name=\"switch1\" ref=\"switchref\" typ=\"special\" />\n```\n\nUse `onChange` as a listener to get data from `$emit('change')`\n```jsx\n//Define a Function to handle onChange and get switch button data\nconst getSwitchData = (data) => {\n  console.log(data)\n}\n\n<Switch checked={true} name=\"demo1\" onChange={getSwitchData}/>\n```\nSwitch can also handle dynamic changes of `checked`\n```jsx\nlet a = true\n\nsetTimeout(() => {\n  a = false\n}, 2000)\n\n<Switch checked={a}/>\n```\nUse `<Switch.Open>` and `<Switch.Close>` to put words into Switch Button\n```jsx\n<Switch checked={true} name=\"demo2\" typ=\"special\" onChange={getSwitchData}>\n  <Switch.Open>開</Switch.Open>\n  <Switch.Close>關</Switch.Close>\n</Switch>\n```\n\n##Demo\n"

/***/ }),
/* 370 */
/***/ (function(module, exports) {

module.exports = "# Tab\n\n## Props of Tab.Head and Tab.Content\n`name` of `Tab.Head` and `Tab.Content` are required, they will be matched\n```js\n{\n  name: 'Tab.Head',\n  props: {\n    isSelected: {\n      type: Boolean,\n      default: false\n    },\n    name: {\n      type: String,\n      default: '',\n      required: true\n    }\n  }\n},\n{\n  name: 'Tab.Content',\n  props: {\n    name: {\n      type: String,\n      default: '',\n      required: true\n    }\n  }\n}\n```\n\n## Usage\n\n- The sequence of `<Tab.Head>` and `<Tab.Content>` should be placed in order, eg. `1`,`2`,...or `Alarms`, `Alarm History`  \n- Must add attribute `slot=\"tabHead\"` in `<Tab.Head>` and `slot=\"tabContent\"` in `<Tab.Content>`\n- Use `onChange` as a listener to get data from `$emit('change')`\n\n```jsx\nconst getTabData = (data) => {\n  console.log(data)\n}\n<Tab onChange={getTabData}>\n  <Tab.Head slot=\"tabHead\" name=\"1\">Tab1</Tab.Head>\n  <Tab.Head slot=\"tabHead\" isSelected={true} name=\"2\">Tab2</Tab.Head>\n  <Tab.Content slot=\"tabContent\" name=\"1\">\n    <br />Hello, I am tab one\n  </Tab.Content>\n  <Tab.Content slot=\"tabContent\" name=\"2\">\n    <br />This is tab two\n  </Tab.Content>\n</Tab>\n```\nIt can be placed like this as well\n```jsx\n<Tab>\n  <Tab.Head slot=\"tabHead\" name=\"1\">Tab1</Tab.Head>\n  <Tab.Content slot=\"tabContent\" name=\"1\">\n    <br />Hello, I am tab one\n  </Tab.Content>\n  <Tab.Head slot=\"tabHead\" isSelected={true} name=\"2\">Tab2</Tab.Head>\n  <Tab.Content slot=\"tabContent\" name=\"2\">\n    <br />This is tab two\n  </Tab.Content>\n</Tab>\n```\n\n## Demo\n"

/***/ }),
/* 371 */
/***/ (function(module, exports) {

module.exports = "# TimePicker\n\n## Props\n\n```js\nprops: {\n  start: {\n    type: String,\n    default: '09:00',\n  },\n  end: {\n    type: String,\n    default: '22:00',\n  },\n  step: {\n    type: Number,\n    default: 15, // mins\n  },\n  open: {\n    type: Boolean,\n    default: false,\n  },\n  defaultValue: {\n    type: String,\n    default: Date().match(/\\d\\d:\\d\\d/)[0], // Current time of client\n  }\n},\n```\n\n## Events\n\n### change(data)\n\n#### data.value \nGets selected time.\n\n## Example\n"

/***/ }),
/* 372 */
/***/ (function(module, exports) {

module.exports = "# Tip\n\n## Props\n\n```js\nprops: {\n  pos: {\n    type: String,\n    default: 'down',\n  },\n  event: {\n    type: String,\n    default: 'mouseenter'\n  },\n  delay: {\n    type: Number,\n    default: 50\n  }\n}\n```\n\n## Usage\n\n```jsx\n<Tip pos=\"right\">\n  hover me\n  <Tip.Context>\n    I am a tip\n  </Tip.Context>\n</Tip>\n```\n\n## Demo\n"

/***/ }),
/* 373 */
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ }),
/* 374 */,
/* 375 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),
/* 376 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAeCAYAAADtubaCAAAAAXNSR0IArs4c6QAAEEFJREFUaAXtmwmQVMUZx783e7kssusS0FUXd8QDwiFEQUkIRxKFEJVDWY0mMcRYBEJKudVUKUlKo1wSiyISTcADhUVFQRFiShBEuTYRYQUhHCsoIocssizsMS+/7828oV/P7LBUaYEVuuh93d/1+vj311/3Gxw5ieRulRYSkdbiSBHPZqg6kiZ7xZUdEpKNzsVSfhLmzoiehiPgnKhNbpnkS5YMZOqLAcGVki655GCqpVonFYDiP4CjRJ5qVeL8edP+oNCZ2jdhBOoFhOsyvVvlToAwVjKlJRMuohMfqadbChIHc6+GRd4q2AZCJkhW4ZPO3LmqeSZ9Q0YgKSDcD6UAEEwj9/NAoEBIlUIwa0LiPt9SnDXNRbJckRCmI5EFAGmI89p7n6RSP8M7fUYgARDuFrxBSF4CDFdIVQMaqhZcR9xZl4izCjBkGi4kDaTUsemk1Q5w5q3e3ABrZ0RO8Qjo2o4npu48toiXJaOBYFDNNPAwv0UiGJRXBzjSnDYSSZvnXt/lAiWdSaf3CMQ9hLuEUPF8eVEaSd8GeQbtVyZgWNFMnOcvZYtgm4hbszqtnqK2bqEUrOzn/E1qLG691SVLlqSXlpb2rKur6+M4TpHrurVpaWnjR40ataZeJRgTJ07shM4N6FxG9Rzy5+hu4PnK2LFjP+KZMk2aNOmKSCRyIzqtEWxK3o+tjdQXjBkz5v2Uyhbz8ccfv/DYsWP9sHcVrPPIX2KLGEsWjh49ejllw6UGlR977LG8Dh06HO7Zs2e9m/bUqVObDhs2LGUA/+ijj16O5X68qy1P3Lh8QV82Z2RkvDZixIjV5lvjU8hWcSeniafkqMlOUVbP8Fm2OH/hHUcyooBIIS4OUeeulkOc0plPpBLzeePHj+9NeQoN187EE506AK2Iif0yTowVYkCYQvW7Ns+vo/8KAzFy+PDhOimBNGHChLbYfoz8owDDqKD/Vnp6+j0M5HqDnFCkLd8ClA8j/yvsMVpJUxkAHw7A3zS5yDu0ZSbPX0Dfj8wAZJaZMgCtWVVV1WJoHcnrec91gPUzUwYbYYA4EdoAk26W0Xsv1h8PGN6W4X7AKnLl914AaUqnKkfA0vyLwDtuQr1DquTAr2ZMqi673+38sq64lAkwjEFgIQMSAIMqQcunEy1tA+j8kgl4B3q9YIjp96uurl7Lqulp2mACBzB4q7BfLxhi+j+ora1dhfzNpr5ZhvdtbOkA34W9+sCgKm2QW0zb77f0e6KnYNDUFJnp0eLxv4BBdRQMmtoxJiOixehfwNADG2up1QsGlUSmC/15B/lBWo/GEFXyMzlLwg125jgEWZfvOuvzRTLq9XhqP5oUEJVns6WcWyjVFbf45GRPBvMOGvkoOe69TDk6vrNZs2abTBqTq+7979BAZ4OSbiMvMQg5Ks2EdGfQZ1NspPUTJd6VDfhesEGlelOmTDkX3mJkwieyo3ztJ/khbA315WlLoO/wW9HWq32+bqWUb/fr+lQ7fn3y5MntsLEAGhN04oRcBvlJxr4VZ0XXmde8f783Qr3d5RldI5tDl0YOS07Eu2/QuY4ufv0bzRwo5GjIdf/lxYgm/bi03QYuNeRQIfADSZG6W10ZFwWiJceeWcBgTrPIXG84ldCW8ZyEu+82aNCg+MZG59VjPA3ftlkL/X3yXHgf2zapnwOvEP1syrN0UCyZaurvkmcgt4J8zOLrpMyaPn16AER4H90SL7RktboDG6+QVyWxpX2cQlsuUcFwOLycxxda9hPt+7lfXrt27Y8p601xPIVCoVe1glyIFf88xcZxJgXsu2SNn14kl5k8LaOXBojahOSAXDgg5+Wr++S84XTLXR66Im9dqH3uutDAxrPl6YzbuZcGZK4XLioCHUJPxy1jLD9uTNlDZZQelbHfgwZgOMJCPBpmyvSOyu0o7S+4KFGQXaW6+l7ogQGmE3MbN25cSMzQnT1yFHv/DlOXzo+mM3kmDZ017LvtkO/Icwp19Qh2Wt+iRYstAHAI+h66fQHVp9yed36P/CvsdMVOe+irfJnYs6CiomKYT2OFdcJWP78ee2oMMBA7Yez0J1+DzMXw3jDloGXQl3FKKy4uruZdcyz+rYDPAy2ycXCoDLLbR44cuULLtOE2+G217CflA5gevLtVZmbmaOi464S0H5m3QxwbW7Nd5Pg3kEedbNme3lJebHSL/DLvObkyr1T+lHmfu68uNuY6pysJVI97qATLQQKOY++lHD8VWCg76Y0BSZugDKyoyxto0unIciLxW4YOHRpYLaYM5Z9a9V25ubnXEoRtws12YcIXYTswADpABFI/YeDr4N1q6e9hYPowgbqa4okB34xOHwi740QKpj4rLNAW3uNiq5i26KqMJ2x/2rlz5xvhl8aJFLDVf8aMGWcpDd4zJo9y00OHDvUBFLnI3WDxntV3KQ2e3YYqANlbg1LAclFNTc1SxFqorJEq8Lx9kNkXIm4Ic++QmDzzIjsziuSB3IedrnnvyHznOk4Kjjjbmoik6w5xgqQe4QCeraq13kdEhR1irIiT4CGYPHWXBaZFOnKv31GT7pfZYooYgIAt5P8wePDgCuzpiSEpGLKysnowwTtjg6/HQTNN0oExCX6Zk8UBJniiX489OxrbRneL9zqAfsuieVU9StK+sRav0d69ezspDb33ePzX5CP/czySLhoPNAbvOaMcaAM60xXMurWyOJZSt8frEH3q5R8/+UbJnqAHuJBh0iy6VMgfZbWRm5rPlznl41yprIluBaacXQ4BmEq8/+f0LxMA+S7Ihe4kPQmcb5mozc/P/7dFC1RBe8DVK5NVrAOpK+V+sr7YTDvofM+77777YyXu27evAJkYUqNiAGq1qWCXk/ErKyu9tmPLbo/XFtuGUV9tA5563AZtNSda1a7nHUMNfS2uZCvYogW9t4DP/nw8YcNrg26NUIuOczwvdIhF1wvwxbfCkHfU3IHYYXJ9oFArgKLWzZLsIw84kj+IW8ijSk2eFAxHsvAmXTiFFCYDT2ASkhv5aqkMdDmd78HqL/ctUwexwQSgknoHQyow4ErHjgagCYl3puwnW4cuRc3xxIQ29iu05Vm/rE94DGr8qOmxeIW9tXj0E/1BTy/IeuM9VpqyIVbrFx4otkLWnVpBkawb0PIqXblqD/zzh4k0IXaKHKFiJd0mDrEwd3ZjpNgF7DsKhxe4jkbvdvrUIqQfOHDgOxYtUGXf+yRAoEJgBgo9T/EQHfZtliEbAIOt19A6K627JVtbUFDwmdJ4X6A9TOA1luxJVfXyDJsrUihVA5o5Ph/5g8hX+nV9Etd445Gdnf0E1fUx3m7k1DMkeDCOnbLd+7TNoqYk3k9canjawKB+8UGRc/V1CpiCUaz+Vkwui0PjGQUC/+TTsMgnP2JGLk4EA2wvsAyFdmjRTDRO98vdJo3Bf4RBTQZPT0xPHHSs3NRB/kENvNgTy4qKisJE1S1xqe3t04mp09AyLrk1ssNNed6/VE8FMdrbJo/yT4hlfmDRTqqK/YCXMJXhLdS4xqRRDrQBmcFcxV+m19uMQwcdj3A4XJQMDGpHTxkf4iG+1I9UHgjUYW4k7yJXkXU6lJcOICoo6qQrWDLxnAqKCEiqhrmn0JVtLJ4ve/D5uxl6ijA7YcytOyxuelkCJxolzzXpTO73GdA506ZNS3Zs9EVf8Aux54UEXm/qJYtOVGyVJWuMpVZ/VY97XF79lJhlGVKBgI42zvQ12a8DbVEws0JLaMvNvszJPnNyckqY1GPJ9KA/Y9Oh2W3QS7RFtKEbvIiOhwFgW53pHueGpLu8xR1fd/FxrmI68QoG7b7umuwCw1e77uTF7IsKEJVVwGx/wpXDn3H0KHAlPRMdXdF4jGRJv2e4tSvkgybd+QGWviGQ9GKKuwj1FIG9nY5UMrilPNfg+qeaq12jZ7aJrfBj5+K4Sb2Y2kCtDF6tUqkfJb/O6ligdXTbMMkqE0/Yb6vepaSkJK28vFwD0xthtuOZFReKFbBViq1OPOMdBjjzkGU/TUg7oKxFdmmnTp2m+x+skK9AntGNJvh3sZKf8uv6ROZFZG4yacgdwAMW2JOLXIhFtI5nW0te27gZ+jqeOnOadIzepQ96+eb1ISTjvKX8gjf50ZlUhsuk62+muJUk668mP5ZI03U8N3Ht+BFHhu0ScT+nnjUAIFwQkUzusJ0IunotCT16rPDL0afGWK7MTgYG5IWJ3k2AZkfRGkwpJLvxHKmr1D+rq466TOh3ULS9QDr0DuTb4Sn/DsqDWbHzGbC+1FMmwDAE2T+icxU5GRj2MYgD/YH0jeGSf0NZ/audiiDcjK2pa9asGW8zU9V5R7Jto8QGg9pANkJccRvFw6ZN3qtX5JdDKyZ748HzTmh/Zzzu82XV+et2UMLElwMC9QnBrGEnt5PkUA5+QDKZ1SygQnYyqGd/KyShXIcraWzpjEOLZrXtl9HkJ1SRml2SWTcber2JU8DTdGosWUGUkOhAIWf1ViaDaH0+8ndCM32cKRIoY6N3gJCkgswVScgeiXdtZXvozsrabsvcc889ewB1L2QSeL6s+X7KGrGZyfNmJqFJkyYLsfe5SaM+06ybZRbJetqnn//t+MIUM8vx8YgC4vvOF0zxQxonpEzJrqf11JB5gcNWkFLV+/ztuo84pYM1SkmZcJm6gvqQN9uC2kkGcatNR2cmE9EVerITTECcwVqpBPZWBWzShMzLvMsGJVGU/In3dwS4HyZVhKg89DtTfBIbCVsjdO/9Mf23Y09d3QqOhFMFF2018H4N74i2iTwJMMbvDnx98wl/KXJXkeeZ9GRlZOLtOT4gS9x0nO48du/rk/4mIkPkz3zDu5dPTIGbTbVQyfwcXMTWkU0lyakgRGwRqV4kdbv6OmXjGrSKteFf0Q9kiHC9qEe3Hj+GmMoguKliCH0/rrQLOj9E9iDbx8a8vLxlOjnKa2giwi9Ety9ZJ+dc9DZg84+xOwiNY/LZBh+E1wLedIC9qD7bulXy2Tv7BFf5Cep8SdWtoh/v0LjiPDKz6SW9LX23efPmD/sfDI8DQvnL3AL2+H8i3lbsuBYTo5ZFZMJiPIJvTnXUwrH9XPuVAAjdai1ARL9wbmI9Xut8cFeyvVWtnJJ0IkCckkad4pdGtwy/Ed2c3QBhAN83NgQPV1GBXU1woUEIRcPHtLMQ0KOH5WE9z1C3Udya/qcbGPwun3kGRyAICOVd52xhbnsRni0gcIw5W57E8NvyOFenW5OuOpIG0dhv9QOWB4bahRKp6uWsH4yHOJO+CSOQCAhtdVeufPdIf0AxlNp2z1sQcG47JyT7GkFJwIT+wof7DIdPmgoEcculrvp3kh/u62z47U4Ip2ViX0/sSRLaadn4r6lR9Z8rir3o+K+yxJ3LNqH/je+W/We7HT88zzm7ucb4PpT0Wcu4urV8pMl4n+1hLgfS2c66X+/9mtr8lZkloCrH2FGy7nmajsZo0dr/4V87Ikg9BKvc8JxZ0rq4TMIAoh2eQuHwgdQd2i6f/GOjsznxl8ypDZ56LieJYkAwWVtCFD6C41rJqW/VqWvB/wDDS8ittNFzHQAAAABJRU5ErkJggg=="

/***/ }),
/* 377 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(137);


/***/ })
],[378]);