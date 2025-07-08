import { test, expect } from "./fixtures/baseFixtures";
const BASE_URL = "https://www.saucedemo.com/";
const ERROR_BLOCK = '[data-test="error"]';
const PASSWORD = "secret_sauce";

const USERS = [
  { username: "standard_user", shouldSucceed: true },
  { username: "locked_out_user", shouldSucceed: false },
  { username: "problem_user", shouldSucceed: true },
  { username: "performance_glitch_user", shouldSucceed: true },
  { username: "error_user", shouldSucceed: true },
  { username: "visual_user", shouldSucceed: true },
];

test.describe("Авторизация пользователей SauceDemo", () => {
  USERS.forEach(({ username, shouldSucceed }) => {
    test(`Проверка авторизации: ${username}`, async ({ page, loginAs }) => {
      await loginAs(username, PASSWORD);

      if (shouldSucceed) {
        await expect(page).toHaveURL(`${BASE_URL}inventory.html`);
        await expect(page.locator(".title")).toHaveText("Products");
      } else {
        await expect(page.locator(ERROR_BLOCK)).toHaveText(
          "Epic sadface: Sorry, this user has been locked out."
        );
      }
    });
  });
});
