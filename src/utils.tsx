const info = (message: string, user: string | undefined, path: string) => {
  let now = new Date()
  let formattedDate = `${now.getFullYear()}/${now.getUTCMonth()}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  console.info(`[${formattedDate}] [${user}] [${path}] ${message}`)
}

const error = (message: string, user: string | undefined, path: string) => {
  let now = new Date()
  let formattedDate = `${now.getFullYear()}/${now.getUTCMonth()}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  console.error(`[${formattedDate}] [${user}] [${path}] ${message}`)
}

const logger = { info, error }

export default logger
