import { useState } from "react"

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [expanded, setExpanded] = useState(false)
  
  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const showDelete = () => {
    return user && blog.user && user.username === blog.user.username
  }

  return (
    <div className="blog">
      <p>{blog.title} {blog.author}
      <button onClick={toggleExpanded}>{expanded ? 'hide' : 'view'}</button></p>
      {expanded && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={handleLike}>like</button> </p>
          <p>{blog.user.name}</p>
          {showDelete() && <button onClick={handleDelete}>delete</button>}
        </div>
      )}
      
    </div>  
  )
}

export default Blog