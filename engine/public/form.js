console.log("loading...")

var host = "http://ec2-18-188-89-250.us-east-2.compute.amazonaws.com"

$(() => {
  $("#validate-snake-btn").click(event => {
    event.preventDefault()
    $("#errors").text("")

    const url = $("#validate-url").val()
    if (!url) {
      $("#errors").text("snake url is required for validation")
      return
    }

    fetch(`${host}:3005/validateSnake?url=${url}`)
      .then(resp => resp.json())
      .then(json => $("#validate-snake").html(`<pre>${JSON.stringify(json, null, 4)}</pre>`))
      .catch(err => $("#errors").text(err))
  })

  $("#add-snake-btn").click(event => {
    console.log("add-snake")
    event.preventDefault()

    const snakeGroup = $(".snake-group")
    const newGroup = snakeGroup.first().clone()
    const newNum = snakeGroup.length + 1
    const legend = $("legend", newGroup)
    legend.text("Snake " + newNum)
    $(".snake-name-label", newGroup).attr("for", "snake-name-" + newNum)
    $(".snake-name", newGroup).attr("id", "snake-name-" + newNum)
    $(".snake-url-label", newGroup).attr("for", "snake-url-" + newNum)
    $(".snake-url", newGroup).attr("id", "snake-url-" + newNum)
    snakeGroup.first().parent().append(newGroup)
  })

  $("#start-game-btn").click(event => {
    console.log("start-game")
    $("#errors").text("")
    event.preventDefault()
    const height = parseInt($("#height").val())
    const width = parseInt($("#width").val())
    const food = parseInt($("#food").val())
    let MaxTurnsToNextFoodSpawn = 0
    if ($("#food-spawn-chance").val()) {
      MaxTurnsToNextFoodSpawn = parseInt($("#food-spawn-chance").val())
    }
    const snakes = [{
      name: "battlesnake-2020",
      url: `${host}:3000`,
    }]

    $(".snake-group").each(function() {
      const url = $(".snake-url", $(this)).val()
      if (!url) {
        return
      }
      snakes.push({
        name: $(".snake-name", $(this)).val(),
        url
      })
    })
    if (snakes.length === 0) {
      $("#errors").text("No snakes available")
    }
    fetch(`${host}:3005/games`, {
      method: "POST",
      body: JSON.stringify({
        width,
        height,
        food,
        MaxTurnsToNextFoodSpawn,
        "snakes": snakes,
      })
    }).then(resp => resp.json())
      .then(json => {
        const id = json.ID
        fetch(`${host}:3005/games/${id}/start`, {
          method: "POST"
        }).then(_ => {
          $("#board").attr("src", `${host}:3009?engine=${host}:3005&game=${id}`)
        }).catch(err => $("#errors").text(err))
      })
      .catch(err => $("#errors").text(err))
  })
  console.log("ready!")
})