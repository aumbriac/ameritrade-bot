export const isMarketOpen = () => {
    const date = new Date()
    const newYorkTime = date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }) 
    if (newYorkTime > '09:30' && newYorkTime < '16:00') {
        return true
    } else {
        return false
    }
}