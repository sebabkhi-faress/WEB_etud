import logger from "@/utils/logger"
import cache from "@/utils/cache"
import { updateCount } from "../counter"
import { fetchData, getCookieData } from "./helpers"

export const getProfileData = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `profile-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Profile Cache Hit", user, "getProfileData")
    return cachedData
  }

  const parseData = (responseData: any) => {
    return {
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
  }

  try {
    const response = await fetchData(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      token,
    )

    logger.info("Profile Data Fetched Successfully", user, "getProfileData")
    const data = parseData(response.data[0])
    updateCount(user)
    cache.set(cacheKey, data)

    return data
  } catch (error) {
    logger.error("Error Fetching Profile Data", user, "getProfileData")
    throw new Error("Error Fetching Profile Data")
  }
}

export const getImage = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `image-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Image Cache Hit", user, "getImage")
    return cachedData
  }

  try {
    const image = await fetchData(
      `https://progres.mesrs.dz/api/infos/image/${uuid}`,
      token,
    )

    logger.info("Image Fetched Successfully", user, "getImage")
    cache.set(cacheKey, image.data)
    return image.data
  } catch (error) {
    logger.error("Error Fetching Image", user, "getImage")
    throw new Error("Error Fetching Image")
  }
}

export const getLogo = async () => {
  const { token, user, EtabId } = getCookieData()

  const cacheKey = `logo-${EtabId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Logo Cache Hit", user, "getLogo")
    return cachedData
  }

  try {
    const logo = await fetchData(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${EtabId}`,
      token,
    )

    logger.info("Logo Fetched Successfully", user, "getLogo")
    cache.set(cacheKey, logo.data)
    return logo.data
  } catch (error) {
    logger.error("Error Fetching Logo", user, "getLogo")
    throw new Error("Error Fetching Logo")
  }
}
