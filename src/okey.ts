import ThresholdKey from '@oraichain/default';
import OraiStorageLayer from '@oraichain/storage-layer-orai';
import WebStorageModule from '@oraichain/web-storage';
import OraiServiceProvider from '@oraichain/service-provider-orai';
import SecurityQuestionsModule from '@oraichain/security-questions';
import init, { interpolate, get_pk } from '@oraichain/blsdkg';
import { Network } from '@oraichain/customauth';
import OnlySocialKey from '@oraichain/only-social-key';
import { metadataUrl, CustomAuthArgs } from '@oraichain/customauth';
import Multifactors from '@oraichain/multifactors.js';

const network: Network = (process.env.REACT_APP_NODE_ENV as Network) || Network.STAGING;
const hostUrl = metadataUrl[network]; // dynamic get default metadataUrl from the multifactors system

// Initialize Multifactors.js for interacting with Multifactors system
const multifactors = new Multifactors({
  blsdkg: { init, get_pk, interpolate }
});

// Configuration of Service Provider
const customAuthArgs: CustomAuthArgs = {
  baseUrl: `${window.location.origin}/serviceworker`,
  network, // based on the verifier network.
  multifactors
};

// Configuration of Modules which are used only in ThresholdKey
const webStorageModule = new WebStorageModule();
const securityQuestionsModule = new SecurityQuestionsModule();
const storageLayer = new OraiStorageLayer({
  hostUrl
});

// Initilize Service Provider which have provided the encKey
const serviceProvider = new OraiServiceProvider({
  customAuthArgs
});

// ThresholdKey
export const tKey = new ThresholdKey({
  modules: {
    webStorage: webStorageModule, // 2 modules have been initilized above
    securityQuestions: securityQuestionsModule
  },
  manualSync: false,
  customAuthArgs,
  storageLayer,
  serviceProvider
});

// OnlySocialKey
export const onlySocialKey = new OnlySocialKey({
  // No need any addition modules
  serviceProvider,
  storageLayer
});

window.tKey = tKey;
window.onlySocialKey = onlySocialKey;
