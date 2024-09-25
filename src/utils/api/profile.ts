import logger from "@/utils/logger"
import cache from "@/utils/cache"
import { updateCount } from "../counter"
import { fetchData, getCookieData } from "./helpers"

export const getProfileData = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `profile-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("profile cache hit", user, "/profile")
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

    logger.info("Profile data fetched successfully", user, "/profile")
    const data = parseData(response.data[0])
    updateCount(user)
    cache.set(cacheKey, data)

    return data
  } catch (error) {
    logger.error("Error fetching profile data", user, "/profile")
    throw new Error("Error fetching profile data")
  }
}

export const getImage = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `image-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Image cache hit", user, "/profile")
    return cachedData
  }

  try {
    const image = await fetchData(
      `https://progres.mesrs.dz/api/infos/image/${uuid}`,
      token,
    )

    logger.info("Image fetched successfully", user, "/profile")
    cache.set(cacheKey, image.data)
    return image.data
  } catch (error) {
    logger.error("Error fetching image", user, "/profile")
    return null
  }
}

export const getLogo = async () => {
  const { token, user, EtabId } = getCookieData()

  const cacheKey = `logo-${EtabId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("logo cache hit", user, "/profile")
    return cachedData
  }

  try {
    const logo = await fetchData(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${EtabId}`,
      token,
    )

    logger.info("Logo fetched successfully", user, "/profile")
    cache.set(cacheKey, logo.data)
    return logo.data
  } catch (error) {
    logger.error("Error fetching logo", user, "/profile")
    return null
  }
}
