import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof LoginSchema>;
type RegisterData = z.infer<typeof RegisterSchema>;

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginData | RegisterData) => {
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(data as LoginData);
        toast.success('Welcome back!');
      } else {
        await signUp(data as RegisterData);
        toast.success('Account created successfully!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <motion.div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      <motion.div className="relative w-full max-w-md z-10">
        <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 w-full">
          <Logo centered={true} size="lg" />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-blue-200 text-center mb-8"
          >
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </motion.p>

          <motion.form onSubmit={(isLogin ? loginForm : registerForm).handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <motion.div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...registerForm.register('name')}
                      className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        registerForm.formState.errors.name 
                          ? 'border-red-500/50' 
                          : 'border-white/20'
                      }`}
                    />
                  </motion.div>
                  {registerForm.formState.errors.name && (
                    <p className="text-red-300 text-sm ml-1">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="space-y-2">
              <motion.div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...(isLogin ? loginForm.register('email') : registerForm.register('email'))}
                  className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    (isLogin ? loginForm.formState.errors.email : registerForm.formState.errors.email) 
                      ? 'border-red-500/50' 
                      : 'border-white/20'
                  }`}
                />
              </motion.div>
              {(isLogin ? loginForm.formState.errors.email : registerForm.formState.errors.email) && (
                <p className="text-red-300 text-sm ml-1">
                  {(isLogin ? loginForm.formState.errors.email?.message : registerForm.formState.errors.email?.message)}
                </p>
              )}
            </motion.div>

            <motion.div className="space-y-2">
              <motion.div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...(isLogin ? loginForm.register('password') : registerForm.register('password'))}
                  className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    (isLogin ? loginForm.formState.errors.password : registerForm.formState.errors.password) 
                      ? 'border-red-500/50' 
                      : 'border-white/20'
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </motion.button>
              </motion.div>
              {(isLogin ? loginForm.formState.errors.password : registerForm.formState.errors.password) && (
                <p className="text-red-300 text-sm ml-1">
                  {(isLogin ? loginForm.formState.errors.password?.message : registerForm.formState.errors.password?.message)}
                </p>
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <motion.div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      {...registerForm.register('confirmPassword')}
                      className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        registerForm.formState.errors.confirmPassword 
                          ? 'border-red-500/50' 
                          : 'border-white/20'
                      }`}
                    />
                  </motion.div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-300 text-sm ml-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>


            <motion.button
              type="submit"
              disabled={loading || !(isLogin ? loginForm.formState.isValid : registerForm.formState.isValid)}
              className="w-full py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div className="flex items-center justify-center space-x-2">
                  <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></motion.div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </motion.div>
              ) : (
                <motion.div className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </motion.div>
              )}
            </motion.button>
          </motion.form>

          <motion.div className="text-center mt-6">
            <p className="text-blue-200 mb-2">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <motion.button
              onClick={toggleMode}
              className="text-blue-400 hover:text-white font-semibold transition-colors"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 