# RockGloss

This repo contains an Expo app and scraper supporting a rock climbing glossary.

## Scraper

Outputs updated terms to `rock-gloss-scraper/out/terms.json`
```
cd rock-gloss-scraper
npm install
npm run scrape
```

## Mobile app

```
cd rock-gloss-expo
npm run start
```

### Publishing iOS app

[Instructions](https://medium.com/@jeffrey.allen.lewis/react-native-how-to-publish-an-expo-app-to-testflight-debug-common-errors-90e427b4b5ea)

## TODO

* Add an alphabetical guide to scrolling the list
  - Use/integrate [SectionList](https://facebook.github.io/react-native/docs/0.35/sectionlist)
  - [alpha-scroll-flat-list](https://github.com/bardog/Alpha-scroll-flat-list/blob/master/src/index.js)