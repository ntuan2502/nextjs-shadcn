import { cookies } from "next/headers";

export const getUserFromCookies = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) return null;

  try {
    const user = JSON.parse(userCookie.value);
    return user.name;
  } catch {
    return null;
  }
};
