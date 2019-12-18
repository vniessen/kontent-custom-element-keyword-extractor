// from https://github.com/sleepycat/rapid-automated-keyword-extraction/blob/master/src/index.js
import { fromPairs, sortBy, toPairs } from "lodash";

var stopWords =
  "a;about;above;across;after;again;against;all;almost;alone;along;already;also;although;always;among;an;and;another;any;anybody;anyone;anything;anywhere;are;area;areas;around;as;ask;asked;asking;asks;at;away;b;back;backed;backing;backs;be;because;become;becomes;became;been;before;began;behind;being;beings;best;better;between;big;both;but;by;c;came;can;cannot;case;cases;certain;certainly;clear;clearly;come;could;d;did;differ;different;differently;do;does;done;down;downed;downing;downs;during;e;each;early;either;end;ended;ending;ends;enough;even;evenly;ever;every;everybody;everyone;everything;everywhere;f;face;faces;fact;facts;far;felt;few;find;finds;first;for;four;from;full;fully;further;furthered;furthering;furthers;g;gave;general;generally;get;gets;give;given;gives;go;going;good;goods;got;great;greater;greatest;group;grouped;grouping;groups;h;had;has;have;having;he;her;herself;here;high;higher;highest;him;himself;his;how;however;i;if;important;in;interest;interested;interesting;interests;into;is;it;its;itself;j;just;k;keep;keeps;kind;knew;know;known;knows;l;large;largely;last;later;latest;least;less;let;lets;like;likely;long;longer;longest;m;made;make;making;man;many;may;me;member;members;men;might;more;most;mostly;mr;mrs;much;must;my;myself;n;necessary;need;needed;needing;needs;never;new;newer;newest;next;no;non;not;nobody;noone;nothing;now;nowhere;number;numbers;o;of;off;often;old;older;oldest;on;once;one;only;open;opened;opening;opens;or;order;ordered;ordering;orders;other;others;our;out;over;p;part;parted;parting;parts;per;perhaps;place;places;point;pointed;pointing;points;possible;present;presented;presenting;presents;problem;problems;put;puts;q;quite;r;rather;really;right;room;rooms;s;said;same;saw;say;says;second;seconds;see;sees;seem;seemed;seeming;seems;several;shall;she;should;show;showed;showing;shows;side;sides;since;small;smaller;smallest;so;some;somebody;someone;something;somewhere;state;states;still;such;sure;t;take;taken;than;that;the;their;them;then;there;therefore;these;they;thing;things;think;thinks;this;those;though;thought;thoughts;three;through;thus;to;today;together;too;took;toward;turn;turned;turning;turns;two;u;under;until;up;upon;us;use;uses;used;v;very;w;want;wanted;wanting;wants;was;way;ways;we;well;wells;went;were;what;when;where;whether;which;while;who;whole;whose;why;will;with;within;without;work;worked;working;works;would;y;year;years;yet;you;young;younger;youngest;your;yours";

function isNumber(str) {
  return /\d/.test(str);
}

// TODO: smaller functions should be extracted from this
export function isAcceptable(phrase, minCharLength, maxWordsLength) {
  // a phrase must have a min length in characters
  if (phrase < minCharLength) {
    return false;
  }
  // a phrase must have a max number of words
  let words = phrase.split(" ");
  if (words.length > maxWordsLength) {
    return false;
  }

  let digits = 0;
  let alpha = 0;
  //is there a better way to do this?
  for (let i = 0; i < phrase.length; i++) {
    if (/\d/.test(phrase[i])) digits += 1;
    if (/[a-zA-Z]/.test(phrase[i])) alpha += 1;
  }

  // a phrase must have at least one alpha character
  if (alpha == 0) {
    return false;
  }

  // a phrase must have more alpha than digits characters
  if (digits > alpha) {
    return false;
  }

  return true;
}

export function countOccurances(haystack, needle) {
  return haystack.reduce((n, value) => {
    return n + (value === needle);
  }, 0);
}

