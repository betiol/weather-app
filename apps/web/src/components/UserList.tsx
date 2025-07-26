import { motion } from 'framer-motion'
import { Edit, MapPin, Clock, Users } from 'lucide-react'
import { trpc } from '../utils/trpc'
import { useAuthenticatedTRPC } from '../hooks/useAuthenticatedTRPC'
import type { User } from '@weather/shared-types'

interface UserListProps {
  onEditUser: (user: User) => void
}

const UserList = ({ onEditUser }: UserListProps) => {
  const { withAuth, isAuthenticated } = useAuthenticatedTRPC()

  const { data: users, isLoading } = trpc.users.getAll.useQuery(
    withAuth({}),
    { enabled: isAuthenticated }
  )

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
      </div>
    )
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
          Add your first user to get started with weather tracking.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user: User, index: number) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name || 'Unknown'}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{user.zipCode || 'N/A'}</span>
              </div>
            </div>
            <motion.button
              onClick={() => onEditUser(user)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Latitude:</span>
              <span className="font-medium">
                {user.latitude !== undefined ? user.latitude.toFixed(4) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Longitude:</span>
              <span className="font-medium">
                {user.longitude !== undefined ? user.longitude.toFixed(4) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Timezone:</span>
              <span className="font-medium">{user.timezone || 'N/A'}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                Updated {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default UserList