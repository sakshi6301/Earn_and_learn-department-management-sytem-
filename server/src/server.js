import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import seedDemoData from "./seed/seedDemoData.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoData();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
