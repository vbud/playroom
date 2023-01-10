import classNames from 'classnames';
import * as React from 'react';

import {
  getInteractableIdMostApplicableToElement,
  InteractableComponent,
} from './Interactable';
import { NoPanArea } from './NoPanArea';
import { PressHandlingOptions, PressInterpreter } from './PressInterpreter';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { PressEventCoordinates, ViewPort } from './ViewPort';

import * as styles from './Space.css';

export interface SpaceProps extends React.PropsWithChildren {
  /**
   * Optional id to use on the outer `div` that the `Space` renders.
   */
  readonly id?: string;
  /**
   * Optional CSS class to use on the outer `div` that the `Space` renders.
   */
  readonly className?: string;
  /**
   * Optional styles to set on the outer `div` that the `Space` renders.
   */
  readonly style?: React.CSSProperties;

  /**
   * Called when the `Space` first creates the outer `div` and sets up the
   * `ViewPort`, but before the inner `div` and the `Space`'s children have been
   * rendered. This can be used, for example, to make the `ViewPort` focus on a
   * certain portion of the virtual space.
   */
  readonly onCreate?: (viewPort: ViewPort) => void;
  /**
   * Called whenever the `ViewPort` is updated.
   */
  readonly onUpdated?: (viewPort: ViewPort) => void;

  /**
   * Called when a mouse hover event happens anywhere in the `Space`.
   */
  readonly onHover?: (
    e: MouseEvent,
    coordinates: PressEventCoordinates
  ) => void;

  /**
   * Called when a right click event happens anywhere in the `Space`.
   */
  readonly onContextMenu?: (
    e: MouseEvent,
    coordinates: PressEventCoordinates
  ) => void;
}

interface SpaceState {
  readonly contextValue?: SpaceContextType;
  readonly transformStyle?: React.CSSProperties;
}

/**
 * This component makes its children zoomable and pan-able.
 *
 * Please read the [Guide](../../Guide.md) for all the details on how to use
 * this.
 *
 * ## Props
 *
 * See `SpaceProps`.
 */
export class Space extends React.PureComponent<SpaceProps, SpaceState> {
  /**
   * Describes what portion of the virtual coordinate space is visible inside
   * the `Space`, and, among other things, provides access to the
   * `ViewPortCamera` which can change that.
   *
   * This is not created until after the component has been mounted, so use the
   * `onCreate` prop if you need to manipulate it before the children of the
   * `Space` are first rendered. The `onUpdated` prop can be used to listen
   * for changes.
   */

  private viewPort?: ViewPort;
  private resizeObserver: ResizeObserver;

  private outerDivElement?: HTMLDivElement;
  private readonly interactableRegistry: Map<string, InteractableComponent>;
  private readonly pressInterpreter: PressInterpreter;

  public constructor(props: SpaceProps) {
    super(props);
    this.state = {};

    this.interactableRegistry = new Map();

    this.resizeObserver = new ResizeObserver(() => this.updateSize());

    this.pressInterpreter = new PressInterpreter(
      this.handleDecideHowToHandlePress
    );
  }

  public componentWillUnmount() {
    this.destroyViewPort();
  }

  public render() {
    return (
      <div
        ref={this.setOuterDivRefAndCreateViewPort}
        id={this.props.id}
        className={classNames(styles.root, this.props.className)}
        style={this.props.style}
      >
        {this.state.contextValue && (
          <SpaceContext.Provider value={this.state.contextValue}>
            <div className={styles.inner} style={this.state.transformStyle}>
              {this.props.children}
            </div>
          </SpaceContext.Provider>
        )}
      </div>
    );
  }

  private updateSize = () => {
    if (this.viewPort) {
      this.viewPort.updateContainerSize();
    }
  };

  private createTransformStyle = () => {
    if (this.viewPort) {
      return {
        transform: `scale(${this.viewPort.zoomFactor}) translate(${
          -1 * this.viewPort.left
        }px,${-1 * this.viewPort.top}px)`,
      };
    }
    return undefined;
  };

  private destroyViewPort = () => {
    if (this.viewPort) {
      this.viewPort.destroy();
      this.viewPort = undefined;
    }

    if (this.outerDivElement) {
      this.outerDivElement.removeEventListener(
        'dragstart',
        this.handleDragStart
      );

      this.resizeObserver.unobserve(this.outerDivElement);
    }
  };

  private handleDragStart = (e: DragEvent) => {
    // This is the only way I have found that actually suppresses the default
    // handling of dragging on images, which interferes with our panning by
    // having a "ghost image" follow the pointer, across all browsers.
    // See this link for more info:
    // https://stackoverflow.com/questions/3873595/how-to-disable-firefoxs-default-drag-and-drop-on-all-images-behavior-with-jquer
    //
    // This additionally prevents another weird case of double clicking to
    // select text in Desktop Safari and then long clicking and dragging. This
    // will enter a weird drag state where all the text is being dragged.
    if (e.target instanceof HTMLElement) {
      const interactableId = getInteractableIdMostApplicableToElement(e.target);
      const interactable =
        (interactableId && this.interactableRegistry.get(interactableId)) ||
        undefined;

      // Suppress the drag _unless_ it is within a NoPanArea, then let it happen.
      if (interactable && interactable instanceof NoPanArea) {
        // Intentionally do nothing
      } else {
        e.preventDefault();
      }
    }
  };

  private handleDecideHowToHandlePress = (
    e: MouseEvent | TouchEvent,
    coordinates: PressEventCoordinates
  ): PressHandlingOptions | undefined => {
    if (e.target instanceof HTMLElement) {
      const interactableId = getInteractableIdMostApplicableToElement(e.target);
      const interactable =
        (interactableId && this.interactableRegistry.get(interactableId)) ||
        undefined;

      if (e.type === 'mousedown') {
        const elementTagName = (e.target.tagName || '').toLowerCase();
        if (elementTagName === 'a' || elementTagName === 'button') {
          // Prevent dragging on these element because:
          // 1) the browsers may interpret the drag end as a click on it
          // 2) desktop Safari (possibly others) has its own drag handling for links which conflicts with what we are doing.
          return { ignorePressEntirely: true };
        }
      }

      if (interactable && interactable instanceof NoPanArea) {
        return { ignorePressEntirely: true };
      }
    }
  };

  private handleViewPortUpdated = () => {
    this.setState({ transformStyle: this.createTransformStyle() });
    if (this.viewPort) {
      this.props.onUpdated?.(this.viewPort);
    }
  };

  private setOuterDivRefAndCreateViewPort = (node: HTMLDivElement) => {
    this.destroyViewPort();
    this.outerDivElement = node;

    this.resizeObserver.observe(this.outerDivElement);

    if (this.outerDivElement) {
      this.viewPort = new ViewPort(this.outerDivElement, {
        onContextMenu: this.props.onContextMenu,
        onUpdated: this.handleViewPortUpdated,
        ...this.pressInterpreter.pressHandlers,
      });

      this.props.onCreate?.(this.viewPort);

      this.outerDivElement.addEventListener('dragstart', this.handleDragStart);

      const contextValue: SpaceContextType = {
        registerInteractable: (i) => this.interactableRegistry.set(i.id, i),
        unregisterInteractable: (i) => this.interactableRegistry.delete(i.id),
        viewPort: this.viewPort,
      };

      this.setState({
        contextValue,
        transformStyle: this.createTransformStyle(),
      });
    }
  };
}
