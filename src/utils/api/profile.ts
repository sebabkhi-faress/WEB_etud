import logger from "@/utils/logger"
import { longCache } from "@/utils/cache"
import { fetchData } from "./helpers"
import { ApiResponseType, ProfileDataType } from "@/utils/types"

export async function getProfileData(token: string, user: string, uuid: string): Promise<ApiResponseType> {
  let response: ApiResponseType = {
    success: false,
    data: undefined,
    error: undefined,
  }

  const cacheKey = `profile-${user}`
  const cachedData = longCache.get(cacheKey) as ProfileDataType

  if (cachedData) {
    response.success = true
    response.data = cachedData
    logger.info("Cache", user, "getProfileData")
    return response
  }

  const parseProfileData = (responseData: any) => {
    const data: ProfileDataType = {
      individuId: responseData.identifiant,
      individuNomArabe: responseData.nomArabe,
      individuNomLatin: responseData.nomLatin,
      individuPrenomArabe: responseData.prenomArabe,
      individuPrenomLatin: responseData.prenomLatin,
      individuDateNaissance: responseData.dateNaissance,
      individuLieuNaissance: responseData.lieuNaissance,
      individuLieuNaissanceArabe: responseData.lieuNaissanceArabe,
      individuEmail: responseData.email,
    }
    return data
  }

  try {
    const res = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/individu`,
      token,
    )

    const data = parseProfileData(res.data)
    longCache.set(cacheKey, data)

    logger.info("Success", user, "getProfileData")

    response.success = true
    response.data = data
  } catch (error) {
    response.success = false
    response.error = "Error Fetching Profile Data"

    logger.error("Error", user, "getProfileData")
  } finally {
    return response
  }
}

export const getImage = async (token: string, user: string, uuid: string) => {
  const cacheKey = `image-${user}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getImage")
    return cachedData
  }

  try {
    const image = await fetchData(
      `${process.env.PROGRES_API}/image/${uuid}`,
      token,
    )

    logger.info("Success", user, "getImage")
    longCache.set(cacheKey, image.data)

    return image.data
  } catch (error) {
    logger.error("Error", user, "getImage")
    return null
  }
}

export const getLogo = async (token: string, user: string, EtabId: number) => {
  const cacheKey = `logo-${EtabId}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getLogo")
    return cachedData
  }

  try {
    const logo = await fetchData(
      `${process.env.PROGRES_API}/logoEtablissement/${EtabId}`,
      token,
    )

    logger.info("Success", user, "getLogo")
    longCache.set(cacheKey, logo.data)

    return logo.data
  } catch (error) {
    logger.error("Error", user, "getLogo")
    return null
  }
}
