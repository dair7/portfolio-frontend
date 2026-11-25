const minuteInMs = 60_000;

class LocalTimeElement extends HTMLElement {
  #alignTimeout: number | undefined;
  #minuteInterval: number | undefined;

  connectedCallback(): void {
    const output = this.querySelector("time");
    if (!output) return;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: this.dataset.timezone,
      hour: "numeric",
      minute: "2-digit",
    });
    const render = () => {
      const now = new Date();
      output.textContent = formatter.format(now);
      output.dateTime = now.toISOString();
    };

    render();
    this.hidden = false;
    this.#alignTimeout = window.setTimeout(
      () => {
        render();
        this.#minuteInterval = window.setInterval(render, minuteInMs);
      },
      minuteInMs - (Date.now() % minuteInMs),
    );
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.#alignTimeout);
    window.clearInterval(this.#minuteInterval);
  }
}

if (!customElements.get("local-time")) {
  customElements.define("local-time", LocalTimeElement);
}
