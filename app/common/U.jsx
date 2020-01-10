var U = (function () {

    var str = (function () {

        let isChinaMobile = (mobile) => {
            return mobile.length == 11;
        };

        let trimChinaMobile = (mobile, defaultStr) => {
            if (mobile) {
                if (mobile.indexOf('-') > -1) {
                    return mobile.split('-')[1];
                }
                return mobile;
            }
            return defaultStr ? defaultStr : '';
        };

        let isIdCard = (id) => {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(id);
        };

        var isNull = function (s) {
            return (s === null || typeof s === 'undefined');
        };
        var isNotNull = function (s) {
            return !isNull(s);
        };

        var isEmpty = function (s) {
            if (isNull(s)) {
                return true;
            }
            if (typeof s != 'string') {
                return false;
            }
            return s.length == 0;
        };
        var isNotEmpty = function (s) {
            return !isEmpty(s);
        };
        var emptyToNull = function (s) {
            return isEmpty(s) ? null : s;
        };
        var nullToEmpty = function (s) {
            return isNull(s) ? '' : s;
        };
        var startsWith = function (s, prefix) {
            return s.indexOf(prefix) == 0;
        };

        var endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var replaceAll = function (s, s1, s2) {
            return s.replace(new RegExp(s1, "gm"), s2);
        };

        let trim = (x) => {
            return x.replace(/^\s+|\s+$/gm, '');
        };

        let num2str = function (num) {
            if (isNull(num) || isNaN(num)) {
                return '0';
            }
            let v = parseInt(num);
            if (v < 1e3) {
                return '' + v;
            }
            if (v < 1e4) {
                return (v / 1e3).toFixed(1) + 'K';
            }
            if (v > 1e7) {
                return '1千万+';
            }
            return (v / 1e4).toFixed(1) + '万';
        };

        let randomString = (len) => {
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let maxIndex = chars.length;
            let s = '';
            for (let i = 0; i < len; i++) {
                s += chars.charAt(Math.floor(Math.random() * maxIndex));
            }
            return s;
        };

        let formatBankNo = (no) => {
            return no.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
        };

        let bankNoTail = (no) => {
            if (isEmpty(no)) {
                return '';
            }
            return no.substring(no.length - 4);
        };

        let rn2br = (str) => {
            return str.replace(/(\r\n)|(\n)/g, '<br>');
        };

        return {
            isEmpty, isNotEmpty, emptyToNull, nullToEmpty, rn2br,
            startsWith, endsWith, replaceAll, trim, isNull, isNotNull, isIdCard,
            num2str, isChinaMobile, trimChinaMobile, randomString, formatBankNo, bankNoTail
        };
    })();

    var date = (function () {
        var pad = function (n) {
            return n < 10 ? '0' + n : n;
        };

        var inAnHour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -60)
                return true;
            return false;
        };

        var in24Hour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -1440)
                return true;
            return false;
        };

        let countdownDays = (date) => {
            return parseInt(Math.floor(new Date(date) - Math.floor(new Date())) / 1000 / 60 / 60 / 24);
        };

        var countdownTimers = (date, offset) => {
            var timers = [0, 0, 0, 0];
            var time = Math.max(0, parseInt(Math.floor(new Date(date) - Math.floor(new Date())) / 1000 + (offset || 0)));

            var hours = parseInt(time / 3600);
            if (hours < 10) {
                timers[0] = 0;
                timers[1] = hours;
            } else {
                timers[0] = parseInt(hours / 10);
                timers[1] = parseInt(hours % 10);
            }

            var mins = parseInt((time % 3600) / 60);
            if (mins < 10) {
                timers[2] = 0;
                timers[3] = mins;
            } else {
                timers[2] = parseInt(mins / 10);
                timers[3] = parseInt(mins % 10);
            }

            var seconds = time % 60;
            if (seconds < 10) {
                timers[4] = 0;
                timers[5] = seconds;
            } else {
                timers[4] = parseInt(seconds / 10);
                timers[5] = parseInt(seconds % 10);
            }

            return timers;
        };

        var foreshowTimeout = function (timers) {

            if (timers[0] === 0 && timers[1] === 0 && timers[2] === 0 && timers[3] === 0 && timers[4] === 0 && timers[5] === 0) {
                return true;
            }
            return false;

        };

        var foreshowTimeouted = function (timers) {

            if (timers[0] <= 0 && timers[1] <= 0 && timers[2] <= 0 && timers[3] <= 0 && timers[4] <= 0 && timers[5] <= 0) {
                return true;
            }
            return false;

        };

        var seconds2MS = function (time) {
            let m = 0, s = 0, ret = '';

            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            if (m > 0)
                ret = m + '′';
            if (s > 0)
                ret += s + '″';

            return ret;
        };

        var seconds2HMS = function (time) {
            let h = 0,
                m = 0,
                s = 0,
                _h,
                _m,
                _s, ret = '';

            h = Math.floor(time / 3600);
            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            if (h > 0) {
                _h = h < 10 ? '0' + h : h;
                ret += _h + ':';
            }
            _s = s < 10 ? '0' + s : s;
            _m = m < 10 ? '0' + m : m;

            ret += _m + ':' + _s;

            return ret;
        };

        var format = function (date, fmt) {
            if (!date || !fmt) {
                return null;
            }
            var o = {
                "M+": date.getMonth() + 1, // 月份
                "d+": date.getDate(), // 日
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
                "H+": date.getHours(), // 小时
                "m+": date.getMinutes(), // 分
                "s+": date.getSeconds(), // 秒
                "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
                "S": date.getMilliseconds()
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt
                    .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
                            : "\u5468")
                            : "")
                        + week[date.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                            .substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };

        var formatISO8601 = function (d) {
            if (!d) {
                return null;
            }
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-'
                + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':'
                + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())
                + 'Z';
        };
        var getInt = function (s) {
            var offset = 0;
            for (var i = 0; i < s.length; i++) {
                if (s.charAt(i) == '0') {
                    continue;
                }
                offset = i;
                break;
            }
            if (offset == 0) {
                return parseInt(s);
            }
            return parseInt(s.substr(offset));
        };
        var parse = function (v, timezoneOffset) {
            if (!v) {
                return null;
            }
            // yyyy-MM-ddTHH:mm:ssZ
            // yyyy-MM-ddTHH:mm:ss.SSSZ
            // yyyy-MM-dd HH:mm:ss.SSS
            var index = 0;
            var year = getInt(v.substr(index, 4));
            index += 5;
            var month = getInt(v.substr(index, 2)) - 1;
            index += 3;
            var day = getInt(v.substr(index, 2));
            index += 3;
            var hour = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var minute = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var second = index >= v.length ? 0 : getInt(v.substr(index, 2));
            // TODO more format
            if (v.charAt(v.length - 1) == 'Z') {
                let millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v.indexOf('.') + 1, v.length - 1)) : 0;
                var d = new Date();
                d.setUTCFullYear(year);
                d.setUTCMonth(month);
                d.setUTCDate(day);
                d.setUTCHours(hour);
                d.setUTCMinutes(minute);
                d.setUTCSeconds(second);
                d.setUTCMilliseconds(millSecond);
                return d;
            } else {
                let millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v.indexOf('.') + 1)) : 0;
                var date = new Date(year, month, day, hour, minute, second,
                    millSecond);
                if (!str.isNull(timezoneOffset)) {
                    var diff = timezoneOffset - date.getTimezoneOffset();
                    date.setTime(date.getTime() - diff * 60 * 1000);
                }
                return date;
            }
        };

        var splashTime = function (date) {

            var date3 = (Math.floor(new Date()) - Math.floor(new Date(date))) / 1000;

            var months = Math.floor(date3 / (30 * 24 * 3600));
            if (months > 0)
                return +months + " 月前";

            var days = Math.floor(date3 / (24 * 3600));
            if (days > 0)
                return +days + " 天前";


            var hours = Math.floor(date3 / 3600);
            if (hours > 0)
                return hours + " 小时前";

            var minutes = Math.floor(date3 / 60);

            if (minutes > 0)
                return minutes + " 分钟前";
            var seconds = Math.floor(date3 / 60) > 0 ? Math.floor(date3 / 60) : '刚刚';
            return seconds;

        };

        let isToday = function (date) {
            let d = U.date.format(U.date.parse(date), 'yyyy-MM-dd');
            let today = U.date.format(new Date(), 'yyyy-MM-dd');
            return d === today;
        };

        var countDownStr = function (t, append) {
            var h = parseInt(Math.floor(new Date(t) - Math.floor(new Date())) / 1000 / 3600);

            let timeStr = '',
                days = Math.floor(h / 24),
                hour = parseInt(h % 24);
            if (days > 0) {
                timeStr = days + "天";
            }
            if (hour > 0 && append) {
                timeStr += hour + '小时'
            }
            return timeStr;
        };


        return {
            parse: parse,
            inAnHour: inAnHour,
            in24Hour: in24Hour,
            seconds2MS: seconds2MS,
            seconds2HMS,
            isToday,
            countDownStr,
            countdownDays,
            countdownTimers: countdownTimers,
            foreshowTimeout: foreshowTimeout,
            foreshowTimeouted: foreshowTimeouted,
            format: format,
            formatISO8601: formatISO8601,
            getDayOfYear: function (date) {
                var start = new Date(date.getFullYear(), 0, 0);
                var diff = date.getTime() - start.getTime();
                var oneDay = 1000 * 60 * 60 * 24;
                return Math.floor(diff / oneDay);
            },
            splashTime
        };
    })();

    let array = (function () {
        let swap = function (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        };

        let remove = function (arr, index) {
            if (isNaN(index) || index > arr.length) {
                return [];
            }
            arr.splice(index, 1);
            return arr;
        };

        let def = function (arr, index) {
            if (isNaN(index) || index > arr.length) {
                return [];
            }
            arr.splice(index, 1);
            return arr;
        };

        let insert = function (arr, index, item) {
            arr.splice(index, 0, item);
            return arr;
        };

        let insertLast = function (arr, item) {
            arr.splice(arr.length, 0, item);
            return arr;
        };

        let msgRemoveDup = function (arr, sort) {

            let result = [];
            let tmp = {};
            for (let i = 0; i < arr.length; i++) {
                if (!(tmp[arr[i].p.id])) {
                    if (arr[i].p.id) {
                        result.push(arr[i]);
                        tmp[arr[i].p.id] = 1;
                    }
                }
            }

            if (sort) {
                result = msgQuickSort(result);
            }

            return result;
        };

        let msgQuickSort = function (arr) {
            if (arr.length <= 1) {
                return arr;
            }
            let pivotIndex = Math.floor(arr.length / 2);
            let pivot = arr.splice(pivotIndex, 1)[0];
            let left = [];
            let right = [];
            for (let i = 0; i < arr.length; i++) {
                if (parseInt(arr[i].p.id) < parseInt(pivot.p.id)) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return msgQuickSort(left).concat([pivot], msgQuickSort(right));
        };

        let contains = (arr, obj) => {
            let i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        return {
            swap, remove, insert, insertLast, msgRemoveDup, contains, def
        }
    })();

    var getHashParameter = function (name, isUnescape) {
        var hash = window.location.hash;
        if (!hash) {
            return null;
        }
        var offset = hash.indexOf('?');
        if (offset < 0) {
            return null;
        }
        hash = hash.substr(offset + 1);
        var offset2 = hash.indexOf('?');
        if (offset2 > 0) {
            hash = hash.substring(0, offset2 + 1);
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = hash.match(reg);
        if (r == null) {
            return null;
        }
        if (isUnescape) {
            return r[2];
        }
        return unescape(r[2]);
    };
    var getParameter = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };

    var shortNumber = function (num) {
        let val = parseInt(num);
        if (val <= 10000) {
            return val;
        }

        if (val > 10000) {
            return (val / 10000).toFixed(1) + '万';
        }
    };

    var convertBigDecimal = function (num) {
        if (num > 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num;
    };

    var isIOS = function () {
        return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    };

    var isAndroid = function () {
        let u = navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    };


    let formatCurrency = function (s, n) {
        if (s) {
            /*
             * 参数说明：
             * s：要格式化的数字
             * n：保留几位小数
             * */
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            let l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            let t = "";
            for (let i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        } else {
            return 0;
        }

    };


    let setWXTitle = (t) => {
        let i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = () => {
            setTimeout(() => {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
        document.title = '河工校园淘 - ' + t;
    };

    let url = (() => {

        let getHashParameter = function (name) {
            let hash = window.location.hash;
            if (!hash) {
                return null;
            }
            let offset = hash.indexOf('?');
            if (offset < 0) {
                return null;
            }
            hash = hash.substr(offset + 1);
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = hash.match(reg);
            if (r === null) {
                return null;
            }
            return unescape(r[2]);
        };
        let getParameter = function (name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = window.location.search.substr(1).match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }
            return null;
        };

        let getDomainFromUrl = function (url) {
            let offset = url.indexOf("//");
            let offset2 = url.indexOf("/", offset + 2);
            if (offset2 === -1) {
                return url.substring(offset + 2);
            }
            return url.substring(offset + 2, offset2);
        };

        return {getHashParameter, getParameter, getDomainFromUrl}

    })();
    let base64 = (() => {
        let getBlobBydataURI = (dataURI, type) => {
            let binary = atob(dataURI.split(',')[1]);
            let array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: type});
        };
        return {getBlobBydataURI}
    })();

    return {

        isNull: str.isNull,
        url,
        str,
        date,
        array,
        getParameter: getParameter,
        getHashParameter: getHashParameter,
        shortNumber: shortNumber,
        convertBigDecimal: convertBigDecimal,
        isIOS: isIOS,
        formatCurrency, base64,
        setWXTitle
    };
})();

export default U;
