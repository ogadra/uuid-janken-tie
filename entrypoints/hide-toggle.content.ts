import "~/assets/hide-toggle.css";

export default defineContentScript({
  matches: ["*://uuid-janken.mimifuwa.cc/*"],
  runAt: "document_start",
  main() {},
});
