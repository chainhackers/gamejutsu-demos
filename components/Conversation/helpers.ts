export const formatTime = (d: Date | undefined): string =>
    d
        ? d.toLocaleTimeString(undefined, {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
        })
        : ''

export function classNames(...classes: (string | null)[]) {
    return classes.filter(Boolean).join(' ')
}