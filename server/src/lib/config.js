import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 5002,
  tokenSecret: process.env.TOKEN_SECRET,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
