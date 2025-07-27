import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthPage } from './components/AuthPage';
import Header from './components/Header';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserMap from './components/UserMap';
import { useAuth } from './contexts/AuthContext';
import { trpc } from './utils/trpc';
import { useAuthenticatedTRPC } from './hooks/useAuthenticatedTRPC';
import type { User } from '@weather/shared-types';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { user, loading, logout } = useAuth();
  const { isAuthenticated } = useAuthenticatedTRPC();

  const { data: users = [] } = trpc.users.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div className="flex flex-col items-center gap-4">
          <motion.div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></motion.div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {!user ? (
        <AuthPage />
      ) : (
        <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header
            userName={user.name}
            userEmail={user.email}
            onLogout={handleLogout}
          />
          
          <motion.div className="w-full px-4 py-4">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <motion.div className="flex justify-end mb-4">
                <motion.button
                  onClick={handleCreateUser}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add New User
                </motion.button>
              </motion.div>

              <UserMap users={users} />
              
              <UserList onEditUser={handleEditUser} />
            </motion.main>

            <AnimatePresence>
              {showForm && (
                <UserForm
                  user={editingUser}
                  onClose={handleCloseForm}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

export default App; 