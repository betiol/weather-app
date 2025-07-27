import React from 'react'
import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'

interface LogoProps {
  centered?: boolean
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Logo: React.FC<LogoProps> = ({ 
  centered = false, 
  showText = true, 
  size = 'md' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-8',
          icon: 'w-4 h-4',
          text: 'text-lg'
        }
      case 'lg':
        return {
          container: 'w-16 h-16',
          icon: 'w-8 h-8',
          text: 'text-3xl'
        }
      default: 
        return {
          container: 'w-10 h-10',
          icon: 'w-6 h-6',
          text: 'text-xl'
        }
    }
  }

  const sizes = getSizeClasses()

  return (
    <motion.div 
      className={`flex items-center gap-2 ${centered ? 'flex-col text-center' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className={`${sizes.container} bg-blue-500 rounded-xl flex items-center justify-center ${centered ? 'mx-auto mb-4' : ''}`}
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
        initial={centered ? { scale: 0 } : {}}
        animate={centered ? { scale: 1 } : {}}
      >
        <Cloud className={`${sizes.icon} text-white`} />
      </motion.div>
      {showText && (
        <motion.h1 
          className={`${sizes.text} font-bold ${centered ? 'text-white mb-2' : 'text-gray-900 dark:text-white'}`}
          initial={centered ? { opacity: 0, y: 20 } : {}}
          animate={centered ? { opacity: 1, y: 0 } : {}}
          transition={centered ? { delay: 0.3 } : {}}
        >
          Weather App
        </motion.h1>
      )}
    </motion.div>
  )
}

export default Logo 