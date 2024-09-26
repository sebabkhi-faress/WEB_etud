import logger from "@/utils/logger"
import cache from "@/utils/cache"
import { fetchData, getCookieData } from "./helpers"

export const getDias = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `dias-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Dias Cache Hit", user, "/notes")
    return cachedData
  }

  try {
    const response = await fetchData(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      token,
    )
    logger.info("Dias Fetched Successfully", user, "getDias")
    cache.set(cacheKey, response.data)
    return response.data
  } catch (error: any) {
    logger.error(`Error - ${error}`, user, "getDias")
    throw new Error(error)
  }
}

export const getTdTp = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `notes-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Notes Cache Hit", user, "getTdTp")

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
    const res = await fetchData(
      `https://progres.mesrs.dz/api/infos/controleContinue/dia/${id}/notesCC`,
      token,
    )

    logger.info("Notes Fetched Successfully", user, "getTdTp")
    const data = parseData(res.data)
    cache.set(cacheKey, data)

    return data
  } catch (error: any) {
    logger.error("Error Fetching Tp And Td Notes", user, "getTdTp")
    return { Sem1TdTp: null, Sem2TdTp: null }
  }
}

export const getExamsNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `exams-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Exams Cache Hit", user, "getExamsNotes")
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
    const res = await fetchData(
      `https://progres.mesrs.dz/api/infos/planningSession/dia/${id}/noteExamens`,
      token,
    )

    logger.info("Exam Notes Fetched Successfully", user, "getExamsNotes")
    const data = parseData(res.data)
    cache.set(cacheKey, data)
    return data
  } catch (error: any) {
    logger.error("Error Fetching Exam Notes", user, "getExamsNotes")
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
    logger.info(
      "Semesters Transcripts Cache Hit",
      user,
      "getSemesterAcademicResults",
    )
    return cachedData
  }

  try {
    const res = await fetchData(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dias/${id}/periode/bilans`,
      token,
    )

    logger.info(
      "Fetched Semesters Academic Results Successfully",
      user,
      "getSemesterAcademicResults",
    )
    const data = parseData(res.data)

    cache.set(cacheKey, data)

    return data
  } catch (error) {
    logger.error(
      "Error Fetching Semesters Academic Results",
      user,
      "getSemesterAcademicResults",
    )
    return { Sem1Results: null, Sem2Results: null }
  }
}

export const getYearAcademicResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `year-transcript-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "getYearAcademicResults")
    return cachedData
  }

  try {
    const res = await fetchData(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dia/${id}/annuel/bilan`,
      token,
    )

    const data = res.data
    logger.info(
      "Fetched Year Academic Results Successfully",
      user,
      "getYearAcademicResults",
    )
    cache.set(cacheKey, data)

    return data
  } catch (error) {
    console.log(error)
    logger.error(
      "Error Fetching Year Academic Results",
      user,
      "getYearAcademicResults",
    )
    return null
  }
}

export const getGroup = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `group-${id}-${tokenHash}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    logger.info("Group Cache Hit", user, "getGroup")
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
    const res = await fetchData(
      `https://progres.mesrs.dz/api/infos/dia/${id}/groups`,
      token,
    )

    const data = parseData(res.data)

    logger.info("Fetched Group And Section Data Successfully", user, "getGroup")
    cache.set(cacheKey, data)
    return data
  } catch (error) {
    logger.error("Error Fetching Group And Section Info", user, "getGroup")
    return null
  }
}
