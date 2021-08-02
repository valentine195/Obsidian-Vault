'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var lexer = createCommonjsModule(function (module) {
module.exports = Lexer;

Lexer.defunct = function (chr) {
    throw new Error("Unexpected character at index " + (this.index - 1) + ": " + chr);
};

function Lexer(defunct) {
    if (typeof defunct !== "function") defunct = Lexer.defunct;

    var tokens = [];
    var rules = [];
    var remove = 0;
    this.state = 0;
    this.index = 0;
    this.input = "";

    this.addRule = function (pattern, action, start) {
        var global = pattern.global;

        if (!global) {
            var flags = "g";
            if (pattern.multiline) flags += "m";
            if (pattern.ignoreCase) flags += "i";
            pattern = new RegExp(pattern.source, flags);
        }

        if (Object.prototype.toString.call(start) !== "[object Array]") start = [0];

        rules.push({
            pattern: pattern,
            global: global,
            action: action,
            start: start
        });

        return this;
    };

    this.setInput = function (input) {
        remove = 0;
        this.state = 0;
        this.index = 0;
        tokens.length = 0;
        this.input = input;
        return this;
    };

    this.lex = function () {
        if (tokens.length) return tokens.shift();

        this.reject = true;

        while (this.index <= this.input.length) {
            var matches = scan.call(this).splice(remove);
            var index = this.index;

            while (matches.length) {
                if (this.reject) {
                    var match = matches.shift();
                    var result = match.result;
                    var length = match.length;
                    this.index += length;
                    this.reject = false;
                    remove++;

                    var token = match.action.apply(this, result);
                    if (this.reject) this.index = result.index;
                    else if (typeof token !== "undefined") {
                        switch (Object.prototype.toString.call(token)) {
                        case "[object Array]":
                            tokens = token.slice(1);
                            token = token[0];
                        default:
                            if (length) remove = 0;
                            return token;
                        }
                    }
                } else break;
            }

            var input = this.input;

            if (index < input.length) {
                if (this.reject) {
                    remove = 0;
                    var token = defunct.call(this, input.charAt(this.index++));
                    if (typeof token !== "undefined") {
                        if (Object.prototype.toString.call(token) === "[object Array]") {
                            tokens = token.slice(1);
                            return token[0];
                        } else return token;
                    }
                } else {
                    if (this.index !== index) remove = 0;
                    this.reject = true;
                }
            } else if (matches.length)
                this.reject = true;
            else break;
        }
    };

    function scan() {
        var matches = [];
        var index = 0;

        var state = this.state;
        var lastIndex = this.index;
        var input = this.input;

        for (var i = 0, length = rules.length; i < length; i++) {
            var rule = rules[i];
            var start = rule.start;
            var states = start.length;

            if ((!states || start.indexOf(state) >= 0) ||
                (state % 2 && states === 1 && !start[0])) {
                var pattern = rule.pattern;
                pattern.lastIndex = lastIndex;
                var result = pattern.exec(input);

                if (result && result.index === lastIndex) {
                    var j = matches.push({
                        result: result,
                        action: rule.action,
                        length: result[0].length
                    });

                    if (rule.global) index = j;

                    while (--j > index) {
                        var k = j - 1;

                        if (matches[j].length > matches[k].length) {
                            var temple = matches[j];
                            matches[j] = matches[k];
                            matches[k] = temple;
                        }
                    }
                }
            }
        }

        return matches;
    }
}
});

