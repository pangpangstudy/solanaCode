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
import { secretKey } from "./keypair";
import {
  createMint,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

(async () => {
  const connection = new Connection(rpc);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  const mint = new Keypair();
  //   const rent = await getMinimumBalanceForRentExemptMint(connection);

  //   const ix = SystemProgram.createAccount({
  //     fromPubkey: keypair.publicKey,
  //     newAccountPubkey: mint.publicKey,
  //     lamports: rent,
  //     space: MINT_SIZE,
  //     programId: TOKEN_PROGRAM_ID,
  //   });
  //   const tx = new Transaction();
  //   tx.add(ix);
  //   const sx = await sendAndConfirmTransaction(connection, tx, [keypair, mint]);
  //   console.log(sx);
  // 这里已经创建了 新账户 已经封装好了  所以 上边的就不需要了
  const mintTx = await createMint(
    connection,
    keypair,
    keypair.publicKey,
    null,
    9,
    keypair
  );
})();
