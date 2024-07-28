import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const user = {
  name: "name testi",
  username: "username testi"
}

const blog = {
  title: "title testi",
  author: "author testi",
  url: "url.testi",
  user: user,
  likes: 0
}

test('Title and author are rendered',() => {

  render(<Blog blog={blog} />)

  const element = screen.getByText('title testi author testi')
  expect(element).toBeDefined()
})

test('Url, likes and user are shown after clicking view-button', async () => {

  //const mockHandler = vi.fn()

  render(<Blog blog={blog} />)

  const eventUser = userEvent.setup()
  const button = screen.getByText('view')
  await eventUser.click(button)

  const urlElement = screen.getByText("url.testi")
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText("0")
  expect(likesElement).toBeDefined()

  const userElement = screen.getByText("name testi")
  expect(userElement).toBeDefined()
})