import logger from "@/utils/logger"
import { updateCount } from "../counter"
import { shortCache, longCache } from "@/utils/cache"
import { fetchData, getCookieData } from "./helpers"
import { ApiResponseType, ProfileDataType } from "@/utils/types"

export async function getProfileData() {
  const { token, user, uuid, tokenHash } = getCookieData()

  let response: ApiResponseType = {
    success: false,
    data: undefined,
    error: undefined,
  }

  const cacheKey = `profile-${tokenHash}`
  const cachedData = shortCache.get(cacheKey) as ProfileDataType

  if (cachedData) {
    response.success = true
    response.data = cachedData
    logger.info("Profile Cache Hit", user, "getProfileData")
    return response
  }

  const parseProfileData = (responseData: any) => {
    const data: ProfileDataType = {
      individuId: responseData.individuId,
      nin: responseData.nin,
      individuNomArabe: responseData.individuNomArabe,
      individuNomLatin: responseData.individuNomLatin,
      individuPrenomArabe: responseData.individuPrenomArabe,
      individuPrenomLatin: responseData.individuPrenomLatin,
      individuDateNaissance: responseData.individuDateNaissance,
      individuLieuNaissance: responseData.individuLieuNaissance,
      individuLieuNaissanceArabe: responseData.individuLieuNaissanceArabe,
      llEtablissementArabe: responseData.llEtablissementArabe,
      llEtablissementLatin: responseData.llEtablissementLatin,
      niveauLibelleLongLt: responseData.niveauLibelleLongLt,
      ofLlDomaine: responseData.ofLlDomaine,
      ofLlSpecialite: responseData.ofLlSpecialite,
    }
    return data
  }

  try {
    const res = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias`,
      token,
    )

    logger.info("Profile Data Fetched Successfully", user, "getProfileData")
    const data = parseProfileData(res.data[0])
    // updateCount(user)
    shortCache.set(cacheKey, data)

    response.success = true
    response.data = data
  } catch (error) {
    response.success = false
    response.error = "Error Fetching Profile Data"
    logger.error("Error Fetching Profile Data", user, "getProfileData")
  } finally {
    return response
  }
}

export const getImage = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `image-${tokenHash}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Image Cache Hit", user, "getImage")
    return cachedData
  }

  try {
    const image = await fetchData(
      `${process.env.PROGRES_API}/image/${uuid}`,
      token,
    )

    logger.info("Image Fetched Successfully", user, "getImage")
    longCache.set(cacheKey, image.data)

    return image.data
  } catch (error) {
    logger.error("Error Fetching Image", user, "getImage")
    return null
  }
}

export const getLogo = async () => {
  const { token, user, EtabId } = getCookieData()

  const cacheKey = `logo-${EtabId}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Logo Cache Hit", user, "getLogo")
    return cachedData
  }

  try {
    const logo = await fetchData(
      `${process.env.PROGRES_API}/logoEtablissement/${EtabId}`,
      token,
    )

    logger.info("Logo Fetched Successfully", user, "getLogo")
    longCache.set(cacheKey, logo.data)

    return logo.data
  } catch (error) {
    logger.error("Error Fetching Logo", user, "getLogo")
    return null
  }
}
