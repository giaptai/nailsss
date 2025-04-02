export const isFormFieldInvalid = (name: string|undefined, formik: any) => {
    if (!name) return false
    if (name.includes('.')) {
        // const tmp = name.split('.')
        return ( formik.errors[name])
    } else {
        return formik.errors[name]
    }
}
export const getTouched2Level = (formik: any, arr: string[]) => {
    if (formik.touched[arr[0]]) {
        const tmp = formik.touched[arr[0]] as Record<string, any>
        if (tmp[arr[1]]) {
            return tmp[arr[1]]
        }
    }
    return undefined
}
export const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj))