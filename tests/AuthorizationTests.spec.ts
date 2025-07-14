import { test, expect } from "../fixtures/baseFixtures";
import { InventoryPage } from "../pages/InventoryPage";

const PASSWORD = "secret_sauce";

const USERS = [
  { username: "standard_user", shouldSucceed: true },
  { username: "locked_out_user", shouldSucceed: false },
  { username: "problem_user", shouldSucceed: true },
];

test.describe("POM: Авторизация пользователей", () => {
  USERS.forEach(({ username, shouldSucceed }) => {
    test(`Login: ${username}`, async ({ loginPage, page }) => {
      await loginPage.login(username, PASSWORD);

      if (shouldSucceed) {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.verifyPageLoaded();
        const itemCount = await inventoryPage.getInventoryItemsCount();
        expect(itemCount).toBeGreaterThan(0);
      } else {
        await expect(page.locator('[data-test="error"]')).toContainText(
          "locked out"
        );
      }
    });
  });
});
