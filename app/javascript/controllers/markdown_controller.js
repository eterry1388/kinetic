import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "output"];
  static values = { input: String };

  connect() {
    if (this.hasInputValue) {
      this.outputTarget.innerHTML = marked.parse(this.inputValue);
    }

    if (this.hasInputTarget) {
      const updatePreview = () => this.outputTarget.innerHTML = marked.parse(this.inputTarget.value);
      updatePreview();
      this.inputTarget.addEventListener("input", updatePreview);
    }
  }
}
