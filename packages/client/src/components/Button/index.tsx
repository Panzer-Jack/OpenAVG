import React from 'react'

type ButtonType = 'primary' | 'default' | 'danger' | 'link'
type ButtonSize = 'small' | 'middle' | 'large'

interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  type = 'default',
  size = 'middle',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  icon,
}) => {
  const buttonClassNames = `
    inline-flex justify-center items-center
    text-white font-semibold border-rounded-40px
    transition-all
    ${size === 'small' ? 'text-sm py-2 px-4' : size === 'large' ? 'text-xl py-4 px-8' : 'text-lg py-3 px-6'}
    ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
    ${disabled || loading ? 'bg-gray-400 cursor-not-allowed' : ''}
    ${type === 'primary' ? 'bg-primary hover:bg-primary-hover active:bg-primary-active' : ''}
    ${type === 'danger' ? 'bg-danger hover:bg-red-600' : ''}
    ${type === 'link' ? 'bg-transparent text-primary hover:text-blue-600' : ''}
    ${type === 'default' ? 'bg-default hover:bg-gray-300' : ''}
    ${className}
  `.trim()

  return (
    <button
      className={buttonClassNames}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ position: 'relative' }}
    >
      {loading && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin border-4 border-white border-t-transparent rounded-full w-4 h-4" />}
      {icon && <span className="mr-2">{icon}</span>}
      <div>{children}</div>
    </button>
  )
}

export default Button