var moo = createCommonjsModule(function (module) {
(function(root, factory) {
  if (module.exports) {
    module.exports = factory();
  } else {
    root.moo = factory();
  }
}(commonjsGlobal, function() {

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var toString = Object.prototype.toString;
  var hasSticky = typeof new RegExp().sticky === 'boolean';

  /***************************************************************************/

  function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
  function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  function reGroups(s) {
    var re = new RegExp('|' + s);
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    if (!regexps.length) return '(?!)'
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|');
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
      if (obj.global) throw new Error('RegExp /g flag is implied')
      if (obj.sticky) throw new Error('RegExp /y flag is implied')
      if (obj.multiline) throw new Error('RegExp /m flag is implied')
      return obj.source

    } else {
      throw new Error('Not a pattern: ' + obj)
    }
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object);
    var result = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var thing = object[key];
      var rules = [].concat(thing);
      if (key === 'include') {
        for (var j = 0; j < rules.length; j++) {
          result.push({include: rules[j]});
        }
        continue
      }
      var match = [];
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match));
          result.push(ruleOptions(key, rule));
          match = [];
        } else {
          match.push(rule);
        }
      });
      if (match.length) result.push(ruleOptions(key, match));
    }
    return result
  }

  function arrayToRules(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      if (obj.include) {
        var include = [].concat(obj.include);
        for (var j = 0; j < include.length; j++) {
          result.push({include: include[j]});
        }
        continue
      }
      if (!obj.type) {
        throw new Error('Rule has no type: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.type, obj));
    }
    return result
  }

  function ruleOptions(type, obj) {
    if (!isObject(obj)) {
      obj = { match: obj };
    }
    if (obj.include) {
      throw new Error('Matching rules cannot also include states')
    }

    // nb. error and fallback imply lineBreaks
    var options = {
      defaultType: type,
      lineBreaks: !!obj.error || !!obj.fallback,
      pop: false,
      next: null,
      push: null,
      error: false,
      fallback: false,
      value: null,
      type: null,
      shouldThrow: false,
    };

    // Avoid Object.assign(), so we support IE9+
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        options[key] = obj[key];
      }
    }

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
      throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    var match = options.match;
    options.match = Array.isArray(match) ? match : match ? [match] : [];
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    });
    return options
  }

  function toRules(spec) {
    return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
  }

  var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true});
  function compileRules(rules, hasStates) {
    var errorRule = null;
    var fast = Object.create(null);
    var fastAllowed = true;
    var unicodeFlag = null;
    var groups = [];
    var parts = [];

    // If there is a fallback rule, then disable fast matching
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].fallback) {
        fastAllowed = false;
      }
    }

    for (var i = 0; i < rules.length; i++) {
      var options = rules[i];

      if (options.include) {
        // all valid inclusions are removed by states() preprocessor
        throw new Error('Inheritance is not allowed in stateless lexers')
      }

      if (options.error || options.fallback) {
        // errorRule can only be set once
        if (errorRule) {
          if (!options.fallback === !errorRule.fallback) {
            throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
          } else {
            throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
          }
        }
        errorRule = options;
      }

      var match = options.match.slice();
      if (fastAllowed) {
        while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
          var word = match.shift();
          fast[word.charCodeAt(0)] = options;
        }
      }

      // Warn about inappropriate state-switching options
      if (options.pop || options.push || options.next) {
        if (!hasStates) {
          throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
        }
        if (options.fallback) {
          throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
        }
      }

      // Only rules with a .match are included in the RegExp
      if (match.length === 0) {
        continue
      }
      fastAllowed = false;

      groups.push(options);

      // Check unicode flag is used everywhere or nowhere
      for (var j = 0; j < match.length; j++) {
        var obj = match[j];
        if (!isRegExp(obj)) {
          continue
        }

        if (unicodeFlag === null) {
          unicodeFlag = obj.unicode;
        } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
          throw new Error('If one rule is /u then all must be')
        }
      }

      // convert to RegExp
      var pat = reUnion(match.map(regexpOrLiteral));

      // validate
      var regexp = new RegExp(pat);
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat);
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat));
    }


    // If there's no fallback rule, use the sticky flag so we only look for
    // matches at the current index.
    //
    // If we don't support the sticky flag, then fake it using an irrefutable
    // match (i.e. an empty pattern).
    var fallbackRule = errorRule && errorRule.fallback;
    var flags = hasSticky && !fallbackRule ? 'ym' : 'gm';
    var suffix = hasSticky || fallbackRule ? '' : '|';

    if (unicodeFlag === true) flags += "u";
    var combined = new RegExp(reUnion(parts) + suffix, flags);
    return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
  }

  function compile(rules) {
    var result = compileRules(toRules(rules));
    return new Lexer({start: result}, 'start')
  }

  function checkStateGroup(g, name, map) {
    var state = g && (g.push || g.next);
    if (state && !map[state]) {
      throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
      throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
  }
  function compileStates(states, start) {
    var all = states.$all ? toRules(states.$all) : [];
    delete states.$all;

    var keys = Object.getOwnPropertyNames(states);
    if (!start) start = keys[0];

    var ruleMap = Object.create(null);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      ruleMap[key] = toRules(states[key]).concat(all);
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var rules = ruleMap[key];
      var included = Object.create(null);
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (!rule.include) continue
        var splice = [j, 1];
        if (rule.include !== key && !included[rule.include]) {
          included[rule.include] = true;
          var newRules = ruleMap[rule.include];
          if (!newRules) {
            throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
          }
          for (var k = 0; k < newRules.length; k++) {
            var newRule = newRules[k];
            if (rules.indexOf(newRule) !== -1) continue
            splice.push(newRule);
          }
        }
        rules.splice.apply(rules, splice);
        j--;
      }
    }

    var map = Object.create(null);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      map[key] = compileRules(ruleMap[key], true);
    }

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      var state = map[name];
      var groups = state.groups;
      for (var j = 0; j < groups.length; j++) {
        checkStateGroup(groups[j], name, map);
      }
      var fastKeys = Object.getOwnPropertyNames(state.fast);
      for (var j = 0; j < fastKeys.length; j++) {
        checkStateGroup(state.fast[fastKeys[j]], name, map);
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {
    var reverseMap = Object.create(null);
    var byLength = Object.create(null);
    var types = Object.getOwnPropertyNames(map);
    for (var i = 0; i < types.length; i++) {
      var tokenType = types[i];
      var item = map[tokenType];
      var keywordList = Array.isArray(item) ? item : [item];
      keywordList.forEach(function(keyword) {
        (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword);
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        reverseMap[keyword] = tokenType;
      });
    }

    // fast string lookup
    // https://jsperf.com/string-lookups
    function str(x) { return JSON.stringify(x) }
    var source = '';
    source += 'switch (value.length) {\n';
    for (var length in byLength) {
      var keywords = byLength[length];
      source += 'case ' + length + ':\n';
      source += 'switch (value) {\n';
      keywords.forEach(function(keyword) {
        var tokenType = reverseMap[keyword];
        source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n';
      });
      source += '}\n';
    }
    source += '}\n';
    return Function('value', source) // type
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state;
    this.states = states;
    this.buffer = '';
    this.stack = [];
    this.reset();
  };

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || '';
    this.index = 0;
    this.line = info ? info.line : 1;
    this.col = info ? info.col : 1;
    this.queuedToken = info ? info.queuedToken : null;
    this.queuedThrow = info ? info.queuedThrow : null;
    this.setState(info ? info.state : this.startState);
    this.stack = info && info.stack ? info.stack.slice() : [];
    return this
  };

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: this.stack.slice(),
      queuedToken: this.queuedToken,
      queuedThrow: this.queuedThrow,
    }
  };

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state;
    var info = this.states[state];
    this.groups = info.groups;
    this.error = info.error;
    this.re = info.regexp;
    this.fast = info.fast;
  };

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop());
  };

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state);
    this.setState(state);
  };

  var eat = hasSticky ? function(re, buffer) { // assume re is /y
    return re.exec(buffer)
  } : function(re, buffer) { // assume re is /g
    var match = re.exec(buffer);
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  };

  Lexer.prototype._getGroup = function(match) {
    var groupCount = this.groups.length;
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i]
      }
    }
    throw new Error('Cannot find token type for matched text')
  };

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var index = this.index;

    // If a fallback token matched, we don't need to re-run the RegExp
    if (this.queuedGroup) {
      var token = this._token(this.queuedGroup, this.queuedText, index);
      this.queuedGroup = null;
      this.queuedText = "";
      return token
    }

    var buffer = this.buffer;
    if (index === buffer.length) {
      return // EOF
    }

    // Fast matching for single characters
    var group = this.fast[buffer.charCodeAt(index)];
    if (group) {
      return this._token(group, buffer.charAt(index), index)
    }

    // Execute RegExp
    var re = this.re;
    re.lastIndex = index;
    var match = eat(re, buffer);

    // Error tokens match the remaining buffer
    var error = this.error;
    if (match == null) {
      return this._token(error, buffer.slice(index, buffer.length), index)
    }

    var group = this._getGroup(match);
    var text = match[0];

    if (error.fallback && match.index !== index) {
      this.queuedGroup = group;
      this.queuedText = text;

      // Fallback tokens contain the unmatched portion of the buffer
      return this._token(error, buffer.slice(index, match.index), index)
    }

    return this._token(group, text, index)
  };

  Lexer.prototype._token = function(group, text, offset) {
    // count line breaks
    var lineBreaks = 0;
    if (group.lineBreaks) {
      var matchNL = /\n/g;
      var nl = 1;
      if (text === '\n') {
        lineBreaks = 1;
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex; }
      }
    }

    var token = {
      type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
      value: typeof group.value === 'function' ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: offset,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    };
    // nb. adding more props to token object will make V8 sad!

    var size = text.length;
    this.index += size;
    this.line += lineBreaks;
    if (lineBreaks !== 0) {
      this.col = size - nl + 1;
    } else {
      this.col += size;
    }

    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      throw new Error(this.formatError(token, "invalid syntax"))
    }

    if (group.pop) this.popState();
    else if (group.push) this.pushState(group.push);
    else if (group.next) this.setState(group.next);

    return token
  };

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer;
    };

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next();
      return {value: token, done: !token}
    };

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    };

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    };
  }

  Lexer.prototype.formatError = function(token, message) {
    if (token == null) {
      // An undefined token indicates EOF
      var text = this.buffer.slice(this.index);
      var token = {
        text: text,
        offset: this.index,
        lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
        line: this.line,
        col: this.col,
      };
    }
    var start = Math.max(0, token.offset - token.col + 1);
    var eol = token.lineBreaks ? token.text.indexOf('\n') : token.text.length;
    var firstLine = this.buffer.substring(start, token.offset + eol);
    message += " at line " + token.line + " col " + token.col + ":\n\n";
    message += "  " + firstLine + "\n";
    message += "  " + Array(token.col).join(" ") + "^";
    return message
  };

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  };

  Lexer.prototype.has = function(tokenType) {
    return true
  };


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
    fallback: Object.freeze({fallback: true}),
    keywords: keywordTransform,
  }

}));
});

