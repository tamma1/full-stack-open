import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
  const [expanded, setExpanded] = useState(false)
  
  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="blog">
      <p>{blog.title} {blog.author}</p>
      {expanded && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={handleLike}>like</button> </p>
          <p>{blog.user.name}</p>
        </div>
      )}
      <button onClick={toggleExpanded}>{expanded ? 'hide' : 'view'}</button>
    </div>  
  )
}

export default Blog