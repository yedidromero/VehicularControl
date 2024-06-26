import {
    Metaplex,
    bundlrStorage,
    keypairIdentity,
} from "@metaplex-foundation/js";
import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import base58 from "bs58";
const SOLANA_NETWORK = "devnet";
const PRIVATE_KEY = process.env.PAYER_PRIVATE_KEY;

const metaplexlib = {};

metaplexlib.createNFT = async (nftData) => {
    try {
        const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
        const metaplex = new Metaplex(connection);

        const {
            publicKey: walletPublicKey,
            imageUrl,
            name,
            explorerLink,
        } = nftData;

        const walletPublicKeyObject = new PublicKey(walletPublicKey.toString());


        const privateKey = Uint8Array.from(base58.decode(PRIVATE_KEY));
        const keypair = Keypair.fromSecretKey(privateKey);
        metaplex.use(keypairIdentity(keypair));

        metaplex.use(
            bundlrStorage({
                address: "https://devnet.bundlr.network",
                providerUrl: "https://api.devnet.solana.com",
                timeout: 60000,
                identity: keypair,
            })
        );

        //prepare metada to upload to arweave
        const metadata = {
            name: "Vehicular Control",
            description: `Project for Solana Hackathon 2024`,
            image: imageUrl,
            symbol: "STS",
            collection: {
                name: "SinBandera",
                family: "Superteam MX",
            },
        };

        try {
            const data = await metaplex.nfts().uploadMetadata(metadata);
            console.info("Creating NFT...");
            const { blockhash } = await connection.getLatestBlockhash();
            const { response: nftCreated } = await metaplex.nfts().create(
                {
                    uri: data.uri,
                    name: metadata.name,
                    sellerFeeBasisPoints: 500,
                    metadata: data.metadata,

                    maxSupply: 1,
                    retainAuthority: false,
                    isMutable: true,
                    edition: "unique",
                    blockhash,
                    tokenOwner: walletPublicKeyObject,
                    signers: [
                        {
                            keypair: keypair,
                            isWritable: true,
                        },
                    ],
                    symbol: "STS",
                },
                {
                    commitment: "finalized",
                    accounts: { to: walletPublicKeyObject },
                }
            );
            console.info("NFT created", nftCreated);
            return nftCreated;
        } catch (error) {
            console.error("Error uploading metadata", error);
            throw error;
        }
    } catch (error) {
        console.error("Error creating NFT", error);
        throw error;
    }
};

export default metaplexlib;
