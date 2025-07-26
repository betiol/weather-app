import { motion } from 'framer-motion';
import { Edit, MapPin, Clock, Users } from 'lucide-react';
import { trpc } from '../utils/trpc';
import type { User } from '@weather/shared-types';

interface UserListProps {
  onEditUser: (user: User) => void;
}

const UserList = ({ onEditUser }: UserListProps) => {
  const { data: users, isLoading } = trpc.users.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No users yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add your first user to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user: User, index: number) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Zip: {user.zipCode}
              </p>
            </div>
            <button
              onClick={() => onEditUser(user)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>
                {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{user.timezone}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserList;