import NodeCache from "node-cache"

const cache = new NodeCache({ stdTTL: 600 }) // 10 Minutes

export default cache
