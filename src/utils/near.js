import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import environment from './config';

const nearEnv = environment('testnet');

export async function initializeContract() {
  const near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearEnv });
  window.walletConnection = new WalletConnection(near);
  console.log(window.walletConnection.account());
  window.accountId = window.walletConnection.getAccountId();
  window.contract = new Contract(window.walletConnection.account(), nearEnv.contractName, {
    viewMethods: ['getItem', 'getItems'],
    changeMethods: ['setItem', 'buyItem', 'rentingItem', 'rentItem', 'sellItem', 'redeemItem'],
  });
}

export async function accountBalance() {
  return formatNearAmount((await window.walletConnection.account().getAccountBalance()).total, 2);
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export function login() {
  window.walletConnection.requestSignIn(nearEnv.contractName);
}

export function logout() {
  window.walletConnection.signOut();
  window.location.reload();
}