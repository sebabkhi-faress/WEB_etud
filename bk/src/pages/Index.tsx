import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BookOpen, School } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Hero Section */}
      <header className="w-full bg-white dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <School className="h-10 w-10 text-[#3B82F6] dark:text-[#60A5FA]" />
            <span className="text-2xl font-bold text-[#2563EB] dark:text-[#F1F5F9] tracking-tight">inimManagement</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-6 py-2 rounded-lg shadow"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Main Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2563EB] dark:text-[#F1F5F9] mb-4 tracking-tight">University Management Simplified</h1>
          <p className="text-lg md:text-xl text-[#6B7280] dark:text-[#CBD5E1] max-w-2xl mx-auto mb-8">
            A comprehensive platform for managing university operations, from course scheduling to student management.
          </p>
          <Button
            size="lg"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-3 rounded-lg shadow"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow p-6 border border-[#E5E7EB] dark:border-[#334155] flex flex-col items-center">
            <Calendar className="h-10 w-10 text-[#3B82F6] dark:text-[#60A5FA] mb-2" />
            <h3 className="text-xl font-semibold text-[#2563EB] dark:text-[#F1F5F9] mb-1">Timetable Management</h3>
            <p className="text-[#6B7280] dark:text-[#CBD5E1] text-center text-sm">
              Create, edit, and publish timetables with ease. Handle teacher preferences and appeals.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow p-6 border border-[#E5E7EB] dark:border-[#334155] flex flex-col items-center">
            <Users className="h-10 w-10 text-[#3B82F6] dark:text-[#60A5FA] mb-2" />
            <h3 className="text-xl font-semibold text-[#2563EB] dark:text-[#F1F5F9] mb-1">User Management</h3>
            <p className="text-[#6B7280] dark:text-[#CBD5E1] text-center text-sm">
              Manage different user roles including administrators, teachers, and pedagogic staff.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow p-6 border border-[#E5E7EB] dark:border-[#334155] flex flex-col items-center">
            <BookOpen className="h-10 w-10 text-[#3B82F6] dark:text-[#60A5FA] mb-2" />
            <h3 className="text-xl font-semibold text-[#2563EB] dark:text-[#F1F5F9] mb-1">Course Management</h3>
            <p className="text-[#6B7280] dark:text-[#CBD5E1] text-center text-sm">
              Organize courses, modules, and specialties across different levels and semesters.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[#E0F2FE] dark:bg-[#1E293B] border-t border-[#E5E7EB] dark:border-[#334155] py-6 text-center">
        <div className="text-[#2563EB] dark:text-[#F1F5F9] font-semibold text-lg mb-1">inimManagement</div>
        <div className="text-[#6B7280] dark:text-[#CBD5E1] text-sm">© 2025 inimManagement. All rights reserved.</div>
      </footer>
    </div>
  );
}
