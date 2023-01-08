import * as React from 'react';

import {
  getInteractableIdMostApplicableToElement,
  InteractableComponent,
} from './Interactable';
import { NoPanArea } from './NoPanArea';
import { Pressable } from './Pressable';
import {
  DecidePressHandlingCallback,
  PressHandlingOptions,
  PressInterpreter,
} from './PressInterpreter';
import { SpaceContext, SpaceContextType } from './SpaceContext';
import { browserIsAndroid, generateRandomId } from './utils';
import { PressEventCoordinates, ViewPort } from './ViewPort';

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
   * `ViewPort`, but before the inner `div` and the `Space's children have
   * been first rendered. This can be used, for example, to make the
   * `ViewPort` focus on a certain portion of the virtual space.
   */
  readonly onCreate?: (viewPort: ViewPort) => void;
  /**
   * Called whenever the `ViewPort` is updated.
   */
  readonly onUpdated?: (viewPort: ViewPort) => void;

  /**
   * Optional callback to be called when a press is initiated in the space.
   * Generally you should prefer to use `Pressable` to handle presses, but
   * this can be used as a lower level alternative. The result of the callback
   * is a `PressHandlingOptions` (or `undefined`) that describes how the
   * press should be handled.
   *
   * If the callback returns a `PressHandlingOptions` it will take precedence
   * over `Pressable` and `NoPanArea` components (even if the press was on
   * one of those).
   */
  readonly onDecideHowToHandlePress?: DecidePressHandlingCallback;
  /**
   * Called when a mouse hover event happens anywhere in the `Space`.
   */
  readonly onHover?: (
    e: MouseEvent,
    coordinates: PressEventCoordinates
  ) => void;
  /**
   * Called when a right click event happens anywhere in the `Space`.
   *
   * @returns Whether to prevent (`true`) a `Pressable` from also handling
   * this event (if it was also the target).
   *
   */
  readonly onContextMenu?: (
    e: MouseEvent,
    coordinates: PressEventCoordinates
  ) => void | boolean | undefined;
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
  private readonly rootDivUniqueClassName = `react-zoomable-ui-${generateRandomId()}`;

  private readonly constantStyles = `
.${this.rootDivUniqueClassName} {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  cursor: default;
}

.${this.rootDivUniqueClassName} > .react-zoomable-ui-inner-div {
  margin: 0; padding: 0; 
  transform-origin: 0% 0%;
  min-height: 100%;
  width: 100%;
}
`;

  private outerDivElement?: HTMLDivElement;
  private currentHoveredPressable?: Pressable;
  private readonly interactableRegistry: Map<string, InteractableComponent>;
  private readonly pressInterpreter: PressInterpreter;

  public constructor(props: SpaceProps) {
    super(props);
    this.state = {};

    this.interactableRegistry = new Map();

    // TODO: do we need to use `new` here?
    // TODO: how often is this called? Can we make it less often?
    this.resizeObserver = new ResizeObserver(() => this.updateSize());

    this.pressInterpreter = new PressInterpreter(
      this.handleDecideHowToHandlePress
    );
  }

  public componentWillUnmount() {
    this.destroyViewPort();
    // TODO: is this necessary?
    this.resizeObserver.disconnect();
  }

  public render() {
    return (
      <div
        ref={this.setOuterDivRefAndCreateViewPort}
        id={this.props.id}
        className={`react-zoomable-ui-outer-div ${
          this.rootDivUniqueClassName
        } ${this.props.className || ''}`}
        style={this.props.style}
      >
        <style>{this.constantStyles}</style>
        {this.state.contextValue && (
          <SpaceContext.Provider value={this.state.contextValue}>
            <div
              className="react-zoomable-ui-inner-div"
              style={this.state.transformStyle}
            >
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
    }

    if (this.outerDivElement) {
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
    // will enter some sorta drag state where all the text is being dragged.
    // This is bad and it also conflicts with our <Pressable> components.
    if (e.target) {
      const interactableId = getInteractableIdMostApplicableToElement(
        e.target as any
      );
      const interactable =
        (interactableId && this.interactableRegistry.get(interactableId)) ||
        undefined;

      // Suppress the drag _unless_ it is within a no pan handling area, then
      // let it happen.
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
    if (this.props.onDecideHowToHandlePress) {
      const result = this.props.onDecideHowToHandlePress(e, coordinates);
      if (result) {
        return result;
      }
    }

    const interactableId = getInteractableIdMostApplicableToElement(
      e.target as any
    );
    const interactable =
      (interactableId && this.interactableRegistry.get(interactableId)) ||
      undefined;

    if (e.type === 'mousedown') {
      const elementTagName = (
        (e.target && (e.target as any).tagName) ||
        ''
      ).toLowerCase();
      if (elementTagName === 'a' || elementTagName === 'button') {
        // Prevent dragging on these elements A. the browsers may interpret the
        // drag end as a click on it and B. desktop Safari (possibly others) has
        // its own drag handling for links which conflicts with what we are
        // doing.
        return { ignorePressEntirely: true };
      }
    }

    if (interactable && interactable instanceof NoPanArea) {
      return { ignorePressEntirely: true };
    } else if (interactable && interactable instanceof Pressable) {
      return interactable.getPressHandlingConfig();
    }
    return undefined;
  };

  private handleHover = (e: MouseEvent, coordinates: PressEventCoordinates) => {
    const interactableId = getInteractableIdMostApplicableToElement(
      e.target as any
    );
    const interactable =
      (interactableId && this.interactableRegistry.get(interactableId)) ||
      undefined;
    if (interactable && interactable instanceof Pressable) {
      if (interactable !== this.currentHoveredPressable) {
        this.currentHoveredPressable = interactable;
        this.currentHoveredPressable.setHovered(true);
      }
    } else if (this.currentHoveredPressable) {
      this.currentHoveredPressable.setHovered(false);
      this.currentHoveredPressable = undefined;
    }

    if (this.props.onHover) {
      this.props.onHover(e, coordinates);
    }
  };

  private handleContextMenu = (
    e: MouseEvent,
    coordinates: PressEventCoordinates
  ) => {
    if (this.props.onContextMenu) {
      const result = this.props.onContextMenu(e, coordinates);
      e.preventDefault();
      if (result) {
        return;
      }
    }

    const interactableId = getInteractableIdMostApplicableToElement(
      e.target as any
    );
    const interactable =
      (interactableId && this.interactableRegistry.get(interactableId)) ||
      undefined;

    if (
      interactable &&
      interactable instanceof Pressable &&
      interactable.props.onContextMenu
    ) {
      interactable.props.onContextMenu(coordinates);
      e.preventDefault();
      return;
    }

    // We have to prevent default this in a few cases on Android because it can
    // interfere w/ panning
    if (browserIsAndroid) {
      if (interactable && interactable instanceof NoPanArea) {
        // Don't do anything
      } else {
        e.preventDefault();
      }
      return;
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
        onHover: this.handleHover,
        onContextMenu: this.handleContextMenu,
        onUpdated: this.handleViewPortUpdated,
        ...this.pressInterpreter.pressHandlers,
      });

      this.props.onCreate?.(this.viewPort);

      this.outerDivElement.addEventListener('dragstart', this.handleDragStart);

      const contextValue: SpaceContextType = {
        rootDivUniqueClassName: this.rootDivUniqueClassName,
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
