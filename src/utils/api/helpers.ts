import { createHash } from "crypto"
import { decode } from "jsonwebtoken"
import { cookies } from "next/headers"
import axios from "axios"

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function getCookieData() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value || ""
  const uuid = cookieStore.get("uuid")?.value as string
  const tokenHash = createHash("md5").update(token).digest("hex")

  if (token.length > 500) throw new Error("Token is too large!")

  if (!isValidUUID(uuid)) throw new Error("Invalid UUID!")

  const tokenPayload = decode(token) as any
  if (!tokenPayload || typeof tokenPayload !== "object")
    throw new Error("Invalid JWT token!")

  const user = tokenPayload.userName as string
  if (
    typeof user !== "string" ||
    user.length > 20 ||
    Number.isNaN(Number(user))
  )
    throw new Error("Invalid username!")

  const EtabId = tokenPayload.idEtablissement as number
  if (Number.isNaN(EtabId) || EtabId.toString().length > 20)
    throw new Error("Invalid EtabId!")

  return { token, user, uuid, tokenHash, EtabId }
}

export async function fetchData(link: string, token: string) {
  return await axios.get(link, {
    headers: {
      Authorization: token,
      Author: "<osca@univ-annaba.dz>",
    },
    timeout: Number(process.env.SERVER_TIMEOUT),
  })
}
