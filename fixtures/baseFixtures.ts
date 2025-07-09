import { test as base } from "@playwright/test";

type Fixtures = {
  loginAs: (username: string, password: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginAs: async ({ page }, use) => {
    await use(async (username: string, password: string) => {
      await page.goto("https://www.saucedemo.com/", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.fill('[data-test="username"]', username);
      await page.fill('[data-test="password"]', password);
      await page.click('[data-test="login-button"]');
    });
  },
});

export { expect } from "@playwright/test";