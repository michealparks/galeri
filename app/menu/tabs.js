const tabCL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]

const ArtworkBtn = document.getElementById('btn-artwork-tab')
const PrefsBtn = document.getElementById('btn-prefs-tab')

const btnCL = [
  ArtworkBtn.classList,
  PrefsBtn.classList
]

ArtworkBtn.onclick = function () {
  return toggleTabs(0)
}

PrefsBtn.onclick = function () {
  return toggleTabs(1)
}

function toggleTabs (activeIndex) {
  btnCL[activeIndex].add('btn--active')
  btnCL[activeIndex ^ 1].remove('btn--active')
  tabCL[activeIndex].remove('tab--hidden')
  return tabCL[activeIndex ^ 1].add('tab--hidden')
}
