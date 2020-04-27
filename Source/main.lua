--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
function __TS__ArrayForEach(arr, callbackFn)
    do
        local i = 0
        while i < #arr do
            callbackFn(_G, arr[i + 1], i, arr)
            i = i + 1
        end
    end
end

function __TS__ObjectAssign(to, ...)
    local sources = {...}
    if to == nil then
        return to
    end
    for ____, source in ipairs(sources) do
        for key in pairs(source) do
            to[key] = source[key]
        end
    end
    return to
end

function __TS__ArrayConcat(arr1, ...)
    local args = {...}
    local out = {}
    for ____, val in ipairs(arr1) do
        out[#out + 1] = val
    end
    for ____, arg in ipairs(args) do
        if pcall(
            function() return #arg end
        ) and (type(arg) ~= "string") then
            local argAsArray = arg
            for ____, val in ipairs(argAsArray) do
                out[#out + 1] = val
            end
        else
            out[#out + 1] = arg
        end
    end
    return out
end

function __TS__ArrayPush(arr, ...)
    local items = {...}
    for ____, item in ipairs(items) do
        arr[#arr + 1] = item
    end
    return #arr
end

import("CoreLibs/graphics")
gameState = 1
gfx = playdate.graphics
d = playdate.display
w = playdate.display.getWidth()
h = playdate.display.getHeight()
gridSize = 3
gridGap = 1
appPadding = 10
maxGridX = (w - (appPadding * 2)) / (gridSize + gridGap)
maxGridY = (h - (appPadding * 2)) / (gridSize + gridGap)
gfx.setPattern({170, 85, 170, 85, 170, 85, 170, 85})
gfx.fillRect(0, 0, w, h)
startingPlayer = {body = {{1, 3}}, type = "player", direction = 3, eating = 6, length = 1}
foods = {}
snakes = {}
player = nil
playdate.update = function()
    if gameState == 0 then
        tick(nil)
    end
end
tick = function()
    __TS__ArrayForEach(snakes, moveSnake)
    snakeCollisionDetect(nil, player.body[1])
    clearPlayArea(nil)
    __TS__ArrayForEach(foods, drawFood)
    __TS__ArrayForEach(snakes, drawSnake)
end
gameStart = function()
    gfx.setPattern({170, 85, 170, 85, 170, 85, 170, 85})
    gfx.fillRect(0, 0, w, h)
    clearPlayArea(nil)
    snakes = {
        __TS__ObjectAssign({}, startingPlayer)
    }
    foods = {}
    player = snakes[1]
    createFood(nil)
end
includesPos = function(____, arr, pos)
    for ____, arrPos in ipairs(arr) do
        if (pos[1] == arrPos[1]) and (pos[2] == arrPos[2]) then
            return true
        end
    end
    return false
end
posEquals = function(____, pos1, pos2) return (pos1[1] == pos2[1]) and (pos1[2] == pos2[2]) end
xToPos = function(____, gridPosX) return ((gridPosX * gridSize) + ((gridPosX - 1) * gridGap)) + appPadding end
yToPos = function(____, gridPosY) return ((gridPosY * gridSize) + ((gridPosY - 1) * gridGap)) + appPadding end
drawFood = function(____, food)
    gfx.setColor(gfx.kColorBlack)
    gfx.fillRect(
        xToPos(nil, food.position[1]),
        yToPos(nil, food.position[2]),
        gridSize,
        gridSize
    )
end
moveSnake = function(____, snake)
    local nextPos = getNextPositionForSnake(nil, snake)
    snakeCollisionDetect(nil, nextPos)
    snake.body = {
        nextPos,
        table.unpack(snake.body)
    }
    if snake.eating ~= 0 then
        snake.eating = snake.eating - 1
        snake.length = snake.length + 1
        return
    end
    table.remove(snake.body, snake.length + 1)
end
createFood = function()
    local allUnacceptablePositions = {}
    __TS__ArrayForEach(
        snakes,
        function(____, snake)
            allUnacceptablePositions = __TS__ArrayConcat(snake.body, allUnacceptablePositions)
        end
    )
    __TS__ArrayForEach(
        foods,
        function(____, food)
            __TS__ArrayPush(allUnacceptablePositions, food.position)
        end
    )
    local x = 0
    local y = 0
    local ok = false
    while not ok do
        x = math.random(1, maxGridX - 2)
        y = math.random(1, maxGridY - 2)
        ok = not includesPos(nil, allUnacceptablePositions, {x, y})
    end
    __TS__ArrayPush(foods, {expires = 250, type = "apple", position = {x, y}})
end
snakeCollisionDetect = function(____, pos)
    foodCollisions(nil, pos)
    wallCollisions(nil, pos)
    snekCollisions(nil, pos)
end
wallCollisions = function(____, pos)
    local outX = (pos[1] < 0) or (pos[1] > maxGridX)
    local outY = (pos[2] < 0) or (pos[2] > maxGridY)
    if outX or outY then
        gameState = 1
    end
end
foodCollisions = function(____, pos)
    local removeIndexes = {}
    __TS__ArrayForEach(
        foods,
        function(____, f, index)
            if posEquals(nil, f.position, pos) then
                createFood(nil)
                player.eating = 3
                __TS__ArrayPush(removeIndexes, index)
            end
        end
    )
    __TS__ArrayForEach(
        removeIndexes,
        function(____, i) return table.remove(foods, i + 1) end
    )
end
snekCollisions = function(____, pos)
    __TS__ArrayForEach(
        snakes,
        function(____, snake)
            if includesPos(nil, snake.body, pos) and (not posEquals(nil, player.body[1], pos)) then
                gameState = 1
            end
        end
    )
end
clearPlayArea = function()
    gfx.setPattern({})
    gfx.fillRect(10, 10, w - 20, h - 20)
end
drawSnake = function(____, snake)
    if snake.type == "player" then
        gfx.setColor(gfx.kColorBlack)
    else
        gfx.setPattern({85, 170, 85, 170, 85, 170, 85, 170})
    end
    do
        local index = 0
        while index < #snake.body do
            local item = snake.body[index + 1]
            gfx.fillRect(
                xToPos(nil, item[1]),
                yToPos(nil, item[2]),
                gridSize,
                gridSize
            )
            index = index + 1
        end
    end
end
getNextPositionForSnake = function(____, snake)
    local x = 0
    local y = 0
    local head = snake.body[1]
    local ____switch35 = snake.direction
    if ____switch35 == 3 then
        goto ____switch35_case_0
    elseif ____switch35 == 1 then
        goto ____switch35_case_1
    elseif ____switch35 == 0 then
        goto ____switch35_case_2
    elseif ____switch35 == 2 then
        goto ____switch35_case_3
    end
    goto ____switch35_end
    ::____switch35_case_0::
    do
        x = head[1]
        y = head[2] + 1
        goto ____switch35_end
    end
    ::____switch35_case_1::
    do
        x = head[1] - 1
        y = head[2]
        goto ____switch35_end
    end
    ::____switch35_case_2::
    do
        x = head[1] + 1
        y = head[2]
        goto ____switch35_end
    end
    ::____switch35_case_3::
    do
        x = head[1]
        y = head[2] - 1
        goto ____switch35_end
    end
    ::____switch35_end::
    return {x, y}
end
playdate.leftButtonDown = function()
    if player and (player.direction ~= 0) then
        player.direction = 1
    end
end
playdate.rightButtonDown = function()
    if player and (player.direction ~= 1) then
        player.direction = 0
    end
end
playdate.upButtonDown = function()
    if player and (player.direction ~= 3) then
        player.direction = 2
    end
end
playdate.downButtonDown = function()
    if player and (player.direction ~= 2) then
        player.direction = 3
    end
end
playdate.BButtonDown = function()
    if gameState == 1 then
        gameStart(nil)
        gameState = 0
    end
end
playdate.AButtonDown = function()
    if gameState == 1 then
        gameStart(nil)
        gameState = 0
    end
end
