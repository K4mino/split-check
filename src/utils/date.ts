export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const today = new Date()
  
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  
    if (isToday) {
      return 'Today'
    }
  
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  