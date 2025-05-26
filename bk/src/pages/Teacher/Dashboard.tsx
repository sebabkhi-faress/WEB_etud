import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckSquare,
  FileText,
  CalendarRange,
  FileCheck,
  GraduationCap,
  Microscope,
  BookOpenCheck
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  teacherAssignmentRequestService
} from '@/services/supabase.service';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    modules: 0,
    lectures: 0,
    labs: 0,
    classes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id_user) return;
      
      try {
        setLoading(true);
        
        // Fetch teacher's assignments
        const { data: assignments, error: assignmentsError } = await teacherAssignmentRequestService.getTeacherPreferencesWithDetails(profile.id_user);
        if (assignmentsError) throw assignmentsError;

        // Count unique modules
        const uniqueModules = new Set(assignments?.map(a => a.module?.name)).size;

        // Count lectures and labs
        const lectures = assignments?.filter(a => a.session_type === 'Lecture').length || 0;
        const labs = assignments?.filter(a => a.session_type === 'Lab').length || 0;

        // Calculate total classes (lectures + labs)
        const totalClasses = lectures + labs;

        setStats({
          modules: uniqueModules,
          lectures,
          labs,
          classes: totalClasses
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id_user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.firstname} {profile?.lastname}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Modules</CardTitle>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.modules}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Teaching modules assigned
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Lectures</CardTitle>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.lectures}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Lecture sessions assigned
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Labs</CardTitle>
              <Microscope className="h-8 w-8 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.labs}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Lab sessions assigned
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Classes</CardTitle>
              <BookOpenCheck className="h-8 w-8 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.classes}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Total classes (Lectures + Labs)
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Schedule</CardTitle>
              <CardDescription className="text-xs">View and manage your teaching schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Weekly Schedule</p>
                  <p className="text-xs text-muted-foreground">View your upcoming classes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarRange className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Schedule Appeals</p>
                  <p className="text-xs text-muted-foreground">Request schedule changes</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button asChild className="flex-1 text-sm">
                  <Link to="/teacher/schedule">View Schedule</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 text-sm">
                  <Link to="/teacher/schedule/appeals">Appeals</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Assignments</CardTitle>
              <CardDescription className="text-xs">Manage your teaching assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">All Assignments</p>
                  <p className="text-xs text-muted-foreground">View your current assignments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileCheck className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Assignment Appeals</p>
                  <p className="text-xs text-muted-foreground">Request assignment changes</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button asChild className="flex-1 text-sm">
                  <Link to="/teacher/assignments">View Assignments</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 text-sm">
                  <Link to="/teacher/assignments/appeals">Appeals</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Profile & Preferences</CardTitle>
              <CardDescription className="text-xs">Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Profile Information</p>
                  <p className="text-xs text-muted-foreground">Update your personal details</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Teaching Preferences</p>
                  <p className="text-xs text-muted-foreground">Set your availability and preferences</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button asChild className="flex-1 text-sm">
                  <Link to="/teacher/profile">Profile</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 text-sm">
                  <Link to="/teacher/preferences">Preferences</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
