const ethers = require("ethers");
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");

    // // Creating wallet from encrypted JSON
    // let wallet = await ethers.Wallet.fromEncryptedJson(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // );

    // wallet = wallet.connect(provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log("Deploying");
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed");
    console.log(contract)

    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);

    const transactionResponse = await contract.store(7);
    const transactionReceipt = await transactionResponse.wait();
    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${updatedFavoriteNumber}`);
    console.log(`Contract deployed to ${contract.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
