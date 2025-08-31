import z from 'zod';

const LoginFormSchema = z.object({
   email: z.email({ message: 'Please enter a valid email.' }),
   password: z.string().min(1, {
      message: 'Password field must not be empty.',
   }),
});

const SignupFormSchema = z
   .object({
      firstName: z.string().min(1, {
         message: 'First name is required.',
      }),
      lastName: z.string().min(1, {
         message: 'Last name is required.',
      }),
      email: z.email({ message: 'Please enter a valid email.' }),
      phone: z.string().min(10, {
         message: 'Phone number must be at least 10 digits long.',
      }),
      password: z.string().min(8, {
         message: 'Password must be at least 8 characters long.',
      }),
      confirmPassword: z.string().min(1, {
         message: 'Confirm password is required.',
      }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
   });

export { LoginFormSchema, SignupFormSchema };
