import { test, expect } from "../fixtures/baseFixtures";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

const PASSWORD = "secret_sauce";
const USERS = [
  { username: "standard_user", shouldSucceed: true },
  { username: "locked_out_user", shouldSucceed: false },
  { username: "problem_user", shouldSucceed: true },
];

test.describe("POM: Авторизация пользователей", () => {
  USERS.forEach(({ username, shouldSucceed }) => {
    test(`Login: ${username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.login(username, PASSWORD);

      if (shouldSucceed) {
        await inventoryPage.verifyPageLoaded();
        expect(await inventoryPage.getInventoryItemsCount()).toBeGreaterThan(0);
      } else {
        await expect(page.locator('[data-test="error"]')).toContainText(
          "locked out"
        );
      }
    });
  });
});