var moo$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), moo, {
    'default': moo
}));

/*!
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faDice = {
  prefix: 'fas',
  iconName: 'dice',
  icon: [640, 512, [], "f522", "M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"]
};

/*!
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var noop = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {},
    _ref$userAgent = _ref.userAgent,
    userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var PERFORMANCE = _PERFORMANCE;
!!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
(function () {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
})();
var DUOTONE_CLASSES = {
  GROUP: 'group',
  SWAP_OPACITY: 'swap-opacity',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

var initial = WINDOW.FontAwesomeConfig || {};

function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector('script[' + attr + ']');

  if (element) {
    return element.getAttribute(attr);
  }
}

function coerce(val) {
  // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
  // We'll assume that this is an indication that it should be toggled to true
  // For example <script data-search-pseudo-elements src="..."></script>
  if (val === '') return true;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return val;
}

if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
  var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
  attrs.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        key = _ref2[1];

    var val = coerce(getAttrConfig(attr));

    if (val !== undefined && val !== null) {
      initial[key] = val;
    }
  });
}

var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: 'async',
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};

var _config = _objectSpread({}, _default, initial);

if (!_config.autoReplaceSvg) _config.observeMutations = false;

var config = _objectSpread({}, _config);

WINDOW.FontAwesomeConfig = config;

var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];

var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();

    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);
  return css;
}
var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }

  return id;
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
  }, '').trim();
}
function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = 'black';
  }

  return abstract;
}

function deGroup(abstract) {
  if (abstract.tag === 'g') {
    return abstract.children;
  } else {
    return [abstract];
  }
}

function makeIconMasking (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      explicitMaskId = _ref.maskId,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;
  var trans = transformForSvg({
    transform: transform,
    containerWidth: maskWidth,
    iconWidth: mainWidth
  });
  var maskRect = {
    tag: 'rect',
    attributes: _objectSpread({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroupChildrenMixin = mainPath.children ? {
    children: mainPath.children.map(fillBlack)
  } : {};
  var maskInnerGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.inner),
    children: [fillBlack(_objectSpread({
      tag: mainPath.tag,
      attributes: _objectSpread({}, mainPath.attributes, trans.path)
    }, maskInnerGroupChildrenMixin))]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
  var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
  var maskTag = {
    tag: 'mask',
    attributes: _objectSpread({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{
      tag: 'clipPath',
      attributes: {
        id: clipId
      },
      children: deGroup(maskPath)
    }, maskTag]
  };
  children.push(defs, {
    tag: 'rect',
    attributes: _objectSpread({
      fill: 'currentColor',
      'clip-path': "url(#".concat(clipId, ")"),
      mask: "url(#".concat(maskId, ")")
    }, ALL_SPACE)
  });
  return {
    children: children,
    attributes: attributes
  };
}

function makeIconStandard (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;
  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({
      transform: transform,
      containerWidth: main.width,
      iconWidth: main.width
    });
    children.push({
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _objectSpread({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
}

function asIcon (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_objectSpread({}, styles, {
      'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
}

function asSymbol (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _objectSpread({}, attributes, {
        id: id
      }),
      children: children
    }]
  }];
}

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      maskId = params.maskId,
      titleId = params.titleId,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === void 0 ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var isUploadedIcon = prefix === 'fak';
  var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function (c) {
    return c !== '' || !!c;
  }).concat(extra.classes).join(' ');
  var content = {
    children: [],
    attributes: _objectSpread({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': extra.attributes.role || 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({
    tag: 'title',
    attributes: {
      id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
    },
    children: [title]
  });

  var args = _objectSpread({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    maskId: maskId,
    transform: transform,
    symbol: symbol,
    styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}

var noop$1 = function noop() {};

config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */

var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */


var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks,
      skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

var styles = namespace.styles,
    shims = namespace.shims;
var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  lookup(function (acc, icon, iconName) {
    if (icon[3]) {
      acc[icon[3]] = iconName;
    }

    return acc;
  });
  lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];
    acc[iconName] = iconName;
    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });
    return acc;
  });
  var hasRegular = 'far' in styles;
  reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = {
      prefix: prefix,
      iconName: iconName
    };
    return acc;
  }, {});
};
build();

namespace.styles;
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
  }
}

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}
MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = {
  fill: 'currentColor'
};
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
});

var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});

({
  tag: 'circle',
  attributes: _objectSpread({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'r',
      values: '28;14;28;28;14;28;'
    })
  }, {
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;1;1;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;0;0;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '0;0;1;1;0;0;'
    })
  }]
});

namespace.styles;
function asFoundIcon(icon) {
  var width = icon[0];
  var height = icon[1];

  var _icon$slice = icon.slice(4),
      _icon$slice2 = _slicedToArray(_icon$slice, 1),
      vectorData = _icon$slice2[0];

  var element = null;

  if (Array.isArray(vectorData)) {
    element = {
      tag: 'g',
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: 'currentColor',
          d: vectorData[0]
        }
      }, {
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: 'currentColor',
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: 'path',
      attributes: {
        fill: 'currentColor',
        d: vectorData
      }
    };
  }

  return {
    found: true,
    width: width,
    height: height,
    icon: element
  };
}

