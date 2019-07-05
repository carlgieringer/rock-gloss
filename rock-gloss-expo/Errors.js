import Sentry from 'sentry-expo'

export default class Errors {
  static onException(err, msg=null) {
    Sentry.captureException(err);
    if (msg) {
      console.error(msg, err);
    } else {
      console.log(err);
    }
  }
}
