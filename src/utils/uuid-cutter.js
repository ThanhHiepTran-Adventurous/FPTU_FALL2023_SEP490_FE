export const getUuidSplitted = (input) => {
    const splittedData = input.split("-")
    return splittedData[0] + splittedData[1]
}