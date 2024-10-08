import { Lucia } from "lucia";
import { adapter } from "./db";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user) => {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      store: user.store,
      feature_flags: user.feature_flags,
      nano_id: user.nano_id,
      pfp_url: user.pfp_url,
      cover_url: user.cover_url,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  email: string;
  name: string;
  store: boolean;
  feature_flags: {
    color_theme?: "dark" | "light";
    notifications?: boolean;
    table_size?: "comfortable" | "compact";
    shipping_price?: number;
    return_period?: "1d" | "3d" | "7d" | "14d" | "30d" | "";
    tiktok?: string;
    facebook?: string;
    instagram?: string;
    allowed_gov?: string[];
  };
  nano_id: string;
  pfp_url: string | undefined;
  cover_url: string | undefined;
}
