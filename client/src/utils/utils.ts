export const formateDate = (isoString: string) : string => {
    const date = new Date(isoString)
    const formateDate = new Intl.DateTimeFormat('es-Es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    return formateDate.format(date)
}