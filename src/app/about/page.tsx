import Image from "next/image"

export const metadata = {
  title: "WebEtu - About",
}

const contentStyle =
  "text-md sm:text-xl leading-loose sm:leading-relaxed text-gray-700 sm:mr-4"

const Section = ({ title, children, titleColor }: any) => {
  return (
    <section className="mb-10">
      <h2 className={`text-xl sm:text-2xl font-semibold sm:m-2 ${titleColor}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}

const List = ({ items }: any) => {
  return (
    <ul className={`${contentStyle} list-disc list-inside space-y-2`}>
      {items.map((item: any, index: any) => (
        <li key={index} className="pr-4">
          {item}
        </li>
      ))}
    </ul>
  )
}

// AboutPage Component
const AboutPage = () => {
  return (
    <article
      className="rtl p-6 sm:p-10 max-w-6xl mx-auto font-sans text-gray-800"
      dir="rtl"
    >
      <header className="text-center mb-12">
        <div className="flex justify-center items-center mt-6 px-4">
          <Image
            priority={true}
            src="/images/logo-black.svg"
            alt="OSCA Club Logo"
            width={150}
            height={150}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
          مرحبًا بكم في WebEtu
        </h1>
        <p className="text-md sm:text-xl text-gray-600 mt-2 font-semibold">
          جامعة باجي مختار
        </p>
      </header>

      <Section title="من نحن؟" titleColor="text-green-700">
        <p className={contentStyle}>
          نحن نادي علمي يتكون من مجموعة من طلاب الإعلام الآلي في جامعة باجي
          مختار بولاية عنابة، يطلق على نادينا إسم مجتمع البرمجيات مفتوحة المصدر،
          حيث نسعى لتعزيز التعاون وتبادل المعرفة في مجال البرمجيات الحرة.
        </p>
      </Section>

      <Section title="ما هو هذا الموقع؟" titleColor="text-green-700">
        <p className={contentStyle}>
          هذا الموقع هو نسخة ويب بديلة غير رسمية من تطبيق{" "}
          <a
            href="https://play.google.com/store/apps/details?id=app.progres.webetu&hl=en"
            className="font-bold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WebEtu
          </a>
        </p>
      </Section>

      <Section title="ما سبب تطوير هذا الموقع؟" titleColor="text-green-700">
        <p className={contentStyle}>هناك سببان رئيسيان يتمثلان في:</p>
        <List
          items={[
            "دعم مختلف المنصات الإلكترونية سواء أجهزة حاسوب أو الهواتف أو أي جهاز رقمي أخر به متصفح",
            "بعض المشاكل التقنية الموجودة في التطبيق الرسمي الخاص بوزارة التعليم العالي والبحث العلمي",
          ]}
        />
      </Section>

      <Section title="الإبلاغ عن مشكلة" titleColor="text-sky-700">
        <p className={contentStyle}>
          في حال أردت التبليغ عن مشكلة أو تقديم إقتراح لتحسين الموقع، يُرجى
          الإنضمام إلى مجموعتنا في التيليجرام عبر الضغط على الأيقونة الموجودة
          أسفل الصفحة.
        </p>
      </Section>

      <Section title="فريق العمل" titleColor="text-sky-700">
        <List items={["قصاص أحمد عبد النور", "شدادي خليل عبد الرحمان"]} />
      </Section>

      <footer className="text-center mt-12">
        <a
          href="https://t.me/OSCommunityChat"
          className="text-sky-600/80 hover:text-sky-500 transition duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-telegram-plane text-4xl sm:text-5xl"></i>{" "}
        </a>
        <p className="text-gray-500 text-sm sm:text-md mt-4">
          🄯 2024 OSCA - All Lefts Unreserved
        </p>
      </footer>
    </article>
  )
}

export default AboutPage
