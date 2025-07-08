import { test as base } from "@playwright/test";

// Тип расширенной фикстуры
type Fixtures = {
  loginAs: (username: string, password: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginAs: async ({ page }, use) => {
    const USERNAME_INPUT = '[data-test="username"]';
    const PASSWORD_INPUT = '[data-test="password"]';
    const LOGIN_BUTTON = '[data-test="login-button"]';

    await use(async (username: string, password: string) => {
      await page.goto("https://www.saucedemo.com/");
      await page.locator(USERNAME_INPUT).fill(username);
      await page.locator(PASSWORD_INPUT).fill(password);
      await page.locator(LOGIN_BUTTON).click();
    });
  },
});
export { expect } from "@playwright/test";
