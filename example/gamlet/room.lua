--[[
USE THIS TO INTERCOMM WITH SESSIONS
]]
gamooga.onmessage("send_to_session_MAKEAHASHKEYHERE", function(conn_id, data)
  gamooga.sendtosession(tonumber(data["sess_id"]),"server_broadcasting", data["data"])
end)


--[[
SAMPLE FOR EMULATE CHANNELS ON GAMOOGA
]]
gamooga.onmessage("add_channel", function(conn_id, data)
  gamooga.kv_string_put(data["channel"],data["session_id"])
  code, session_id = gamooga.kv_string_get(data["channel"])
  gamooga.send(conn_id, "add_channel", {code=code,_id=session_id})
end)

gamooga.onmessage("get_session", function(conn_id, channel)
  code, session_id = gamooga.kv_string_get(channel)
  gamooga.send(conn_id, "get_session", {code=code,_id=session_id})
end)




conn_id_map = {}
online_user_list = {}

--[[
On user connect, send him the list of online users in a 
message of type "userlist".
]]
gamooga.onconnect(function(conn_id)
    gamooga.send(conn_id, "userlist", {ol=online_user_list})
end)

--[[
User sends "mynick" message right after he connects to the
room with his nick. We then send a "userjoin" message with
his nick to all the users.
]]
gamooga.onmessage("mynick", function(conn_id, nick)
    online_user_list[nick] = true
    conn_id_map[conn_id] = nick
    gamooga.broadcast("userjoin", nick)
end)

--[[
User sends a "chat" message with his chat. We broadcast it
to all the users.
]]
gamooga.onmessage("chat", function(conn_id, data)
    gamooga.broadcast("chat",{f=conn_id_map[conn_id],c=data});
end)

--[[
User sends a "chat" message with his chat. We broadcast it
to all the users.
]]
gamooga.onmessage("broadcast_to", function(conn_id, data)
  -- gamooga.sendtosession(sess_id, msg_typ, msg)
end)

--[[
On a user disconnect, we send a "usergone" message to all
the users in that room with his nick.
]]
gamooga.ondisconnect(function(conn_id)
    online_user_list[conn_id_map[conn_id]] = nil
    gamooga.broadcast("usergone",conn_id_map[conn_id])
    conn_id_map[conn_id] = nil
end)
