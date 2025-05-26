import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { teacherAssignmentRequestService } from '@/services/supabase.service';
import { TeacherAssignmentRequest } from '@/types/database.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

type RequestStatus = 'Pending' | 'Accepted' | 'Rejected';

interface TeacherAssignmentRequestWithModule extends TeacherAssignmentRequest {
  module?: {
    name: string;
    unit?: {
      name: string;
      semester?: {
        name: string;
        category?: {
          name: string;
          level?: {
            name: string;
            formation?: {
              name: string;
            };
          };
        };
      };
    };
  };
}

const TeacherAssignments = () => {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const [requests, setRequests] = useState<TeacherAssignmentRequestWithModule[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TeacherAssignmentRequestWithModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const sessionTypes = ['Lecture', 'Class', 'Lab'];
  const statuses: RequestStatus[] = ['Pending', 'Accepted', 'Rejected'];

  useEffect(() => {
    const fetchRequests = async () => {
      if (!profile?.id_user) return;
      
      try {
        const { data, error } = await teacherAssignmentRequestService.getTeacherPreferencesWithDetails(profile.id_user);
        if (error) throw error;
        setRequests(data || []);
        setFilteredRequests(data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [profile?.id_user]);

  useEffect(() => {
    let filtered = [...requests];

    if (searchQuery) {
      filtered = filtered.filter(request => 
        request.module?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedModule !== 'all') {
      filtered = filtered.filter(request => 
        request.module?.name === selectedModule
      );
    }

    if (selectedDay !== 'all') {
      filtered = filtered.filter(request => 
        request.StudyingDay === selectedDay
      );
    }

    if (selectedSessionType !== 'all') {
      filtered = filtered.filter(request => 
        request.session_type === selectedSessionType
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => 
        request.status === selectedStatus
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, selectedModule, selectedDay, selectedSessionType, selectedStatus, requests]);

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getModulePath = (assignment: TeacherAssignmentRequestWithModule) => {
    const module = assignment.module;
    if (!module) return 'N/A';
    
    const unit = module.unit;
    if (!unit) return module.name;
    
    const semester = unit.semester;
    if (!semester) return `${unit.name} > ${module.name}`;
    
    const category = semester.category;
    if (!category) return `${semester.name} > ${unit.name} > ${module.name}`;
    
    const level = category.level;
    if (!level) return `${category.name} > ${semester.name} > ${unit.name} > ${module.name}`;
    
    const formation = level.formation;
    if (!formation) return `${level.name} > ${category.name} > ${semester.name} > ${unit.name} > ${module.name}`;
    
    return `${formation.name} > ${level.name} > ${category.name} > ${semester.name} > ${unit.name} `;
  };

  const uniqueModules = Array.from(new Set(requests.map(req => req.module?.name).filter(Boolean)));

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight flex items-center gap-2",
            theme === 'dark' ? "text-white" : "text-black"
          )}>
            <BookOpen className="h-6 w-6 text-primary" />
            Teaching Assignments
          </h1>
          <p className="text-muted-foreground">
            View your current teaching assignments
          </p>
        </div>
      </div>

      <Card className={cn(
        "border-none shadow-lg",
        theme === 'dark' ? "bg-[#1E293B]" : "bg-white"
      )}>
        <CardHeader className="bg-muted/30 rounded-t-lg">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Assignment Requests
            </CardTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Session Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((assignment) => (
                  <TableRow key={assignment.request_id}>
                    <TableCell className="font-medium">#{assignment.request_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{assignment.module?.name}</span>
                        <span className="text-xs text-muted-foreground">{getModulePath(assignment)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {assignment.StudyingDay}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {assignment.session_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(assignment.status as RequestStatus)}
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.request_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No assignment requests found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignments;