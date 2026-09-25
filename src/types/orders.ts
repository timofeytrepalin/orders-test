export const ORDER_STATUSES = ['Выполнен', 'Новый'] as const;

export type Status = (typeof ORDER_STATUSES)[number];

export interface Order {
    id: number
    name: string
    address: string
    date: string
    status: Status
    comment?: string
}