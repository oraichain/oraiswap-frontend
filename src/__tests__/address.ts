import assert from 'assert';
import { ethToTronAddress, tronToEthAddress } from 'helper';
import { getEvmAddress } from 'libs/utils';

describe('address', () => {
  it('getEvmAddress-happy-path', async () => {
    assert(getEvmAddress('oraie1ny7sdlyh7303deyqtzpmnznvyzat2jtyxs3y0v'), '0x993d06fc97f45f16e4805883b98a6c20bab54964');
    assert(ethToTronAddress('0x993d06fc97f45f16e4805883b98a6c20bab54964'), 'TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc');
    assert(tronToEthAddress('TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc'), '0x993d06fc97f45f16e4805883b98a6c20bab54964');
  });
});
