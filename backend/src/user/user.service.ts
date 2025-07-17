import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
   constructor(private readonly prismaService: PrismaService) {}

   async findMe(userId: string) {
      const user = await this.prismaService.user.findUnique({
         where: { id: userId },
      });

      return user;
   }

   async findByEmail(email: string) {
      const user = await this.prismaService.user.findUnique({
         where: { email },
      });

      return user;
   }

   async remove(id: string) {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
         throw new NotFoundException('User not found');
      }

      await this.prismaService.user.delete({ where: { id } });

      return { msg: 'User deleted successfully' };
   }

   async usernameGenerator(email: string) {
      const username = email.split('@')[0];
      let user = await this.findByEmail(username);

      if (!user) return username;

      let counter = 1;
      while (user) {
         const newUsername = `${username}${counter}`;
         user = await this.findByEmail(newUsername);
         counter++;
      }

      return `${username}${counter - 1}`;
   }
}