namespace.styles;

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

function css () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
    var rPatt = new RegExp("\\.".concat(drc), 'g');
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }

  return s;
}

var Library =
/*#__PURE__*/
function () {
  function Library() {
    _classCallCheck(this, Library);

    this.definitions = {};
  }

  _createClass(Library, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
        defineIcons(key, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;
        if (!additions[prefix]) additions[prefix] = {};
        additions[prefix][iconName] = icon;
      });
      return additions;
    }
  }]);

  return Library;
}();

function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());

    _cssInserted = true;
  }
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });
  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;
      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}

function findIconDefinition(iconLookup) {
  var _iconLookup$prefix = iconLookup.prefix,
      prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
      iconName = iconLookup.iconName;
  if (!iconName) return;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _objectSpread({}, params, {
      mask: mask
    }));
  };
}

var library = new Library();
var _cssInserted = false;
var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === void 0 ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === void 0 ? null : _params$mask,
      _params$maskId = params.maskId,
      maskId = _params$maskId === void 0 ? null : _params$maskId,
      _params$title = params.title,
      title = _params$title === void 0 ? null : _params$title,
      _params$titleId = params.titleId,
      titleId = _params$titleId === void 0 ? null : _params$titleId,
      _params$classes = params.classes,
      classes = _params$classes === void 0 ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === void 0 ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;
  return apiObject(_objectSpread({
    type: 'icon'
  }, iconDefinition), function () {
    ensureCss();

    if (config.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes['aria-hidden'] = 'true';
        attributes['focusable'] = 'false';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _objectSpread({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      maskId: maskId,
      titleId: titleId,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});

const MATCH = /^\|?([\s\S]+?)\|?$/;
const SPLIT = /\|/;
function extract(content) {
    const lines = content.split("\n");
    const inner = lines.map((l) => { var _a; return ((_a = l.trim().match(MATCH)) !== null && _a !== void 0 ? _a : [, l.trim()])[1]; });
    const headers = inner[0].split(SPLIT);
    const rows = [];
    const ret = [];
    for (let index in headers) {
        let header = headers[index];
        if (!header.trim().length)
            header = index;
        ret.push([header.trim(), []]);
    }
    for (let line of lines.slice(2)) {
        const entries = line
            .trim()
            .split(SPLIT)
            .map((e) => e.trim())
            .filter((e) => e.length);
        rows.push(entries.join(" | "));
        for (let index in entries) {
            const entry = entries[index].trim();
            if (!entry.length || !ret[index])
                continue;
            ret[index][1].push(entry);
        }
    }
    return {
        columns: Object.fromEntries(ret),
        rows: rows
    };
}
/**
 * Inserts a new result into a results map.
 *
 * @private
 * @param {ResultMapInterface} map Results map to modify.
 * @param {number} index Index to insert the new value.
 * @param {ResultInterface} value Value to insert.
 * @memberof DiceRoll
 */
function _insertIntoMap(map, index, value) {
    /** Get all values above index, then reverse them */
    let toUpdate = [...map].slice(index).reverse();
    /** Loop through the values and re-insert them into the map at key + 1 */
    toUpdate.forEach(([key, value]) => {
        map.set(key + 1, value);
    });
    /** Insert the new value at the specified index */
    map.set(index, value);
}
function _getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function _checkCondition(value, conditions) {
    return conditions.every(({ operator, comparer }) => {
        if (Number.isNaN(value) || Number.isNaN(comparer)) {
            return false;
        }
        let result = false;
        switch (operator) {
            case "=":
                result = value === comparer;
                break;
            case "!=":
            case "=!":
                result = value !== comparer;
                break;
            case "<":
                result = value < comparer;
                break;
            case "<=":
                result = value <= comparer;
                break;
            case ">":
                result = value > comparer;
                break;
            case ">=":
                result = value >= comparer;
                break;
        }
        return result;
    });
}

class DiceRoll {
    constructor(dice) {
        this.modifiers = [];
        this.modifiersAllowed = true;
        this.static = false;
        if (!/(\-?\d+)[dD]?(\d+|%|\[\d+,\s?\d+\])?/.test(dice)) {
            throw new Error("Non parseable dice string passed to DiceRoll.");
        }
        this.dice = dice.split(" ").join("");
        if (/^-?\d+$/.test(this.dice)) {
            this.static = true;
            this.modifiersAllowed = false;
        }
        let [, rolls, min = null, max = 1] = this.dice.match(/(\-?\d+)[dD]\[?(?:(-?\d+)\s?,)?\s?(-?\d+|%|F)\]?/) || [, 1, null, 1];
        this.rolls = Number(rolls) || 1;
        if (Number(max) < 0 && !min) {
            min = -1;
        }
        if (max === "%")
            max = 100;
        if (max === "F") {
            max = 1;
            min = -1;
        }
        if (Number(max) < Number(min)) {
            [max, min] = [min, max];
        }
        this.faces = { max: max ? Number(max) : 1, min: min ? Number(min) : 1 };
        this.originalRoll = this.roll();
        this.results = new Map([...this.originalRoll].map((n, i) => {
            return [i, { usable: true, value: n, modifiers: new Set() }];
        }));
    }
    get text() {
        return `${this.result}`;
    }
    get result() {
        if (this.static) {
            return Number(this.dice);
        }
        const results = [...this.results].map(([, { usable, value }]) => usable ? value : 0);
        return results.reduce((a, b) => a + b, 0);
    }
    get display() {
        if (this.static) {
            return `${this.result}`;
        }
        return `[${[...this.results]
            .map(([, { modifiers, value }]) => `${value}${[...modifiers].join("")}`)
            .join(", ")}]`;
    }
    keepLow(drop = 1) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        [...this.results]
            .sort((a, b) => a[1].value - b[1].value)
            .slice(drop - this.results.size)
            .forEach(([index]) => {
            const previous = this.results.get(index);
            previous.usable = false;
            previous.modifiers.add("d");
            this.results.set(index, Object.assign({}, previous));
        });
    }
    keepHigh(drop = 1) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        [...this.results]
            .sort((a, b) => b[1].value - a[1].value)
            .slice(drop)
            .forEach(([index]) => {
            const previous = this.results.get(index);
            previous.usable = false;
            previous.modifiers.add("d");
            this.results.set(index, Object.assign({}, previous));
        });
    }
    reroll(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.min
            });
        }
        /**
         * Find values that pass the conditional.
         */
        let i = 0, toReroll = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        while (i < times &&
            toReroll.filter(([, { value }]) => _checkCondition(value, conditionals)).length > 0) {
            i++;
            toReroll.map(([, roll]) => {
                roll.modifiers.add("r");
                roll.value = _getRandomBetween(this.faces.min, this.faces.max);
            });
        }
        toReroll.forEach(([index, value]) => {
            this.results.set(index, value);
        });
    }
    explodeAndCombine(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.max
            });
        }
        /**
         * Find values that pass the conditional
         */
        let i = 0, toExplode = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        toExplode.forEach(([index, value]) => {
            let newRoll = _getRandomBetween(this.faces.min, this.faces.max);
            i++;
            value.modifiers.add("!");
            value.value += newRoll;
            this.results.set(index, value);
            while (i < times && _checkCondition(newRoll, conditionals)) {
                i++;
                newRoll = _getRandomBetween(this.faces.min, this.faces.max);
                value.value += newRoll;
                this.results.set(index, value);
            }
        });
    }
    explode(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.max
            });
        }
        /**
         * Find values that pass the conditional
         */
        let toExplode = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        /** Track how many have been inserted */
        let inserted = 0;
        /** Loop through values that need to explode */
        toExplode.forEach(([key, value]) => {
            /** newRoll is the new value to check against the max face value */
            let newRoll = value.value;
            /** i tracks how many times this roll has been exploded */
            let i = 0;
            /**
             * Explode max rolls.
             */
            while (i < times && _checkCondition(newRoll, conditionals)) {
                let previous = this.results.get(key + inserted + i);
                previous.modifiers.add("!");
                newRoll = _getRandomBetween(this.faces.min, this.faces.max);
                /** Insert the new roll into the results map */
                _insertIntoMap(this.results, key + inserted + i + 1, {
                    usable: true,
                    value: newRoll,
                    modifiers: new Set()
                });
                i++;
            }
            /** Update how many have been inserted. */
            inserted += i;
        });
    }
    roll() {
        if (this.static) {
            return [Number(this.dice)];
        }
        return [...Array(this.rolls)].map(() => _getRandomBetween(this.faces.min, this.faces.max));
    }
}
class StuntRoll extends DiceRoll {
    constructor(dice) {
        super(`3d6`);
        this.dice = dice;
    }
    get doubles() {
        return (new Set([...this.results].map(([, { usable, value }]) => usable ? value : 0)).size < 3);
    }
    get display() {
        let str = [];
        for (let result of this.results) {
            if (result[0] == 0 && this.doubles) {
                str.push(`${result[1].value}S`);
                continue;
            }
            str.push(`${result[1].value}`);
        }
        return `[${str.join(", ")}]`;
    }
}
class TableRoll {
    constructor(rolls, options, text, link, block) {
        this.rolls = rolls;
        this.options = options;
        this.text = text;
        this.link = link;
        this.block = block;
        this.roll();
    }
    get result() {
        return this.resultArray.join("|");
    }
    get display() {
        return `${this.result}`;
    }
    roll() {
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[_getRandomBetween(0, this.options.length - 1)]));
    }
}
class SectionRoller extends obsidian.Events {
    constructor(rolls = 1, options, content, file) {
        super();
        this.rolls = rolls;
        this.options = options;
        this.content = content;
        this.file = file;
        this.selected = new Set();
        if (!rolls)
            this.rolls = 1;
        this.roll();
    }
    get text() {
        return this.display;
    }
    get result() {
        return this.resultArray[0];
    }
    get display() {
        let res = this.content
            .get(this.file)
            .slice(this.result.position.start.offset, this.result.position.end.offset);
        return `${res}`;
    }
    displayFromCache(cache) {
        let res = this.content
            .get(cache.file)
            .slice(cache.position.start.offset, cache.position.end.offset);
        return `${res}`;
    }
    get remaining() {
        return this.options.filter((o) => !this.selected.has(o));
    }
    element(parent) {
        parent.empty();
        const holder = parent.createDiv();
        for (let result of Array.from(this.selected)) {
            const resultEl = holder.createDiv();
            if (this.content.size > 1) {
                resultEl.createEl("h5", {
                    cls: "dice-file-name",
                    text: result.file
                });
            }
            resultEl.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                if ((evt && evt.getModifierState("Control")) ||
                    evt.getModifierState("Meta")) {
                    evt.stopPropagation();
                    this.trigger("open-link", result.file);
                    return;
                }
            });
            const ret = resultEl.createDiv({
                cls: "markdown-embed"
            });
            if (!result) {
                ret.createDiv({
                    cls: "dice-no-results",
                    text: "No results."
                });
                continue;
            }
            const embed = ret.createDiv({
                attr: {
                    "aria-label": `${result.file}: ${result.type}`
                }
            });
            obsidian.MarkdownRenderer.renderMarkdown(this.displayFromCache(result), embed, "", null);
        }
        holder.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
            evt.stopPropagation();
            this.roll();
            this.element(parent);
        });
        return holder;
    }
    roll() {
        this.selected = new Set();
        this.resultArray = [...Array(this.rolls)].map(() => {
            const choice = this.remaining[_getRandomBetween(0, this.remaining.length - 1)];
            this.selected.add(choice);
            return choice;
        });
        return this.resultArray;
    }
}
class FileRoller {
    constructor(rolls = 1, options, cache) {
        this.rolls = rolls;
        this.options = options;
        this.cache = cache;
        if (!rolls)
            this.rolls = 1;
        this.roll();
    }
    get result() {
        return this.resultArray[0];
    }
    get text() {
        return "";
    }
    get display() {
        return this.result;
    }
    element(sourcePath = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.cache.getFirstLinkpathDest(this.display, sourcePath);
            /* return  */ const link = createEl("a", {
                cls: "internal-link",
                text: file.basename
            });
            return link;
        });
    }
    roll() {
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[_getRandomBetween(0, this.options.length - 1)]));
    }
}

