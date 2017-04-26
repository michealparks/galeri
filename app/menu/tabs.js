const tabCL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]

const ArtworkBtn = document.getElementById('btn-artwork-tab')
const PrefsBtn = document.getElementById('btn-prefs-tab')

const activeArrowCL = document.getElementById('active-arrow').classList
const btnCL = [ArtworkBtn.classList, PrefsBtn.classList]

const ACTIVE_0 = 'active-arrow--tab-0'
const ACTIVE_1 = 'active-arrow--tab-1'
const BTN_ACTIVE = 'btn--active'
const TAB_HIDDEN = 'tab--hidden'

ArtworkBtn.onclick = function () {
  toggleActiveArrow(0)
  toggleTabs(0)
}

PrefsBtn.onclick = function () {
  toggleActiveArrow(1)
  toggleTabs(1)
}

function toggleActiveArrow (n) {
  activeArrowCL.toggle(ACTIVE_0, n === 0)
  activeArrowCL.toggle(ACTIVE_1, n === 1)
}

function toggleTabs (activeIndex) {
  btnCL[activeIndex].add(BTN_ACTIVE)
  btnCL[activeIndex ^ 1].remove(BTN_ACTIVE)
  tabCL[activeIndex].remove(TAB_HIDDEN)
  tabCL[activeIndex ^ 1].add(TAB_HIDDEN)
}
