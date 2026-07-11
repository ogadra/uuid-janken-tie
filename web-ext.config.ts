import { defineWebExtConfig } from "wxt";

export default defineWebExtConfig({
  binaries: {
    chrome: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  },
  startUrls: ["https://uuid-janken.mimifuwa.cc/"],
});
