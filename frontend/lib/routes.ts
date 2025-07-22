export type RouteType =
   | 'home'
   | 'signin'
   | 'signup'
   | 'dashboard'
   | 'profile'
   | 'admin.dashboard'
   | 'admin.bookings'
   | 'admin.assign'
   | 'admin.customers'
   | 'admin.customers.details'
   | 'admin.agents'
   | 'admin.agents.details'
   | 'agent.dashboard'
   | 'agent.bookings'
   | 'user.bookings'
   | 'parcels.booking'
   | 'parcels.details'
   | 'parcels.options';

type RouteParamsMap = {
   home: undefined;
   signin: undefined;
   signup: undefined;
   dashboard: undefined;
   profile: { username: string };
   'admin.dashboard': undefined;
   'admin.bookings': undefined;
   'admin.assign': undefined;
   'admin.customers': undefined;
   'admin.customers.details': { username: string };
   'admin.agents': undefined;
   'admin.agents.details': { username: string };
   'agent.dashboard': undefined;
   'agent.bookings': undefined;
   'user.bookings': undefined;
   'parcels.booking': undefined;
   'parcels.details': { id: string };
   'parcels.options': undefined;
};

type RouteQueryMap = {
   home: Record<string, string>;
   signin: Record<string, string>;
   signup: Record<string, string>;
   dashboard: Record<string, string>;
   profile: Record<string, string>;
   'admin.dashboard': Record<string, string>;
   'admin.bookings': Record<string, string>;
   'admin.assign': Record<string, string>;
   'admin.customers': Record<string, string>;
   'admin.customers.details': Record<string, string>;
   'admin.agents': Record<string, string>;
   'admin.agents.details': Record<string, string>;
   'agent.dashboard': Record<string, string>;
   'agent.bookings': Record<string, string>;
   'user.bookings': Record<string, string>;
   'parcels.booking': Record<string, string>;
   'parcels.details': Record<string, string>;
   'parcels.options': Record<string, string>;
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
      case 'profile':
         return (
            `/profile/${(params as { username: string }).username}` +
            queryString
         );
      case 'admin.dashboard':
         return '/admin-panel/dashboard' + queryString;
      case 'admin.bookings':
         return '/admin-panel/bookings' + queryString;
      case 'admin.assign':
         return '/admin-panel/assign' + queryString;
      case 'admin.customers':
         return '/admin-panel/customers' + queryString;
      case 'admin.customers.details':
         return (
            `/admin-panel/customers/${(params as { username: string }).username}` +
            queryString
         );
      case 'admin.agents':
         return '/admin-panel/agents' + queryString;
      case 'agent.bookings':
         return '/agent/bookings' + queryString;
      case 'admin.agents.details':
         return (
            `/admin-panel/agents/${(params as { username: string }).username}` +
            queryString
         );
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
      case 'parcels.options':
         return '/parcels/options' + queryString;
      default:
         return '/' + queryString;
   }
};
