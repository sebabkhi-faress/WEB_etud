export const counter = new Map<string, number>()

export const updateCount = async (user: string) => {
  if (typeof user === "string" && !counter.has(user)) {
    counter.set(user, 1)
  }
}

export const getCount = () => {
  return counter.size
}
