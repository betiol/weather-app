import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, User as UserIcon, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { trpc } from '../utils/trpc'
import { useAuthenticatedTRPC } from '../hooks/useAuthenticatedTRPC'
import type { User } from '@weather/shared-types'

interface UserFormProps {
  user?: User | null
  onClose: () => void
}

const UserForm = ({ user, onClose }: UserFormProps) => {
  const [name, setName] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [errors, setErrors] = useState({ name: '', zipCode: '' })

  const { getAuthInput, isAuthenticated } = useAuthenticatedTRPC()
  const utils = trpc.useContext()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setZipCode(user.zipCode)
    }
  }, [user])

  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      toast.success('User created successfully!')
      utils.users.getAll.invalidate()
      onClose()
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
      toast.error(error.message || 'Failed to create user')
    },
  })

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success('User updated successfully!')
      utils.users.getAll.invalidate()
      onClose()
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
      toast.error(error.message || 'Failed to update user')
    },
  })

  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      toast.success('User deleted successfully!')
      utils.users.getAll.invalidate()
      onClose()
    },
    onError: (error) => {
      console.error('Failed to delete user:', error)
      toast.error(error.message || 'Failed to delete user')
    },
  })

  const validateForm = () => {
    const newErrors = { name: '', zipCode: '' }
    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      newErrors.zipCode = 'Invalid zip code format'
    }
    
    setErrors(newErrors)
    return !newErrors.name && !newErrors.zipCode
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !isAuthenticated) return

    try {
      if (user) {
        await updateUser.mutateAsync(getAuthInput({
          id: user.id,
          name: name.trim(),
          zipCode: zipCode.trim(),
        }))
      } else {
        await createUser.mutateAsync(getAuthInput({
          name: name.trim(),
          zipCode: zipCode.trim(),
        }))
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleDelete = async () => {
    if (!user || !isAuthenticated) return
    
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return

    try {
      await deleteUser.mutateAsync(getAuthInput({ id: user.id }))
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const isLoading = createUser.isLoading || updateUser.isLoading || deleteUser.isLoading

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <UserIcon className="w-4 h-4" />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter zip code (e.g., 12345)"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading || !isAuthenticated}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Saving...' : user ? 'Update' : 'Create'}
              </motion.button>

              {user && (
                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading || !isAuthenticated}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UserForm 