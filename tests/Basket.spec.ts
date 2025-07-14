import { test, expect } from "../fixtures/baseFixtures";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

const PASSWORD = "secret_sauce";

test.describe("POM: Проверка корзины", () => {
  test("Добавить товар в корзину", async ({ page, loginAs }) => {
    const inventoryPage = new InventoryPage(page);
    await loginAs("standard_user", PASSWORD);
    await inventoryPage.addFirstItemToCart();
    await expect(await inventoryPage.getCartBadgeCount()).toHaveText("1");
  });

  test("Удалить товар из корзины", async ({ page, loginAs }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await loginAs("standard_user", PASSWORD);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await cartPage.removeItem();
    await expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test("Перейти в корзину со страницы товаров", async ({ page, loginAs }) => {
    const inventoryPage = new InventoryPage(page);
    await loginAs("standard_user", PASSWORD);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test("Оформить заказ до стадии Checkout: Your Information", async ({
    page,
    loginAs,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    await loginAs("standard_user", PASSWORD);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await cartPage.verifyCheckoutPage();
    await expect(page.locator(".title")).toHaveText(
      "Checkout: Your Information"
    );
  });

  test("Проверить, что корзина пуста при новом входе", async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const inventoryPage = new InventoryPage(page1);
    const loginPage1 = new (await import("../pages/LoginPage")).LoginPage(
      page1
    );

    await loginPage1.goto();
    await loginPage1.login("standard_user", PASSWORD);
    await inventoryPage.addFirstItemToCart();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const loginPage2 = new (await import("../pages/LoginPage")).LoginPage(
      page2
    );
    const cartPage2 = new CartPage(page2);

    await loginPage2.goto();
    await loginPage2.login("standard_user", PASSWORD);
    await page2.locator(".shopping_cart_link").click();
    await expect(await cartPage2.getCartItemsCount()).toBe(0);
    await context2.close();
  });
});
