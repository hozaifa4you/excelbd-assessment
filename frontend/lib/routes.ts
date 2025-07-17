export type RouteType = 'home' | 'signin' | 'signup';

export const route = (
   name: RouteType,
   params?: Record<string, string>,
   query?: Record<string, string>,
) => {
   switch (name) {
      case 'home':
         return '/';
      case 'signin':
         return '/signin';
      case 'signup':
         return '/signup';

      default:
         return '/';
   }
};
