import React from 'react';

import usePreviewUrl from 'src/utils/usePreviewUrl';
import { CopyButton } from './CopyButton';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { Stack } from '../Stack/Stack';
import { Inline } from '../Inline/Inline';
import PlayIcon from '../icons/PlayIcon';
import { Button } from '../Button/Button';

export default function PreviewPanel() {
  const prototypeUrl = usePreviewUrl();

  return (
    <ToolbarPanel data-testid="preview-panel">
      <Stack space="medium">
        <Heading as="h4" level="3">
          Preview
        </Heading>

        <Inline space="small">
          <Button
            as="a"
            href={prototypeUrl}
            target="_blank"
            title="Open preview in new window"
            rel="noopener noreferrer"
            data-testid="view-prototype"
            icon={<PlayIcon size={20} />}
          >
            Open
          </Button>
          <CopyButton
            copyContent={prototypeUrl}
            title="Copy preview link to clipboard"
          />
        </Inline>
      </Stack>
    </ToolbarPanel>
  );
}
