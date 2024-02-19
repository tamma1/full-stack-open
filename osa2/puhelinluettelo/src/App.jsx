import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ value, onChange }) => (
  <form>
    <div>
      filter shown with <input
      value={value}
      onChange={onChange}
      />
    </div>
  </form>
)

const PersonForm = ({ onSubmit, newName, newNumber, onNameChange, onNumberChange}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input 
      value={newName}
      onChange={onNameChange}
      />
    </div>
    <div>
      number: <input
      value={newNumber}
      onChange={onNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, deletePerson }) => 
  <div>
    {persons.map((person, index) =>
      <div key={index}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person)}>Delete</button>
      </div>
    )}
  </div>
  

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const personToUpdate = persons.find(person => person.name === newName)
    console.log(personToUpdate)

    if (personToUpdate !== undefined) {
      const newPerson = { ...personToUpdate, number: newNumber}
      updatePerson(newPerson)
    } else {
      const nameObject = { 
        name: newName, 
        number: newNumber
      }
      personService
        .create(nameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
          }) 
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          alert(`Error deleting ${person.name}`)
        })
    }
  }

  const updatePerson = (person) => {
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      personService.update(person.id, person)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          alert(`Error updating the number of ${person.name}`)
        })
    }

  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const filteredPersons = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      /> 
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App