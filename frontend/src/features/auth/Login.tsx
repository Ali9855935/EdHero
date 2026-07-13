import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import showToast from '../../components/common/Toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Mock API request lag
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockUser = {
        id: 'usr_1',
        email: data.email,
        name: 'Sruthi K',
        role: 'administrator',
      };
      const mockToken = 'mock_jwt_token_123456';
      
      login(mockUser, mockToken);
      showToast.success('Successfully logged in!', `Welcome back, ${mockUser.name}`);
      navigate('/dashboard');
    } catch {
      showToast.error('Authentication failed', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-8 shadow-2xl relative">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-neutralDark-400">
          Sign in to your CRM dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@edhero.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end text-xs">
            <Link
              to="/forgot-password"
              className="text-brand-500 hover:text-brand-400 transition-colors font-medium cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full py-3 text-sm font-semibold"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
