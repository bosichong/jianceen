import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'

export default function Exam({ examData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState(Array(examData.questions.length).fill(''))
  const [showResult, setShowResult] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [currentInputIndex, setCurrentInputIndex] = useState(0)
  const [remainingTime, setRemainingTime] = useState(examData.time)
  const [startTime, setStartTime] = useState(null)
  const [totalTime, setTotalTime] = useState(0)
  
  useEffect(() => {
    let timer
    if (isStarted && remainingTime > 0 && !showResult) {
      setStartTime(Date.now())
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setShowResult(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isStarted])

  useEffect(() => {
    if (showResult && startTime) {
      const endTime = Date.now()
      setTotalTime(Math.floor((endTime - startTime) / 1000))
    }
  }, [showResult])
  
  const handleStart = () => setIsStarted(true)
  
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers]
    const currentAnswer = newAnswers[currentQuestion].split('')
    currentAnswer[index] = value.toLowerCase()
    newAnswers[currentQuestion] = currentAnswer.join('')
    setUserAnswers(newAnswers)
  
    // 自动跳转到下一个输入框
    if (value && index < examData.questions[currentQuestion].answer.length - 1) {
      setCurrentInputIndex(index + 1)
    }
  }
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      setCurrentInputIndex(index - 1)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setCurrentInputIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < userAnswers[currentQuestion].length - 1) {
      setCurrentInputIndex(index + 1)
    } else if (e.key === 'Enter') {
      // 如果当前题目已经填写完整，按回车键进入下一题
      const currentAnswer = userAnswers[currentQuestion]
      const expectedLength = examData.questions[currentQuestion].answer.length
      if (currentAnswer.length === expectedLength) {
        handleNext()
        // 重置输入框索引到第一个位置
        setCurrentInputIndex(0)
      }
    }
  }
  
  const renderInputBoxes = () => {
    const currentAnswer = examData.questions[currentQuestion].answer
    const inputCount = currentAnswer.length
    const boxes = []
  
    for (let i = 0; i < inputCount; i++) {
      boxes.push(
        <input
          key={i}
          type="text"
          maxLength={1}
          value={userAnswers[currentQuestion][i] || ''}
          onChange={(e) => handleAnswerChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          ref={i === currentInputIndex ? (input) => input && input.focus() : null}
          className="w-10 h-10 text-center border border-gray-300 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
        />
      )
    }
  
    return boxes
  }
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  
  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setCurrentInputIndex(0)  // 重置输入框索引到第一个位置
    } else {
      setShowResult(true)
    }
  }
  
  if (showResult) {
    const correctCount = examData.questions.reduce((acc, question, index) => 
      acc + (userAnswers[index] === question.answer.toLowerCase() ? 1 : 0), 0)
    const score = ((correctCount / examData.questions.length) * 100).toFixed(1)
  
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">{examData.title}</h1>
        <p className="mb-6 text-gray-600 text-lg">{examData.description}</p>
        <h3 className="text-3xl mb-6 text-gray-700">得分：<span className="text-blue-600">{score}</span>分</h3>
        <p className="mb-6 text-gray-600 text-lg">答题用时：<span className="text-blue-600">{totalTime}</span>秒</p>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">题目</th>
                <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">你的答案</th>
                <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">正确答案</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {examData.questions.map((question, index) => (
                <tr key={index} className={`${userAnswers[index] === question.answer.toLowerCase() ? 'bg-green-50' : 'bg-red-50'}`}>
                  <td className="px-6 py-4 text-sm text-gray-900">{question.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{userAnswers[index]}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{question.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-center space-x-4 w-full">
          <button onClick={() => window.location.href = '/'} className="text-white bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            返回首页
          </button>
          <button onClick={() => window.location.reload()} className="text-white bg-green-600 hover:bg-green-700 font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            重新答题
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {!isStarted ? (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">{examData.title}</h1>
          <p className="mb-6 text-gray-600 text-lg">{examData.description}</p>
          <p className="mb-6 text-gray-700 text-lg font-medium">答题时间：<span className="text-blue-600">{examData.time}</span>秒</p>
          <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-full md:w-auto">
            开始答题
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-600">第 <span className="text-blue-600 font-bold">{currentQuestion + 1}</span> 题 / 共 {examData.questions.length} 题</span>
              <span className="text-lg font-medium text-gray-600">剩余时间：<span className="text-blue-600 font-bold">{remainingTime}</span>秒</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestion + 1) / examData.questions.length * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-600">第 <span className="text-blue-600 font-bold">{currentQuestion + 1}</span> 题 / 共 {examData.questions.length} 题</span>
            <span className="text-sm text-gray-500">请输入英文答案</span>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{examData.questions[currentQuestion].question}</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {renderInputBoxes()}
          </div>
          <div className="flex justify-between items-center">
            <div>
              {currentQuestion > 0 && (
                <button onClick={handlePrevious} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                  上一题
                </button>
              )}
            </div>
            <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              {currentQuestion === examData.questions.length - 1 ? '提交结果' : '下一题'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const dataDir = path.join(process.cwd(), 'src/data')
  const filenames = fs.readdirSync(dataDir)
  
  const paths = filenames.map(filename => ({
    params: { id: filename.replace(/\.json$/, '') }
  }))
  
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'src/data', `${params.id}.json`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const examData = JSON.parse(fileContents)
  
  return { props: { examData } }
}
