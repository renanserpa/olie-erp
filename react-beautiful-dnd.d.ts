// Tipos para react-beautiful-dnd
declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type DraggableId = string;
  export type DroppableId = string;
  export type DragStart = {
    draggableId: DraggableId;
    type: string;
    source: {
      droppableId: DroppableId;
      index: number;
    };
  };
  export type DropResult = {
    draggableId: DraggableId;
    type: string;
    source: {
      droppableId: DroppableId;
      index: number;
    };
    destination: {
      droppableId: DroppableId;
      index: number;
    } | null;
    reason: 'DROP' | 'CANCEL';
  };

  export type DraggableProvided = {
    draggableProps: {
      style?: React.CSSProperties;
      'data-rbd-draggable-id'?: string;
      'data-rbd-draggable-context-id'?: string;
      [key: string]: any;
    };
    dragHandleProps: {
      'data-rbd-drag-handle-draggable-id'?: string;
      'data-rbd-drag-handle-context-id'?: string;
      role?: string;
      tabIndex?: number;
      'aria-grabbed'?: boolean;
      draggable?: boolean;
      onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
      [key: string]: any;
    } | null;
    innerRef: (element: HTMLElement | null) => void;
  };

  export type DroppableProvided = {
    droppableProps: {
      'data-rbd-droppable-id'?: string;
      'data-rbd-droppable-context-id'?: string;
      [key: string]: any;
    };
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactNode;
  };

  export type DraggableStateSnapshot = {
    isDragging: boolean;
    isDropAnimating: boolean;
    draggingOver: DroppableId | null;
    dropAnimation: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    } | null;
    combineWith: DraggableId | null;
    combineTargetFor: DraggableId | null;
    mode: 'FLUID' | 'SNAP';
  };

  export type DroppableStateSnapshot = {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
  };

  export type DragDropContextProps = {
    onDragStart?: (start: DragStart) => void;
    onDragUpdate?: (update: any) => void;
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
  };

  export type DraggableProps = {
    draggableId: DraggableId;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
  };

  export type DroppableProps = {
    droppableId: DroppableId;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    ignoreContainerClipping?: boolean;
    renderClone?: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: any) => React.ReactNode;
    getContainerForClone?: () => HTMLElement;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
  };

  export const DragDropContext: React.ComponentClass<DragDropContextProps>;
  export const Droppable: React.ComponentClass<DroppableProps>;
  export const Draggable: React.ComponentClass<DraggableProps>;
}
