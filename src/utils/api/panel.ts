import logger from "@/utils/logger"
import { longCache, shortCache } from "@/utils/cache"
import { fetchData, getCookieData } from "./helpers"

export const getDias = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `dias-${tokenHash}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getDias")
    return cachedData
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias`,
      token,
    )
    logger.info("Success", user, "getDias")
    longCache.set(cacheKey, response.data)

    return response.data
  } catch (error: any) {
    logger.error("Error", user, "getDias")
    throw new Error(error)
  }
}

export const getNormalNotes = async (id: number) => {
  const { token, user, tokenHash } = getCookieData()

  const cacheKey = `notes-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getNormalNotes")
    return cachedData
  }

  const parseData = (data: any) => {
    const firstSemNotes = [] as any[]
    const secondSemNotes = [] as any[]

    let firstSemKey = data[0].llPeriode
    let secondSemKey =
      data.find((item: any) => item.llPeriode !== firstSemKey)?.llPeriode ||
      firstSemKey

    if (firstSemKey > secondSemKey) firstSemKey = secondSemKey

    data.forEach((item: any) => {
      if (item.llPeriode === firstSemKey) firstSemNotes.push(item)
      else secondSemNotes.push(item)
    })

    return { firstSemNotes, secondSemNotes }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/controleContinue/dia/${id}/notesCC`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getNormalNotes")

    return data
  } catch (error: any) {
    logger.error("Error", user, "getNormalNotes")
    return { firstSemNotes: null, secondSemNotes: null }
  }
}

export const getExamsNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `exams-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getExamsNotes")
    return cachedData
  }

  const parseData = (data: any) => {
    const firstSemExams = {
      normal: [],
      rattrappage: [],
    } as any
    const secondSemExams = {
      normal: [],
      rattrappage: [],
    } as any

    const periods = data.map((course: any) => course.idPeriode)
    const firstSemId = Math.min(...periods)

    data.forEach((course: any) => {
      const period = course.idPeriode
      const session = course.planningSessionIntitule

      if (session === "session_1") {
        period == firstSemId
          ? firstSemExams.normal.push(course)
          : secondSemExams.normal.push(course)
      } else {
        period == firstSemId
          ? firstSemExams.rattrappage.push(course)
          : secondSemExams.rattrappage.push(course)
      }
    })

    return { firstSemExams, secondSemExams }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/planningSession/dia/${id}/noteExamens`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getExamsNotes")

    return data
  } catch (error: any) {
    logger.error("Error", user, "getExamsNotes")
    return { firstSemExams: null, secondSemExams: null }
  }
}

export const getSemesterResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `semesters-transcripts-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache ", user, "getSemesterResults")
    return cachedData
  }

  let firstSemResults: any[] = []
  let secondSemResults: any[] = []

  const parseData = (data: any) => {
    if (data[1] === undefined) {
      firstSemResults = data[0]
      return { firstSemResults, secondSemResults }
    }

    let firstSemBool =
      data[0].periodeLibelleFr < data[1].periodeLibelleFr ? true : false

    if (firstSemBool) {
      firstSemResults = data[0]
      secondSemResults = data[1]
    } else {
      firstSemResults = data[1]
      secondSemResults = data[0]
    }

    return { firstSemResults, secondSemResults }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias/${id}/periode/bilans`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getSemesterResults")

    return data
  } catch (error) {
    logger.error("Error", user, "getSemesterResults")
    return { firstSemResults, secondSemResults }
  }
}

export const getYearTranscript = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `year-transcript-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getYearTranscript")
    return cachedData
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dia/${id}/annuel/bilan`,
      token,
    )

    const data = response.data
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getYearTranscript")

    return data
  } catch (error) {
    logger.error("Error", user, "getYearTranscript")
    return null
  }
}

