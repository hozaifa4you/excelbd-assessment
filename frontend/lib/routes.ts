export type RouteType =
   | 'home'
   | 'signin'
   | 'signup'
   | 'dashboard'
   | 'parcels'
   | 'parcel.details'
   | 'profile'
   | 'agent.dashboard'
   | 'admin.dashboard';

type RouteParamsMap = {
   home: undefined;
   signin: undefined;
   signup: undefined;
   dashboard: undefined;
   parcels: undefined;
   'parcel.details': { slug: string };
   profile: { username: string };
   'agent.dashboard': undefined;
   'admin.dashboard': undefined;
};

type RouteQueryMap = {
   home: Record<string, string>;
   signin: Record<string, string>;
   signup: Record<string, string>;
   dashboard: Record<string, string>;
   parcels: Record<string, string>;
   'parcel.details': Record<string, string>;
   profile: Record<string, string>;
   'agent.dashboard': Record<string, string>;
   'admin.dashboard': Record<string, string>;
};

export const route = <T extends RouteType>(
   name: T,
   ...args: RouteParamsMap[T] extends undefined
      ? [params?: undefined, query?: RouteQueryMap[T]]
      : [params: RouteParamsMap[T], query?: RouteQueryMap[T]]
): string => {
   const [params, query] = args;

   const queryString = query ? '?' + new URLSearchParams(query).toString() : '';

   switch (name) {
      case 'home':
         return '/' + queryString;
      case 'signin':
         return '/signin' + queryString;
      case 'signup':
         return '/signup' + queryString;
      case 'dashboard':
         return '/dashboard' + queryString;
      case 'parcels':
         return '/parcels' + queryString;
      case 'parcel.details':
         return `/parcels/${(params as { slug: string }).slug}` + queryString;
      case 'profile':
         return (
            `/profile/@${(params as { username: string }).username}` +
            queryString
         );
      case 'agent.dashboard':
         return '/agent/dashboard' + queryString;
      case 'admin.dashboard':
         return '/admin/dashboard' + queryString;
      default:
         return '/' + queryString;
   }
};
