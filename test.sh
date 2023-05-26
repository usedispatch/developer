base58WalletAddress="ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy"
devForumId="yjtu_Y1CgN98OJOF"


# Get all topics in a forum
# Get all topics in a subplex
# Get a topic 
# Get all posts in a topic
# Get all users
# Get a specific user
# Get all topics in a forum by a specific user
# Get all posts in a forum by a specific user

# Get pending actions for a user
# curl https://dev.api.solarplex.xyz/action/pending/tmpdid-${base58WalletAddress}:0096

# Get all items in a forum 
# curl https://dev.api.solarplex.xyz/entities/forum/${devForumId}

# Get a single topic in a subplex - whats the diff between this and next one?
# curl https://dev.api.solarplex.xyz/entities/forum/MczyXCM7ieOk0L3A/topic/MczyXCM7ieOk0L3A

# Get a single topic in a forum - how is this diff from above?
# https://dev.api.solarplex.xyz/entities/forum/yjtu_Y1CgN98OJOF/topic/MczyXCM7ieOk0L3A

# Get all posts within a topic
# curl https://dev.api.solarplex.xyz/entities/forum/yjtu_Y1CgN98OJOF/topic/MczyXCM7ieOk0L3A/posts


# Get a user's profile by wallet
# curl https://dev.api.solarplex.xyz/entities/profile/ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy

# Get notifications for a user by did
# curl https://dev.api.solarplex.xyz/notifications/tmpdid-ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy:0096

# create a new post on a topic
action_json="{
  'crud': 1,
  'type': 100,
  'parentId': 'MczyXCM7ieOk0L3A', 
  'params': { 
    'title': 'Hello World from curl', 
    'body': 'Hello world? yes please'
  }
}
"
#echo $action_json
a=$(echo -n ${action_json} | shasum -a 256)
#echo $a

# needs to be changed every time
localActionId=1

rpc="{
  'creatorId': 'tmpdid-ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy:0096',
  'wallet': 'ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy',
  'chainId': 20,
  'hash': '$a',
  'action': $action_json,
  'meta': {
    'actionId': $localActionId
  }
}"

# echo $rpc

post_data="{'action': $rpc}"

echo $post_data
# remember to move all single quotes to ""

echo curl -X POST https://dev.api.solarplex.xyz/action -H 'Content-Type: application/json' -d "$post_data"

# [{"id":"WxSdxcJuJOQoG-_M","actionId":"WxSdxcJuJOQoG-_M","blockOrder":"","chainId":20,"creatorId":"tmpdid-ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy:0096","parentId":"MczyXCM7ieOk0L3A","pendingActionId":"","status":0,"tags":[],"txId":"","wallet":"ChwjoPqevRgZFFBDQazTtPaGTNgqQT6D51p5gcB6KxVy","updatedBlockOrder":"","deletedBy":"","action":{"crud":1,"type":100,"parentId":"MczyXCM7ieOk0L3A","params":{"title":"Hello World from curl","body":"Hello world? yes please"}},"block":0,"errors":[],"hash":"6760e20fc18b77d645da75f943e665c7ce9e744a2049293c2e1c0627bdddb03c -","nonce":"000001885004ecd70000000000000005","originalTargetId":"","pendingId":"1685047897?WxSdxcJuJOQoG-_M","proxyWallet":"","signedTxn":{"type":"Buffer","data":[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,158,193,19,93,211,176,127,123,55,103,69,183,245,53,162,105,93,137,219,90,179,139,180,247,26,31,155,252,58,11,176,44,9,112,207,4,81,135,45,14,137,22,187,99,220,66,229,231,79,84,141,157,138,195,208,129,98,172,132,215,4,239,52,9,2,1,1,3,173,237,174,81,54,176,193,238,10,195,65,217,218,175,101,82,45,3,134,210,194,99,174,249,58,119,12,252,252,217,135,236,176,151,70,213,10,223,239,240,192,201,163,137,56,240,147,243,234,152,55,216,74,67,9,76,17,232,56,107,39,86,25,38,227,246,96,174,77,25,51,6,131,51,214,151,67,213,189,129,76,55,95,110,36,137,183,116,164,172,57,145,206,234,61,0,205,120,53,96,143,102,240,230,32,248,171,13,74,13,6,162,221,66,7,19,15,227,26,237,229,104,255,174,128,29,179,3,1,2,2,0,1,135,1,88,23,241,89,161,239,94,122,173,237,174,81,54,176,193,238,10,195,65,217,218,175,101,82,45,3,134,210,194,99,174,249,58,119,12,252,252,217,135,236,83,0,0,0,87,120,83,100,120,99,74,117,74,79,81,111,71,45,95,77,32,54,55,54,48,101,50,48,102,99,49,56,98,55,55,100,54,52,53,100,97,55,53,102,57,52,51,101,54,54,53,99,55,99,101,57,101,55,52,52,97,50,48,52,57,50,57,51,99,50,101,49,99,48,54,50,55,98,100,100,100,98,48,51,99,32,45,217,27,113,100,0,0,0,0]},"time":0,"txn":0,"meta":{"actionId":1,"actionDeleteKey":"78c69dc3-f25e-499b-947e-46d0f80de112"}}]