export function generateCandidateKeywordScores(
  phraseList,
  wordScore,
  minKeywordFrequency = 1
) {
  let keywordCandidates = {};

  phraseList.forEach(phrase => {
    if (minKeywordFrequency > 1) {
      if (countOccurances(phraseList, phrase) < minKeywordFrequency) {
        return;
      }
    }
    phrase in keywordCandidates || (keywordCandidates[phrase] = 0);
    let wordList = separateWords(phrase, 0);
    let candidateScore = 0;
    wordList.forEach(word => {
      candidateScore += wordScore[word];
      keywordCandidates[phrase] = candidateScore;
    });
  });
  return keywordCandidates;
}

export function separateWords(text, minWordReturnSize) {
  let wordDelimiters = /[^a-zA-Z0-9_+\-/]/;
  let words = [];
  text.split(wordDelimiters).forEach(singleWord => {
    let currentWord = singleWord.trim().toLowerCase();
    //leave numbers in phrase, but don't count as words, since they tend to invalidate scores of their phrases
    if (
      currentWord.length > minWordReturnSize &&
      currentWord != "" &&
      !isNumber(currentWord)
    ) {
      words.push(currentWord);
    }
  });
  return words;
}

export function calculateWordScores(phraseList) {
  let wordFrequency = {};
  let wordDegree = {};
  phraseList.forEach(phrase => {
    let wordList = separateWords(phrase, 0);
    let wordListLength = wordList.length;
    let wordListDegree = wordListLength - 1;
    wordList.forEach(word => {
      word in wordFrequency || (wordFrequency[word] = 0);
      wordFrequency[word] += 1;
      word in wordDegree || (wordDegree[word] = 0);
      wordDegree[word] += wordListDegree;
    });
  });

  Object.keys(wordFrequency).forEach(item => {
    wordDegree[item] = wordDegree[item] + wordFrequency[item];
  });

  // Calculate Word scores = deg(w)/frew(w)
  let wordScore = {};
  Object.keys(wordFrequency).forEach(item => {
    item in wordScore || (wordScore[item] = 0);
    wordScore[item] = wordDegree[item] / (wordFrequency[item] * 1.0);
  });

  return wordScore;
}

export function generateCandidateKeywords(
  sentenceList,
  stopWordPattern,
  minCharLength = 1,
  maxWordsLength = 5
) {
  let phraseList = [];
  sentenceList.forEach(sentence => {
    let tmp = sentence
      .replace(new RegExp("\\b(" + stopWordPattern + ")\\b", "gi"), " ")
      .replace(/\s{2,}/g, "|"); //stopWordPattern[Symbol.replace](sentence, '|')
    let phrases = tmp.split("|");
    phrases.forEach(ph => {
      let phrase = ph.trim().toLowerCase();

      if (phrase != "" && isAcceptable(phrase, minCharLength, maxWordsLength)) {
        phraseList.push(phrase);
      }
    });
  });
  return phraseList;
}

export function buildStopWordRegex() {
  let stopWordRegexList = stopWords.split(";");

  let stopWordPattern = new RegExp(stopWordRegexList.join("|"), "ig");
  return stopWordPattern;
}

export function splitSentences(text) {
  let sentenceDelimiters = /[[\]\n.!?,;:\t\\-\\"\\(\\)\\'\u2019\u2013]/;
  return text.split(sentenceDelimiters);
}

export function rake(
  text,
  minCharLength = 3,
  maxWordsLength = 5,
  minKeywordFrequency = 1
) {
  let stopWordPattern = buildStopWordRegex();
  let sentenceList = splitSentences(text);
  let phraseList = generateCandidateKeywords(
    sentenceList,
    stopWordPattern,
    minCharLength,
    maxWordsLength
  );
  let wordScores = calculateWordScores(phraseList);
  let keywordCandidates = generateCandidateKeywordScores(
    phraseList,
    wordScores,
    minKeywordFrequency
  );
  let sortedKeywords = fromPairs(
    sortBy(toPairs(keywordCandidates), pair => pair[1]).reverse()
  );
  return sortedKeywords;
}
