import { Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async removeItem() {
    await this.page.locator(".cart_button").click();
  }

  async getCartItemsCount() {
    return this.page.locator(".cart_item").count();
  }

  async proceedToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  async verifyCheckoutPage() {
    await this.page.locator(".title").waitFor();
  }
}