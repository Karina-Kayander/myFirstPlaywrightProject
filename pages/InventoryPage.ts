import { Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyPageLoaded() {
    await this.page.waitForURL(/inventory\.html/);
    await this.page.locator(".title").waitFor();
  }

  async addFirstItemToCart() {
    await this.page.locator(".inventory_item button").first().click();
  }

  async getCartBadgeCount() {
    return this.page.locator(".shopping_cart_badge");
  }

  async openCart() {
    await this.page.locator(".shopping_cart_link").click();
  }

  async getInventoryItemsCount() {
    return this.page.locator(".inventory_item").count();
  }
}