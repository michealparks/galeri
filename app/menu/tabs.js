const tabCL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]

const ArtworkBtn = document.getElementById('btn-artwork-tab')
const PrefsBtn = document.getElementById('btn-prefs-tab')

const activeArrowCL = document.getElementById('active-arrow').classList
const btnCL = [ArtworkBtn.classList, PrefsBtn.classList]

ArtworkBtn.onclick = function () {
  toggleActiveArrow(0)
  return toggleTabs(0)
}

PrefsBtn.onclick = function () {
  toggleActiveArrow(1)
  return toggleTabs(1)
}

function toggleActiveArrow(n) {
  activeArrowCL.toggle('active-arrow--tab-0', n === 0)
  activeArrowCL.toggle('active-arrow--tab-1', n === 1)
}

function toggleTabs (activeIndex) {
  btnCL[activeIndex].add('btn--active')
  btnCL[activeIndex ^ 1].remove('btn--active')
  tabCL[activeIndex].remove('tab--hidden')
  return tabCL[activeIndex ^ 1].add('tab--hidden')
}
