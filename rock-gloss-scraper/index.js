const {ArgumentParser} = require('argparse');

const {scrapeTerms} = require('./scraper');

// const argParser = new ArgumentParser({
//   description: 'Runs the scraper'
// })
// const args = argParser.parseArgs()

(async () => {
  try {
    await scrapeTerms();
  } catch (e) {
    console.log(e);
    return;
  }
  console.log('success');
})();
