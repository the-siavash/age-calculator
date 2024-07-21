// get day/month/year from selects
const selectedDay = document.getElementById('day-picker');
const selectedMonth = document.getElementById('month-picker');
const selectedYear = document.getElementById('year-picker');
let selectedDayValue;

document.addEventListener('DOMContentLoaded', () => {
  populateYears();
  populateDays();
});

selectedYear.addEventListener('change', () => {
  clearDayOptions();
  populateDays(selectedDayValue);
});

selectedMonth.addEventListener('change', () => {
  clearDayOptions();
  populateDays(selectedDayValue);
});

selectedDay.addEventListener('change', (event) => {
  selectedDayValue = event.target.value;
});

// populate years in DOM
function populateYears(from = 1900) {
  for (let year = from; year <= new Date().getFullYear(); year++) {
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    opt.selected = year;
    selectedYear.appendChild(opt);
  }
}

// populate days in DOM
function populateDays(defaultDay) {
  const isLeapYear = new Date(selectedYear.value, 1, 29).getDate() === 29;
  const months = {
    January: 31,
    February: isLeapYear ? 29 : 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  const month = selectedMonth.options[selectedMonth.value].text;
  for (let day = 1; day <= months[month]; day++) {
    const opt = document.createElement('option');
    opt.value = day;
    opt.textContent = day;
    if (parseInt(defaultDay) === day) opt.selected = true;
    selectedDay.appendChild(opt);
  }
}

// clear day options in DOM
function clearDayOptions() {
  [...selectedDay.options].forEach((option) => option.remove());
}

// get hour:minute from time-input
const birthTime = document.getElementById('time-picker');
let birthTimeHour = 0;
let birthTimeMinute = 0;

birthTime.addEventListener('change', () => {
  birthTimeHour = birthTime.value.split(':').at(0);
  birthTimeMinute = birthTime.value.split(':').at(1);
});

// app
const submit = document.querySelector('#submit');
const dataContainers = document.querySelectorAll('.data-wrapper');
const dateYear = document.getElementById('year');
const dateMonth = document.getElementById('month');
const dateDay = document.getElementById('day');
const dateHour = document.getElementById('hour');
const dateMinute = document.getElementById('minute');
const dateSecond = document.getElementById('second');
const dateYears = document.getElementById('years');
const dateMonths = document.getElementById('months');
const dateWeeks = document.getElementById('weeks');
const dateDays = document.getElementById('days');
const timeHour = document.getElementById('hours');
const timeMinute = document.getElementById('minutes');
const timeSecond = document.getElementById('seconds');
const nextBirthDay = document.getElementById('birthday-counter');
const birthDateContainer = document.getElementById('birthdate');

const data = {};
let birthDate;

submit.addEventListener('click', () => {
  dataContainers.forEach(
    (dataContainer) => (dataContainer.style.display = 'grid')
  );

  birthDate = new Date(
    selectedYear.value,
    selectedMonth.value,
    selectedDay.value,
    birthTimeHour,
    birthTimeMinute,
    0
  );

  app();

  setInterval(() => app(), 1000);
});

// calculate year-month-day and save it to data{}
function calculateAge(birthDate) {
  const birthYaer = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  data.year = year - birthYaer;

  if (month >= birthMonth) {
    data.month = month - birthMonth;
  } else {
    data.year -= 1;
    data.month = 12 + month - birthMonth;
  }

  if (day >= birthDay) {
    data.day = day - birthDay;
  } else {
    data.month -= 1;
    data.day = getDaysInMonth(birthYaer, birthMonth) + day - birthDay;
  }

  if (data.month < 0) {
    data.month = 11;
    data.year -= 1;
  }
}

// calculate h:m:s and save it to data{}
function calculateTimeFromBirthDate(birthDate, nowDate) {
  let delta = (nowDate - birthDate) / 1000;
  data.hours = Math.floor(delta / 60 / 60);
  data.minutes = Math.floor(delta / 60);
  data.seconds = Math.floor(delta);
}

function calculateDaysToNextBirthDay() {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  const delta = (now.getTime() - target.getTime()) / 1000;
  let daysToNextBirthday = Math.floor(delta / 86400);
  if (daysToNextBirthday === 0) return 0;
  if (daysToNextBirthday < 0) return Math.abs(daysToNextBirthday);
  let daysOfYear = [];
  for (let month = 0; month < 12; month++) {
    daysOfYear.push(getDaysInMonth(now.getFullYear(), month));
  }
  return daysOfYear.reduce((acc, value) => acc + value, 0) - daysToNextBirthday;
}

function calculateDateFromBirthDate(birthDate) {
  const delta = (Date.now() - birthDate.getTime()) / 1000;
  // 0 Years 0 Months 0 Weeks 0 Days
  data.years = data.year;
  data.days = Math.floor(delta / (60 * 60 * 24));
  data.weeks = Math.floor(data.days / 7);
  data.months = data.years * 12 + data.month;
}

function getDaysInMonth(year, month) {
  return new Date(year, month - 1, 0).getDate();
}

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function findMonthName(month) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
}

function findDayName(day) {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return days[day - 1];
}

function app() {
  // update birthDateContainer in DOM
  birthDateContainer.innerHTML = `${findDayName(
    birthDate.getDay()
  )}, ${birthDate.getDate()} ${findMonthName(
    birthDate.getMonth()
  )} ${birthDate.getFullYear()}, 
  ${birthDate
    .getHours()
    .toString()
    .padStart(2, 0)
  }:${birthDate
    .getMinutes()
    .toString()
    .padStart(2, 0)
  }`;

  // calculate age and update DOM
  calculateAge(birthDate);
  dateYear.textContent = data.year;
  dateMonth.textContent = data.month;
  dateDay.textContent = data.day;
  const now = new Date();
  dateHour.textContent = now.getHours();
  dateMinute.textContent = now.getMinutes();
  dateSecond.textContent = now.getSeconds();

  // calculate Date and update DOM
  calculateDateFromBirthDate(birthDate);
  dateYears.textContent = data.years;
  dateMonths.textContent = numberWithCommas(data.months);
  dateWeeks.textContent = numberWithCommas(data.weeks);
  dateDays.textContent = numberWithCommas(data.days);

  // calculate Time and update DOM
  calculateTimeFromBirthDate(birthDate.getTime(), Date.now());
  timeHour.textContent = numberWithCommas(data.hours);
  timeMinute.textContent = numberWithCommas(data.minutes);
  timeSecond.textContent = numberWithCommas(data.seconds);

  // calculate days to next birth-date and update DOM
  data.daysToNextBirthday = calculateDaysToNextBirthDay();
  if (data.daysToNextBirthday !== 0) {
    nextBirthDay.innerHTML = `Days to your next birthday: <span class="clr-800">${data.daysToNextBirthday}</span>`;
  } else {
    nextBirthDay.textContent = 'Happy Birth Day 🎂🎉🥳';
  }
}
