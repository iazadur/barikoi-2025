
const getPois = async () => {
    const response = await fetch("https://mharmony.barikoimaps.dev/images")
    const data = await response.json()
    console.log(data, "pois")
    return data
}
const approvePoi = async (poiId: string) => {
    const response = await fetch(`https://mharmony.barikoimaps.dev/approve-image/${poiId}`)
    const data = await response.json()
    console.log(data, "approved")
    return data
}
const rejectPoi = async (poiId: string) => {
    const response = await fetch(`https://mharmony.barikoimaps.dev/reject-image/${poiId}`)
    const data = await response.json()
    console.log(data, "rejected")
    return data
}
export { getPois, approvePoi, rejectPoi }