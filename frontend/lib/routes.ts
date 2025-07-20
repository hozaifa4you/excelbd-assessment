export type RouteType =
   | 'home'
   | 'signin'
   | 'signup'
   | 'dashboard'
   | 'agent.dashboard'
   | 'admin.dashboard'
   | 'user.bookings'
   | 'parcels.booking';

type RouteParamsMap = {
   home: undefined;
   signin: undefined;
   signup: undefined;
   dashboard: undefined;
   'agent.dashboard': undefined;
   'admin.dashboard': undefined;
   'user.bookings': undefined;
   'parcels.booking': undefined;
};

type RouteQueryMap = {
   home: Record<string, string>;
   signin: Record<string, string>;
   signup: Record<string, string>;
   dashboard: Record<string, string>;
   'agent.dashboard': Record<string, string>;
   'admin.dashboard': Record<string, string>;
   'user.bookings': Record<string, string>;
   'parcels.booking': Record<string, string>;
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
      // case 'profile':
      //    return (
      //       `/profile/@${(params as { username: string }).username}` +
      //       queryString
      //    );
      case 'agent.dashboard':
         return '/agent/dashboard' + queryString;
      case 'admin.dashboard':
         return '/admin/dashboard' + queryString;
      case 'user.bookings':
         return '/bookings' + queryString;
      case 'parcels.booking':
         return '/parcels/booking' + queryString;
      default:
         return '/' + queryString;
   }
};
