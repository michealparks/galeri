const tabCL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]

const ArtworkBtn = document.getElementById('btn-artwork-tab')
const PrefsBtn = document.getElementById('btn-prefs-tab')
const activeArrowCL = document.getElementById('active-arrow').classList
const btnCL = [ArtworkBtn.classList, PrefsBtn.classList]

ArtworkBtn.onclick = () => toggle(0)
PrefsBtn.onclick = () => toggle(1)

function toggle (n) {
  activeArrowCL.toggle('tab-0', n === 0)
  activeArrowCL.toggle('tab-1', n === 1)
  btnCL[n].add('btn--active')
  btnCL[n ^ 1].remove('btn--active')
  tabCL[n].remove('tab--hidden')
  tabCL[n ^ 1].add('tab--hidden')
}
