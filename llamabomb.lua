game = game or {}
leaderboard = leaderboard or {}
max_leaderboard_size = 10


--[[
  easy = 1,
  medium = 2,
  hard = 3
]]

Handlers.add(
  "addGame",
  Handlers.utils.hasMatchingTag("Action", "AddGame"),
  function (msg)
    -- Save the message to the Messages table
    table.insert(game, {From = msg.From, Data = msg.Data})

    Handlers.utils.reply("AddGame")(msg)
  end
)

--[[
  return the last game played
]]
Handlers.add(
  "getGame",
  Handlers.utils.hasMatchingTag("Action", "GetGame"),
  function (msg)
    -- Return only the last game to the requester
    local lastGame = game[#game] or {}
    ao.send({Target = msg.From, Data = lastGame})
    Handlers.utils.reply(lastGame["Data"])
  end
)
