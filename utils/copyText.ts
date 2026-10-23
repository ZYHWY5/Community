const toast = useToast()

export const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            toast.success('Copy success')
        })
        .catch(() => {
            toast.error('Copy fail')
        })
}
