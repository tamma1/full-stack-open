import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    });  
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          handleSuccess(
            `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
          )
        })
        .catch(error => {
          handleError('failed to create a new blog')
        })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleError('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLike = id => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1}
    console.log(updatedBlog)

    blogService
      .update(id, updatedBlog)
        .then(returnedBlog => {
          setBlogs(blogs
            .map(b => b.id !== id ? b : returnedBlog)
            .sort((a, b) => b.likes - a.likes))
          handleSuccess(`blog ${returnedBlog.title} liked successfully`)
          console.log(returnedBlog)
        })
        .catch(error => {
          handleError('failed to update likes')
        })
  }

  const handleDelete = (id) => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`removing blog ${blog.author} by ${blog.author}`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          handleSuccess(`blog ${blog.title} deleted successfully`)
        })
        .catch(error => {
          handleError(`Failed to delete blog ${blog.title}`)
        })
    }
  }

  const handleSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button> 
      </p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleDelete={() => handleDelete(blog.id)}
          user={user}
        />
      )}
    </div>
  )
}

export default App