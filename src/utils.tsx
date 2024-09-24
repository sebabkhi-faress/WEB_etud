const info = (message: string, user: string | undefined, path: string) => {
  console.info(`[${user}] [${path}] ${message}`)
}

const error = (message: string, user: string | undefined, path: string) => {
  console.error(`[${user}] [${path}] ${message}`)
}

const logger = { info, error }

export default logger
