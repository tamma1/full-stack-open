import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const blog = {
  title: "title testi",
  author: "author testi",
  url: "url.testi"
}

test('Form calls the callback function with correct data when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
})