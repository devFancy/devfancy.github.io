# Firebase

`database.rules.json` holds the Realtime Database rules behind the like button.

**Nothing here deploys.** The file is a copy of what is pasted into the Firebase console,
kept in the repository so the rules can be reviewed in a diff. After editing it, paste it into
Realtime Database -> Rules and publish, or the live rules and this file drift apart.

The rules allow reading one post's count and writing a value exactly one higher or one lower.
Everything else is denied, including the root. They are safe to publish: rules are enforced on
the server, and the database URL is already in the page source because the browser has to call it.
