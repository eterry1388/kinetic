import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="notice"
export default class extends Controller {
  static values = { duration: { type: Number, default: 5000 } };

  connect() {
    this.startFadeOut();
  }

  startFadeOut() {
    setTimeout(() => {
      this.element.style.transition = "opacity 1s";
      this.element.style.opacity = "0";
      setTimeout(() => {
        this.element.remove();
      }, 1000);
    }, this.durationValue);
  }
}
