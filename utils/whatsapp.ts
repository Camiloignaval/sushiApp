import { client } from "../pages/api/admin/wspconnect";

export const sendMessage = async (number: string, msg: string) => {
  try {
    console.log(
      "voy a enviar el mensaje!",
      `${number.replaceAll("+", "")}@c.us`
    );

    const resp = await client.sendMessage(
      `${number.replaceAll("+", "")}@c.us`,
      msg
    );
    if (resp.id.fromMe) {
      console.log({ success: "The message has been send" });
    }
  } catch (error) {
    console.log({ error });
  }
};
