import { test, expect } from "@playwright/test";

// Общие константы
const BASE_URL = "https://www.saucedemo.com/";
const USERNAME_INPUT = '[data-test="username"]';
const PASSWORD_INPUT = '[data-test="password"]';
const LOGIN_BUTTON = '[data-test="login-button"]';
const ERROR_BLOCK = '[data-test="error"]';

// Тестовые данные
const PASSWORD = "secret_sauce";
const USERS = [
  "standard_user",
  "locked_out_user",
  "problem_user",
  "performance_glitch_user",
  "error_user",
  "visual_user",
];

test.describe("Тесты авторизации пользователей", () => {
  test.beforeEach(async ({ page }) => {
    // Предусловие: открываем страницу авторизации
    await page.goto(BASE_URL);
  });

  USERS.forEach((username) => {
    test(`Проверка авторизации для пользователя ${username}`, async ({ page }) => {
      // Вводим логин
      await page.locator(USERNAME_INPUT).fill(username);
      await expect(page.locator(USERNAME_INPUT)).toHaveValue(username);

      // Вводим пароль
      await page.locator(PASSWORD_INPUT).fill(PASSWORD);

      // Нажимаем кнопку входа
      await page.locator(LOGIN_BUTTON).click();

      if (username === "locked_out_user") {
        // Ожидаем сообщение об ошибке
        await expect(page.locator(ERROR_BLOCK)).toHaveText(
          "Epic sadface: Sorry, this user has been locked out."
        );
      } else {
        // Проверяем успешный переход на страницу товаров
        await expect(page).toHaveURL(`${BASE_URL}inventory.html`);

        // Проверяем заголовок
        await expect(page.locator(".title")).toHaveText("Products");

        // Проверяем, что есть товары
        const itemCount = await page.locator(".inventory_item").count();
        expect(itemCount).toBeGreaterThan(0);

        // Проверяем доступность кнопки 'Add to cart'
        await expect(page.locator(".inventory_item button").first()).toBeVisible();
      }
    });
  });
});
