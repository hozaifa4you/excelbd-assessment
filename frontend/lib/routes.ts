export type RouteType =
   | 'home'
   | 'signin'
   | 'signup'
   | 'dashboard'
   | 'parcels'
   | 'parcel.details';

type RouteParamsMap = {
   home: undefined;
   signin: undefined;
   signup: undefined;
   dashboard: undefined;
   parcels: undefined;
   'parcel.details': { slug: string };
};

type RouteQueryMap = {
   home: Record<string, string>;
   signin: Record<string, string>;
   signup: Record<string, string>;
   dashboard: Record<string, string>;
   parcels: Record<string, string>;
   'parcel.details': Record<string, string>;
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
      default:
         return '/' + queryString;
   }
};
