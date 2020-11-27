const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

// When "/schedule", schedule a message for tomorrow morning
// Tip: use the shortcut() method to listen to shortcut events
app.command("/schedule", async ({ command, ack, client }) => {
  // Acknowledge incoming command event
  ack();

  // Unix timestamp for tomorrow morning at 9AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0);

  try {
    // Call the chat.scheduleMessage method using the built-in WebClient
    // The client uses the token you used to initialize the app
    const result = await client.chat.scheduleMessage({
      channel: "general",
      text: command.text,
      // Time to post message, in Unix Epoch timestamp format
      post_at: tomorrow.getTime() / 1000
    });

    // Print result
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

publishMessage("general", "Get ready for Monday Stories!");