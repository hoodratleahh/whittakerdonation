(() => {
  "use strict";

  const copyButtons = document.querySelectorAll(".btn-copy");
  const status = document.getElementById("copy-status");
  const yearEl = document.getElementById("year");
  const revealEls = document.querySelectorAll(".reveal");
  const form = document.getElementById("tribute-form");
  const nameInput = document.getElementById("tribute-name");
  const input = document.getElementById("tribute-input");
  const list = document.getElementById("tribute-list");
  const charCount = document.getElementById("char-count");
  const STORAGE_KEY = "rwhitaker_guestbook_entries";

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

  function renderEntry(entry) {
    if (!list) return;
    const item = document.createElement("li");
    const author = document.createElement("span");
    author.className = "tribute-author";
    author.textContent = entry.name ? `${entry.name} wrote:` : "Anonymous tribute:";

    const text = document.createElement("span");
    text.textContent = entry.message;

    item.appendChild(author);
    item.appendChild(text);
    list.prepend(item);
  }

  function getStoredEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 40)));
    } catch (err) {
      // Ignore storage failures.
    }
  }

  if (copyButtons.length) {
    copyButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const targetId = button.getAttribute("data-copy-target");
        const target = targetId ? document.getElementById(targetId) : null;
        const value = target ? target.textContent.trim() : "";
        const label = targetId === "contract-address" ? "Token contract copied." : "Donation wallet copied.";
        await copyText(value, label);
      });
    });
  }

  if (input && charCount) {
    const updateCount = () => {
      charCount.textContent = `${input.value.length}/180`;
    };
    input.addEventListener("input", updateCount);
    updateCount();
  }

  if (form && input && list) {
    const stored = getStoredEntries();
    stored
      .slice()
      .reverse()
      .forEach((entry) => renderEntry(entry));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const name = nameInput ? nameInput.value.trim() : "";
      const entry = { name, message: text };
      renderEntry(entry);

      const entries = getStoredEntries();
      entries.push(entry);
      saveEntries(entries);

      input.value = "";
      if (nameInput) nameInput.value = "";
      if (charCount) charCount.textContent = "0/180";
    });
  }
})();
