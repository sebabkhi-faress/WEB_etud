"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

export default function ExamTabs({ data }) {
  return (
    <div className="w-full max-w-4xl">
      <TabGroup>
        <TabList className="flex gap-4 ">
          {Object.keys(data).map((semester) => (
            <Tab
              key={semester}
              className="rounded-full py-1 px-3 text-sm font-semibold text-black focus:outline-none data-[selected]:bg-green-400"
            >
              {semester}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-3">
          {Object.keys(data).map((semester) => (
            <TabPanel key={semester} className="rounded-xl bg-white/5 p-3">
              <div className="session">
                <h3 className="text-lg font-bold">Normal Session</h3>
                <div className="mt-2 flex flex-col gap-4">
                  {data[semester].normal.map((course) => (
                    <div
                      className={`rounded-lg p-4 flex justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                        course.noteExamen >= 10
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                      key={course.id}
                    >
                      <h4 className="font-semibold text-black">
                        {course.mcLibelleFr}
                      </h4>
                      <div className="flex gap-4">
                        <p className="font-bold text-lg">{course.noteExamen}</p>

                        {/* <p className="font-bold text-lg">
                          {course.rattachementMcCredit}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="session mt-4 text-red-500">
                <h3 className="text-lg font-bold">Rattrappage Session</h3>
                <div className="mt-2 flex flex-col gap-4">
                  {data[semester].rattrappage.map((course) => (
                    <div
                      className={`rounded-lg p-4 flex justify-between items-center shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                        course.noteExamen >= 10
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                      key={course.id}
                    >
                      <h4 className="font-semibold text-black">
                        {course.mcLibelleFr}
                      </h4>
                      <div className="flex gap-4">
                        <p className="font-bold text-lg">{course.noteExamen}</p>

                        {/* <p className="font-bold text-lg">
                          {course.rattachementMcCredit}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
