import { seedData } from '../data/seed';
import type { Comment, SiteData, User } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
let sessionToken = '';

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };
export type ReactionSummary = {
  likes: number;
  dislikes: number;
  useful: number;
};

export function hasApiBase() {
  return API_BASE.length > 0;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  if (!API_BASE) {
    return {
      ok: false,
      error: 'API не настроен. Укажите VITE_API_BASE_URL.',
      status: 0,
    };
  }

  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
    const payload = (await response.json().catch(() => ({}))) as {
      data?: T;
      error?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        error: payload.error || `Ошибка API ${response.status}`,
        status: response.status,
      };
    }

    return { ok: true, data: (payload.data ?? payload) as T };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Не удалось выполнить запрос',
      status: 0,
    };
  }
}

async function loadCollection<T>(path: string, fallback: T): Promise<T> {
  const result = await request<T>(path);
  return result.ok ? result.data : fallback;
}

export async function loadSiteData(): Promise<SiteData> {
  if (!API_BASE) {
    return seedData;
  }

  const [characters, guides, tierlists, teams, news, leaks, comments] =
    await Promise.all([
      loadCollection('/api/characters', seedData.characters),
      loadCollection('/api/guides', seedData.guides),
      loadCollection('/api/tierlists', seedData.tierlists),
      loadCollection('/api/teams', seedData.teams),
      loadCollection('/api/news', seedData.news),
      loadCollection('/api/leaks', seedData.leaks),
      loadCollection(
        '/api/comments?targetType=site&targetId=home',
        seedData.comments,
      ),
    ]);

  return {
    ...seedData,
    characters,
    guides,
    tierlists,
    teams,
    news,
    leaks,
    comments,
  };
}

export async function login(username: string, password: string) {
  const result = await request<{ token: string; user: User }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
  );

  if (result.ok) {
    sessionToken = result.data.token;
  }

  return result;
}

export async function register(
  username: string,
  password: string,
  confirmPassword: string,
) {
  const result = await request<{ token: string; user: User }>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ username, password, confirmPassword }),
    },
  );

  if (result.ok) {
    sessionToken = result.data.token;
  }

  return result;
}

export async function logout() {
  const result = await request<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
  sessionToken = '';
  return result;
}

export async function me() {
  const result = await request<User>('/api/auth/me');
  if (!result.ok && result.status === 401) {
    sessionToken = '';
  }
  return result;
}

export async function loadComments(
  targetType: Comment['targetType'],
  targetId: string,
) {
  return request<Comment[]>(
    `/api/comments?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
  );
}

export async function createComment(
  targetType: Comment['targetType'],
  targetId: string,
  body: string,
  parentId?: string,
) {
  return request<Comment>('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ targetType, targetId, body, parentId }),
  });
}

export async function loadReactionSummary(
  targetType: string,
  targetId: string,
) {
  return request<ReactionSummary>(
    `/api/reactions?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
  );
}

export async function sendReaction(
  targetType: string,
  targetId: string,
  reactionType: 'like' | 'dislike' | 'useful',
) {
  return request<ReactionSummary>('/api/reactions', {
    method: 'POST',
    body: JSON.stringify({ targetType, targetId, reactionType }),
  });
}

export async function saveEntity<T>(
  path: string,
  payload: unknown,
  method: 'POST' | 'PATCH' = 'POST',
) {
  return request<T>(path, {
    method,
    body: JSON.stringify(payload),
  });
}

export async function deleteEntity(path: string) {
  return request<{ success: boolean }>(path, { method: 'DELETE' });
}
