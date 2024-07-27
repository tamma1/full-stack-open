import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import Blog from './Blog'

test('renders content',() => {
  const blog = {
    title: "title testi",
    author: "author testi",
    url: "url.testi"
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('title testi author testi')
  expect(element).toBeDefined()
})