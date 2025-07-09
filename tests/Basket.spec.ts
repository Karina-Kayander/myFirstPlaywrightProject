import { test, expect } from "../fixtures/baseFixtures";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";

const PASSWORD = "secret_sauce";

test.describe("POM: Проверка корзины", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("standard_user", PASSWORD);
  });

  test("Добавить товар в корзину", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await expect(await inventoryPage.getCartBadgeCount()).toHaveText("1");
  });

  test("Удалить товар из корзины", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await cartPage.removeItem();
    await expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test("Перейти в корзину со страницы товаров", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test("Оформить заказ до стадии Checkout: Your Information", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addFirstItemToCart();
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await cartPage.verifyCheckoutPage();
    await expect(page.locator(".title")).toHaveText("Checkout: Your Information");
  });

  test("Проверить, что корзина пуста при новом входе", async ({ page, browser }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addFirstItemToCart();

    const context = await browser.newContext();
    const newPage = await context.newPage();
    const loginPage = new LoginPage(newPage);
    const cartPage = new CartPage(newPage);

    await loginPage.goto();
    await loginPage.login("standard_user", PASSWORD);

    await newPage.locator(".shopping_cart_link").click();
    await expect(await cartPage.getCartItemsCount()).toBe(0);
  });
});