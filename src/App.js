// css
import './App.css';

// react
import { React,  useEffect, useState, useCallback } from 'react';

// data
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 0, name: 'start'},
  {id: 1, name: 'game'},
  {id: 2, name: 'end'},
]

// quantity of guesses
const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState("")

  const [guessedLetters, setGuessedLetters] = useState(['a'])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
   
    //pic a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
   
    return { word, category }
    
  }, [words]);

  
  // start the game
  const startGame = useCallback(() => {
  // clear all letters
  clearLetterStates()
    

  // pick word and pick category  
    const { word, category } = pickWordAndCategory()

  // create an array of letters
    let wordLetters = word.split('')

    wordLetters = wordLetters.map((i) => i.toLowerCase())


    console.log(word)
   

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
    
  }, [pickWordAndCategory])

  
  // process the letter input
  const verifyLetter = (letter) => {
    

    const normalizedLetter = letter.toLowerCase()

    // check if the letter ha already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])  

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGameStage([])
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  
    // check win condition
  useEffect(() => {
      const uniqueLetters = [...new Set(letters)]

      // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      
      //add score
      setScore((score + 100))

      // restart game w/ new word
      startGame()

    }  
  }, [guessedLetters, letters, startGame, score])

  //restart the game
  const retry = () => {
   setScore(0)
   setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
    {gameStage === 'start' && <StartScreen startGame={startGame}/>}
    {gameStage === 'game' && (
      <Game 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters} 
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
    )}
    {gameStage === 'end' && <GameOver retry={retry} score={score}  />}
    </div>
  )
}

export default App
