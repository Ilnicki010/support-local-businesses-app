module.exports = function sendSentryException(tag, email, error, extras,Sentry) {
  if (!error) return;
  if (!error.name) return;

  Sentry.configureScope((scope) => {
    if (extras) {
      for (extra of extras) {
        if (extra.key && extra.value) scope.setExtra(extra.key, extra.value);
      }
    }

    if (tag && tag.key && tag.value) {
      scope.setTag(tag.key, tag.value);
    }

    if (email) scope.setUser({ email });
  });

  const e = new Error();
  e.name = error.name;
  e.message = error.message;
  Sentry.captureException(e);
}