import { cookies } from "next/headers";
import axios from "axios";
import ExamTabs from "@/components/ExamTabs";

export const metadata = {
  title: "WebEtu - Exams",
};

const getExamsNotes = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];

  const parseData = (data: any) => {
    const semesters = {
      "Semester 1": {
        normal: [],
        rattrappage: [],
      },
      "Semester 2": {
        normal: [],
        rattrappage: [],
      },
    } as any;

    data.forEach((course: any) => {
      const period = course.idPeriode;
      const session = course.planningSessionIntitule;
      const semester = period % 2 == 0 ? "Semester 1" : "Semester 2";

      if (session === "session_1") {
        semesters[semester].normal.push(course);
      } else {
        semesters[semester].rattrappage.push(course);
      }
    });

    return semesters;
  };

  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/planningSession/dia/${dia.id}/noteExamens`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 10000,
      }
    );

    console.log("[exams] Exam Notes fetched successfully");
    return parseData(res.data);
  } catch (error: any) {
    throw Error("Error fetching Exam Notes");
  }
};

export default async function Exams() {
  const results = (await getExamsNotes()) as any;
  return (
    <>
      <ExamTabs data={results} />
    </>
  );
}
