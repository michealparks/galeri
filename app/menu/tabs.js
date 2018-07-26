const tabCL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]

const ArtworkBtn = document.getElementById('btn-artwork-tab')
const PrefsBtn = document.getElementById('btn-prefs-tab')
const activeArrowCL = document.getElementById('active-arrow').classList

const toggle = (n) => {
  activeArrowCL.toggle('tab-0', n === 0)
  activeArrowCL.toggle('tab-1', n === 1)
  tabCL[n].remove('hidden')
  tabCL[n ^ 1].add('hidden')
}

ArtworkBtn.onclick = () => toggle(0)
PrefsBtn.onclick = () => toggle(1)
