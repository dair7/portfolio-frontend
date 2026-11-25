const feedbackDurationInMs = 1600;
const copiedMessage = "Copied";
const selectedMessage = "Selected. Copy it with your keyboard.";

function selectText(element: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function setupCopyEmailBlock(block: HTMLElement): void {
  const value = block.querySelector<HTMLElement>("[data-copy-email-value]");
  const button = block.querySelector<HTMLButtonElement>(
    "[data-copy-email-button]",
  );
  const status = block.querySelector<HTMLElement>("[data-copy-email-status]");
  if (!value || !button || !status) return;

  let clearFeedback: number | undefined;

  button.addEventListener("click", async () => {
    window.clearTimeout(clearFeedback);
    const copied = await copyText(value.textContent?.trim() ?? "");
    if (!copied) selectText(value);
    status.textContent = copied ? copiedMessage : selectedMessage;
    clearFeedback = window.setTimeout(() => {
      status.textContent = "";
    }, feedbackDurationInMs);
  });
}

export function setupCopyEmail(): void {
  document
    .querySelectorAll<HTMLElement>("[data-copy-email]")
    .forEach(setupCopyEmailBlock);
}
