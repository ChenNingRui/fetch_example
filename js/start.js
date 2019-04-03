
    // ---------------------------------element
    let nicknameInput = document.getElementById('nicknameInput')
    let startBtn = document.getElementById('startBrn')

    // -------------------------------event
    startBtn.onclick = function () {
      if (nicknameInput.value !== '' && nicknameInput.value != null && nicknameInput.value !== undefined) {
        window.location.href = 'question.html?name=' + nicknameInput.value
      } else {
        window.alert('Input your nickname')
      }
    }
