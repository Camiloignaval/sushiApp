import jwt from "jsonwebtoken";

export const signToken = (_id: string, phone: string, role: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw "No hay una semilla de JWT, Revisar .env";
  }

  return jwt.sign({ _id, phone, role }, process.env.JWT_SECRET_SEED, {
    expiresIn: "30d",
  });
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw "No hay una semilla de JWT, Revisar .env";
  }

  return new Promise((res, rej) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) return rej("JWT no valido");
        const { _id } = payload as { _id: string };
        res(_id);
      });
    } catch (error) {
      rej("JWT no valido");
    }
  });
};
