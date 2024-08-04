import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { rpc } from "./util";
import { secretKey } from "./keypair";

(async () => {
  const connection = new Connection(rpc);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

  const ix = SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: new Keypair().publicKey,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  });

  const tx = new Transaction();
  tx.add(ix);
  //   添加优先费用  建议为所有的程序增加优先费
  const ixAddPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 1,
  });
  tx.add(ixAddPriorityFee);
  const sx = await sendAndConfirmTransaction(connection, tx, [keypair]);
  console.log(sx);
})();
