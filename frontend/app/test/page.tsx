import { NavUser } from '@/components/auth/nav-user';

const Test = () => {
   return (
      <div>
         <NavUser
            user={{
               avatar: 'https://example.com/avatar.jpg',
               name: 'John Doe',
               email: 'john@example.com',
            }}
         />
      </div>
   );
};

export default Test;
