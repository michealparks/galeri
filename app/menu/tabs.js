const CL = [
  document.getElementById('description').classList,
  document.getElementById('preferences').classList
]
const ArtworkTabBtn = document.getElementById('btn-artwork-tab')
const PrefsTabBtn = document.getElementById('btn-prefs-tab')

ArtworkTabBtn.onclick = toggleTabs.bind(null, 0)
PrefsTabBtn.onclick = toggleTabs.bind(null, 1)

function toggleTabs (activeIndex) {
  CL[activeIndex].remove('tab--hidden')
  CL[activeIndex ^ 1].add('tab--hidden')
}
