import { getSimulationComputeUnits } from "@solana-developers/helpers";
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  Signer,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

async function buildOptimalTransaction(
  connection: Connection,
  instructions: Array<TransactionInstruction>,
  signer: Signer,
  lookupTables: Array<AddressLookupTableAccount>
) {
  const [microLamports, units, recentBlockhash] = await Promise.all([
    100 /* Get optimal priority fees - https://solana.com/developers/guides/advanced/how-to-use-priority-fees*/,
    //    调用该函数模拟执行交易以获取所需的计算单位（Compute Units）。传入的参数包括连接、指令、付款人的公钥和地址查找表。
    getSimulationComputeUnits(
      connection,
      instructions,
      signer.publicKey,
      lookupTables
    ),
    // 获取最新的区块哈希，用于确保交易的唯一性和确定性
    connection.getLatestBlockhash(),
  ]);
  //   microLamports: 设置为100，
  //  这将添加到交易的指令列表的开头，以确保在其他指令之前设置优先级费用。
  // 指令设置计算单位的价格（每个计算单位的微Lamports数）100
  instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports })
  );
  if (units) {
    // probably should add some margin of error to units
    //   如果units存在，则添加一条指令以设置计算单位的上限（限制）。这确保了交易不会超过指定的计算单位限制。通常，可能会添加一些容错余量，以防模拟和实际执行之间的差异。
    instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units }));
  }
  return {
    //   构建一个消息对象，
    transaction: new VersionedTransaction(
      new TransactionMessage({
        instructions,
        recentBlockhash: recentBlockhash.blockhash,
        payerKey: signer.publicKey,
      })
        //  将交易消息编译为V0格式的消息，使用提供的地址查找表。
        .compileToV0Message(lookupTables)
    ),
    recentBlockhash,
  };
}
