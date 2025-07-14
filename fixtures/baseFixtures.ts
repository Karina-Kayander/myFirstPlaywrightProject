import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type Fixtures = {
  loginPage: LoginPage;
  loginAs: (username: string, password: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(); // автоматически открывает сайт
    await use(loginPage);
  },

  loginAs: async ({ loginPage }, use) => {
    await use(async (username: string, password: string) => {
      await loginPage.login(username, password);
    });
  },
});

export { expect } from "@playwright/test";
