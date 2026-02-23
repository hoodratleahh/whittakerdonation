(() => {
  "use strict";

  const copyBtn = document.getElementById("copy-wallet-btn");
  const wallet = document.getElementById("wallet-address");
  const status = document.getElementById("copy-status");
  const amountNote = document.getElementById("amount-note");
  const amountBtns = document.querySelectorAll(".amount-btn");
  const candleBtn = document.getElementById("light-candle-btn");
  const candleCount = document.getElementById("candle-count");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const candleStorageKey = "memorial_virtual_candles";

  if (revealNodes.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  if (copyBtn && wallet && status) {
    copyBtn.addEventListener("click", async () => {
      const value = wallet.textContent.trim();
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        status.textContent = "Wallet address copied.";
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1200);
      } catch (err) {
        status.textContent = "Copy failed. Select and copy manually.";
      }
    });
  }

  if (amountBtns.length && amountNote) {
    amountBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const amount = btn.dataset.amount || "a custom amount";
        amountNote.textContent = `Thank you. You selected ${amount} as a donation idea.`;
      });
    });
  }

  if (candleBtn && candleCount) {
    const getCurrentCount = () => {
      const raw = localStorage.getItem(candleStorageKey);
      const parsed = Number.parseInt(raw || "0", 10);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const setCount = (value) => {
      candleCount.textContent = String(value);
      localStorage.setItem(candleStorageKey, String(value));
    };

    setCount(getCurrentCount());

    candleBtn.addEventListener("click", () => {
      const next = getCurrentCount() + 1;
      setCount(next);
      candleBtn.textContent = "Candle Lit";
      setTimeout(() => {
        candleBtn.textContent = "Light Candle";
      }, 1000);
      if (status) {
        status.textContent = "Thank you for honoring his memory.";
      }
    });
  }
})();
