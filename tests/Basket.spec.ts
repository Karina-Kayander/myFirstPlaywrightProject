import { test, expect } from "./fixtures/baseFixtures";

const PASSWORD = "secret_sauce";

test.describe("Проверка работы корзины", () => {
  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs("standard_user", PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("Добавить товар в корзину", async ({ page }) => {
    await page.locator(".inventory_item button").first().click();
    const badge = page.locator(".shopping_cart_badge");
    await expect(badge).toHaveText("1");
  });

  test("Удалить товар из корзины", async ({ page }) => {
    await page.locator(".inventory_item button").first().click();
    await page.locator(".shopping_cart_link").click();
    await page.locator(".cart_button").click();
    await expect(page.locator(".cart_item")).toHaveCount(0);
  });

  test("Перейти в корзину со страницы товаров", async ({ page }) => {
    await page.locator(".inventory_item button").first().click();
    await page.locator(".shopping_cart_link").click();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test("Оформить заказ до стадии Checkout: Your Information", async ({ page }) => {
    await page.locator(".inventory_item button").first().click();
    await page.locator(".shopping_cart_link").click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator(".title")).toHaveText("Checkout: Your Information");
  });

  test("Проверить, что корзина пуста при новом входе (чистый контекст)", async ({ browser, loginAs }) => {
    // Создаём новый контекст и страницу
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    // Логинимся и добавляем товар
    await page1.goto("https://www.saucedemo.com/");
    await page1.locator('[data-test="username"]').fill("standard_user");
    await page1.locator('[data-test="password"]').fill(PASSWORD);
    await page1.locator('[data-test="login-button"]').click();
    await page1.locator(".inventory_item button").first().click();

    // Закрываем старый контекст (симулируем выход)
    await context1.close();

    // Новый контекст — как новое «окно браузера»
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    // Логинимся заново
    await page2.goto("https://www.saucedemo.com/");
    await page2.locator('[data-test="username"]').fill("standard_user");
    await page2.locator('[data-test="password"]').fill(PASSWORD);
    await page2.locator('[data-test="login-button"]').click();

    // Проверяем корзину — она должна быть пустая
    await page2.locator(".shopping_cart_link").click();
    await expect(page2.locator(".cart_item")).toHaveCount(0);

    // Закрываем новый контекст
    await context2.close();
  });
});
