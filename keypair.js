const { decode, encode } = require('bs58');

const { Keypair } = require('@solana/web3.js');
const { existsSync } = require('node:fs');
const { parse } = require('json5');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');

function getPath(...paths) {
  const args = [process.cwd(), ...paths];
  return resolve.apply(null, args);
}

async function getFile(path) {
  const cwdPath = getPath(path);
  if (!existsSync(cwdPath)) {
    return;
  }

  return await readFile(cwdPath);
}

async function getJson(path) {
  let file = await getFile(path);
  // Try to parse the file as json.
  try {
    file = parse(file.toString());
  } catch (err) {}
  return file ?? {};
}

async function getKeyPair() {
  // id.local.json = { privateKey: yourPrivateKey }
  const { privateKey } = await getJson('./id.local.json');
  return Keypair.fromSecretKey(decode(privateKey));
}

async function getKeyPairStrings() {
  const { publicKey, secretKey } = await getKeyPair();
  return [publicKey.toBase58(), encode(secretKey)];
}

module.exports = {
  getKeyPair,
  getKeyPairStrings,
}
