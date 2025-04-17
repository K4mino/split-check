export type Group = {
    id: string
    name: string
    created_by: string
    created_at: string
    members?: string[]
    recentExpense?: string
    date?: string
    pendingAmount?: string
}


export type Expense = {
    id: string
    title: string
    paid_by: string
    created_at: string,
    amount: number
    split_type: string
    group_id: string
    receipt?:string
    expense_splits?:ExpenseSplit[]
}

export type ExpenseSplit = {
    id:string
    created_at: string
    expense_id:string
    member_id:string
    amount:number
}

export type GroupMember = {
    id: string
    group_id: string
    name: string
    email?: string | null
    created_at: string
}
