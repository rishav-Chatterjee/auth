import app from "./src/app.ts";
import config from "./src/config/config.ts";
import { connectDB } from "./src/db/database.ts";

// Fallback for port
const serverPort = config.PORT || 8000;

await connectDB();

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
