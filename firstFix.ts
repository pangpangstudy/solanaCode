import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { rpc } from "./util";
import fs from "fs";
export function loadWalletKey(keyPairFile: string) {
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keyPairFile).toString()))
  );
  return loaded;
}
(async () => {
  const connection = new Connection(rpc);
  const keyPair = loadWalletKey("keyPair.json");
  // 直接先空投完毕
  //   const airdrop = await connection.requestAirdrop(
  //     keyPair.publicKey,
  //     0.1 * LAMPORTS_PER_SOL
  //   );

  const balance = await connection.getBalance(keyPair.publicKey);
  console.log(balance);
  const ix = SystemProgram.transfer({
    fromPubkey: keyPair.publicKey,
    toPubkey: new Keypair().publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });
  const tx = new Transaction();
  tx.add(ix);
  const sx = await sendAndConfirmTransaction(connection, tx, [keyPair]);
  console.log(sx);
})();
