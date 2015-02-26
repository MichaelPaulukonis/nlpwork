// convert file of mispellings in a weird format
// into rought json

var fs = require('fs');
var pos = require('pos');
var array = require('array');

fs.readFile('slogans.txt', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  var lines = data.trim().split('\n');

  var posed = [];
  var posBank = {};
  var lexer = new pos.Lexer();
  var tagger = new pos.Tagger();

  lines.forEach(function(line) {

    // ignore
    if (line[0] == '#') return;

    line = line.trim().replace('\r', '');

    // "The lines and policies advanced by the great Comrades Kim Il Sung and Kim Jong Il and their instructions are textbooks for the revolution."

    // [ [ 'The', 'DT' ],
    //   [ 'lines', 'NNS' ],
    //   [ 'and', 'CC' ],
    //   [ 'policies', 'NNS' ],
    //   [ 'advanced', 'VBD' ],
    //   [ 'by', 'IN' ],
    //   [ 'the', 'DT' ],
    //   [ 'great', 'JJ' ],
    //   [ 'Comrades', 'NNPS' ],
    //   [ 'Kim', 'NNP' ],
    //   [ 'Il', 'FW' ],
    //   [ 'Sung', 'NNP' ],
    //   [ 'and', 'CC' ],
    //   [ 'Kim', 'NNP' ],
    //   [ 'Jong', 'NNP' ],
    //   [ 'Il', 'FW' ],
    //   [ 'and', 'CC' ],
    //   [ 'their', 'PRP$' ],
    //   [ 'instructions', 'NNS' ],
    //   [ 'are', 'VBP' ],
    //   [ 'textbooks', 'NNS' ],
    //   [ 'for', 'IN' ],
    //   [ 'the', 'DT' ],
    //   [ 'revolution', 'NN' ],
    //   [ '.', '.' ] ]

    var outpos = [];
    var words = lexer.lex(line);
    var taggedWords = tagger.tag(words);
    for (var i in taggedWords) {
      var taggedWord = taggedWords[i];
      var part = taggedWord[1];
      if (!posBank[part]) {
        posBank[part] = array();
      }
      if (!posBank[part].find(function(x) { return x == taggedWord[0]; })) {
        posBank[part].push(taggedWord[0]);
        posBank[part].sort();
      }
      // outpos.push(part);
    }

    var outline = outpos.join(' ') + ' : ' + line;
    posed.push(outline);

  });

  // console.log(spells);

  fs.writeFile('tagged.slogans.01.txt', JSON.stringify(posBank, null, 2));

});
