import * as React from 'react';
import classNames from 'classnames';

import { InteractableIdAttributeName } from './Interactable';
import { SpaceContext, SpaceContextType } from './SpaceContext';

import * as styles from './NoPanArea.css';

export interface NoPanAreaProps extends React.PropsWithChildren {
  readonly id?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * If you have a part of your `Space` that you do not want to be pan-able for
 * some reason you can wrap it with `NoPanArea`. This has limited utility, but
 * might be useful in some cases.
 *
 * This doesn't affect zooming though.
 *
 * Must only be used inside a `Space`.
 *
 * ## Props
 *
 * See `NoPanAreaProps`.
 */
export class NoPanArea extends React.PureComponent<NoPanAreaProps> {
  public static contextType = SpaceContext;
  public readonly context!: SpaceContextType;
  public readonly id = crypto.randomUUID();

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  public constructor(props: NoPanAreaProps, context: SpaceContextType) {
    super(props);
  }

  public componentDidMount() {
    this.context.registerInteractable(this);
  }

  public componentWillUnmount() {
    this.context.unregisterInteractable(this);
  }

  public render() {
    const { id, children, className, style } = this.props;
    return (
      <React.Fragment>
        <div
          id={id}
          {...{ [InteractableIdAttributeName]: this.id }}
          className={classNames(styles.root, className)}
          style={style}
          ref={this.divRef}
        >
          {children}
        </div>
      </React.Fragment>
    );
  }
}
