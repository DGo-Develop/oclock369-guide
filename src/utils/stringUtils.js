class StringUtils {
  compareStrings(string1, string2) {
    const from = "áàãâäéèêëíìîïóòõôöúùûüñç";
    const to = "aaaaaeeeeiiiiooooouuuunc";
    const map = {};

    for (let i = 0, len = from.length; i < len; i++) {
      map[from.charAt(i)] = to.charAt(i);
    }

    function removeAccents(s) {
      return s.toLowerCase().replace(/[\u00E0-\u00FC]/g, function (ch) {
        return map[ch] || ch;
      });
    }

    string1 = removeAccents(string1);
    string2 = removeAccents(string2);

    return string1 === string2;
  }
}

module.exports = new StringUtils()
