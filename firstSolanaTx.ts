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
// 这个函数 报错 Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.
(async () => {
  const connection = new Connection(rpc);
  const keyPair = new Keypair();
  const airdrop = await connection.requestAirdrop(
    keyPair.publicKey,
    0.1 * LAMPORTS_PER_SOL
  );
  const blockHash = await connection.getLatestBlockhash();
  const strategy: TransactionConfirmationStrategy = {
    signature: airdrop,
    ...blockHash,
  };
  const result = await connection.confirmTransaction(strategy, "finalized");
  console.log(result);
  // 4FRkBjgXTLBuRc4kWNiPV76MppA95L3SfdksvqPfL5CLskjvf8xaDrEAweek8vuVQviqKNuK8DcF6Azzs4r2D4BB
  // 这里签名存在 这里是成功空投了
  console.log(airdrop);
  // 这里得到的balance确实0  也就是说空投成功了 但是没有被验证  没有被共识 所以这里还是0
  const balance = await connection.getBalance(keyPair.publicKey);
  console.log(balance);
  const ix = SystemProgram.transfer({
    fromPubkey: keyPair.publicKey,
    toPubkey: new Keypair().publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });
  const tx = new Transaction();
  tx.add(ix);
  // 在这测试一下 这里等待20秒 下边的交易就会成功
  // 因为空投交易 已经被验证处理
  //   console.log("waiting....");
  //   await new Promise((_) => setTimeout(_, 20000));
  //   console.log("start....");

  const sx = await sendAndConfirmTransaction(connection, tx, [keyPair]);
  // 如果这里 跳过预检 不去模拟执行 就不会报错 但是如果交易在验证时失败，错误将发生在网络层面而不是客户端层面
  // 所以不要设置为true  应该在其他地方解决问题
  //   const sx = await sendAndConfirmTransaction(connection, tx, [keyPair], {
  //     skipPreflight: true,
  //   });
  console.log(sx);
})();
