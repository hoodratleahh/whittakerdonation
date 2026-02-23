(() => {
  "use strict";

  const copyBtn = document.getElementById("copy-wallet-btn");
  const wallet = document.getElementById("wallet-address");
  const copyContractBtn = document.getElementById("copy-contract-btn");
  const contract = document.getElementById("contract-address");
  const status = document.getElementById("copy-status");
  const yearEl = document.getElementById("year");
  const revealEls = document.querySelectorAll(".reveal");
  const form = document.getElementById("tribute-form");
  const input = document.getElementById("tribute-input");
  const list = document.getElementById("tribute-list");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  async function copyText(value, okLabel) {
    if (!status || !value) return;
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = okLabel;
    } catch (err) {
      status.textContent = "Copy failed. Select and copy manually.";
    }
  }

  if (copyBtn && wallet) {
    copyBtn.addEventListener("click", async () => {
      const value = wallet.textContent.trim();
      await copyText(value, "Donation wallet copied.");
    });
  }

  if (copyContractBtn && contract) {
    copyContractBtn.addEventListener("click", async () => {
      const value = contract.textContent.trim();
      await copyText(value, "Token contract copied.");
    });
  }

  if (form && input && list) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const item = document.createElement("li");
      item.textContent = text;
      list.prepend(item);
      input.value = "";
    });
  }
})();
