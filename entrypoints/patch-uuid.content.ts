type Version = "v4" | "v7";

function generateStubUuid(version: Version): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | (version === "v7" ? 0x70 : 0x40);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  if (version === "v7") {
    const now = BigInt(Date.now());
    bytes[0] = Number((now >> 40n) & 0xffn);
    bytes[1] = Number((now >> 32n) & 0xffn);
    bytes[2] = Number((now >> 24n) & 0xffn);
    bytes[3] = Number((now >> 16n) & 0xffn);
    bytes[4] = Number((now >> 8n) & 0xffn);
    bytes[5] = Number(now & 0xffn);
  }
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export default defineContentScript({
  matches: ["*://uuid-janken.mimifuwa.cc/*"],
  world: "MAIN",
  runAt: "document_start",
  main() {
    let displayedMode: Version = "v4";
    let frozen = generateStubUuid(displayedMode);

    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      writable: true,
      value: () => frozen,
    });

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (!target.closest(".version-toggle")) return;

        event.stopImmediatePropagation();
        event.preventDefault();

        displayedMode = displayedMode === "v4" ? "v7" : "v4";
        frozen = generateStubUuid(displayedMode);

        const toggles = document.querySelectorAll<HTMLElement>(".version-toggle");
        for (const el of toggles) {
          el.textContent = displayedMode;
          el.classList.remove("switching");
        }
        void toggles[0]?.offsetWidth;
        for (const el of toggles) el.classList.add("switching");
      },
      true,
    );

    new MutationObserver((mutations) => {
      if (displayedMode !== "v7") return;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (
            node.classList.contains("countdown-number") &&
            node.classList.contains("call-four") &&
            node.textContent === "4"
          ) {
            node.textContent = "7";
          }
        }
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
  },
});
