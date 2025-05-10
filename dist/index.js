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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const address_1 = require("./address");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const vault = address_1.PUBLIC_KEY;
//@ts-ignore
app.post("/helius", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const helius_response = req.body;
    const incomingTxn = (_a = helius_response.nativeTransfers) === null || _a === void 0 ? void 0 : _a.find((x) => x.toUserAccount === vault);
    if (!incomingTxn) {
        return res.status(400).send("No matching transfer to vault");
    }
    const fromAddress = incomingTxn.fromUserAccount;
    const toAddress = incomingTxn.toUserAccount;
    const amount = incomingTxn.amount;
    const type = "received_native_sol";
    try {
        if (type === "received_native_sol") {
            yield (0, mintTokens_1.mintTokens)(fromAddress, amount);
        }
        else {
            yield (0, mintTokens_1.burnToken)(fromAddress, amount);
            yield (0, mintTokens_1.sendNativeToken)(toAddress, amount);
        }
        res.send("Transaction successful");
    }
    catch (err) {
        console.error("Error processing transaction:", err);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
