import logger from "@/utils/logger"
import { shortCache } from "@/utils/cache"
import { fetchData, getCookieData } from "./helpers"

export const getDias = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `dias-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Dias Cache Hit", user, "getDias")
    return cachedData
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias`,
      token,
    )
    logger.info("Dias Fetched Successfully", user, "getDias")
    shortCache.set(cacheKey, response.data)
    return response.data
  } catch (error: any) {
    logger.error(`Error Fetching Dias Records`, user, "getDias")
    throw new Error(error)
  }
}

export const getOrdinaryNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `notes-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Notes Cache Hit", user, "getOrdinaryNotes")
    return cachedData
  }

  const parseData = (data: any) => {
    const Sem1Ordinary = [] as any[]
    const Sem2Ordinary = [] as any[]

    let sem1 = data[0].llPeriode
    let sem2 = data.find((item: any) => item.llPeriode !== sem1).llPeriode
    if (sem1 > sem2) {
      sem1 = sem2
    }
    data.forEach((item: any) => {
      if (item.llPeriode === sem1) {
        Sem1Ordinary.push(item)
      } else {
        Sem2Ordinary.push(item)
      }
    })
    return { Sem1Ordinary, Sem2Ordinary }
  }

  try {
    const res = await fetchData(
      `${process.env.PROGRES_API}/controleContinue/dia/${id}/notesCC`,
      token,
    )

    const data = parseData(res.data)
    shortCache.set(cacheKey, data)

    logger.info("Notes Fetched/Parsed Successfully", user, "getOrdinaryNotes")

    return data
  } catch (error: any) {
    logger.error("Error Fetching Ordinary Notes", user, "getOrdinaryNotes")
    return { Sem1Ordinary: null, Sem2Ordinary: null }
  }
}

export const getExamsNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `exams-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

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
      `${process.env.PROGRES_API}/planningSession/dia/${id}/noteExamens`,
      token,
    )

    const data = parseData(res.data)
    shortCache.set(cacheKey, data)

    logger.info("Exam Notes Fetched/Parsed Successfully", user, "getExamsNotes")

    return data
  } catch (error: any) {
    logger.error("Error Fetching/Parsing Exams Notes", user, "getExamsNotes")
    return { Sem1Exams: null, Sem2Exams: null }
  }
}

export const getSemesterResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `semesters-transcripts-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

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
    logger.info("Semesters Transcripts Cache Hit", user, "getSemesterResults")
    return cachedData
  }

  try {
    const res = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias/${id}/periode/bilans`,
      token,
    )

    const data = parseData(res.data)
    shortCache.set(cacheKey, data)

    logger.info(
      "Fetched/Parsed Semesters Results Successfully",
      user,
      "getSemesterResults",
    )

    return data
  } catch (error) {
    logger.error(
      "Error Fetching/Parsing Semesters Results",
      user,
      "getSemesterResults",
    )
    return { Sem1Results: null, Sem2Results: null }
  }
}

export const getYearTranscript = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `year-transcript-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "getYearTranscript")
    return cachedData
  }

  try {
    const res = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dia/${id}/annuel/bilan`,
      token,
    )

    const data = res.data
    shortCache.set(cacheKey, data)

    logger.info(
      "Fetched Year Transcript Successfully",
      user,
      "getYearTranscript",
    )

    return data
  } catch (error) {
    logger.error("Error Fetching Year Transcript", user, "getYearTranscript")
    return null
  }
}

export const getGroup = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `group-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

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
      `${process.env.PROGRES_API}/dia/${id}/groups`,
      token,
    )

    const data = parseData(res.data)
    shortCache.set(cacheKey, data)

    logger.info(
      "Fetched/Parsed Group And Section Data Successfully",
      user,
      "getGroup",
    )

    return data
  } catch (error) {
    logger.error(
      "Error Fetching/Parsing Group And Section Info",
      user,
      "getGroup",
    )
    return null
  }
}
