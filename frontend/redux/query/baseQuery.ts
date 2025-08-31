import { appEnv } from '@/config/env.config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = createApi({
   reducerPath: 'baseQuery',
   baseQuery: fetchBaseQuery({ baseUrl: `${appEnv.NEXT_PUBLIC_API_URL}/api` }),
   tagTypes: [],
   endpoints: () => ({}),
});
