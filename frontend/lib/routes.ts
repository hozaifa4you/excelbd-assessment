export type RouteType =
   | 'home'
   | 'signin'
   | 'signup'
   | 'dashboard'
   | 'admin.dashboard'
   | 'admin.bookings'
   | 'admin.assign'
   | 'agent.dashboard'
   | 'user.bookings'
   | 'parcels.booking'
   | 'parcels.details';

type RouteParamsMap = {
   home: undefined;
   signin: undefined;
   signup: undefined;
   dashboard: undefined;
   'admin.dashboard': undefined;
   'admin.bookings': undefined;
   'admin.assign': undefined;
   'agent.dashboard': undefined;
   'user.bookings': undefined;
   'parcels.booking': undefined;
   'parcels.details': { id: string };
};

type RouteQueryMap = {
   home: Record<string, string>;
   signin: Record<string, string>;
   signup: Record<string, string>;
   dashboard: Record<string, string>;
   'admin.dashboard': Record<string, string>;
   'admin.bookings': Record<string, string>;
   'admin.assign': Record<string, string>;
   'agent.dashboard': Record<string, string>;
   'user.bookings': Record<string, string>;
   'parcels.booking': Record<string, string>;
   'parcels.details': Record<string, string>;
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
      case 'admin.dashboard':
         return '/admin-panel/dashboard' + queryString;
      case 'admin.bookings':
         return '/admin-panel/bookings' + queryString;
      case 'admin.assign':
         return '/admin-panel/assign' + queryString;
      case 'dashboard':
         return '/dashboard' + queryString;
      case 'agent.dashboard':
         return '/agent/dashboard' + queryString;
      case 'user.bookings':
         return '/bookings' + queryString;
      case 'parcels.booking':
         return '/parcels/booking' + queryString;
      case 'parcels.details':
         return `/profile/${(params as { id: string }).id}` + queryString;
      default:
         return '/' + queryString;
   }
};
