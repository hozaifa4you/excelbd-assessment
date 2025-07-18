export const appEnv = {
   APP_NAME: process.env.APP_NAME,
   NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
   APP_URL: process.env.APP_URL,
   NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
   API_URL: process.env.API_URL,
   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
   SESSION_NAME: process.env.SESSION_NAME ?? 'auth.quicko',
   SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
   SESSION_SECRET_EXP: parseInt(process.env.SESSION_SECRET_EXP ?? '604800000'),
   SESSION_SECRET_EXP_WITH_UNITS:
      process.env.SESSION_SECRET_EXP_WITH_UNITS ?? '7d',
};
