import React from 'react'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  className?: string // 支持用户传入自定义样式
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  className = '', // 默认为空字符串
}) => {
  const totalPages = Math.ceil(total / pageSize)

  // 生成页码数组
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  // 处理页码点击
  const handlePageChange = (page: number) => {
    if (page !== current) {
      onChange(page)
    }
  }

  return (
    <div className={`space-x-2 ${className}`}>
      {pageNumbers.map(page => (
        <button
          key={page}
          className={`px-10 py-1 border-rounded-20px font-size-30px border-none ${
            page === current
              ? 'bg-gray'
              : 'bg-white'
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

    </div>
  )
}

export default Pagination
