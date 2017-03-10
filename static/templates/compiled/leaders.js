;(function () {
  var x = Function('return this')();
  if (!x.fest)x.fest = {};
  module.exports = function (__fest_context) {
    "use strict";
    var __fest_self = this, __fest_buf = "", __fest_chunks = [], __fest_chunk, __fest_attrs = [], __fest_select, __fest_if, __fest_iterator, __fest_to, __fest_fn, __fest_html = "", __fest_blocks = {}, __fest_params, __fest_element, __fest_debug_file = "", __fest_debug_line = "", __fest_debug_block = "", __fest_element_stack = [], __fest_short_tags = {
      "area": true,
      "base": true,
      "br": true,
      "col": true,
      "command": true,
      "embed": true,
      "hr": true,
      "img": true,
      "input": true,
      "keygen": true,
      "link": true,
      "meta": true,
      "param": true,
      "source": true,
      "wbr": true
    }, __fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g, __fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/, __fest_htmlchars = /[&<>"]/g, __fest_htmlchars_test = /[&<>"]/, __fest_jshash = {
      "\"": "\\\"",
      "\\": "\\\\",
      "/": "\\/",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\b": "\\b",
      "\f": "\\f",
      "'": "\\'",
      "<": "\\u003C",
      ">": "\\u003E"
    }, __fest_htmlhash = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;"
    }, __fest_escapeJS = function __fest_escapeJS(value) {
      if (typeof value === 'string') {
        if (__fest_jschars_test.test(value)) {
          return value.replace(__fest_jschars, __fest_replaceJS);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceJS = function __fest_replaceJS(chr) {
      return __fest_jshash[chr];
    }, __fest_escapeHTML = function __fest_escapeHTML(value) {
      if (typeof value === 'string') {
        if (__fest_htmlchars_test.test(value)) {
          return value.replace(__fest_htmlchars, __fest_replaceHTML);
        }
      }

      return value == null ? '' : value;
    }, __fest_replaceHTML = function __fest_replaceHTML(chr) {
      return __fest_htmlhash[chr];
    }, __fest_extend = function __fest_extend(dest, src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dest[key] = src[key];
        }
      }
    }, __fest_param = function __fest_param(fn) {
      fn.param = true;
      return fn;
    }, i18n = __fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {
      return str;
    }, ___fest_log_error;
    if (typeof __fest_error === "undefined") {
      ___fest_log_error = (typeof console !== "undefined" && console.error) ? function () {
        return Function.prototype.apply.call(console.error, console, arguments)
      } : function () {
      };
    } else {
      ___fest_log_error = __fest_error
    }
    ;
    function __fest_log_error(msg) {
      ___fest_log_error(msg + "\nin block \"" + __fest_debug_block + "\" at line: " + __fest_debug_line + "\nfile: " + __fest_debug_file)
    }

    function __fest_call(fn, params, cp) {
      if (cp)for (var i in params)if (typeof params[i] == "function" && params[i].param)params[i] = params[i]();
      return fn.call(__fest_self, params)
    }

    var info = __fest_context;
    try {
      var active = {active: 'leaders', nick: info.username}
    } catch (e) {
      __fest_log_error(e.message);
    }
    var __fest_context0;
    try {
      __fest_context0 = active
    } catch (e) {
      __fest_context0 = {};
      __fest_log_error(e.message)
    }
    ;
    (function (__fest_context) {
      var info = __fest_context;
      __fest_buf += ("<div class=\"user-bar\">Вы вошли как ");
      try {
        __fest_buf += (__fest_escapeHTML(info.nick))
      } catch (e) {
        __fest_log_error(e.message + "2");
      }
      __fest_buf += ("</div><nav id=\"main-navigation\"><ul>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'play' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"play\" class=\"no-reload\" title=\"Играть\">Играть</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'leaders' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"leaders\" class=\"no-reload\" title=\"Лидерборд\">Лидерборд</a></li>");
      try {
        __fest_attrs[0] = __fest_escapeHTML(info.active === 'about' ? 'active-item' : '')
      } catch (e) {
        __fest_attrs[0] = "";
        __fest_log_error(e.message);
      }
      __fest_buf += ("<li class=\"" + __fest_attrs[0] + "\"><a href=\"about\" class=\"no-reload\" title=\"Об игре\">Об игре</a></li><li><a href=\"login\" class=\"no-reload logout-link\" title=\"Выйти\">Выйти</a></li></ul></nav>");
    })(__fest_context0);
    __fest_buf += ("<div id=\"main-content-container\"><div id=\"main-content\"><table id=\"leaderboard\"><col width=\"300\"/><col width=\"150\"/><col width=\"100\"/><thead><tr><th><a href=\"\">Игрок</a></th><th><a href=\"\">Уровень</a></th><th><a href=\"\">Рейтинг</a></th></tr></thead><tbody>");
    var i, v, __fest_to1, __fest_iterator1;
    try {
      __fest_iterator1 = info.leaders || [];
      __fest_to1 = __fest_iterator1.length;
    } catch (e) {
      __fest_iterator1 = [];
      __fest_to1 = 0;
      __fest_log_error(e.message);
    }
    for (i = 0; i < __fest_to1; i++) {
      v = __fest_iterator1[i];
      __fest_buf += ("<tr><td><a href=\"\">");
      try {
        __fest_buf += (__fest_escapeHTML(v.username))
      } catch (e) {
        __fest_log_error(e.message + "20");
      }
      __fest_buf += ("</a></td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(v.level))
      } catch (e) {
        __fest_log_error(e.message + "21");
      }
      __fest_buf += ("</td><td>");
      try {
        __fest_buf += (__fest_escapeHTML(v.rating))
      } catch (e) {
        __fest_log_error(e.message + "22");
      }
      __fest_buf += ("</td></tr>");
    }
    __fest_buf += ("</tbody></table></div></div>");
    __fest_to = __fest_chunks.length;
    if (__fest_to) {
      __fest_iterator = 0;
      for (; __fest_iterator < __fest_to; __fest_iterator++) {
        __fest_chunk = __fest_chunks[__fest_iterator];
        if (typeof __fest_chunk === "string") {
          __fest_html += __fest_chunk;
        } else {
          __fest_fn = __fest_blocks[__fest_chunk.name];
          if (__fest_fn) __fest_html += __fest_call(__fest_fn, __fest_chunk.params, __fest_chunk.cp);
        }
      }
      return __fest_html + __fest_buf;
    } else {
      return __fest_buf;
    }
  }
})();
