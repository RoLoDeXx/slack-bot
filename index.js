const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Regular expression for matching specific message format
const feOpsGroupId = "S06KNMPR12N";
const helpTextFormat =
  /Component:\s*([^:\n]+)\s*\nIssue-Type:\s*([^:\n]+)\s*\nPriority:\s*([^:\n]+)\s*\nVersion:\s*([^:\n]+)\s*\nDescription:\s*([^:\n]+)\s*\nScreenshot\/Video:\s*([^:\n]+)/;

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);

  // Listen for a specific text message and respond in the same thread
  app.message("hola amigo", async ({ message, say }) => {
    console.log(message, "replying as a new message");
    await say(`kaise ho? theek ho? <@${message.user}>`);
  });

  // Listen for a specific text message ("hello") and respond in the same thread
  app.message("hello", async ({ message, say }) => {
    console.log(message, "replying in thread");
    await say({
      text: `Hello <@${message.user}>!`,
      thread_ts: message.ts,
    });
  });

  // Listen for messages that match the specified format and respond in the same thread
  app.message(helpTextFormat, async ({ message, say }) => {
    const lines = message.text.split("\n");

    // Find the line that contains 'Issue-Type'
    const issueTypeLine = lines.find((line) => line.includes("Issue-Type"));
    // Find the line that contains 'Description'
    const descriptionLine = lines.find((line) => line.includes("Description"));

    const issueType = issueTypeLine ? issueTypeLine.split(": ")[1] : "";
    const description = descriptionLine ? descriptionLine.split(": ")[1] : "";

    if (issueType.toLowerCase() === "query") {
      try {
        const generatedResponse = await axios.post(
          "https://2713-2401-4900-1c5c-a8ce-7844-3937-7f15-3424.ngrok-free.app/api",
          {
            query: description,
          }
        );
        await say({
          text: `${generatedResponse.data} \ncc: <subteam^${feOpsGroupId}>`,
          thread_ts: message.ts,
        });
      } catch (error) {
        console.error("Generateded response failed", error);
      }
    } else {
      console.log("The Issue-Type is not Query.");
    }
  });
  console.log(`⚡️ Bolt app is running on ${process.env.PORT || 3000}`);
})();
