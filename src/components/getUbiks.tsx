import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";

const programId = "BhcfWg1D2zEEbxy8d72L7y3o3yCsHruamMQsPPF8q21i"; // Stake Program Address
const STAKE_SEED = "stake";

async function findProgramAddress(
  programId: PublicKey,
  seeds: (PublicKey | Uint8Array | string)[]
): Promise<[PublicKey, number]> {
  const seed_bytes = seeds.map((s) => {
    if (typeof s == "string") {
      return Buffer.from(s);
    } else if ("toBytes" in s) {
      return s.toBytes();
    } else {
      return s;
    }
  });
  return await PublicKey.findProgramAddress(seed_bytes, programId);
}

const getStakedNfts = async (userWallet) => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const [pda_account, nonce] = await findProgramAddress(new PublicKey(programId), [
    STAKE_SEED,
    userWallet,
  ]);

  return await getParsedNftAccountsByOwner({
    publicAddress: pda_account.toString(),
    connection: connection,
  });
};

async function getTokenList(walletAddress) {
  try {
      const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  let tokensInWallet: Array<Object> = await getParsedNftAccountsByOwner({
      publicAddress: walletAddress,
      connection: connection,
      sanitize: true,
  });

  const tokensStaked = await getStakedNfts(walletAddress);
  const tokensList = tokensInWallet.concat(tokensStaked);

  const result = await tokensList.map(token => {
      if ( (typeof token['data'].creators) != 'undefined'  ) {
          const name = token['data'].name;
          const creators = token['data'].creators;
          if (creators[0].address === "WAku72SeQKPDwh9fJbKEohYSnHyMkcXzDU5aaUwaax2" || creators[0].address === "WAku72SeQKPDwh9fJbKEohYSnHyMkcXzDU5aaUwaax2") {
              return parseInt(name.split('#')[1])
          }
          return 0
      };
      return 0
  }).filter(token => token !== 0);

  return result

  } catch (e) {
      console.log(e)
      return []
  }
}

export default getTokenList;