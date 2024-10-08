import NodeCache from "node-cache"

const shortCache = new NodeCache({ stdTTL: 600 }) // 10 Minutes
const longCache = new NodeCache({ stdTTL: 21600 }) // 6 Hours

export { shortCache, longCache }
