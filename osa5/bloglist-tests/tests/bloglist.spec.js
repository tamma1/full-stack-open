const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('bloglist', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Kayttaja',
        username: 'toinen',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, 'testiTitle', 'testiAuthor', 'testi.fi')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('testiTitle testiAuthor')).toBeVisible()
    })

    test('a new blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('0')).toBeVisible()
      await page.getByRole('button', { name: 'like'}).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('user who added blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('testiTitle testiAuthor')).not.toBeVisible()
    })

    test('only the user who added blog can see delete button', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'toinen', 'salasana')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are sorted by number of likes in descending order', async ({ page }) => {
      await createBlog(page, 'pienin', 'pieni', 'pieni.fi')
      await createBlog(page, 'isoin', 'iso', 'iso.fi')

      const firstBlogText = await page.getByText('isoin iso')
      const firstBlogElement = await firstBlogText.locator('..')
      await likeBlog(page, firstBlogElement, 3)

      const secondBlogText = await page.getByText('testiTitle testiAuthor')
      const secondBlogElement = await secondBlogText.locator('..')
      await likeBlog(page, secondBlogElement, 2)

      const thirdBlogText = await page.getByText('pienin pieni')
      const thirdBlogElement = await thirdBlogText.locator('..')
      await likeBlog(page, thirdBlogElement, 1)

      const blogs = await page.locator('.blog').all()
      await expect(blogs[0].getByText('isoin iso')).toBeVisible()
      await expect(blogs[0].getByText('3')).toBeVisible()
      await expect(blogs[1].getByText('testiTitle testiAuthor')).toBeVisible()
      await expect(blogs[1].getByText('2')).toBeVisible()
      await expect(blogs[2].getByText('pienin pieni')).toBeVisible()
      await expect(blogs[2].getByText('1')).toBeVisible()
    })
  })
})