// ---------------------------------element
let timeTxt = document.getElementById('timeKeeper')
let questionTxt = document.getElementById('question')
let answerInput = document.getElementById('answerInput')
let answerBtn = document.getElementById('answerBtn')
let selectionList = document.getElementById('selectionList')
let scoreTxt = document.getElementById('score')
let nicknameTxt = document.getElementById('nickname')

// declaration
let timer
let URL
let nextURL
let answer
let isRadio
let selectArr
let liArr
let score
let nickname
let res
let totalTime

// --------------------execute
init()

function init () {
  timer = null
  URL = null
  nextURL = null
  answer = null
  isRadio = false
  selectArr = []
  liArr = []
  score = 0
  totalTime = 0

    // display
  score.value = 0
  timeTxt.value = 0

  URL = 'http://vhost3.lnu.se:20080/question/1'
  fetchURL(URL)
  timerkeeper()
  getNickname(window.location.search)
}

// ------------------------fetch
async function fetchURL (url) {
  try {
    await window.fetch(url).then(function (response) {
      return response.json().then(function (json) {
        allocation(json)
      })
    })
  } catch (e) {
    console.log('Oops, error', e)
  }
}

async function fetchPost (url, answer) {
  console.log(answer)
  await window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer: answer,
      nextURL: url
    })
  })
      .then(function (response) {
        if (response.status === 400) {
          window.location.href = 'lose.html'
        }
        res = response
        return response.json()
      })
      .then((responseJsonData) => {
        if (responseJsonData.nextURL) {
          nextURL = responseJsonData.nextURL
          console.log('post   ' + nextURL)
          fetchURL(nextURL)
        } else if (res.status !== 400 && !responseJsonData.nextURL) {
          window.location.href = 'win.html?name=' + nickname + '&score=' + score + '&totalTime=' + totalTime
        }
      })
      .catch((e) => {
        console.log('Oops, error', e)
      })
}

// -------------------------------tool
function allocation (json) {
  console.log(json)

  questionTxt.size = json.question.length
  questionTxt.value = json.question
  nextURL = json.nextURL
  console.log('get  ' + nextURL)

  if (json.alternatives) {
        // clear ul
    removeAllLi()
    selectArr = []
    liArr = []

    selectionList.style.display = 'block'
    answerInput.type = 'hidden'
    isRadio = true
    let i = 1
    for (let alt in json.alternatives) {
      let li = document.createElement('li')
      let input = document.createElement('input')
      input.setAttribute('value', json.alternatives['alt' + i])
      input.readOnly = true
      input.setAttribute('style', 'border:0px')
      input.setAttribute('size', input.value.length)
      let radio = document.createElement('input')
      radio.setAttribute('id', 'alt' + i)
      radio.setAttribute('type', 'radio')
      radio.setAttribute('name', 'answer')
      radio.setAttribute('value', 'alt' + i)
      radio.checked = false

      selectArr.push(radio)
      li.appendChild(radio)
      li.appendChild(input)
      liArr.push(li)
      selectionList.appendChild(li)

      i++
    }
  } else {
    answerInput.value = ''
    answerInput.type = 'show'
    selectionList.style.display = 'none'
    isRadio = false
  }
}

function answerValue () {
  if (!isRadio) {
    answer = answerInput.value
  } else {
    let i = 0
    for (i; i < selectArr.length; i++) {
      let radio = selectArr[i]
      if (radio.checked === true) {
        answer = radio.value
      }
    }
  }
}

function removeAllLi () {
  if (liArr && liArr.length !== 0) {
    let i = 0

    for (i; i < liArr.length; i++) {
      let li = liArr[i]
      li.remove()
    }
  }
}

function timerkeeper () {
  if (timeTxt) {
    let n = 0
    clearInterval(timer)
    timer = setInterval(function () {
      n++
      var s = parseInt(n / 60 % 60)
      timeTxt.value = 20 - s

      if (timeTxt.value <= 0) {
        answerQuestion()
      }
    }, 1000 / 60)
  }
}

function answerQuestion () {
  totalTime = totalTime + parseInt(timeTxt.value)
  answerValue()

  fetchPost(nextURL, answer)

  score++
  scoreTxt.value = score

  timeTxt.value = 0
  timerkeeper()
}

function getNickname (str) {
  nickname = str.substring(6)
  nicknameTxt.value = nickname
}

// -------------------------------event
answerBtn.onclick = function () {
  answerQuestion()
}
