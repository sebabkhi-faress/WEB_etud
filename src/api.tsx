import { cookies } from "next/headers"
import axios from "axios"
import logger from "@/utils"
import cache from "@/cache"
import { createHash } from "crypto"
import { decode } from "jsonwebtoken"

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

const getCookieData = () => {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value || ""
  const uuid = cookieStore.get("uuid")?.value as string

  if (token.length > 500) {
    throw new Error("Token is too large!")
  }
  if (!isValidUUID(uuid)) {
    throw new Error("Invalid UUID!")
  }

  const tokenPayload = decode(token) as any

  if (typeof tokenPayload !== "object" || tokenPayload == null)
    throw new Error("Invalid JWT token!")

  const user = tokenPayload.userName as string

  if (
    typeof user !== "string" ||
    user.length > 20 ||
    Number.isNaN(Number(user))
  ) {
    throw new Error("Invalid username!")
  }

  const EtabId = tokenPayload.idEtablissement as number

  const tokenHash = createHash("md5").update(token).digest("hex")

  return { token, user, uuid, tokenHash, EtabId }
}

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
    const response = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000, // Timeout set to 10 seconds
      },
    )

    logger.info("Profile data fetched successfully", user, "/profile")
    const data = parseData(response.data[0])
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
    const image = await axios.get(
      `https://progres.mesrs.dz/api/infos/image/${uuid}`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000, // Timeout set to 10 seconds
      },
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
    const logo = await axios.get(
      `https://progres.mesrs.dz/api/infos/logoEtablissement/${EtabId}`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000, // Timeout set to 10 seconds
      },
    )

    logger.info("Logo fetched successfully", user, "/profile")
    cache.set(cacheKey, logo.data)
    return logo.data
  } catch (error) {
    logger.error("Error fetching logo", user, "/profile")
    return null
  }
}

export const getDias = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `dias-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Dias Cache Hit", user, "/notes")
    return cachedData
  }

  try {
    const response = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000,
      },
    )
    logger.info("Dias Fetched Successfully", user, "/year")
    cache.set(cacheKey, response.data)
    return response.data
  } catch (error: any) {
    logger.error(`Error - ${error}`, user, "/year")
    throw new Error(error)
  }
}

export const getTdTp = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `notes-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Notes Cache Hit", user, "/notes")
    return cachedData
  }

  const parseData = (data: any) => {
    const Sem1TdTp = [] as any[]
    const Sem2TdTp = [] as any[]

    let sem1 = data[0].llPeriode
    let sem2 = data.find((item: any) => item.llPeriode !== sem1).llPeriode
    if (sem1 > sem2) {
      sem1 = sem2
    }
    data.forEach((item: any) => {
      if (item.llPeriode === sem1) {
        Sem1TdTp.push(item)
      } else {
        Sem2TdTp.push(item)
      }
    })
    return { Sem1TdTp, Sem2TdTp }
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/controleContinue/dia/${id}/notesCC`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000,
      },
    )

    logger.info("Notes Fetched Successfully", user, "/notes")
    const data = parseData(res.data)
    cache.set(cacheKey, data)

    return data
  } catch (error: any) {
    logger.error("Error Fetching Tp And Td Notes", user, "/notes")
    return { Sem1TdTp: null, Sem2TdTp: null }
  }
}

export const getExamsNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `exams-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Exams Cache Hit", user, "/exams")
    return cachedData
  }

  const parseData = (data: any) => {
    const Sem1Exams = {
      normal: [],
      rattrappage: [],
    } as any
    const Sem2Exams = {
      normal: [],
      rattrappage: [],
    } as any

    const periods = data.map((course: any) => course.idPeriode)
    const firstSemester = Math.min(...periods)

    data.forEach((course: any) => {
      const period = course.idPeriode
      const session = course.planningSessionIntitule
      const sem1 = period == firstSemester

      if (session === "session_1") {
        sem1 ? Sem1Exams.normal.push(course) : Sem2Exams.normal.push(course)
      } else {
        sem1
          ? Sem1Exams.rattrappage.push(course)
          : Sem2Exams.rattrappage.push(course)
      }
    })

    return { Sem1Exams, Sem2Exams }
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/planningSession/dia/${id}/noteExamens`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000,
      },
    )

    logger.info("Exam Notes fetched successfully", user, "/exams")
    const data = parseData(res.data)
    cache.set(cacheKey, data)
    return data
  } catch (error: any) {
    logger.error("Error Fetching Exam Notes", user, "/exams")
    return { Sem1Exams: null, Sem2Exams: null }
  }
}

export const getSemesterAcademicResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `semesters-transcripts-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  const parseData = (data: any) => {
    let sem1 = data[0].periodeLibelleFr < data[1].periodeLibelleFr ? 0 : 1
    let Sem1Results
    let Sem2Results
    if (sem1 === 0) {
      Sem1Results = data[0]
      Sem2Results = data[1]
    } else {
      Sem1Results = data[1]
      Sem2Results = data[0]
    }
    return { Sem1Results, Sem2Results }
  }

  if (cachedData) {
    logger.info("Semesters Transcripts Cache Hit", user, "/transcripts")
    return cachedData
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dias/${id}/periode/bilans`,
      {
        headers: { Authorization: token },
        timeout: 15000,
      },
    )

    logger.info(
      "Fetched Semesters Academic Results Successfully",
      user,
      "/year",
    )
    const data = parseData(res.data)

    cache.set(cacheKey, data)

    return data
  } catch (error) {
    logger.error("Error Fetching Semesters Academic Results", user, "/year")
    return { Sem1Results: null, Sem2Results: null }
  }
}

export const getYearAcademicResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `year-transcript-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "/transcripts")
    return cachedData
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dia/${id}/annuel/bilan`,
      {
        headers: { Authorization: token },
        timeout: 15000,
      },
    )

    const data = res.data
    logger.info("Fetched Year Academic Results Successfully", user, "/year")
    cache.set(cacheKey, data)

    return data
  } catch (error) {
    logger.error("Error Fetching Year Academic Results", user, "/year")
    return null
  }
}

export const getGroup = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `group-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Group Cache Hit", user, "/group")
    return cachedData
  }

  const parseData = (data: any) =>
    data
      .sort((a: any, b: any) => a.periodeId - b.periodeId)
      .reduce((semesterInfo: any, item: any) => {
        if (!item.nomSection) return semesterInfo
        const semesterKey = item.periodeLibelleLongLt
        const group = item.nomGroupePedagogique
        const section =
          item.nomSection === "Section" ? "Section 1" : item.nomSection
        semesterInfo[semesterKey] = { group, section }
        return semesterInfo
      }, {})

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/dia/${id}/groups`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 15000,
      },
    )

    const data = parseData(res.data)

    logger.info("Fetched Group And Section Data Successfully", user, "/group")
    cache.set(cacheKey, data)
    return data
  } catch (error) {
    logger.error("Error Fetching Group And Section Info", user, "/group")
    return null
  }
}
