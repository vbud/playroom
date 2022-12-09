import { useContext } from 'react';

import { StoreContext } from '../StoreContext/StoreContext';
import { createPreviewUrl } from '../../utils';
import playroomConfig from '../config';

const baseUrl = window.location.href
  .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
  .split('index.html')[0];

export default () => {
  const [{ code }] = useContext(StoreContext);

  return createPreviewUrl({
    baseUrl,
    code,
    paramType: playroomConfig.paramType,
  });
};
