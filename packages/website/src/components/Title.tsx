import type React from 'react'

export const Title: React.FC<{ children?: React.ReactNode; title: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className='flex items-center py-8 relative border-b-gray-200 border-b mb-10'>
      <h1 className='text-2xl flex-auto font-semibold text-black py-1'>{title}</h1>
      { children }
    </div>
  )
}