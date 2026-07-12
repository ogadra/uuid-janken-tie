import { v4 as uuidV4, v7 as uuidV7 } from "uuid";

type Version = "v4" | "v7";

function generateStubUuid(version: Version): string {
  return version === "v7" ? uuidV7() : uuidV4();
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