export const getGroup = async (id: number) => {
  const { token, user, tokenHash } = getCookieData()

  const cacheKey = `group-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getGroup")
    return cachedData
  }

  function parseData(data: any) {
    const sortedData = data.sort((a: any, b: any) => a.periodeId - b.periodeId)

    return sortedData.reduce((semesterInfo: any, item: any) => {
      if (!item.nomSection) return semesterInfo

      const semester = item.periodeLibelleLongLt
      const group = item.nomGroupePedagogique
      const section =
        item.nomSection === "Section" ? "Section 1" : item.nomSection

      semesterInfo[semester] = { group, section }

      return semesterInfo
    }, {})
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/dia/${id}/groups`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getGroup")

    return data
  } catch (error) {
    logger.error("Error", user, "getGroup")
    return null
  }
}

export const getTimeTable = async (id: number) => {
  const firstSemTimeTable = [
    {
      id: 967436,
      associationGroupePedagogiqueId: 3560104,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Analyse mathématique 1",
      matiereAr: "تحليل رياضي 1",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 1,
      jourCode: "DIM",
      jourLibelleFr: "Dimanche",
      jourLibelleAr: "Dimanche",
      enseignantId: 35884369,
      nomEnseignantLatin: "ASSALA",
      nomEnseignantArabe: "عسالة",
      prenomEnseignantLatin: "Aicha",
      prenomEnseignantArabe: "عائشة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Analyse mathématique 1/2/Amphi 1/A. ASSALA",
    },
    {
      id: 967437,
      associationGroupePedagogiqueId: 3560105,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Economie générale ",
      matiereAr: "اقتصاد عام ",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 1,
      jourCode: "DIM",
      jourLibelleFr: "Dimanche",
      jourLibelleAr: "Dimanche",
      enseignantId: 38881125,
      nomEnseignantLatin: "ATIL",
      nomEnseignantArabe: "عطيل",
      prenomEnseignantLatin: "Assia",
      prenomEnseignantArabe: "اسيا",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Economie générale /2/Amphi 1/A. ATIL",
    },
    {
      id: 967438,
      associationGroupePedagogiqueId: 3560106,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Algèbre",
      matiereAr: " الجبر",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884361,
      nomEnseignantLatin: "YESSAAD  MOKHTARI",
      nomEnseignantArabe: "يسعد مختاري",
      prenomEnseignantLatin: "Sabah",
      prenomEnseignantArabe: "صباح",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Algèbre/2/Amphi 1/S. YESSAAD  MOKHTARI",
    },
    {
      id: 967439,
      associationGroupePedagogiqueId: 3560107,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Comptabilité financière 1",
      matiereAr: "محاسبة مالية 1",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 1,
      jourCode: "DIM",
      jourLibelleFr: "Dimanche",
      jourLibelleAr: "Dimanche",
      enseignantId: 35882075,
      nomEnseignantLatin: "BENCHIKH LEHOCINE ",
      nomEnseignantArabe: "بن الشيخ الحسين",
      prenomEnseignantLatin: "Ahmed",
      prenomEnseignantArabe: " احمد",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance:
        "CM/Comptabilité financière 1/2/Amphi 1/A. BENCHIKH LEHOCINE ",
    },
    {
      id: 967440,
      associationGroupePedagogiqueId: 3560109,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Fondement du droit 1",
      matiereAr: "أسس القانون 1",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8312,
      refLieuDesignation: "Amphi 2",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31340,
      plageHoraireLibelleFr: "15:30-17:00",
      plageHoraireHeureDebut: "15:30",
      plageHoraireHeureFin: "17:00",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 38881145,
      nomEnseignantLatin: "DJESAS",
      nomEnseignantArabe: "جصاص",
      prenomEnseignantLatin: "Rajaa",
      prenomEnseignantArabe: "رجاء",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Fondement du droit 1/2/Amphi 2/R. DJESAS",
    },
    {
      id: 967441,
      associationGroupePedagogiqueId: 3560101,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Philosophie ",
      matiereAr: "فلسفة ",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8312,
      refLieuDesignation: "Amphi 2",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31339,
      plageHoraireLibelleFr: "14:00-15:30",
      plageHoraireHeureDebut: "14:00",
      plageHoraireHeureFin: "15:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884363,
      nomEnseignantLatin: "BELKACEMI",
      nomEnseignantArabe: "بلقاسمي",
      prenomEnseignantLatin: "Aida",
      prenomEnseignantArabe: "عايدة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Philosophie /2/Amphi 2/A. BELKACEMI",
    },
    {
      id: 967442,
      associationGroupePedagogiqueId: 3560102,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Informatique 1",
      matiereAr: "إعلام آلي 1",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884370,
      nomEnseignantLatin: "NEMOUCHI",
      nomEnseignantArabe: "نموشي",
      prenomEnseignantLatin: "Soulef",
      prenomEnseignantArabe: "سلاف",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Informatique 1/2/Amphi 1/S. NEMOUCHI",
    },
    {
      id: 967443,
      associationGroupePedagogiqueId: 3560103,
      groupePedagogiqueId: 590794,
      periodeId: 16,
      sectionId: null,
      groupe: "2",
      matiere: "Statistiques descriptives ",
      matiereAr: "الإحصاء الوصفي ",
      ap: "CM",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35882080,
      nomEnseignantLatin: "Ghouar",
      nomEnseignantArabe: "غوار",
      prenomEnseignantLatin: " Ahlem",
      prenomEnseignantArabe: "احلام",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Statistiques descriptives /2/Amphi 1/ . GHOUAR",
    },
    {
      id: 967468,
      associationGroupePedagogiqueId: 3560181,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Analyse mathématique 1",
      matiereAr: "تحليل رياضي 1",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9562,
      refLieuDesignation: "Salle 2\t",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35884368,
      nomEnseignantLatin: "BERKANE",
      nomEnseignantArabe: "بركان",
      prenomEnseignantLatin: "Ali",
      prenomEnseignantArabe: "علي",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Analyse mathématique 1/4/Salle 2\t/A. BERKANE",
    },
    {
      id: 967469,
      associationGroupePedagogiqueId: 3560182,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Economie générale ",
      matiereAr: "اقتصاد عام ",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9562,
      refLieuDesignation: "Salle 2\t",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 38878467,
      nomEnseignantLatin: "benaissa",
      nomEnseignantArabe: "بن عيسى",
      prenomEnseignantLatin: "ilhem",
      prenomEnseignantArabe: "الهام",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Economie générale /4/Salle 2\t/I. BENAISSA",
    },
    {
      id: 967470,
      associationGroupePedagogiqueId: 3560183,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Algèbre",
      matiereAr: " الجبر",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884361,
      nomEnseignantLatin: "YESSAAD  MOKHTARI",
      nomEnseignantArabe: "يسعد مختاري",
      prenomEnseignantLatin: "Sabah",
      prenomEnseignantArabe: "صباح",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Algèbre/4/Salle 4/S. YESSAAD  MOKHTARI",
    },
    {
      id: 967471,
      associationGroupePedagogiqueId: 3560184,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Comptabilité financière 1",
      matiereAr: "محاسبة مالية 1",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884395,
      nomEnseignantLatin: "CHEMMAM",
      nomEnseignantArabe: "شمام",
      prenomEnseignantLatin: "Ouafa",
      prenomEnseignantArabe: "وفاء",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Comptabilité financière 1/4/Salle 4/O. CHEMMAM",
    },
    {
      id: 967472,
      associationGroupePedagogiqueId: 3560185,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Français 1",
      matiereAr: "فرنسية 1",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9568,
      refLieuDesignation: "Salle 10",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31339,
      plageHoraireLibelleFr: "14:00-15:30",
      plageHoraireHeureDebut: "14:00",
      plageHoraireHeureFin: "15:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35882079,
      nomEnseignantLatin: "MADOUI",
      nomEnseignantArabe: "مضوي",
      prenomEnseignantLatin: "Sandra",
      prenomEnseignantArabe: "صندرة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Français 1/4/Salle 10/S. MADOUI",
    },
    {
      id: 967473,
      associationGroupePedagogiqueId: 3560186,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Anglais 1",
      matiereAr: "إنجليزية 1",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9568,
      refLieuDesignation: "Salle 10",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31340,
      plageHoraireLibelleFr: "15:30-17:00",
      plageHoraireHeureDebut: "15:30",
      plageHoraireHeureFin: "17:00",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35882069,
      nomEnseignantLatin: "BENGHOMRANI",
      nomEnseignantArabe: "بن غمراني",
      prenomEnseignantLatin: "Naziha",
      prenomEnseignantArabe: "نزيهة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Anglais 1/4/Salle 10/N. BENGHOMRANI",
    },
    {
      id: 967474,
      associationGroupePedagogiqueId: 4363500,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Informatique 1",
      matiereAr: "إعلام آلي 1",
      ap: "TP",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 13272,
      refLieuDesignation: "Labo 2",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 38303813,
      nomEnseignantLatin: "RAIS",
      nomEnseignantArabe: "رايس",
      prenomEnseignantLatin: "MOHAMED SABER",
      prenomEnseignantArabe: "محمد صابر",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TP/Informatique 1/4/Labo 2/M. RAIS",
    },
    {
      id: 967475,
      associationGroupePedagogiqueId: 3560180,
      groupePedagogiqueId: 590802,
      periodeId: 16,
      sectionId: 590794,
      groupe: "4",
      matiere: "Statistiques descriptives ",
      matiereAr: "الإحصاء الوصفي ",
      ap: "TD",
      emploiId: 19384,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884485,
      nomEnseignantLatin: "MERADJI",
      nomEnseignantArabe: "مراجي",
      prenomEnseignantLatin: "Asma",
      prenomEnseignantArabe: "اسماء",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Statistiques descriptives /4/Salle 4/A. MERADJI",
    },
  ]
  const secondSemTimeTable = [
    {
      id: 968296,
      associationGroupePedagogiqueId: 4065820,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Algèbre linéaire 1",
      matiereAr: "الجبر الخطي 1",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884361,
      nomEnseignantLatin: "YESSAAD  MOKHTARI",
      nomEnseignantArabe: "يسعد مختاري",
      prenomEnseignantLatin: "Sabah",
      prenomEnseignantArabe: "صباح",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Algèbre linéaire 1/2/Amphi 1/S. YESSAAD  MOKHTARI",
    },
    {
      id: 968297,
      associationGroupePedagogiqueId: 4065824,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Analyse mathématique 2",
      matiereAr: "التحليل الرياضي 2",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 1,
      jourCode: "DIM",
      jourLibelleFr: "Dimanche",
      jourLibelleAr: "Dimanche",
      enseignantId: 35884369,
      nomEnseignantLatin: "ASSALA",
      nomEnseignantArabe: "عسالة",
      prenomEnseignantLatin: "Aicha",
      prenomEnseignantArabe: "عائشة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Analyse mathématique 2/2/Amphi 1/A. ASSALA",
    },
    {
      id: 968298,
      associationGroupePedagogiqueId: 4065829,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Comptabilité financière 2",
      matiereAr: "محاسبة مالية 2",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 1,
      jourCode: "DIM",
      jourLibelleFr: "Dimanche",
      jourLibelleAr: "Dimanche",
      enseignantId: 35882075,
      nomEnseignantLatin: "BENCHIKH LEHOCINE ",
      nomEnseignantArabe: "بن الشيخ الحسين",
      prenomEnseignantLatin: "Ahmed",
      prenomEnseignantArabe: " احمد",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance:
        "CM/Comptabilité financière 2/2/Amphi 1/A. BENCHIKH LEHOCINE ",
    },
    {
      id: 968299,
      associationGroupePedagogiqueId: 4065801,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Introduction aux Sciences Sociales ",
      matiereAr: "مدخل إلى العلوم الإجتماعية ",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8312,
      refLieuDesignation: "Amphi 2",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31339,
      plageHoraireLibelleFr: "14:00-15:30",
      plageHoraireHeureDebut: "14:00",
      plageHoraireHeureFin: "15:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884363,
      nomEnseignantLatin: "BELKACEMI",
      nomEnseignantArabe: "بلقاسمي",
      prenomEnseignantLatin: "Aida",
      prenomEnseignantArabe: "عايدة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance:
        "CM/Introduction aux Sciences Sociales /2/Amphi 2/A. BELKACEMI",
    },
    {
      id: 968300,
      associationGroupePedagogiqueId: 4065804,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Probabilités 1",
      matiereAr: "احتمالات 1",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35882080,
      nomEnseignantLatin: "Ghouar",
      nomEnseignantArabe: "غوار",
      prenomEnseignantLatin: " Ahlem",
      prenomEnseignantArabe: "احلام",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Probabilités 1/2/Amphi 1/ . GHOUAR",
    },
    {
      id: 968301,
      associationGroupePedagogiqueId: 4065808,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Informatique 2",
      matiereAr: "إعلام آلي 2",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8314,
      refLieuDesignation: "Amphi 1",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 35884370,
      nomEnseignantLatin: "NEMOUCHI",
      nomEnseignantArabe: "نموشي",
      prenomEnseignantLatin: "Soulef",
      prenomEnseignantArabe: "سلاف",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Informatique 2/2/Amphi 1/S. NEMOUCHI",
    },
    {
      id: 968302,
      associationGroupePedagogiqueId: 4065798,
      groupePedagogiqueId: 677932,
      periodeId: 46,
      sectionId: null,
      groupe: "2",
      matiere: "Fondement du droit 2",
      matiereAr: "أسس القانون 2",
      ap: "CM",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 8312,
      refLieuDesignation: "Amphi 2",
      refLieuTypeLibelleLongFr: "Amphi",
      plageHoraireId: 31340,
      plageHoraireLibelleFr: "15:30-17:00",
      plageHoraireHeureDebut: "15:30",
      plageHoraireHeureFin: "17:00",
      jourId: 3,
      jourCode: "MAR",
      jourLibelleFr: "Mardi",
      jourLibelleAr: "Mardi",
      enseignantId: 37876640,
      nomEnseignantLatin: "TOUIL",
      nomEnseignantArabe: "طويل",
      prenomEnseignantLatin: "Zakaria",
      prenomEnseignantArabe: "زكريا",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "CM/Fondement du droit 2/2/Amphi 2/Z. TOUIL",
    },
    {
      id: 968343,
      associationGroupePedagogiqueId: 4072067,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Macro économie",
      matiereAr: "إقتصاد كلي",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9562,
      refLieuDesignation: "Salle 2\t",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35884360,
      nomEnseignantLatin: "CHERAIET",
      nomEnseignantArabe: "شريط",
      prenomEnseignantLatin: "Nesrine",
      prenomEnseignantArabe: "نسرين",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Macro économie/4/Salle 2\t/N. CHERAIET",
    },
    {
      id: 968344,
      associationGroupePedagogiqueId: 4072070,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Algèbre linéaire 1",
      matiereAr: "الجبر الخطي 1",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884361,
      nomEnseignantLatin: "YESSAAD  MOKHTARI",
      nomEnseignantArabe: "يسعد مختاري",
      prenomEnseignantLatin: "Sabah",
      prenomEnseignantArabe: "صباح",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Algèbre linéaire 1/4/Salle 4/S. YESSAAD  MOKHTARI",
    },
    {
      id: 968345,
      associationGroupePedagogiqueId: 4072072,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Analyse mathématique 2",
      matiereAr: "التحليل الرياضي 2",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9562,
      refLieuDesignation: "Salle 2\t",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35884368,
      nomEnseignantLatin: "BERKANE",
      nomEnseignantArabe: "بركان",
      prenomEnseignantLatin: "Ali",
      prenomEnseignantArabe: "علي",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Analyse mathématique 2/4/Salle 2\t/A. BERKANE",
    },
    {
      id: 968346,
      associationGroupePedagogiqueId: 4072076,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Comptabilité financière 2",
      matiereAr: "محاسبة مالية 2",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31337,
      plageHoraireLibelleFr: "09:30-11:00",
      plageHoraireHeureDebut: "09:30",
      plageHoraireHeureFin: "11:00",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884395,
      nomEnseignantLatin: "CHEMMAM",
      nomEnseignantArabe: "شمام",
      prenomEnseignantLatin: "Ouafa",
      prenomEnseignantArabe: "وفاء",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Comptabilité financière 2/4/Salle 4/O. CHEMMAM",
    },
    {
      id: 968347,
      associationGroupePedagogiqueId: 4072054,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Probabilités 1",
      matiereAr: "احتمالات 1",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9010,
      refLieuDesignation: "Salle 4",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31338,
      plageHoraireLibelleFr: "11:00-12:30",
      plageHoraireHeureDebut: "11:00",
      plageHoraireHeureFin: "12:30",
      jourId: 5,
      jourCode: "JEU",
      jourLibelleFr: "Jeudi",
      jourLibelleAr: "Jeudi",
      enseignantId: 35884485,
      nomEnseignantLatin: "MERADJI",
      nomEnseignantArabe: "مراجي",
      prenomEnseignantLatin: "Asma",
      prenomEnseignantArabe: "اسماء",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Probabilités 1/4/Salle 4/A. MERADJI",
    },
    {
      id: 968348,
      associationGroupePedagogiqueId: 4072063,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Informatique 2",
      matiereAr: "إعلام آلي 2",
      ap: "TP",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 13272,
      refLieuDesignation: "Labo 2",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31336,
      plageHoraireLibelleFr: "08:00-09:30",
      plageHoraireHeureDebut: "08:00",
      plageHoraireHeureFin: "09:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 38303813,
      nomEnseignantLatin: "RAIS",
      nomEnseignantArabe: "رايس",
      prenomEnseignantLatin: "MOHAMED SABER",
      prenomEnseignantArabe: "محمد صابر",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TP/Informatique 2/4/Labo 2/M. RAIS",
    },
    {
      id: 968349,
      associationGroupePedagogiqueId: 4072047,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Langue française 2",
      matiereAr: "اللغة الفرنسية 2",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9568,
      refLieuDesignation: "Salle 10",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31339,
      plageHoraireLibelleFr: "14:00-15:30",
      plageHoraireHeureDebut: "14:00",
      plageHoraireHeureFin: "15:30",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35882079,
      nomEnseignantLatin: "MADOUI",
      nomEnseignantArabe: "مضوي",
      prenomEnseignantLatin: "Sandra",
      prenomEnseignantArabe: "صندرة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Langue française 2/4/Salle 10/S. MADOUI",
    },
    {
      id: 968350,
      associationGroupePedagogiqueId: 4072050,
      groupePedagogiqueId: 677954,
      periodeId: 46,
      sectionId: 677932,
      groupe: "4",
      matiere: "Langue anglaise 2",
      matiereAr: "اللغة الإنجليزية 2",
      ap: "TD",
      emploiId: 8690,
      enseignantNom: null,
      enseignantPrenom: null,
      refLieuId: 9568,
      refLieuDesignation: "Salle 10",
      refLieuTypeLibelleLongFr: "Salle",
      plageHoraireId: 31340,
      plageHoraireLibelleFr: "15:30-17:00",
      plageHoraireHeureDebut: "15:30",
      plageHoraireHeureFin: "17:00",
      jourId: 4,
      jourCode: "MER",
      jourLibelleFr: "Mercredi",
      jourLibelleAr: "Mercredi",
      enseignantId: 35882069,
      nomEnseignantLatin: "BENGHOMRANI",
      nomEnseignantArabe: "بن غمراني",
      prenomEnseignantLatin: "Naziha",
      prenomEnseignantArabe: "نزيهة",
      lieuDisponible: null,
      enseignantDisponible: null,
      groupeDisponible: null,
      libelleSeance: "TD/Langue anglaise 2/4/Salle 10/N. BENGHOMRANI",
    },
  ]
  return { firstSemTimeTable, secondSemTimeTable }
}
