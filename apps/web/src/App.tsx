import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
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
  const { withAuth, isAuthenticated } = useAuthenticatedTRPC();

  const { data: users = [] } = trpc.users.getAll.useQuery(
    withAuth({}),
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        userName={user.name}
        userEmail={user.email}
        onLogout={handleLogout}
      />
      
      <div className="w-full px-4 py-4">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-end mb-4">
            <motion.button
              onClick={handleCreateUser}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Add User
            </motion.button>
          </div>

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
      </div>
    </div>
  );
}

export default App; 