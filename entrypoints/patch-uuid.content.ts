export default defineContentScript({
  matches: ["*://uuid-janken.mimifuwa.cc/*"],
  world: "MAIN",
  runAt: "document_start",
  main() {
    const frozen = crypto.randomUUID();
    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      writable: true,
      value: () => frozen,
    });
  },
});
