"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNativeToken = exports.burnToken = void 0;
exports.mintTokens = mintTokens;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const address_1 = require("./address");
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
const secret = new Uint8Array(address_1.PRIVATE_KEY);
const wallet = web3_js_1.Keypair.fromSecretKey(secret);
const mint = new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS);
function mintTokens(fromAddres, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipient = new web3_js_1.PublicKey(fromAddres);
        console.log(wallet.publicKey);
        const tokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, wallet, mint, recipient, false, undefined, undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
        yield (0, spl_token_1.mintTo)(connection, wallet, mint, tokenAccount.address, wallet.publicKey, amount, [], undefined, spl_token_1.TOKEN_2022_PROGRAM_ID);
    });
}
const burnToken = (fromAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = wallet.publicKey;
    const tokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, owner, false, spl_token_1.TOKEN_2022_PROGRAM_ID);
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createBurnCheckedInstruction)(tokenAccount, mint, owner, amount, 9, [], spl_token_1.TOKEN_2022_PROGRAM_ID));
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        wallet,
    ]);
    console.log("burned tokens txns: ", signature);
});
exports.burnToken = burnToken;
const sendNativeToken = (toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = new web3_js_1.PublicKey(toAddress);
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(wallet.publicKey, recipient, wallet.publicKey, amount * 1e9));
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        wallet,
    ]);
    console.log("SOL SENT: ", signature);
});
exports.sendNativeToken = sendNativeToken;
