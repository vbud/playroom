import React from 'react';

import { CopyButton } from './CopyButton';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { Stack } from '../Stack/Stack';
import { Inline } from '../Inline/Inline';
import PlayIcon from '../icons/PlayIcon';
import { Button } from '../Button/Button';
import playroomConfig from 'src/config';
import { FrameId } from 'src/StoreContext/StoreContext';

export type ParamType = 'hash' | 'search';

const baseUrl = window.location.href
  .split(playroomConfig.paramType === 'hash' ? '#' : '?')[0]
  .split('index.html')[0];

const createPreviewUrl = ({
  baseUrl,
  frameId,
  paramType = 'hash',
}: {
  baseUrl: string;
  frameId: FrameId;
  paramType?: ParamType;
}) => {
  const path = `/preview/${paramType === 'hash' ? '#' : ''}?frame=${frameId}`;

  const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

  return `${trimmedBaseUrl}${path}`;
};

export default function PreviewPanel({
  selectedFrameId,
}: {
  selectedFrameId: FrameId;
}) {
  const prototypeUrl = createPreviewUrl({
    baseUrl,
    frameId: selectedFrameId,
    paramType: playroomConfig.paramType,
  });

  return (
    <ToolbarPanel data-testid="preview-panel">
      <Stack space="medium">
        <Heading as="h4" level="3">
          Preview selected frame
        </Heading>

        <Inline space="small">
          <Button
            as="a"
            href={prototypeUrl}
            target="_blank"
            title="Open frame preview in new window"
            rel="noopener noreferrer"
            data-testid="view-prototype"
            icon={<PlayIcon />}
          >
            Open
          </Button>
          <CopyButton
            copyContent={prototypeUrl}
            title="Copy frame preview link to clipboard"
          />
        </Inline>
      </Stack>
    </ToolbarPanel>
  );
}
