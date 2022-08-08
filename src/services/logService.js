import * as Sentry from "@sentry/browser";

export function init() {
    Sentry.init({
        dsn: process.env.REACT_APP_DSN
    });
}
