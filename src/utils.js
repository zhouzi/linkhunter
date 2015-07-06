export default {
    merge: (dest, src) => {
        for (var key in src) {
            if (!src.hasOwnProperty(key)) continue;
            dest[key] = src[key];
        }

        return dest;
    },

    addEllipsis: (str, maxLength = str.length, ellipsis = '...') => {
        if (str.length <= maxLength) return str;
        return str.substr(0, maxLength - ellipsis.length) + ellipsis;
    }
}