class Parser {
    constructor(table) {
        this.table = table;
    }
    parse(input) {
        var length = input.length, table = this.table, output = [], stack = [], index = 0;
        while (index < length) {
            var token = input[index++];
            switch (token.data) {
                case "(":
                    stack.unshift(token);
                    break;
                case ")":
                    while (stack.length) {
                        var token = stack.shift();
                        if (token.data === "(")
                            break;
                        else
                            output.push(token);
                    }
                    if (token.data !== "(")
                        throw new Error("Mismatched parentheses.");
                    break;
                default:
                    if (table.hasOwnProperty(token.data)) {
                        while (stack.length) {
                            var punctuator = stack[0];
                            if (punctuator.data === "(")
                                break;
                            var operator = table[token.data], precedence = operator.precedence, antecedence = table[punctuator.data].precedence;
                            if (precedence > antecedence ||
                                (precedence === antecedence &&
                                    operator.associativity === "right"))
                                break;
                            else
                                output.push(stack.shift());
                        }
                        stack.unshift(token);
                    }
                    else
                        output.push(token);
            }
        }
        while (stack.length) {
            var token = stack.shift();
            if (token.data !== "(")
                output.push(token);
            else
                throw new Error("Mismatched parentheses.");
        }
        return output;
    }
}

const TAG_REGEX = /(?:(\d+)[Dd])?(#[\p{Letter}\p{Emoji_Presentation}\w/-]+)(?:\|([\+-]))?(?:\|([^\+-]+))?/u;
const TABLE_REGEX = /(?:(\d+)[Dd])?\[\[([\s\S]+?)#?\^([\s\S]+?)\]\]\|?([\s\S]+)?/;
const SECTION_REGEX = /(?:(\d+)[Dd])?\[\[([\s\S]+)\]\]\|?([\s\S]+)?/;
const MATH_REGEX = /[\(\^\+\-\*\/\)]/;

class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.plugin = plugin;
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            let { containerEl } = this;
            containerEl.empty();
            containerEl.createEl("h2", { text: "Dice Roller Settings" });
            new obsidian.Setting(containerEl)
                .setName("Roll All Files for Tags")
                .setDesc("Return a result for each file when rolling tags.")
                .addToggle((t) => {
                t.setValue(this.plugin.returnAllTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.returnAllTags = v;
                    yield this.plugin.saveData({
                        returnAllTags: this.plugin.returnAllTags,
                        rollLinksForTags: this.plugin.rollLinksForTags
                    });
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Always Return Links for Tags")
                .setDesc("Enables random link rolling with the link parameter. Override by specifying a section type.")
                .addToggle((t) => {
                t.setValue(this.plugin.rollLinksForTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.rollLinksForTags = v;
                    yield this.plugin.saveData({
                        returnAllTags: this.plugin.returnAllTags,
                        rollLinksForTags: this.plugin.rollLinksForTags
                    });
                }));
            });
        });
    }
}

