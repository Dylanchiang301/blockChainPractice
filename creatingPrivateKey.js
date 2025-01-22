/*
 * Private key 256 bits （16進位[hex]表示的32字節數字）
 * Public key (uncompressed) 512 bits
 * Public key (compressed) 512 bits
 * Hashed public key 256 bits
 * Address 106 bits
 * 8 bits = 1 bytes
 * 4 bits = 1 HEX
*/
// 產生流程：私鑰 → [橢圓曲線計算ECDSA(不可逆)] → 公鑰 → [hash] → Hash公鑰 → [截取處理(每個鏈有自己的截取策略)] → 地址


function appendHexPrefix(value) {
    return '0x' + value;
}

// 手動生成：
const crypto = require('crypto'); // node 內建模組
const EC = require('elliptic').ec; // 橢圓曲線函數。elliptic 只負責橢圓曲線密鑰生成
const secp256k1 = new EC('secp256k1'); // 以太坊使用 secp256k1 橢圓曲線來生成密鑰對

const privateKey = crypto.randomBytes(32).toString('hex')

console.log(privateKey, 'primaryKey')
// 透過elliptic隨機生成密鑰對可以使用： const keyPair = secp256k1.genKeyPair();
const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex'); // 生成 keyPair，並用自己已生成的私鑰
const uncompressedPublicKey = keyPair.getPublic().encode('hex');
const compressedPublicKey = keyPair.getPublic().encodeCompressed('hex');

console.log('Uncompressed Public Key:', appendHexPrefix(uncompressedPublicKey));
console.log('Compressed Public Key:', appendHexPrefix(compressedPublicKey));

// 以太坊使用 Keccak-256 做公鑰哈希（hash function）
const pkg = require('js-sha3');
const { keccak_256 } = pkg;
const publicKeyBuffer = Buffer.from(uncompressedPublicKey.slice(2), 'hex');

// Hash the public key with Keccak-256
const publicKeyAfterKeccak256 = keccak_256(publicKeyBuffer);
console.log(
    'Public Key After Keccak-256:',
    appendHexPrefix(publicKeyAfterKeccak256)
);

const address = appendHexPrefix(publicKeyAfterKeccak256.slice(-40));
console.log('Address:', address)


// 使用套件：ether
// const { ethers } = require('ethers');

// const wallet = ethers.Wallet.createRandom();
// console.log('Ether Private Key:', wallet.privateKey);
// console.log('Ether Public Key:', wallet.publicKey);
// console.log('Ether Address:', wallet.address);

