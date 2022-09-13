export const hola = "hola";

// client
//   .sendMessage("56945706195@c.us", "hola mor probando desde aca")
//   .then((response) => {
//     if (response.id.fromMe) {
//       console.log("El mensaje fue enviado");
//     }
//   });

// client.on("ready", () => {
//   console.log("Client has connected");
//   client
//     // .sendMessage("56945706195@c.us", "hola mor probando desde aca")
//     .sendMessage("5691234567@c.us", "EXAMPLE")
//     .then((response) => {
//       if (response.id.fromMe) {
//         console.log("The message has send");
//       }
//     });
// });
// client.on("message", (msg) => {
//   const { from, to, body } = msg;
//   console.log("MESSAGE RECEIVED", { from, to, body });

//   if (msg.body === "ping") {
//     msg.reply("pong");
//   }
// });
// process.on("SIGINT", async () => {
//   console.log("(SIGINT) Shutting down...");
//   await client.destroy();
//   process.exit(0);
// });
