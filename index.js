const canvas = document.querySelector("canvas");
const secondsCount = document.querySelector(".seconds");
const level = document.querySelector(".grade");
const context = canvas.getContext("2d");
const pugDimensions = { width: 353 * 1.2, height: 325 * 1.2 };


const positiveLevels = {
  0: "Assistant",
  5: "Sr Assistant",
  10: "Jr Honoror",
  15: "Master Honoror",
  35: "S Tier Honoror",
  65: "Junior Acolyte",
  105: "Acolyte",
  150: "Senior Acolyte",
  250: "Priest",
  450: "Sage",
  650: "Hermit",
  1000: "Senior Hermit",
  1500: "CEO",
  2500: "Pope",
  3500: "Underlord",
  4500: "Lord",
  10500: "OverLord",
  20500: "King",
  30500: "Anunnaki"
}

const negativeLevels = {
  5: "Minor Failer",
  10: "Amateur Failer",
  15: "Master Failer",
  35: "S Tier Failer",
  65: "Junior Disgrace",
  105: "Disgrace",
  150: "Senior Disgrace",
  250: "Rascal",
  450: "Pariah",
  650: "Outcast",
  1000: "Senior Outcast",
  1500: "Unemployed",
  2500: "Beggar",
  3500: "Criminal",
  4500: "Wanted Criminal",
  10500: "Exiled",
  20500: "Junior Evil Mastermind",
  30500: "Evil Mastermind",
  40500: "Senior Partner in the Firm of Evil Mastermind & Sons, Inc.",
}

const startTime = Date.now();
let blurStart;
let totalBlurredTime = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.translate(window.innerWidth / 2, window.innerHeight / 2);

const image = new Image();
image.src = "./assets/pug.png"; // Photo credit to Matthew Henry (https://unsplash.com/photos/U5rMrSI7Pn4)

const loopingPugs = 40; // 125 pugs required to cover a full 4K television screen. Tested via Firefox DevTools
const offsetDistance = 120;
let currentOffset = 0;

const movementRange = 200

const mouseOffset = {
  x: 0,
  y: 0
}

const movementOffset = {
  x: 0,
  y: 0
}

image.onload = () => {
  startLooping();
};

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.setTransform(1, 0, 0, 1, 0, 0); //Reset the canvas context
  context.translate(window.innerWidth / 2, window.innerHeight / 2);
};

window.addEventListener('mousemove', onMouseMove)

function draw(offset, loopCount) {

  let currentPercentage = (loopingPugs - loopCount) / loopingPugs
  context.drawImage(
    image,
    -pugDimensions.width / 2 - offset/2 + (movementOffset.x * currentPercentage),
    -pugDimensions.height / 2 - offset/2 + (movementOffset.y * currentPercentage),
    pugDimensions.width + offset,
    pugDimensions.height + offset
  );
}

function onMouseMove(e) {
  mouseOffset.x = (e.clientX - window.innerWidth / 2) / window.innerWidth / 2 * movementRange
  mouseOffset.y = (e.clientY - window.innerHeight / 2) / window.innerHeight / 2 * movementRange
}

function lerp(start, end, amount) {
  return start*(1-amount)+end*amount
}

function loopDraw() {

  movementOffset.x = lerp(movementOffset.x, mouseOffset.x, 0.05)
  movementOffset.y = lerp(movementOffset.y, mouseOffset.y, 0.05)

  for (let i = loopingPugs; i >= 1; i--) {
    draw(i * offsetDistance + currentOffset, i);
  }

  draw(offsetDistance, 1);

  currentOffset++;
  if (currentOffset >= offsetDistance) {
    currentOffset = 0;
  }

  const newTime = Math.floor((Date.now() - startTime) / 1000) - totalBlurredTime;

  secondsCount.innerText = newTime;


  if (newTime > 0) { // if the time is positive, use the positiveLevels
    console.log('positive')
    if (positiveLevels[newTime]) {
    level.innerText = positiveLevels[newTime];
    }
  } else { // the time is negative, so use the negativeLevels
    const levelNumbers = Object.keys(negativeLevels);

    // find the highest level that is less than the current time
    const currentRank = levelNumbers.reduce((highest, current) => {
      const numOfSeconds = Math.abs(newTime); // convert to positive number
      if (numOfSeconds >= current && current > highest) {
        return parseInt(current)
      } else { return parseInt(highest) }
    }, 0);
  
    level.innerText = negativeLevels[currentRank];
  }

  requestAnimationFrame(loopDraw);
}

// on blur, record the time
window.addEventListener('blur', (e) => {
  blurStart = Date.now();
})

// on window focus, record the time spent blurred and add it to the totalBlurredTime
window.addEventListener('focus', (e) => {
  let blurredTime = Math.floor((Date.now() - blurStart) / 1000);
  totalBlurredTime += blurredTime * 2; //this has to be doubled to counteract the time that passed while blurred
})

function startLooping() {
  requestAnimationFrame(loopDraw);
}
