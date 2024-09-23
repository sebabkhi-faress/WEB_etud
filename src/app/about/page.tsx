export const metadata = {
  title: "WebEtu - Blog",
};

const Layout = async () => {
  return (
    <article className="rtl p-6 sm:p-10 max-w-4xl mx-auto font-sans text-gray-800" dir="rtl">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-600">
          OSCA Club
        </h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-4">
          من نحن؟
        </h2>
        <p className="text-lg leading-relaxed">
          نحن مجموعة من طلبة الإعلام الآلي من جامعة باجي مختار لولاية عنابة
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-4">
          ما هو هذا الموقع؟
        </h2>
        <p className="text-lg leading-relaxed">
          هذا الموقع هو نسخة ويب بديلة غير رسمية من تطبيق WebEtu
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-4">
          ما سبب تطوير هذا الموقع؟
        </h2>
        <p className="text-lg leading-relaxed">
          هناك سببين رئيسيان يتمثلان فيه:
        </p>
        <ul className="list-disc list-inside text-lg leading-relaxed">
          <li className="pr-4">
            دعم مختلف المنصات الإلكترونية سواء أجهزة حاسوب أو الهواتف أو أي جهاز رقمي
            أخر به متصفح حديث نوعا ما
          </li>
          <li className="pr-4">
            بعض المشاكل التقنية الموجودة في التطبيق الرسمي الخاص بوزارة التعليم العالي
            والبحث العلمي
          </li>
        </ul>
      </section>

      <footer className="text-center mt-10">
        <p className="text-lg">
          Telegram:{" "}
          <a
            href="https://t.me/OSCommunityChat"
            className="text-green-600 hover:underline"
          >
            t.me/OSCommunityChat
          </a>
        </p>
        <div className="flex justify-center items-center mt-6 px-4">
          <img
            src="/logo-black-text.svg"
            alt="OSCA Club Logo"
            className="h-16 sm:h-20 md:h-24 object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </footer>
    </article>
  );
};

export default Layout;
