export default {
    merge: (dest, src) => {
        for (var key in src) {
            if (!src.hasOwnProperty(key)) continue;
            dest[key] = src[key];
        }

        return dest;
    }
}