export interface Sub {
    name: string
    price: string
    period: string
    originalPrice: string
    discount: string
    credits: string
    creditRate: string
    buttonText: string
    buttonVariant: string
    buttonDisabled: boolean
    features: string[]
}

// 定义积分套餐类型
export interface PointsPackage {
    id: number // 积分套餐ID
    description: string // 套餐描述
    points: number // 积分
    bonus_points: number // 奖励积分
    discount_percent: number // 折扣百分比
    group: string // 组
    project: string // 项目
    price_id: string // 价格ID
    coupon_id: string // 优惠券ID
    currency: string // 货币
    product_id: string // 产品ID
    moneydesc: string // 人民币价格
    gmoneydesc: string // 美元价格
    original_gmoney_desc: string // 原价
    money: number // 人民币价格
    gmoney: number // 美元价格
    discount_ratio: string // 折扣比例
    isLoading?: boolean // 是否加载中
    base_points: number // 基础积分
    name: string // 套餐名称
}

export interface PointsPackageResponse {
    subscription_is_cancel: boolean // 是否取消订阅
    actions: PointsPackage[]
    subscription_end_time: number // 订阅结束时间
}

// 创建订单接口类型
export interface CreateOrderRequest {
    product_id: string
    price_id: string
    payment_method: string
    currency: string
    country: string
    platform: string
    amount: number
    cancel_url: string
    redirect_url: string
}

// 创建订单响应类型
export interface CreateOrderResponse {
    status: number
    order_code: string
    redirect_url: string
    subscribe_code: string
}

// 会员状态响应类型
export interface MembershipStatusResponse {
    user_id: string
    is_member: boolean
    is_once: boolean
    member_type: string
    subscription: {
        id: number
        type: string
        status: string
        start_time: string | null
        end_time: string | null
        days_remaining: number
    }
    points: {
        available_points: number
        total_points: number
    }
    timestamp: string
}
