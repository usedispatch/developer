const web3 = require("@solana/web3.js");
const fs = require('fs');
const { createHash } = require('crypto');
const fetch = require('node-fetch');

(async () => {
  const decodedKey = new Uint8Array(
    JSON.parse(
      fs.readFileSync('./id.json').toString())
      );
      let fromKeyPair = web3.Keypair.fromSecretKey(decodedKey);
      
      
      const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
      
      const localActionId = 1;
      
      const action_json = {
        'crud': 1,
        'type': 100,
        'parentId': 'MczyXCM7ieOk0L3A',
        'params': {
          'title': 'Hello World from curl',
          'body': 'Hello world? yes please'
        }
      };
      
      const h = createHash('sha256').update(JSON.stringify(action_json)).digest('hex');
      
      rpc = {
        'creatorId': 'tmpdid-5Cm4m2cd64thBR1bRAxKmyJRM3u2foDeFgX9cxjgezoZ:0096',
        'wallet': '5Cm4m2cd64thBR1bRAxKmyJRM3u2foDeFgX9cxjgezoZ',
        'chainId': 20,
        'hash': h,
        'action': action_json,
        'meta': {
          'actionId': localActionId
        }
      };
      
      post_data = {"action": rpc};
      
      console.log('post data: ', post_data);
      
      const a = await fetch('https://dev.api.solarplex.xyz/action', {
      method: 'POST',
      body: JSON.stringify(post_data),
      headers: { 'Content-Type': 'application/json' }
       });
    const d = await a.json();
    console.log(d);
    
    const transaction = web3.Transaction.from(Buffer.from(d[0].signedTxn.data));
    
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeyPair],
      );
      console.log('SIGNATURE', signature);
    })();
    
    