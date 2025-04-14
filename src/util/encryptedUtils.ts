import CryptoJS from 'crypto-js'

const SECRET_KEY = "kiteseven77"

export const encipher =(number)=>{
    return CryptoJS.AES.encrypt(
        number.toString(),
        SECRET_KEY
    ).toString()
}

export const decrypt =(number)=>{
    const bytes = CryptoJS.AES.decrypt(
        number.toString(),
        SECRET_KEY
    )
    return bytes.toString(CryptoJS.enc.Utf8)
}