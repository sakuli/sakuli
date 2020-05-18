const express = require("express");
const execa = require("execa");
const app = express();
app.use(express.static("demo-page"));
const demoPageServer = require("http").createServer(app);

app.listen(1234, async () => {
  try {
    console.log("Running");
    const { stdout } = await execa("sakuli", ["run", "legacy-suite"]);
    console.log(stdout);
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    demoPageServer.close();
  }
});
