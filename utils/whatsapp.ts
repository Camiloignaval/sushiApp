// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = "AC61463abf5fb53303386f637124dd35c1";
const authToken = "dab87267dd76c65376541bb7aa18cdeb";
const client = require("twilio")(accountSid, authToken);

export const wspMessage = () => {
  console.log("entre a la funcion");
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      //   14155238886
      body: "Tu pedido listo!",
      to: "whatsapp:+56945706195",
    })
    .then((message) => console.log(message.sid))
    .catch((error) => {
      console.log({ error });
    });
};
