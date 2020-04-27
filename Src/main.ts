require("CoreLibs/graphics")

type Position = [number, number]

type Snake = {
  body: Position[]
  type: "player" | "bot"
  direction: Dir
  eating: number
  length: number
}

type Food = {
  position: Position
  expires: number
  type: "apple"
}

const enum Dir {
  Right,
  Left,
  Top,
  Down,
}

const enum GameState {
  Playing,
  GameOver,
}

let gameState = GameState.GameOver

const gfx = playdate.graphics
const d = playdate.display
const w = playdate.display.getWidth()
const h = playdate.display.getHeight()

const gridSize = 3
const gridGap = 1

const appPadding = 10
const maxGridX = (w - appPadding * 2) / (gridSize + gridGap)
const maxGridY = (h - appPadding * 2) / (gridSize + gridGap)

// Draw a BG
gfx.setPattern([0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55])
gfx.fillRect(0, 0, w, h)

// The default starting point for the snake
const startingPlayer: Snake = {
  // first = head
  body: [
    [1, 3]
  ],
  type: "player",
  direction: Dir.Down,
  eating: 6,
  length: 1, // lookup for the body length in lua is tricky
}

// Globals which are the 'game state'
let foods: Food[] = []
let snakes: Snake[] = []
let player = (undefined as unknown) as Snake

// Set up the runloop to only happen when the game is active
playdate.update = function (this: void) {
  if (gameState === GameState.Playing) tick()
}

// Main runloop for the game
const tick = () => {
  snakes.forEach(moveSnake)
  snakeCollisionDetect(player.body[0])

  clearPlayArea()

  foods.forEach(drawFood)
  snakes.forEach(drawSnake)
}

const gameStart = () => {
  // Make a fresh border
  gfx.setPattern([0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55])
  gfx.fillRect(0, 0, w, h)

  // Makes the white BG
  clearPlayArea()

  // Sets up fresh game state
  snakes = [{ ...startingPlayer }]
  foods = []
  player = snakes[0]
  
  createFood()
}

// Some tuple management tools
const includesPos = (arr: Position[], pos: Position) => {
  for (const arrPos of arr) {
    if (pos[0] === arrPos[0] && pos[1] === arrPos[1]) return true
  }
  return false
}

const posEquals = (pos1: Position, pos2: Position) => pos1[0] === pos2[0] && pos1[1] === pos2[1]

// From in-memory grid to x / y positions on the screen
const xToPos = (gridPosX: number) => gridPosX * gridSize + (gridPosX - 1) * gridGap + appPadding
const yToPos = (gridPosY: number) => gridPosY * gridSize + (gridPosY - 1) * gridGap + appPadding

const drawFood = (food: Food) => {
  gfx.setColor(gfx.kColorBlack)
  gfx.fillRect(xToPos(food.position[0]), yToPos(food.position[1]), gridSize, gridSize)
}

const moveSnake = (snake: Snake) => {
  // Add a new head
  const nextPos = getNextPositionForSnake(snake)

  // Check for collisions before we move the snake along one
  snakeCollisionDetect(nextPos)

  // Add the new head
  snake.body = [nextPos, ...snake.body]

  // While eating extend the head, but leave the tail alone
  if (snake.eating !== 0) {
    snake.eating -= 1
    snake.length += 1
    return
  }

  // Remove the last tail entry
  table.remove(snake.body, snake.length + 1)
}

const createFood = () => {
  // Only create a food in a space not contained by other food or snakes
  
  let allUnacceptablePositions: [number, number][] = []
  snakes.forEach((snake) => {
    allUnacceptablePositions = snake.body.concat(allUnacceptablePositions)
  })

  foods.forEach((food) => {
    allUnacceptablePositions.push(food.position)
  })

  let x = 0
  let y = 0
  let ok = false
  while (!ok) {
    // @ts-ignore
    x = Math.random(1, maxGridX - 2)
    // @ts-ignore
    y = Math.random(1, maxGridY - 2)
    ok = !includesPos(allUnacceptablePositions, [x, y])
  }

  foods.push({
    expires: 250,
    type: "apple",
    position: [x, y],
  })
}

const snakeCollisionDetect = (pos: [number, number]) => {
  foodCollisions(pos)
  wallCollisions(pos)
  snekCollisions(pos)
}

const wallCollisions = (pos: [number, number]) => {
  const outX = pos[0] < 0 || pos[0] > maxGridX
  const outY = pos[1] < 0 || pos[1] > maxGridY
  if (outX || outY) {
    gameState = GameState.GameOver
  }
}

const foodCollisions = (pos: [number, number]) => {
  const removeIndexes = [] as number[]
  foods.forEach((f, index) => {
    if (posEquals(f.position, pos)) {
      createFood()
      player.eating = 3
      removeIndexes.push(index)
    }
  })

  removeIndexes.forEach((i) => table.remove(foods, i + 1))
}

const snekCollisions = (pos: [number, number]) => {
  snakes.forEach((snake) => {
    if (includesPos(snake.body, pos) && !posEquals(player.body[0], pos)) {
      gameState = GameState.GameOver
    }
  })
}

const clearPlayArea = () => {
  gfx.setPattern([])
  gfx.fillRect(10, 10, w - 20, h - 20)
}

const drawSnake = (snake: Snake) => {
  if (snake.type === "player") {
    gfx.setColor(gfx.kColorBlack)
  } else {
    gfx.setPattern([0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa])
  }

  for (let index = 0; index < snake.body.length; index++) {
    const item = snake.body[index]
    gfx.fillRect(xToPos(item[0]), yToPos(item[1]), gridSize, gridSize)
  }
}

const getNextPositionForSnake = (snake: Snake): Position => {
 // Add a new head
 let x = 0
 let y = 0
 const head = snake.body[0]
 switch (snake.direction) {
   case Dir.Down:
     x = head[0]
     y = head[1] + 1
     break
   case Dir.Left:
     x = head[0] - 1
     y = head[1]
     break
   case Dir.Right:
     x = head[0] + 1
     y = head[1]
     break
   case Dir.Top:
     x = head[0]
     y = head[1] - 1
     break
 }
 return [x, y]
}

playdate.leftButtonDown = function () {
  if (player && player.direction !== Dir.Right) player.direction = Dir.Left
}
playdate.rightButtonDown = function () {
  if (player && player.direction !== Dir.Left) player.direction = Dir.Right
}
playdate.upButtonDown = function () {
  if (player && player.direction !== Dir.Down) player.direction = Dir.Top
}
playdate.downButtonDown = function () {
  if (player && player.direction !== Dir.Top) player.direction = Dir.Down
}

playdate.BButtonDown = function () {
  if (gameState === GameState.GameOver) {
    gameStart()
    gameState = GameState.Playing
  }
}
playdate.AButtonDown = function () {
  if (gameState === GameState.GameOver) {
    gameStart()
    gameState = GameState.Playing
  }
}
