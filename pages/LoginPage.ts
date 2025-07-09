import { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput = '[data-test="username"]';
  readonly passwordInput = '[data-test="password"]';
  readonly loginButton = '[data-test="login-button"]';
  readonly errorBlock = '[data-test="error"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async expectError(expectedText: string) {
    await this.page.locator(this.errorBlock).waitFor();
    await this.page.locator(this.errorBlock).isVisible();
  }
}