import { Mail, Phone, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface PDParcelAuthorInfoProps {
   author: {
      avatar: string | null;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
   };
}

const PDParcelAuthorInfo = ({ author }: PDParcelAuthorInfoProps) => {
   const fullName = `${author.firstName} ${author.lastName}`;
   const initials = `${author.firstName.charAt(0)}${author.lastName.charAt(
      0,
   )}`.toUpperCase();

   return (
      <Card className="animate-fade-in-up">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <UserCheck className="h-5 w-5" />
               Parcel Author Information
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
               <Avatar className="h-12 w-12">
                  {author.avatar && (
                     <AvatarImage src={author.avatar} alt={fullName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                     {initials}
                  </AvatarFallback>
               </Avatar>
               <div className="flex-1">
                  <p className="text-base font-medium">{fullName}</p>
                  <p className="muted-foreground text-sm">Parcel Sender</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                     <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                     <p className="text-muted-foreground text-sm">Email</p>
                     <p className="text-sm font-medium">{author.email}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                     <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                     <p className="text-muted-foreground text-sm">Phone</p>
                     <p className="text-sm font-medium">
                        {author.phone ?? 'Not found'}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
               <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
               </Button>
               <Button size="sm" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Author
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};

export { PDParcelAuthorInfo };
