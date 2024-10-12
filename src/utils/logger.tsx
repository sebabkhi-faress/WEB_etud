const info = (message: string, user: string | undefined, path: string) => {
  console.info(`[${user}] [${path}] ${message}`)
}

const error = (message: string, user: string | undefined, path: string) => {
  console.error(`[${user}] [${path}] ${message}`)
}

const warn = (message: string, user: string | undefined, path: string) => {
  console.warn(`[${user}] [${path}] ${message}`)
}

const logger = { info, error, warn }

export default logger
