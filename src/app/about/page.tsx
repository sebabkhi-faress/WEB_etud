import Image from "next/image"
import { FaUser, FaInfoCircle, FaBullseye, FaComments, FaTelegram, FaGithub } from 'react-icons/fa'

export const metadata = {
  title: "WebEtu - About",
}

const contentStyle =
  "text-md sm:text-xl leading-loose sm:leading-relaxed text-gray-700 sm:mr-4"

const Section = ({ title, children, titleColor, icon }: any) => {
  return (
    <section className="mb-10 bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className={`text-xl sm:text-2xl font-semibold sm:m-2 ${titleColor} flex items-center gap-2`}>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}

const AboutPage = () => {
  return (
    <article
      className="rtl p-6 sm:p-10 max-w-6xl mx-auto font-sans text-gray-800 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      <header className="text-center mb-12 bg-white rounded-lg p-8 shadow-lg">
        <div className="flex justify-center items-center mt-6 px-4">
          <Image
            priority={true}
            src="/images/umbb-logo.png"
            alt="UMBB Logo"
            width={120} 
            height={120}
            className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          مرحبًا بكم في WebEtu
        </h1>
        <p className="text-md sm:text-xl text-gray-600 mt-2 font-semibold">
          جامعة امحمد بوقرة بومرداس كلية العلوم
        </p>
      </header>

      <Section title="من أنا؟" titleColor="text-green-700" icon={<FaUser className="text-green-600" />}>
        <p className={contentStyle}>
          أنا <span className="font-bold text-green-700">فارس سبابخي</span>، مطور مستقل قمت بتطوير هذا الموقع بالكامل بهدف تحسين تجربة استخدام منصة WebEtu على الويب. أسعى لتقديم حلول رقمية عملية وحديثة لطلبة جامعة بومرداس .
        </p>
      </Section>

      <Section title="ما هو هذا الموقع؟" titleColor="text-green-700" icon={<FaInfoCircle className="text-green-600" />}>
        <p className={contentStyle}>
          هذا الموقع هو نسخة ويب بديلة وغير رسمية من تطبيق{" "}
          <a
            href="https://play.google.com/store/apps/details?id=app.progres.webetu&hl=en"
            className="font-bold underline hover:text-green-600 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            WebEtu
          </a>
          ، مصمم بواجهة حديثة ومتوافقة مع مختلف الأجهزة.
        </p>
      </Section>

      <Section title="أهداف المشروع" titleColor="text-green-700" icon={<FaBullseye className="text-green-600" />}>
        <ul className={`${contentStyle} list-disc list-inside space-y-2`}>
          <li className="hover:text-green-600 transition-colors duration-200">
            دعم جميع المنصات (حاسوب، هاتف، جهاز لوحي) من خلال تجربة تصفح سلسة.
          </li>
          <li className="hover:text-green-600 transition-colors duration-200">
            تجاوز بعض القيود والمشاكل التقنية في التطبيق الرسمي الخاص بالوزارة.
          </li>
          <li className="hover:text-green-600 transition-colors duration-200">
            تقديم واجهة عصرية خفيفة وسريعة مبنية بتقنيات حديثة مثل Next.js وTailwind CSS.
          </li>
        </ul>
      </Section>

      <Section title="التواصل أو الإبلاغ عن مشكلة" titleColor="text-sky-700" icon={<FaComments className="text-sky-600" />}>
        <p className={contentStyle}>
          إذا كنت ترغب في تقديم ملاحظة أو الإبلاغ عن مشكلة، يُرجى التواصل عبر{" "}
          <a
            href="mailto:sebabkhifaresseddine.fs@univ-boumerdes.dz"
            className="font-bold underline hover:text-sky-600 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            الايميل
          </a>
          .
        </p>
      </Section>

      <footer className="text-center mt-12 bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-center gap-6">
          <a
            href=""
            className="text-sky-600/80 hover:text-sky-500 transition duration-200 hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram className="text-4xl sm:text-5xl" />
          </a>
          <a
            href=""
            className="text-gray-800 hover:text-gray-600 transition duration-200 hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-4xl sm:text-5xl" />
          </a>
        </div>
        <p className="text-gray-500 text-sm sm:text-md mt-4">
          🄯 2024 Sebabkhi Fares – جميع الحقوق مفتوحة
        </p>
      </footer>
    </article>
  )
}

export default AboutPage
