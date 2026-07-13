import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import showToast from '../../components/common/Toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PageTransition from '../../components/common/PageTransition';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      // Simulate network lag
      await new Promise((resolve) => setTimeout(resolve, 800));
      // TODO: VERIFY this endpoint path and payload shape against actual backend once teammate confirms
      // Currently fully mocked on frontend
      return { email: data.email };
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: any) => {
      console.error('[FORGOT_PASSWORD_SERVICE_ERROR] Raw service error:', error);
      showToast.error('Something went wrong', 'Please try again.');
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutate(data);
  };

  return (
    <PageTransition>
      <div className="bg-neutralDark-900 border border-neutralDark-800 rounded-2xl p-8 shadow-2xl relative animate-fade-in">
        {success ? (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Check your email
              </h2>
              <p className="text-sm text-neutralDark-400 max-w-sm mx-auto leading-relaxed">
                If an account exists for this email, a reset link has been sent.
              </p>
            </div>
            <div className="pt-4 border-t border-neutralDark-800">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 mb-4">
                <Mail size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                Forgot password?
              </h2>
              <p className="mt-2 text-sm text-neutralDark-400">
                Enter your email to receive a password reset link
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

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={isPending}
                  className="w-full py-3 text-sm font-semibold"
                >
                  Send Reset Link
                </Button>
              </div>

              <div className="text-center border-t border-neutralDark-800 pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
