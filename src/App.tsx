import { useState, useEffect } from 'react'
import './App.css'
import { IQuestion, IUserAnswer } from './types'
import { getQuesionList } from './components/services/fetchQuestions';
import { Difficulty, totalQuestions } from './components/constants';
import AppSpinner from './components/Spinner/index';
import AppButton from './components/AppButton';
import { Box, Heading } from '@chakra-ui/react';
import QuesionCard from './components/QuestionCard';

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState<IUserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const questionListing = await getQuesionList(
        totalQuestions,
        Difficulty.EASY
      );
      setQuestions(questionListing);
      setLoading(false);
    }
    fetchQuestions();
  }, [])

  const startQuizGame = () => {
    setStartQuiz(true)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if(gameOver) return;

    const choseAnswer = e.currentTarget.innerText;
    const correct = questions[questionNumber]?.correct_answer === choseAnswer;
    // 정답 점수 + 1
    correct && setScore((previous) => previous + 1);

    const answerObject = {
      question: questions[questionNumber]?.question,
      answer: choseAnswer,
      correct,
      correctAnswer: questions[questionNumber]?.correct_answer
    };
    setUserAnswer((previous) => [...previous, answerObject]);
  }

  const nextQuestison = (): void => {
    const nextQuestion = questionNumber + 1;
    totalQuestions === nextQuestion
    ? setGameOver(true)
    : setQuestionNumber(nextQuestion)
  }

  const replayQuiz = () => {
    setStartQuiz(false)
    setGameOver(false)
    setQuestionNumber(0)
    setScore(0)
    setUserAnswer([])
  }

  return (
    <main>
      {loading && (
        <div className="app-spinner">
          <AppSpinner
            speed="0.65s"
            emptyColor="gray.200" 
            thickness="5px" 
            color="purple"
            size="lg"
          />
        </div>
      )}

      { userAnswer.length === questionNumber &&
        !gameOver && 
        !loading &&
        !startQuiz 
        ? (
          <>
            <div className="greenting-box">
                <Box boxShadow="base" p="6" rounded="md" bg="white" maxW="560px">
                  <Heading as="h2" size="lg" mb={2}>
                    Quiz App
                  </Heading>

                  <p>
                    참 또는 거짓으로 대답할 수 있는 {totalQuestions}개의 질문이 제시됩니다.
                  </p>

                  <AppButton 
                    colorScheme='purple'
                    variant='solid'
                    onClick={startQuizGame}
                    value='Start Quiz Game'
                  />
                </Box>
            </div>
          </>
        ) 
        : null
      }

      { !loading && !gameOver && startQuiz && (
        <Box boxShadow="base" p="6" rounded="md" bg="white" maxW="560px">
          <QuesionCard 
            questions={questions[questionNumber].question}
            category={questions[questionNumber].category}
            checkAnswer={checkAnswer}
            totalQuestions={totalQuestions}
            questionNumber={questionNumber}
          />

          <AppButton
            disabled={
              userAnswer.length === questionNumber + 1 &&
              questionNumber !== totalQuestions
              ? false
              : true
            }
            colorScheme='purple'
            variant='solid'
            onClick={nextQuestison}
            value='Next Question'
            className="next-button"
            width="full"
          />
        </Box>
      )}

      { gameOver && (
        <>
          <Box boxShadow="base" p="6" rounded="md" bg="white" maxW="560px">
            <Box mb={4}>
              <Box fontWeight="bold" as="h3" fontSize="4xl">
                Game Over!
              </Box>
              <Box as="h3" fontSize="xl">
                Your Score id {score}/{totalQuestions}.
              </Box>
            </Box>

            {userAnswer.map((answer, index) => (
              <Box key={index}>
                <div className="answer-list">
                  <Box fontSize="md" fontWeight="bold">
                    Q.{index + 1}
                    <p dangerouslySetInnerHTML={{__html: answer.question}} />
                  </Box>
                  <ul>
                    <li>You answered: {answer.answer}</li>
                    <li>Correct answer: {answer.correctAnswer}</li>
                  </ul>
                </div>
              </Box>
            ))}

            <AppButton
              colorScheme='purple'
              variant='solid'
              onClick={replayQuiz}
              value='Replay Quiz'
              width='full'
            />

          </Box>
        </>
      )}
    </main>
  )
}

export default App