console.log("🚀 ~ file: main.ts ~ line 13 ~ moo", moo$1);
String.prototype.matchAll =
    String.prototype.matchAll ||
        function* matchAll(regexp) {
            const flags = regexp.global ? regexp.flags : regexp.flags + "g";
            const re = new RegExp(regexp, flags);
            let match;
            while ((match = re.exec(this))) {
                yield match;
            }
        };
class DiceRoller extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "^": (a, b) => {
                return Math.pow(a, b);
            }
        };
    }
    onload() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DiceRoller plugin loaded");
            const data = Object.assign({
                returnAllTags: true,
                rollLinksForTags: false
            }, yield this.loadData());
            this.returnAllTags = (_a = data.returnAllTags) !== null && _a !== void 0 ? _a : true;
            this.rollLinksForTags = (_b = data.rollLinksForTags) !== null && _b !== void 0 ? _b : false;
            this.addSettingTab(new SettingTab(this.app, this));
            const ICON_DEFINITION = Symbol("dice-roller-icon").toString();
            const ICON_SVG = icon(faDice).html[0];
            obsidian.addIcon(ICON_DEFINITION, ICON_SVG);
            this.registerMarkdownPostProcessor((el, ctx) => __awaiter(this, void 0, void 0, function* () {
                let nodeList = el.querySelectorAll("code");
                if (!nodeList.length)
                    return;
                for (const node of Array.from(nodeList)) {
                    if (!/^dice:\s*([\s\S]+)\s*?/.test(node.innerText))
                        return;
                    try {
                        let [, content] = node.innerText.match(/^dice:\s*([\s\S]+)\s*?/);
                        let { text, link, renderMap, tableMap, type, fileMap } = yield this.parseDice(content);
                        let container = createDiv().createDiv({
                            cls: "dice-roller",
                            attr: {
                                "aria-label": `${content}\n${text}`,
                                "aria-label-position": "top",
                                "data-dice": content
                            }
                        });
                        if (type === "render") {
                            container.addClasses([
                                "has-embed",
                                "markdown-embed"
                            ]);
                        }
                        let resultEl = container.createDiv();
                        this.reroll(null, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                        const icon = container.createDiv({
                            cls: "dice-roller-button"
                        });
                        obsidian.setIcon(icon, ICON_DEFINITION);
                        node.replaceWith(container);
                        container.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                        icon.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                    }
                    catch (e) {
                        console.error(e);
                        new obsidian.Notice(`There was an error parsing the dice string: ${node.innerText}.\n\n${e}`, 5000);
                        return;
                    }
                }
            }));
            this.lexer = new lexer();
            this.addLexerRules();
            var exponent = {
                precedence: 3,
                associativity: "right"
            };
            var factor = {
                precedence: 2,
                associativity: "left"
            };
            var term = {
                precedence: 1,
                associativity: "left"
            };
            this.parser = new Parser({
                "+": term,
                "-": term,
                "*": factor,
                "/": factor,
                "^": exponent
            });
        });
    }
    reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, sourcePath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            resultEl.empty();
            if (type === "dice") {
                let { result, text } = yield this.parseDice(content);
                container.setAttrs({
                    "aria-label": `${content}\n${text}`
                });
                resultEl.setText(result.toLocaleString(navigator.language, {
                    maximumFractionDigits: 2
                }));
            }
            else if (type === "table") {
                if (link && evt && evt.getModifierState("Control")) {
                    yield this.app.workspace.openLinkText(link.replace("^", "#^").split(/\|/).shift(), (_a = this.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path, true);
                    return;
                }
                resultEl.empty();
                tableMap.roll();
                const split = tableMap.result.split(/(\[\[(?:[\s\S]+?)\]\])/);
                for (let str of split) {
                    if (/\[\[(?:[\s\S]+?)\]\]/.test(str)) {
                        //link;
                        const [, match] = str.match(/\[\[([\s\S]+?)\]\]/);
                        const internal = resultEl.createEl("a", {
                            cls: "internal-link",
                            text: match
                        });
                        internal.onmouseover = () => {
                            var _a;
                            this.app.workspace.trigger("link-hover", this, //not sure
                            internal, //targetEl
                            match.replace("^", "#^").split("|").shift(), //linkText
                            (_a = this.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path //source
                            );
                        };
                        internal.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            ev.stopPropagation();
                            yield this.app.workspace.openLinkText(match.replace("^", "#^").split(/\|/).shift(), (_b = this.app.workspace.getActiveFile()) === null || _b === void 0 ? void 0 : _b.path, ev.getModifierState("Control"));
                        });
                        continue;
                    }
                    resultEl.createSpan({ text: str });
                }
            }
            else if (type === "render") {
                resultEl.empty();
                resultEl.addClass("internal-embed");
                for (let [file, elements] of Array.from(renderMap)) {
                    const holder = resultEl.createDiv({
                        attr: {
                            "aria-label": file
                        }
                    });
                    if (renderMap.size > 1) {
                        holder.createEl("h5", {
                            cls: "dice-file-name",
                            text: file
                        });
                    }
                    for (let el of elements) {
                        el.roll();
                        el.element(holder.createDiv());
                        el.on("open-link", (link) => __awaiter(this, void 0, void 0, function* () {
                            var _c;
                            if (link) {
                                yield this.app.workspace.openLinkText(link.replace("^", "#^").split(/\|/).shift(), (_c = this.app.workspace.getActiveFile()) === null || _c === void 0 ? void 0 : _c.path, true);
                            }
                        }));
                    }
                }
            }
            else if (type === "file") {
                fileMap.roll();
                container.setAttrs({
                    "aria-label": `${content}\n${fileMap.display}`
                });
                const link = yield fileMap.element(sourcePath);
                link.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _d;
                    evt.stopPropagation();
                    this.app.workspace.openLinkText(fileMap.result.replace("^", "#^").split(/\|/).shift(), (_d = this.app.workspace.getActiveFile()) === null || _d === void 0 ? void 0 : _d.path, true);
                });
                link.onmouseenter = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _e;
                    this.app.workspace.trigger("link-hover", this, //not sure
                    link, //targetEl
                    fileMap.result, //linkText
                    (_e = this.app.workspace.getActiveFile()) === null || _e === void 0 ? void 0 : _e.path //source
                    );
                });
                resultEl.empty();
                resultEl.appendChild(link);
            }
        });
    }
    addLexerRules() {
        this.lexer.addRule(/\s+/, function () {
            /* skip whitespace */
        });
        this.lexer.addRule(/[{}]+/, function () {
            /* skip brackets */
        });
        this.lexer.addRule(MATH_REGEX, function (lexeme) {
            return {
                type: "math",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(TABLE_REGEX, function (lexeme) {
            return {
                type: "table",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(SECTION_REGEX, function (lexeme) {
            return {
                type: "section",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(TAG_REGEX, function (lexeme) {
            return {
                type: "tag",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/(\d+)([Dd]\[?(?:(-?\d+)\s?,)?\s?(-?\d+|%|F)\]?)?/, function (lexeme) {
            let [, dice] = lexeme.match(/(\d+(?:[Dd]?\[?(?:-?\d+\s?,)?\s?(?:-?\d+|%|F)\]?)?)/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            return {
                type: "dice",
                data: dice,
                original: lexeme,
                conditionals: conditionals
            }; // symbols
        });
        this.lexer.addRule(/1[Dd]S/, function (lexeme) {
            var _a;
            const [, dice] = (_a = lexeme.match(/1[Dd]S/)) !== null && _a !== void 0 ? _a : [, "1"];
            return {
                type: "stunt",
                data: dice,
                original: lexeme,
                conditionals: []
            }; // symbols
        });
        this.lexer.addRule(/kh?(?!:l)(\d*)/, function (lexeme) {
            /** keep high */
            return {
                type: "kh",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/dl?(?!:h)\d*/, function (lexeme) {
            /** drop low */
            return {
                type: "dl",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/kl\d*/, function (lexeme) {
            /** keep low */
            return {
                type: "kl",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/dh\d*/, function (lexeme) {
            /** drop high */
            return {
                type: "dh",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/!!(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** explode and combine */
            let [, data = `1`] = lexeme.match(/!!(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(-?\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/!!i/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "!!",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
        this.lexer.addRule(/!(i|\d+)?(?:(!?=|=!?|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** explode */
            let [, data = `1`] = lexeme.match(/!(i|\d+)?(?:(!?=|=!?|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!?|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/!i/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "!",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
        this.lexer.addRule(/r(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** reroll */
            let [, data = `1`] = lexeme.match(/r(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?={1,2}|>=?|<=?)(-?\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/ri/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "r",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
    }
    onunload() {
        console.log("DiceRoller unloaded");
    }
    parseDice(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                let stack = [], diceMap = [], tableMap, renderMap = new Map(), fileMap, type = "dice";
                const parsed = this.parse(text);
                let stunted = "";
                for (const d of parsed) {
                    if (d.type === "table") {
                        type = "table";
                        const [, roll = 1, link, block, header] = d.data.match(TABLE_REGEX), file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                        if (!file || !(file instanceof obsidian.TFile))
                            reject("Could not read file cache. Is the link correct?\n\n" +
                                link);
                        const cache = yield this.app.metadataCache.getFileCache(file);
                        if (!cache ||
                            !cache.blocks ||
                            !cache.blocks[block.toLowerCase()])
                            reject("Could not read file cache. Does the block reference exist?\n\n" +
                                `${link} > ${block}`);
                        const data = cache.blocks[block.toLowerCase()];
                        const content = (_a = (yield this.app.vault.read(file))) === null || _a === void 0 ? void 0 : _a.slice(data.position.start.offset, data.position.end.offset);
                        let table = extract(content);
                        let opts;
                        if (header && table.columns[header]) {
                            opts = table.columns[header];
                        }
                        else {
                            if (header)
                                reject(`Header ${header} was not found in table ${link} > ${block}.`);
                            opts = table.rows;
                        }
                        tableMap = new TableRoll(Number(roll !== null && roll !== void 0 ? roll : 1), opts, d.data, link, block);
                        if (parsed.length > 1) {
                            new obsidian.Notice(`Random tables cannot be used with modifiers.`);
                        }
                        break;
                    }
                    else if (d.type === "section") {
                        type = "render";
                        const [, roll = 1, link, filter] = d.data.match(SECTION_REGEX), file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                        let types;
                        if (filter && filter.length) {
                            types = filter.split(",");
                        }
                        if (!file || !(file instanceof obsidian.TFile))
                            reject("Could not read file cache. Is the link correct?\n\n" +
                                link);
                        const cache = yield this.app.metadataCache.getFileCache(file);
                        if (!cache || !cache.sections || !cache.sections.length)
                            reject("Could not read file cache.");
                        const content = yield this.app.vault.read(file);
                        const data = cache.sections
                            .filter(({ type }) => types
                            ? types.includes(type)
                            : !["yaml", "thematicBreak"].includes(type))
                            .map((cache) => {
                            return Object.assign(Object.assign({}, cache), { file: file.basename });
                        });
                        const roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), file.basename);
                        renderMap.set(file.basename, [
                            ...((_b = renderMap.get(file.basename)) !== null && _b !== void 0 ? _b : []),
                            roller
                        ]);
                        break;
                    }
                    else if (d.type === "tag") {
                        type = "render";
                        if (!this.app.plugins.plugins.dataview) {
                            new obsidian.Notice("Tags are only supported with the Dataview plugin installed.");
                            return;
                        }
                        const [, roll = 1, tag, collapseTrigger, filter] = d.data.match(TAG_REGEX);
                        const collapse = collapseTrigger === "-"
                            ? true
                            : collapseTrigger === "+"
                                ? false
                                : !this.returnAllTags;
                        let types;
                        if (filter && filter.length) {
                            types = filter.split(",");
                        }
                        const files = this.app.plugins.plugins.dataview.index.tags.invMap.get(tag);
                        if (!files || !files.size) {
                            reject("No files found with that tag. Is the tag correct?\n\n" +
                                tag);
                        }
                        if (filter === "link" ||
                            (this.rollLinksForTags && !(types === null || types === void 0 ? void 0 : types.length))) {
                            fileMap = new FileRoller(1, [...files], this.app.metadataCache);
                            type = "file";
                        }
                        else {
                            for (let link of files) {
                                let file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                                const cache = yield this.app.metadataCache.getFileCache(file);
                                if (!cache ||
                                    !cache.sections ||
                                    !cache.sections.length)
                                    ;
                                const content = yield this.app.vault.read(file);
                                const data = cache.sections
                                    .filter(({ type }) => types
                                    ? types.includes(type)
                                    : !["yaml", "thematicBreak"].includes(type))
                                    .map((cache) => {
                                    return Object.assign(Object.assign({}, cache), { file: file.basename });
                                });
                                if (collapse) {
                                    let roller;
                                    const rollers = renderMap.get("all");
                                    if (rollers && rollers.length) {
                                        roller = rollers.shift();
                                        roller.options = [
                                            ...roller.options,
                                            ...data
                                        ];
                                        roller.content.set(file.basename, content);
                                    }
                                    else {
                                        roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), "all");
                                    }
                                    renderMap.set("all", [
                                        ...((_c = renderMap.get("all")) !== null && _c !== void 0 ? _c : []),
                                        roller
                                    ]);
                                }
                                else {
                                    const roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), file.basename);
                                    renderMap.set(file.basename, [
                                        ...((_d = renderMap.get(file.basename)) !== null && _d !== void 0 ? _d : []),
                                        roller
                                    ]);
                                }
                            }
                        }
                        break;
                    }
                    else {
                        switch (d.type) {
                            case "+":
                            case "-":
                            case "*":
                            case "/":
                            case "^":
                            case "math":
                                const b = stack.pop(), a = stack.pop(), result = this.operators[d.data](a.result, b.result);
                                stack.push(new DiceRoll(`${result}`));
                                break;
                            case "kh": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                diceInstance.keepHigh(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dl": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                data = diceInstance.results.size - data;
                                diceInstance.keepHigh(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "kl": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                diceInstance.keepLow(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dh": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                data = diceInstance.results.size - data;
                                diceInstance.keepLow(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "!": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.explode(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "!!": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.explodeAndCombine(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "r": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.reroll(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dice":
                                ///const res = this.roll(d.data);
                                diceMap.push(new DiceRoll(d.data));
                                stack.push(diceMap[diceMap.length - 1]);
                                break;
                            case "stunt":
                                let stunt = new StuntRoll(d.original);
                                diceMap.push(stunt);
                                if (stunt.doubles) {
                                    stunted = ` - ${stunt.results.get(0).value} Stunt Points`;
                                }
                                stack.push(diceMap[diceMap.length - 1]);
                        }
                    }
                }
                diceMap.forEach((diceInstance) => {
                    text = text.replace(`${diceInstance.dice}${diceInstance.modifiers.join("")}`, diceInstance.display);
                });
                if (tableMap) {
                    text = text.replace(tableMap.text, `${tableMap.link} > ${tableMap.block}`);
                }
                if (renderMap && renderMap.size) {
                    text = `Results from ${renderMap.size} file${renderMap.size != 1 ? "s" : ""}`;
                }
                if (fileMap) {
                    text = fileMap.result;
                }
                resolve({
                    result: stack.length ? `${stack[0].text}${stunted}` : null,
                    text: text,
                    link: (_e = `${tableMap === null || tableMap === void 0 ? void 0 : tableMap.link}#^${tableMap === null || tableMap === void 0 ? void 0 : tableMap.block}`) !== null && _e !== void 0 ? _e : null,
                    type,
                    tableMap,
                    renderMap,
                    fileMap
                });
            }));
        });
    }
    parse(input) {
        this.lexer.setInput(input);
        var tokens = [], token;
        while ((token = this.lexer.lex()))
            tokens.push(token);
        return this.parser.parse(tokens);
    }
}

module.exports = DiceRoller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbGV4L2xleGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbW9vL21vby5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvbm9kZV9tb2R1bGVzL0Bmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29ucy9pbmRleC5lcy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvbm9kZV9tb2R1bGVzL0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZS9pbmRleC5lcy5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3V0aWwudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9yb2xsZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9wYXJzZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9jb25zdGFudHMudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9zZXR0aW5ncy50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbInRoaXMiLCJOb3RpY2UiLCJFdmVudHMiLCJNYXJrZG93blJlbmRlcmVyIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJtb28iLCJQbHVnaW4iLCJhZGRJY29uIiwic2V0SWNvbiIsIlRGaWxlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVB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UyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQy9DLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksR0FBRTtBQUM1QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQztBQUNsQixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBQztBQUNsQyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSTtBQUNyRCxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSTtBQUNyRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBQztBQUN0RCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFFO0FBQzdELElBQUksT0FBTyxJQUFJO0FBQ2YsSUFBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxXQUFXO0FBQ3BDLElBQUksT0FBTztBQUNYLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ3JCLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO0FBQ25CLE1BQU0sS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ3ZCLE1BQU0sS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQy9CLE1BQU0sV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ25DLE1BQU0sV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQ25DLEtBQUs7QUFDTCxJQUFHO0FB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
