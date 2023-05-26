const web3 = require("@solana/web3.js");
const fs = require('fs');
const { createHash } = require('crypto');
const fetch = require('node-fetch');
const { getKeyPair, getKeyPairStrings } = require("./keypair");
const { decode, encode } = require('bs58');

// Forum Id
const forumActionId = 'yjtu_Y1CgN98OJOF';
const topicActionId = 'MczyXCM7ieOk0L3A';

// Establish the connection
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

// Have a count of the local id -- how you can find the action again.
let localActionId = 0;

async function getTopicId(topicActionId) {
  const url = `https://dev.api.solarplex.xyz/entities/forum/${forumActionId}/topic/${topicActionId}`;
  const items = await (await fetch(url, { headers: { 'Content-Type': 'application/json' } })).json();
  const topic = items.find((i) => i.actionId === topicActionId && i.actionId !== i.id);
  return topic.id;
}

async function getPostActionJson(body, topicActionId) {
  const parentId = await getTopicId(topicActionId);
  return {
    crud: 1,
    type: 100,
    parentId,
    params: {
      title: 'Hello World from curl', // Not required for a post
      body, // Required for a post
    }
  };
}

function getUserIdFromWalletAddress(address) {
  return `tmpdid-${address}:0096`
}

async function sendTxFromAction(actionJson) {
  const tx = web3.Transaction.from(actionJson.signedTxn.data);
  // First sign it with your wallet.
  tx.partialSign(await getKeyPair());
  // Then get blockhash and lastValidBlockHeight
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
  const strategy = {
    blockhash,
    lastValidBlockHeight,
    signature: encode((tx).signature),
  };
  // Now send it.
  return await web3.sendAndConfirmRawTransaction(connection, (tx).serialize(), strategy, { skipPreflight: false });
}

async function createPost(body, topicActionId) {
  const action = await getPostActionJson(body, topicActionId);
  const hash = createHash('sha256').update(JSON.stringify(action)).digest('hex');
  const [publicKey] = await getKeyPairStrings();
  const actionId = ++localActionId;
  const rpc = {
    creatorId: getUserIdFromWalletAddress(publicKey),
    wallet: publicKey,
    chainId: 20,
    hash,
    action,
    meta: {
      actionId,
    }
  };
  const items = await(await fetch('https://dev.api.solarplex.xyz/action', {
    method: 'POST',
    body: JSON.stringify({ action: rpc }),
    headers: { 'Content-Type': 'application/json' }
  })).json();
  const actionJson = items.find((i) => i.meta?.actionId == actionId);
  await sendTxFromAction(actionJson);
  return actionJson.id;
}

async function hasPendingAction(actionId) {
  const [publicKey] = await getKeyPairStrings();
  const url = `https://dev.api.solarplex.xyz/action/pending/${getUserIdFromWalletAddress(publicKey)}`;
  const items = await (await fetch(url, { headers: { 'Content-Type': 'application/json' } })).json();
  return items.find((i) => i.id === actionId );
}

async function sleep(ms) {
  return await new Promise((resolve) => setTimeout(resolve, Math.max(ms, 0)));
}

async function pollPending(actionId) {
  const pending = await hasPendingAction(actionId);
  if (pending) {
    console.log(`Action (${actionId}) pending...`);
    await sleep(1000);
    return pollPending(actionId);
  }
  console.log(`Successfully posted ${actionId}! See it here: ${`https://dev.solarplex.xyz/${topicActionId}`}`)
}

const [body] = process.argv.slice(2);

(async () => {
  if (!(body ?? '').trim()) {
    console.error(`Please provide a body in the command line ala: node send 'this is my body'`);
    return;
  }
  console.log('creating a post with the body:', body);
  console.log('using wallet:', (await getKeyPairStrings())[0]);
  const actionId = await createPost(body, topicActionId);
  await pollPending(actionId);
})();
    
    