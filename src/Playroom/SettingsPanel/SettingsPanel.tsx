import React, { useContext, ReactElement } from 'react';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { StoreContext } from 'src/StoreContext/StoreContext';
import { ColorScheme } from 'src/utils/colorScheme';
import { Stack } from '../Stack/Stack';

import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';

import * as styles from './SettingsPanel.css';

const colorModeIcon: Record<ColorScheme, ReactElement> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

export default function SettingsPanel() {
  const [{ colorScheme }, dispatch] = useContext(StoreContext);

  return (
    <ToolbarPanel data-testid="settings-panel">
      <Stack space="large">
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color Mode</Heading>
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
}
