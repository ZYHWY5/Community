import type Sortable from 'sortablejs'

/**
 * SortableJS 事件对象扩展（包含 Swap 插件）
 */
export interface SortableEvent extends Event {
    to: HTMLElement
    from: HTMLElement
    item: HTMLElement
    clone: HTMLElement
    oldIndex?: number
    newIndex?: number
    oldDraggableIndex?: number
    newDraggableIndex?: number
    pullMode?: 'clone' | boolean
    /** Swap 插件：交换的目标元素 */
    swapItem?: HTMLElement | null
}

/**
 * Move 事件对象(包含业务数据)
 */
export interface MoveEvent<T = any> {
    dragged: HTMLElement
    draggedRect: DOMRect
    related: HTMLElement
    relatedRect: DOMRect
    willInsertAfter?: boolean
    to: HTMLElement
    from: HTMLElement
    /** 被拖拽的数据项 */
    draggedItem?: T
    /** 关联的数据项 */
    relatedItem?: T
}

/**
 * 唯一键类型(支持属性名或函数)
 */
export type ItemKey<T> = keyof T | ((item: T) => string | number)

/**
 * 获取唯一键的函数类型
 */
export type GetItemKey<T> = (item: T) => string | number

/**
 * Swap 插件配置选项
 */
export interface SwapOptions {
    /** 启用交换模式 */
    swap?: boolean
    /** 交换目标高亮样式类 */
    swapClass?: string
}

/**
 * 拖拽组件基础配置选项
 * @description CsDraggable 和 CsTreeDraggable 共享的基础配置
 */
export interface DraggableBaseOptions extends SwapOptions {
    /** SortableJS group 配置,支持字符串或完整配置对象 */
    group?: string | Sortable.GroupOptions
    /** 拖拽动画时间(毫秒) */
    animation?: number
    /** 拖拽手柄选择器(只能通过特定元素拖动) */
    handle?: string
    /** 拖拽时影子元素的样式类 */
    ghostClass?: string
    /** 选中元素的样式类 */
    chosenClass?: string
    /** 拖拽中元素的样式类 */
    dragClass?: string
    /** 是否禁用拖拽 */
    disabled?: boolean
}

/**
 * 拖拽行为控制选项
 * @description 控制拖拽延迟、滚动等行为的高级选项
 */
export interface DraggableBehaviorOptions {
    /** 是否允许列表内排序 */
    sort?: boolean
    /** 拖拽延迟时间(毫秒) */
    delay?: number
    /** 是否仅在触摸设备上延迟 */
    delayOnTouchOnly?: boolean
    /** 触摸开始阈值(像素) */
    touchStartThreshold?: number
    /** 强制使用降级方案 */
    forceFallback?: boolean
    /** 降级方案的样式类 */
    fallbackClass?: string
    /** 降级元素是否添加到 body */
    fallbackOnBody?: boolean
    /** 降级方案的容差(像素) */
    fallbackTolerance?: number
    /** 滚动敏感度(像素) */
    scrollSensitivity?: number
    /** 滚动速度 */
    scrollSpeed?: number
    /** 过滤选择器(不可拖拽的元素) */
    filter?: string
    /** 触发 filter 时是否阻止默认行为 */
    preventOnFilter?: boolean
}

/**
 * CsDraggable 组件完整 Props 类型
 */
export interface DraggableProps<T extends Record<string, any>> extends DraggableBaseOptions, DraggableBehaviorOptions {
    /** v-model 绑定的列表数据 */
    modelValue: T[]
    /** 唯一键,支持属性名或函数 */
    itemKey?: ItemKey<T>
    /** 容器标签名 */
    tag?: string
    /** 容器样式类 */
    class?: string
    /** 列表项样式类 */
    itemClass?: string
    /** 克隆函数(用于跨列表拖拽) */
    clone?: (original: T) => T
    /** move 事件回调(返回 false/-1 取消拖拽) */
    move?: (item: T, evt: MoveEvent<T>, originalEvent: Event) => boolean | -1 | 1
    /** add 事件回调(返回 false 取消添加操作) */
    add?: (item: T, evt: SortableEvent) => boolean
    /** update 事件回调(返回 false 取消更新操作) */
    update?: (item: T, evt: SortableEvent) => boolean
    /** remove 事件回调(返回 false 取消移除操作) */
    remove?: (item: T, evt: SortableEvent) => boolean
    /** SortableJS 完整配置对象(优先级最低) */
    options?: Sortable.Options
}

/**
 * CsDraggable 组件 Emits 类型
 */
export interface DraggableEmits<T = any> {
    'update:modelValue': [value: T[]]
    start: [evt: SortableEvent]
    end: [evt: SortableEvent]
    add: [evt: SortableEvent]
    remove: [evt: SortableEvent]
    update: [evt: SortableEvent]
    sort: [evt: SortableEvent]
    clone: [evt: SortableEvent]
    change: [evt: SortableEvent]
    choose: [evt: SortableEvent]
    unchoose: [evt: SortableEvent]
    move: [evt: MoveEvent<T>, originalEvent: Event]
}

/**
 * 默认插槽 Props 类型
 */
export interface ItemSlotProps<T> {
    item: T
    index: number
}

/**
 * 树节点接口
 */
export interface TreeNode {
    id: number | string
    name: string
    children?: TreeNode[]
    /** 支持扩展字段 */
    [key: string]: unknown
}

/**
 * 树形字段配置
 */
export interface TreeFieldNames {
    /** 唯一标识字段名 */
    key?: string
    /** 显示标题字段名 */
    title?: string
    /** 子节点字段名 */
    children?: string
}

/**
 * CsTreeDraggable 组件 Props 类型
 */
export interface TreeDraggableProps extends DraggableProps<TreeNode> {
    /** 当前层级(内部递归使用,外部无需传入) */
    level?: number
    /** 最大拖拽层级限制(0表示根节点,1表示第一级子节点,以此类推) */
    maxLevel?: number
    /** 子节点容器样式类 */
    childrenClass?: string
    /** 自定义字段名配置 */
    fieldNames?: TreeFieldNames
}

/**
 * CsTreeDraggable 组件 Emits 类型
 */
export interface TreeDraggableEmits {
    'update:modelValue': [value: TreeNode[]]
    'node-click': [node: TreeNode, level: number]
    'node-drag-start': [node: TreeNode, level: number]
    'node-drag-end': [node: TreeNode, level: number]
}

/**
 * 树节点插槽 Props 类型
 */
export interface TreeNodeSlotProps {
    /** 当前节点数据 */
    node: TreeNode
    /** 当前层级 */
    level: number
    /** 是否有子节点 */
    hasChildren: boolean | undefined
}
