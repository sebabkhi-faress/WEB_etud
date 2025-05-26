import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  CalendarDays
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  moduleService,
  formationService,
  levelService,
  categoryService,
  semesterService
} from '@/services/supabase.service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    formations: 0,
    levels: 0,
    categories: 0,
    semesters: 0,
    modules: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [formationsRes, levelsRes, categoriesRes, semestersRes, modulesRes] = await Promise.all([
          formationService.getAll(),
          levelService.getAll(),
          categoryService.getAll(),
          semesterService.getAll(),
          moduleService.getAll()
        ]);

        setStats({
          formations: formationsRes.data?.length ?? 0,
          levels: levelsRes.data?.length ?? 0,
          categories: categoriesRes.data?.length ?? 0,
          semesters: semestersRes.data?.length ?? 0,
          modules: modulesRes.data?.length ?? 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values in case of error
        setStats({
          formations: 0,
          levels: 0,
          categories: 0,
          semesters: 0,
          modules: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Formations',
      value: stats.formations,
      description: 'Total formations managed',
      icon: <GraduationCap className="h-6 w-6" />,
      path: '/formations',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Levels',
      value: stats.levels,
      description: 'Across all formations',
      icon: <Layers className="h-6 w-6" />,
      path: '/levels',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Categories',
      value: stats.categories,
      description: 'Specialties available',
      icon: <Users className="h-6 w-6" />,
      path: '/categories',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Semesters',
      value: stats.semesters,
      description: 'Academic periods',
      icon: <CalendarDays className="h-6 w-6" />,
      path: '/semesters',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Modules',
      value: stats.modules,
      description: 'Teaching subjects',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/modules',
      color: 'bg-red-50 text-red-600'
    }
  ];

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your educational management system
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded w-16 mb-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {card.title}
                      </CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </div>
                    <div className={`p-2 rounded-md ${card.color}`}>
                      {card.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">{card.value}</div>
                  <Link to={card.path}>
                    <Button variant="outline">View details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/modules/new">
                <Button className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" /> Add New Module
                </Button>
              </Link>
              <Link to="/categories/new">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" /> Add New Category
                </Button>
              </Link>
              <Link to="/semesters/new">
                <Button variant="outline" className="w-full">
                  <CalendarDays className="mr-2 h-4 w-4" /> Add New Semester
                </Button>
              </Link>
              <Link to="/formations/new">
                <Button variant="outline" className="w-full">
                  <GraduationCap className="mr-2 h-4 w-4" /> Add New Formation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Info</CardTitle>
              <CardDescription>Educational system overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Hierarchy</span>
                  <span className="text-sm">Formation → Level → Category → Semester</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Semester Content</span>
                  <span className="text-sm">Units → Modules</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Groups</span>
                  <span className="text-sm">Semester → Section → Group</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Dashboard;

