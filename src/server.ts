import app from "./app";
import { prisma } from "./lib/prisma";
const port = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    app.get("/", (req, res) => {
      res.send("Hello world");
    });
    app.listen(port, () => {
      console.log(`server is running on ports =  ${port}`);
    });
  } catch (err) {
    console.log("error", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
