module.exports = {
  second: () => 1000,
  seconds: n => n * 1000,
  minute: () => 1000 * 60,
  minutes: n => n * 1000 * 60,
  hour: () => 1000 * 60 * 60,
  hours: n => n * 1000 * 60 * 60,
  day: () => 1000 * 60 * 60 * 24,
  days: n => n * 1000 * 60 * 60 * 24
}
