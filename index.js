const canvas = document.querySelector("canvas");
const secondsCount = document.querySelector(".seconds")
const context = canvas.getContext("2d");
const pugDimensions = { width: 353 * 1.2, height: 325 * 1.2 };

const startTime = Date.now()

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.translate(window.innerWidth / 2, window.innerHeight / 2);

const image = new Image();
image.src = "./assets/pug.png";

const loopingPugs = 40
const offsetDistance = 100
let currentOffset = 0

image.onload = () => {
  startLooping();
};

function draw(offset) {
  context.drawImage(
    image,
    -pugDimensions.width / 2 - offset/2,
    -pugDimensions.height / 2 - offset/2,
    pugDimensions.width + offset,
    pugDimensions.height + offset
  );
}



function loopDraw() {
  for(let i = loopingPugs; i >= 1; i--) {
    draw(i * offsetDistance + currentOffset)
  }

  draw(offsetDistance)

  currentOffset++
  if(currentOffset >= offsetDistance) {
    currentOffset = 0
  }

  const newTime = Math.floor((Date.now() - startTime) / 1000)

  secondsCount.innerText = newTime

  requestAnimationFrame(loopDraw)
}

function startLooping() {
  requestAnimationFrame(loopDraw)
}


