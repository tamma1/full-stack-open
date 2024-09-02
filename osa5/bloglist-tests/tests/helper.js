const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog'}).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async (page, blog, numLikes) => {
  await blog.getByRole('button', { name: 'view' }).click()
  for (let i = 0; i < numLikes; i++) {
    await blog.getByRole('button', {name: 'like' }).click()
    await page.waitForTimeout(100);
  }
}

export { loginWith, createBlog, likeBlog }