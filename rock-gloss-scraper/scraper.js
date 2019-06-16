const cheerio = require('cheerio')
const rp = require('request-promise')
const fs = require('fs')

module.exports.getTerms = async function getTerms() {
  const terms = []

  const body = await rp({uri: 'https://en.wikipedia.org/wiki/Glossary_of_climbing_terms'})
  const $ = cheerio.load(body)

  const termsContainer = $('#mw-content-text > .mw-parser-output')

  // The wikipedia glossary is organized oddly.  Mostly, it alternates <p> tags containing
  // the term names with <dl><dd> tags containing the definition.  (Normally a <dl> definition 
  // list would put the term name inside the <dl> as a <dt> tag.)  Sometimes it uses a <dt>.
  let prevParagraph = null
  termsContainer.children().each((i, child) => {
    if (child.name === 'p') {
      prevParagraph = child
    } else if (child.name === 'dl') {
      const definitionTitle = $(child).find('dt');
      const title = definitionTitle.length ? definitionTitle.text().trim() : $(prevParagraph).text().trim()
      const definition = $(child).text().trim()
      terms.push({title, definition})
    }
  })

  return terms
}

module.exports.scrapeTerms = async function scrapeTerms() {
  const terms = await module.exports.getTerms()
  const json = JSON.stringify(terms)
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }
  fs.writeFileSync("out/terms.json", json);
}

