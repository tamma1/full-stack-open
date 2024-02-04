import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Anecdote = ({ text }) => (
  <div>
    {text}
  </div>
)

const Votes = ({ votes }) => (
  <div>
    has {votes} votes
  </div>
)

const BestAnecdote = ({ best, votes }) => (
  <div>
    <h1>
      Anecdote with most votes
    </h1>
    <Anecdote text={best} />
    <Votes votes={votes} />
  </div>
)

const Title = () => <h1>Anecdote of the day</h1>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const initialVotes = Array(anecdotes.length).fill(0)
  const [votes, setVotes] = useState(initialVotes)

  const updateVotes = (index) => {
    const copy = [...votes]
    copy[index] += 1
    setVotes(copy)
    console.log(copy)
  }

  const nextAnecdote = () => setSelected(Math.floor(Math.random() * 8))

  const mostVotes = () => Math.max(...votes)

  const bestAnecdote = () => {
    const bestAnecdoteIndex = votes.indexOf(mostVotes())
    const bestAnecdote = anecdotes[bestAnecdoteIndex]
    return bestAnecdote
  }

  return (
    <div>
      <Title />
      <Anecdote text={anecdotes[selected]}/>
      <Votes votes={votes[selected]}/>
      <Button handleClick={() => updateVotes(selected)} text='vote'/>
      <Button handleClick={nextAnecdote} text='next anecdote'/>
      <BestAnecdote best={bestAnecdote()} votes={mostVotes()}/>
    </div>
  )
}

export default App