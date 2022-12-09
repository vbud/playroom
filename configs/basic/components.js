import React from 'react';
import PropTypes from 'prop-types';

const withPropTypes = (component) => {
  component.propTypes = {
    background: PropTypes.bool,
    color: PropTypes.oneOf(['red', 'blue']),
    children: PropTypes.node,
  };

  return component;
};
const getStyles = (background) => {
  const styles = {
    border: '1px solid currentColor',
    padding: '10px 10px 10px 15px',
  };
  if (background) {
    styles.background = 'rgba(0, 0, 0, 0.15)';
  }
  return styles;
};

export const Foo = withPropTypes(
  ({ color = 'black', background, children }) => (
    <div style={{ color }}>
      Foo{children ? <div style={getStyles(background)}>{children}</div> : null}
    </div>
  )
);

export const Bar = withPropTypes(
  ({ color = 'black', background, children }) => (
    <div style={{ color }}>
      Bar{children ? <div style={getStyles(background)}>{children}</div> : null}
    </div>
  )
);
