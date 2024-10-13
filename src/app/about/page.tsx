import Image from "next/image"

export const metadata = {
  title: "WebEtu - About",
}

const titleStyle = "text-2xl sm:text-3xl font-semibold sm:m-2"
const contentStyle =
  "text-lg sm:text-2xl leading-loose sm:leading-relaxed text-gray-700 sm:mr-4"

const AboutPage = async () => {
  return (
    <article
      className="rtl p-6 sm:p-10 max-w-6xl mx-auto font-sans text-gray-800"
      dir="rtl"
    >
      <header className="text-center mb-12">
        <div className="flex justify-center items-center mt-6 px-4">
          <Image
            src="/images/logo-black.svg"
            alt="OSCA Club Logo"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
          مرحبًا بكم في WebEtu
        </h1>
        <p className="text-lg sm:text-2xl text-gray-600 mt-2 font-semibold">
          جامعة باجي مختار
        </p>
      </header>

      <section className="mb-10">
        <h2 className={`${titleStyle} text-green-700`}>من نحن؟</h2>
        <p className={contentStyle}>
          نحن نادي علمي يتكون من مجموعة من طلاب الإعلام الآلي في جامعة باجي
          مختار بولاية عنابة، يطلق على نادينا إسم مجتمع البرمجيات مفتوحة المصدر،
          حيث نسعى لتعزيز التعاون وتبادل المعرفة في مجال البرمجيات الحرة
        </p>
      </section>

      <section className="mb-10">
        <h2 className={`${titleStyle} text-green-700`}>ما هو هذا الموقع؟</h2>
        <p className={contentStyle}>
          هذا الموقع هو نسخة ويب بديلة غير رسمية من تطبيق{" "}
          <a
            href="https://play.google.com/store/apps/details?id=app.progres.webetu&hl=en"
            className="font-bold underline"
          >
            WebEtu
          </a>
        </p>
      </section>

      <section className="mb-10">
        <h2 className={`${titleStyle} text-green-700`}>
          ما سبب تطوير هذا الموقع؟
        </h2>
        <p className="text-lg sm:text-2xl leading-loose sm:leading-relaxed text-gray-700 m-2">
          هناك سببان رئيسيان يتمثلان في:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-lg sm:text-2xl leading-loose sm:leading-relaxed space-y-2">
          <li className="pr-4">
            دعم مختلف المنصات الإلكترونية سواء أجهزة حاسوب أو الهواتف أو أي جهاز
            رقمي أخر به متصفح حديث نوعا ما
          </li>
          <li className="pr-4">
            بعض المشاكل التقنية الموجودة في التطبيق الرسمي الخاص بوزارة التعليم
            العالي والبحث العلمي
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className={`${titleStyle} text-sky-700`}>الإبلاغ عن مشكلة</h2>
        <p className={contentStyle}>
          في حال أردت التبليغ عن مشكلة أو تقديم إقتراح لتحسين الموقع، يُرجى
          الإنضمام إلى مجموعتنا في التيليجرام عبر الضغط على الأيقونة الموجودة
          أسفل الصفحة
        </p>
      </section>

      <section className="mb-10">
        <h2 className={`${titleStyle} text-sky-700`}>فريق العمل</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg sm:text-2xl leading-loose sm:leading-relaxed space-y-2">
          <li className="pr-4">قصاص أحمد عبد النور</li>
          <li className="pr-4">شدادي خليل عبد الرحمان</li>
        </ul>
      </section>

      <footer className="text-center mt-12">
        <a
          href="https://t.me/OSCommunityChat"
          className="text-green-600 hover:text-green-700 transition duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-telegram-plane text-5xl"></i>{" "}
        </a>
        <p className="text-gray-500 text-sm mt-4">
          © 2024 OSCA - All Rights Reserved
        </p>
      </footer>
    </article>
  )
}

export default AboutPage
