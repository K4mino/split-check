interface Group {
    id: string
    name: string
    members: string[]
    expenses: Expense[]
  }
  
  interface Expense {
    id: string
    title: string
    total: number
    payer: string
    splits: { [name: string]: number }
    date: string
  }
  