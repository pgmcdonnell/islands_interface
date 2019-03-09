//join channel
var socket = new Phoenix.Socket("/socket", {params: {token: window.userToken}})
socket.connect()
function new_channel(subtopic, screen_name) {
    return socket.channel("game:" + subtopic, {screen_name: screen_name});
}
var game_channel = new_channel("moon", "moon")
function join(channel) {
    channel.join()
    .receive("ok", response => {
        console.log("joined sucessfully!", response)
    })
    .receive("error", response => {
        console.log("unable to join", response)
    })
}
join(game_channel)

//start new game (following joining commands)
function new_game(channel) {
    channel.push("new_game")
    .receive("ok", response => {
        console.log("New Game!", response)
    })
    .receive("error", response => {
        console.log("Unable to start a new game.", response)
    })
}
new_game(game_channel)

//make visible when a new player joins
game_channel.on("player_added", response => {
    console.log("Player Added", response)
})

//adding a second player to a game (after join command, in second browser)
function add_player(channel, player) {
    channel.push("add_player", player)
    .receive("error", response => {
        console.log("unable to add new player: " + player, response)
    })
}
add_player(game_channel, "PlayerName")

//positioning islands
function position_island(channel, player, island, row, col) {
  var params = {"player": player, "island": island, "row": row, "col": col}
  channel.push("position_island", params)
  .receive("ok", response => {
    console.log("Island positioned!", response)
  })
  .receive("error", response => {
    console.log("Unable to position island.", response)
  })
}

//handy positions for all islands
position_island(game_channel, "player2", "atoll", 1, 1)
position_island(game_channel, "player2", "dot", 1, 5)
position_island(game_channel, "player2", "l_shape", 1, 7)
position_island(game_channel, "player2", "s_shape", 5, 1)
position_island(game_channel, "player2", "square", 5, 5)

//setting islands once positioned
function set_islands(channel, player) {
  channel.push("set_islands", player)
  .receive("ok", response => {
    console.log("Here is the board:")
    console.dir(response.board)
  })
  .receive("error", response => {
    console.log("Unable to set islands for: " + player, response)
  })
}

//listen for a response to setting islands
game_channel.on("player_set_islands", response => {
  console.log("Player set islands", response)
})

//guess coordinate
function guess_coordinate(channel, player, row, col) {
  var params = {"player": player, "row": row, "col": col}
  channel.push("guess_coordinate", params)
  .receive("error", response => {
    console.log("Unable to guess a coordinate:" + player, response)
  })
}

//listen for response to guessing coordinates
game_channel.on("player_guessed_coordinate", response => {
  console.log("Player Guessed Coordinate: ", response.result)
})
