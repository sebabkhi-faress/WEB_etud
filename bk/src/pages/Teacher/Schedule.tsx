import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarRange, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTeacherTimetable } from '@/services/supabase.service';
import { groupService } from '@/services/supabase.service';
import { supabase } from '@/lib/supabase';

const TeacherSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('weekly');
  const [timetable, setTimetable] = useState([]);
  const { profile } = useAuth();
  const [groupOptions, setGroupOptions] = useState([]);

  const periodTimes = {
    P1: "08:00-09:30",
    P2: "09:40-11:10",
    P3: "11:20-12:50",
    P4: "13:00-14:30",
    P5: "14:40-16:10",
    P6: "16:20-17:50",
  };
  const periodOrder = ["P1", "P2", "P3", "P4", "P5", "P6"];
  const days = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];

  useEffect(() => {
    // Extract the tab from the URL
    const path = location.pathname;
    const pathSegments = path.split('/');
    
    if (pathSegments.length >= 4) {
      setActiveTab(pathSegments[3]);
    } else {
      setActiveTab('weekly');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!profile?.id_user) return;
      const { data, error } = await getTeacherTimetable(profile.id_user);
      if (!error) setTimetable(data || []);
    };
    fetchTimetable();
  }, [profile?.id_user]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!profile?.id_user) return;
      // Raw SQL to get unique groups for the teacher's sessions
      const { data, error } = await supabase.rpc('get_teacher_groups', { user_id: profile.id_user });
      // If you don't have a function, fallback to client-side join:
      // 1. Get all timetable entries
      const { data: timetable } = await getTeacherTimetable(profile.id_user);
      // 2. Extract all group IDs from sessions
      const groupIds = [
        ...new Set(
          (timetable || [])
            .map(t => t.session?.group?.idgroup)
            .filter(Boolean)
        ),
      ];
      if (groupIds.length === 0) {
        setGroupOptions([]);
        return;
      }
      // 3. Fetch all groups and filter
      const { data: groups } = await groupService.getAll();
      const filteredGroups = (groups || []).filter(g => groupIds.includes(g.idgroup));
      setGroupOptions(filteredGroups);
    };
    fetchGroups();
  }, [profile?.id_user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'weekly') {
      navigate('/teacher/schedule');
    } else {
      navigate(`/teacher/schedule/${value}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          View and manage your teaching schedule
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Weekly View</span>
          </TabsTrigger>
          <TabsTrigger value="appeals" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>Appeals</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Your teaching schedule for the current week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-3 justify-center">
                <div>
                  <label className="block text-sm font-medium mb-1">By Day</label>
                  <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Days</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">By Period</label>
                  <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Periods</option>
                    {periodOrder.map(period => (
                      <option key={period} value={period}>{period} ({periodTimes[period]})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">By Group</label>
                  <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Groups</option>
                    {groupOptions.map(group => (
                      <option key={group.idgroup} value={group.idgroup}>{group.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">By Module</label>
                  <select className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed" disabled>
                    <option>Coming soon</option>
                  </select>
                </div>
              </div>
              <div className="h-[500px] flex items-center justify-center border rounded-md overflow-auto w-full">
                <table className="w-full border-collapse border border-gray-300 text-center">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-8 py-4 text-lg font-bold">Period</th>
                      {days.map(day => (
                        <th key={day} className="border border-gray-300 px-8 py-4 text-lg font-bold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periodOrder.map(period => (
                      <tr key={period}>
                        <td className="border border-gray-300 px-8 py-4 text-base font-semibold">{periodTimes[period]}</td>
                        {days.map(day => (
                          <td key={day} className="border border-gray-300 px-8 py-4 min-h-[60px] min-w-[120px]"></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appeals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Appeals</CardTitle>
              <CardDescription>
                Submit and track your schedule change requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Schedule appeals interface goes here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSchedule;