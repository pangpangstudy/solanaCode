// https://tame-quaint-flower.solana-devnet.quiknode.pro/59df35260b1d72364653fe1ba7bc67e4ef45d7ae/

import { Connection, PublicKey } from "@solana/web3.js";
import { rpc } from "./util";
const connection = new Connection(rpc);

const simulation = await connection.simulateTransaction(tx);
// return accounts err logs returnData unitsConsumed
if (!simulation.value.err) {
  // preflight检查包括模拟交易以检测潜在的错误和问题，如账户余额不足、交易无效等。
  const sx = await connection.sendTransaction(tx, [keypair], {
    skipPreflight: true,
  });
}

// read
// async function read() {
//   const account = await program.account.dataAccount.fetch(pda);
//   account.counter;
// }
