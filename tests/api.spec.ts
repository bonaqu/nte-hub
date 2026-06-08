import { expect, test } from '@playwright/test';

const apiBase = 'http://127.0.0.1:8788';

test('auth, comments and reactions work through Worker and D1', async ({
  request,
}) => {
  const username = `pw_${Date.now()}_${Math.round(Math.random() * 10000)}`;
  const password = 'Playwright-Strong-42!';

  const guidesResponse = await request.get(`${apiBase}/api/guides`);
  expect(guidesResponse.ok()).toBeTruthy();
  const guidesPayload = await guidesResponse.json();
  expect(guidesPayload.data.length).toBeGreaterThan(0);

  const registerResponse = await request.post(`${apiBase}/api/auth/register`, {
    data: { username, password, confirmPassword: password },
  });
  expect(registerResponse.status()).toBe(201);
  await expect(registerResponse.json()).resolves.toMatchObject({
    data: { user: { role: 'owner' } },
  });

  const meResponse = await request.get(`${apiBase}/api/auth/me`);
  expect(meResponse.ok()).toBeTruthy();
  await expect(meResponse.json()).resolves.toMatchObject({
    data: { username },
  });

  const commentResponse = await request.post(`${apiBase}/api/comments`, {
    data: {
      targetType: 'guide',
      targetId: 'guide-hotori',
      body: `Комментарий Playwright ${username}`,
    },
  });
  expect(commentResponse.status()).toBe(201);
  await expect(commentResponse.json()).resolves.toMatchObject({
    data: { author: username },
  });

  const reactionResponse = await request.post(`${apiBase}/api/reactions`, {
    data: {
      targetType: 'guide',
      targetId: 'guide-hotori',
      reactionType: 'useful',
    },
  });
  expect(reactionResponse.ok()).toBeTruthy();
  const reactionPayload = await reactionResponse.json();
  expect(reactionPayload.data.useful).toBeGreaterThanOrEqual(1);

  const guideSlug = `playwright-guide-${Date.now()}`;
  const guideResponse = await request.post(`${apiBase}/api/guides`, {
    data: {
      slug: guideSlug,
      characterId: 'hotori',
      title: 'Тестовый гайд Playwright',
      summary: 'Проверка CRUD гайда и вложенных секций.',
      status: 'draft',
      patchVersion: 'test',
      sections: [
        {
          title: 'Тестовая секция',
          type: 'custom',
          content: 'Контент тестовой секции.',
        },
      ],
    },
  });
  expect(guideResponse.status()).toBe(201);
  const guideId = (await guideResponse.json()).data.id;

  const savedGuideResponse = await request.get(
    `${apiBase}/api/guides/${guideId}`,
  );
  expect(savedGuideResponse.ok()).toBeTruthy();
  await expect(savedGuideResponse.json()).resolves.toMatchObject({
    data: {
      slug: guideSlug,
      status: 'draft',
      sections: [{ title: 'Тестовая секция' }],
    },
  });

  expect(
    (await request.delete(`${apiBase}/api/guides/${guideId}`)).ok(),
  ).toBeTruthy();

  const logoutResponse = await request.post(`${apiBase}/api/auth/logout`);
  expect(logoutResponse.ok()).toBeTruthy();
  expect((await request.get(`${apiBase}/api/auth/me`)).status()).toBe(401);
});
