
const getPois = async () => {
    const response = await fetch("https://mharmony.barikoimaps.dev/images")
    const data = await response.json()
    return data
}

export { getPois }