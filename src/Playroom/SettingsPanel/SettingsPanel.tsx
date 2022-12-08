import React, { useContext, ReactChild } from 'react';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import {
  ColorScheme,
  EditorPosition,
  StoreContext,
} from 'src/StoreContext/StoreContext';
import { Stack } from '../Stack/Stack';
import EditorLeftIcon from '../icons/EditorLeftIcon';
import EditorUndockedIcon from '../icons/EditorUndockedIcon';

import * as styles from './SettingsPanel.css';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';

const positionIcon: Record<EditorPosition, ReactChild> = {
  undocked: <EditorUndockedIcon />,
  left: <EditorLeftIcon />,
};

const colorModeIcon: Record<ColorScheme, ReactChild> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

interface SettingsPanelProps {}

export default ({}: SettingsPanelProps) => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  return (
    <ToolbarPanel data-testid="frame-panel">
      <Stack space="large">
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Editor Position</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['Left', 'Undocked'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="editorPosition"
                  id={`editorPosition${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === editorPosition}
                  onChange={() =>
                    dispatch({
                      type: 'updateEditorPosition',
                      payload: {
                        position: option.toLowerCase() as EditorPosition,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`editorPosition${option}`}
                  className={styles.label}
                  title={option}
                >
                  <span className={styles.labelText}>
                    {positionIcon[option.toLowerCase() as EditorPosition]}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color Scheme</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['System', 'Light', 'Dark'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="colorScheme"
                  id={`colorScheme${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === colorScheme}
                  onChange={() =>
                    dispatch({
                      type: 'updateColorScheme',
                      payload: {
                        colorScheme: option.toLowerCase() as ColorScheme,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`colorScheme${option}`}
                  className={styles.label}
                  title={option}
                >
                  <span className={styles.labelText}>
                    {colorModeIcon[option.toLowerCase() as ColorScheme]}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </Stack>
    </ToolbarPanel>
  );
};
