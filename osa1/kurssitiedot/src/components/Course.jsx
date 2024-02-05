const Part = ({ part, exercises}) => {
  return (
    <div>
    <p>
      {part} {exercises}
    </p>
  </div>
  )
}

const Header = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
    </div>
  )
}

const Content = ({ course }) => {
  const parts = course.parts
  return (
    <div>
      {parts.map((part, index) => (
        <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <p><b>total of {total} exercises</b></p>
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default Course