import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import showToast from '../../components/common/Toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PageTransition from '../../components/common/PageTransition';
import { Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      // Simulate network lag
      await new Promise((resolve) => setTimeout(resolve, 800));
      // TODO: VERIFY this endpoint path and payload shape against actual backend once teammate confirms
      // Currently fully mocked on frontend
      return { token, password: data.password };
    },
    onSuccess: () => {
      setSuccess(true);
      showToast.success('Password reset successful', 'You can now log in with your new password.');
    },
    onError: (error: any) => {
      console.error('[RESET_PASSWORD_SERVICE_ERROR] Raw service error:', error);
      showToast.error('Something went wrong', 'Please try again.');
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutate(data);
  };

  // If no token is present in the URL, show an inline error state explaining the link is invalid/expired
  if (!token) {
    return (
      <PageTransition>
        <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-8 shadow-2xl relative text-center space-y-6 animate-fadeIn">
          <div className="mx-auto w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center text-accent-500">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-neutralDark-400 max-w-sm mx-auto leading-relaxed">
              This password reset link is invalid or expired. Please request a new password reset link.
            </p>
          </div>
          <div className="pt-4 border-t border-neutralDark-800">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Request New Link
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-8 shadow-2xl relative animate-fadeIn">
        {success ? (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Password updated
              </h2>
              <p className="text-sm text-neutralDark-400 max-w-sm mx-auto leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
            </div>
            <div className="pt-4 border-t border-neutralDark-800">
              <Button
                onClick={() => navigate('/login')}
                className="w-full py-3 text-sm font-semibold"
              >
                Go to Login
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Reset password
              </h2>
              <p className="mt-2 text-sm text-neutralDark-400">
                Please enter and confirm your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={isPending}
                  className="w-full py-3 text-sm font-semibold"
                >
                  Reset Password
                </Button>
              </div>

              <div className="text-center border-t border-neutralDark-800 pt-4">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Request New Link
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
