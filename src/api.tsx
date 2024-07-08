import { cookies } from "next/headers";
import axios from "axios";
import logger from "@/utils";
import cache from "@/cache";

const getCookieData = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  const uuid = cookieStore.get("uuid")?.value;

  return { token, user, uuid };
};

export const getDias = async () => {
  const { token, user, uuid } = getCookieData();

  try {
    const response = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${uuid}/dias`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 100000,
      }
    );
    logger.info("dias fetched successfully", user, "/years");
    return response.data;
  } catch (error: any) {
    logger.error(`Error - ${error}`, user, "/years");
    return null;
  }
};

export const getTdTp = async (id: number) => {
  const { token, user } = getCookieData();

  const cacheKey = `notes-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("notes cache hit", user, "/notes");
    return cachedData;
  }

  const parseData = (data: any) => {
    const Sem1TdTp = [] as any[];
    const Sem2TdTp = [] as any[];

    let sem1 = data[0].llPeriode;
    let sem2 = data.find((item: any) => item.llPeriode !== sem1).llPeriode;
    if (sem1 > sem2) {
      sem1 = sem2;
    }
    data.forEach((item: any) => {
      if (item.llPeriode === sem1) {
        Sem1TdTp.push(item);
      } else {
        Sem2TdTp.push(item);
      }
    });
    return { Sem1TdTp, Sem2TdTp };
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/controleContinue/dia/${id}/notesCC`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000,
      }
    );

    logger.info("Notes fetched successfully", user, "/notes");
    const data = parseData(res.data);
    cache.set(cacheKey, data);

    return data;
  } catch (error: any) {
    logger.error("Error fetching TP and Td Notes", user, "/notes");
    return { Sem1TdTp: null, Sem2TdTp: null };
  }
};

export const getExamsNotes = async (id: number) => {
  const { token, user } = getCookieData();

  const cacheKey = `exams-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("exams cache hit", user, "/exams");
    return cachedData;
  }

  const parseData = (data: any) => {
    const Sem1Exams = {
      normal: [],
      rattrappage: [],
    } as any;
    const Sem2Exams = {
      normal: [],
      rattrappage: [],
    } as any;

    const periods = data.map((course: any) => course.idPeriode);
    const firstSemester = Math.min(...periods);

    data.forEach((course: any) => {
      const period = course.idPeriode;
      const session = course.planningSessionIntitule;
      const sem1 = period == firstSemester;

      if (session === "session_1") {
        sem1 ? Sem1Exams.normal.push(course) : Sem2Exams.normal.push(course);
      } else {
        sem1
          ? Sem1Exams.rattrappage.push(course)
          : Sem2Exams.rattrappage.push(course);
      }
    });

    return { Sem1Exams, Sem2Exams };
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/planningSession/dia/${id}/noteExamens`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000,
      }
    );

    logger.info("Exam Notes fetched successfully", user, "/exams");
    const data = parseData(res.data);
    cache.set(cacheKey, data);
    return data;
  } catch (error: any) {
    logger.error("Error fetching exam notes", user, "/exams");
    return { Sem1Exams: null, Sem2Exams: null };
  }
};

export const getSemesterAcademicResults = async (id: number) => {
  const { token, user } = getCookieData();
  const cacheKey = `semesters-transcripts-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  const parseData = (data: any) => {
    let sem1 = data[0].periodeLibelleFr < data[1].periodeLibelleFr ? 0 : 1;
    let Sem1Results;
    let Sem2Results;
    if (sem1 === 0) {
      Sem1Results = data[0];
      Sem2Results = data[1];
    } else {
      Sem1Results = data[1];
      Sem2Results = data[0];
    }
    return { Sem1Results, Sem2Results };
  };

  if (cachedData) {
    logger.info("Semesters Transcripts Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dias/${id}/periode/bilans`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    logger.info(
      "Fetched Semesters Academic Results Successfully",
      user,
      "/years"
    );
    const data = parseData(res.data);

    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Semesters Academic Results", user, "/years");
    return { Sem1Results: null, Sem2Results: null };
  }
};

export const getYearAcademicResults = async (id: number) => {
  const { token, user } = getCookieData();
  const cacheKey = `year-transcript-${id}-${user}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info("Year Transcript Cache Hit", user, "/transcripts");
    return cachedData;
  }

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/bac/${token}/dia/${id}/annuel/bilan`,
      {
        headers: { Authorization: token },
        timeout: 10000,
      }
    );

    const data = res.data;
    logger.info("Fetched Year Academic Results Successfully", user, "/years");
    cache.set(cacheKey, data);

    return data;
  } catch (error) {
    logger.error("Error Fetching Year Academic Results", user, "/years");
    return null;
  }
};
