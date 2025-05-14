// Simple user theme API helpers
export async function getUserTheme(userId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/theme`);
  if (!res.ok) throw new Error('Failed to fetch user theme');
  const data = await res.json();
  return data.theme;
}

export async function setUserTheme(userId, theme) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme })
  });
  if (!res.ok) throw new Error('Failed to set user theme');
  const data = await res.json();
  return data.theme;
}
