// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// All the room in the world for your code

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.message("hola amigo", async ({ message, say }) => {
    console.log(message);
    await say(`kaise ho? theek ho? <@${message.user}>`);
  });

  console.log(`⚡️ Bolt app is running on ${process.env.PORT || 3000}`);
})();
