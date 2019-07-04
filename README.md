# RockGloss

This repo contains an Expo app and scraper supporting a rock climbing glossary.  All revenue from this app is donated to
[Access Fund](https://www.accessfund.org).

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

[Full Instructions](https://medium.com/@jeffrey.allen.lewis/react-native-how-to-publish-an-expo-app-to-testflight-debug-common-errors-90e427b4b5ea)

#### Instruction after first time
* Ensure that `app.json` `expo.version` key has been incremented.
* Build app
    ```
    $ expo build:ios
    ...
    Successfully built standalone app: https://expo.io/artifacts/abc-123-456-def
    ```
* Download link at end of build.
* Upload using Application Loader.app
* In [App Store Connect](https://appstoreconnect.apple.com/), in Test Flight, add external testers.

## TODO

* Terms of Use, Privacy Policy
  - https://www.adventureprojects.net/terms
  - https://www.adventureprojects.net/privacy-policy
* Add'l terms:
  - https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html
  - https://rockandice.com/how-to-climb/climbing-terminology/
* Single out exact match (best match?) at top of terms, with remaining terms below.
* Highlight search in text
* Convert search from list header to separate component that shows when user scrolls up anywhere in the list
* Support internal links between definitions
* Add sections to make it clearer that user has navigated to letter section.
* https://github.com/infinitered/reactotron
* package ViewMeasurer for distribution ("react native getItemLayout dynamic")
