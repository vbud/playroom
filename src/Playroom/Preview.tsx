import React, { useEffect, useState } from 'react';

import { useParams } from 'src/utils/params';
import { Components } from 'src/utils/componentsToHints';
import { FrameConfigs, State, store } from 'src/StoreContext/StoreContext';
import { Frame } from './Frame/Frame';

import './Preview.css';

export interface PreviewProps {
  components: Components;
}
export default function Preview({ components }: PreviewProps) {
  const [frames, setFrames] = useState<FrameConfigs | null>(null);

  useEffect(() => {
    store
      .getItem<State['frames']>('frames')
      .then((result) => setFrames(result));
  }, []);

  const frameIdFromUrl = useParams((params): string => {
    if (typeof params.frame === 'string') {
      return params.frame;
    }

    return '';
  });

  if (frameIdFromUrl.length > 0 && frames !== null) {
    return (
      <Frame frameConfig={frames[frameIdFromUrl]} components={components} />
    );
  } else {
    return 'Cannot render frame.';
  }
}
