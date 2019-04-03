// ---------------------element
let scoreTxt = document.getElementById('score')
let nicknameTxt = document.getElementById('nickname')
let timeTxt = document.getElementById('totalTime')
let rankList = document.getElementById('rankList')

// ---------------------declaration
let rankArr
let rankStr = ''
let name
let score
let totalTime

// start
init()

// ----------------------init
function init () {
  getPlayerProfile(window.location.search)

  rankStr = window.sessionStorage.getItem('rankList26')
  if (rankStr === undefined || rankStr === null) {
    rankStr = ''
  } else {
    rankArr = strToArr(rankStr)
  }

  manageRank()
  sequence(rankArr)
  showRank()
}

// ----------------------tool
function transferToStrAndSave (arr) {
  let str
  if (arr !== null) {
    str = arrToStr(arr)
  } else {
    str = ''
  }

  window.sessionStorage.setItem('rankList26', str)
}

function getPlayerProfile (str) {
  let splitArr = str.substring(1).split('&')
  name = splitArr[0].split('=')[1]
  score = splitArr[1].split('=')[1]
  totalTime = splitArr[2].split('=')[1]

  nicknameTxt.value = name
  scoreTxt.value = score
  timeTxt.value = totalTime
}

function manageRank () {
  if (!rankArr || rankArr.length < 5) {
    if (!rankArr) {
      rankArr = []
    }
    rankArr.push({'name': name, 'score': score, 'totalTime': totalTime})
  } else {
    for (let i = 0; i < rankArr.length; i++) {
      let entry = rankArr[i]
      if (parseInt(totalTime) > parseInt(entry.totalTime)) {
        entry.name = name
        entry.totalTime = totalTime
        entry.score = score

        break
      }
    }
  }
  transferToStrAndSave(rankArr)
}

function sequence (arr) {
  console.log(arr)
  let temp
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i; j < arr.length - 1; j++) {
      if (parseInt(arr[j].totalTime) < parseInt(arr[j + 1].totalTime)) {
        temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
}

function arrToStr (arr) {
  let str = ''
  let player
  for (let i = 0; i < arr.length; i++) {
    player = arr[i]
    if (player && player.totalTime !== undefined) {
      str += player.name + '&' + player.score + '&' + player.totalTime + '|'
    }
  }
  return str
}

function strToArr (str) {
  let arr = []
  let arr1 = str.split('|')
  let arr2
  for (let i = 0; i < arr1.length - 1; i++) {
    arr2 = arr1[i].split('&')

    arr.push({'name': arr2[0], 'score': arr2[1], 'totalTime': arr2[2]})
  }

  return arr
}

function showRank () {
  console.log(rankArr)
  if (!rankArr || rankArr.length === 0) {
    return
  }
  let i = 0
  for (i; i < rankArr.length; i++) {
    let entry = rankArr[i]
    let li = document.createElement('li')
    let input = document.createElement('input')
    input.setAttribute('value', entry.name + '.................' + entry.totalTime)
    input.readOnly = true
    input.setAttribute('style', 'font-size:15px; border:0px')
    input.setAttribute('size', input.value.length)

    li.appendChild(input)
    rankList.appendChild(li)
  }
}
