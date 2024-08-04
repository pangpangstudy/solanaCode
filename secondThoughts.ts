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

(async () => {
  const connection = new Connection(rpc);
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  //   console.log(keypair.publicKey.toString());HFMUP5pNSfmULhiGB6v6fr82jCmWetEUPR2Tme9EMx4Y
  const price = 0.005;
  const taxInBSP = 10;

  const tax = (price * taxInBSP) / 10000;
  const receiverAmount = price - tax;

  const receiver = new Keypair().publicKey;
  const treasury = new Keypair().publicKey;

  const ix1 = SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: receiver,
    lamports: receiverAmount * LAMPORTS_PER_SOL,
  });
  const ix2 = SystemProgram.transfer({
    fromPubkey: keypair.publicKey,
    toPubkey: treasury,
    lamports: tax * LAMPORTS_PER_SOL,
  });
  const tx = new Transaction();
  tx.add(ix1, ix2);
  // receiver 和 treasury 都是新的公钥，因此会创建新的账户。这些新账户的租金必须由转账的初始账户（即 keypair）提供。
  // Transaction simulation failed: Transaction results in an account (2) with insufficient funds for rent
  const sx = await sendAndConfirmTransaction(connection, tx, [keypair]);
  console.log(sx);
})();
// 租金机制的工作原理
// 租金豁免状态：

// 如果一个账户的余额高于或等于租金豁免的最低余额（也称为最低租金保障金额），那么该账户被视为租金豁免状态。在这种状态下，该账户不会被扣除租金。
// 非豁免状态：

// 如果一个账户的余额低于租金豁免的最低余额，则该账户会定期被扣除租金。这是为了支付该账户在网络上占用的存储资源。
// 每个区块（大约400毫秒）都会对账户进行租金扣除计算。因此，如果账户不在租金豁免状态，其余额会逐步减少。
