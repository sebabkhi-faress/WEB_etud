import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ArrowDown,
  ArrowUp,
  Pencil,
  Filter,
  GraduationCap,
  Layers,
  BookMarked,
  BookOpenCheck,
  BookOpenText,
  MoreHorizontal,
  BookOpenIcon,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { moduleService, semesterService, unitService, categoryService, levelService, formationService, teacherAssignmentRequestService } from '@/services/supabase.service';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Formation, Level, Category, Semester, Unit, Module, TeacherAssignmentRequest, Day, SessionType, RequestStatus } from '@/types/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModuleWithRelations extends Module {
  unit?: Unit & {
    semester?: Semester & {
      category?: Category & {
        level?: Level & {
          formation?: Formation;
        };
      };
    };
  };
}

const TeacherPreferences = () => {
  const { profile } = useAuth();
  const [modules, setModules] = useState<ModuleWithRelations[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [unitsWithFullPath, setUnitsWithFullPath] = useState<{ id: string, name: string, fullPath: string }[]>([]);
  
  // Drag and drop state
  const [draggedModule, setDraggedModule] = useState<ModuleWithRelations | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [isSubmittingPreference, setIsSubmittingPreference] = useState(false);

  const days: Day[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const sessionTypes: SessionType[] = ['Lecture', 'Class', 'Lab'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modulesRes, unitsRes, semestersRes, categoriesRes, levelsRes, formationsRes] = await Promise.all([
        moduleService.getAll(),
        unitService.getAll(),
        semesterService.getAll(),
        categoryService.getAll(),
        levelService.getAll(),
        formationService.getAll()
      ]);

      if (modulesRes.data) {
        // Create maps for quick lookups with proper type casting
        const unitMap = new Map((unitsRes.data as any[]).map(unit => [unit.idunit, {
          ...unit,
          semester: unit.semester
        }]));

        const semesterMap = new Map((semestersRes.data as any[]).map(sem => [sem.idsemester, {
          ...sem,
          idspecialty: sem.idcategory,
          category: sem.category
        }]));

        const categoryMap = new Map((categoriesRes.data as any[]).map(cat => [cat.idcategory, {
          ...cat,
          category_type: cat.CategoryType
        }]));

        const levelMap = new Map((levelsRes.data as any[]).map(level => [level.idlevel, level]));
        const formationMap = new Map((formationsRes.data as any[]).map(formation => [formation.idformation, formation]));

        // Create unit paths for the select dropdown
        const unitFullPaths = (unitsRes.data as any[]).map(unit => {
          const semester = semesterMap.get(unit.idsemester);
          const category = semester ? categoryMap.get(semester.idspecialty) : null;
          const level = category ? levelMap.get(category.idlevel) : null;
          const formation = level ? formationMap.get(level.idformation) : null;

          const fullPath = [
            formation?.name,
            level?.name,
            category?.name,
            semester?.name,
            unit.name
          ].filter(Boolean).join(' > ');

          return {
            id: unit.idunit.toString(),
            name: unit.name,
            fullPath: fullPath
          };
        });

        // Link the data together
        const modulesWithRelations = (modulesRes.data as any[]).map(module => {
          const unit = unitMap.get(module.idunit);
          if (unit) {
            const semester = semesterMap.get(unit.idsemester);
            if (semester) {
              const category = categoryMap.get(semester.idspecialty);
              if (category) {
                const level = levelMap.get(category.idlevel);
                if (level) {
                  const formation = formationMap.get(level.idformation);
                  return {
                    ...module,
                    unit: {
                      ...unit,
                      semester: {
                        ...semester,
                        category: {
                          ...category,
                          level: {
                            ...level,
                            formation
                          }
                        }
                      }
                    }
                  };
                }
              }
            }
          }
          return module;
        });

        setUnitsWithFullPath(unitFullPaths);
        setModules(modulesWithRelations);
        setUnits(unitsRes.data as any[]);
        setSemesters(semestersRes.data as any[]);
        setCategories(categoriesRes.data as any[]);
        setLevels(levelsRes.data as any[]);
        setFormations(formationsRes.data as any[]);
      }
    } catch (error) {
      toast.error("Failed to fetch data - There was a problem loading the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Draggable Module Component
  const DraggableModuleCard = ({ module, id }: { module: ModuleWithRelations, id: string }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: id,
      data: { type: 'module', module }
    });
    
    const style = transform ? {
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 1000 : 1,
      opacity: isDragging ? 0.8 : 1,
    } : undefined;

    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        className={`cursor-move ${isDragging ? 'ring-2 ring-primary/50 shadow-xl' : ''}`}
      >
        <Card className="overflow-hidden border-none ring-1 ring-muted/40 shadow-sm hover:shadow-md transition-all duration-300 hover:ring-primary/20">
          <CardHeader className="pb-2 relative border-b border-muted/10 bg-muted/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg font-medium line-clamp-1">
                  {module.name}
                </CardTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                    {module.moduletype}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {module.credits} Credits
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Coef: {module.coefficient}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {module.volumehours}h
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-1">
              {renderModuleHierarchy(module)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderModuleHierarchy = (module: ModuleWithRelations) => {
    const formation = module.unit?.semester?.category?.level?.formation;
    const level = module.unit?.semester?.category?.level;
    const category = module.unit?.semester?.category;
    const semester = module.unit?.semester;
    const unit = module.unit;

    return (
      <div className="flex flex-col gap-2 text-sm">
        {formation && (
          <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
            <div className="flex items-center gap-2 min-w-[120px]">
              <GraduationCap className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-medium">Formation:</span>
            </div>
            <span className="truncate">{formation.name}</span>
          </div>
        )}
        {level && (
          <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
            <div className="flex items-center gap-2 min-w-[120px]">
              <Layers className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-medium">Level:</span>
            </div>
            <span className="truncate">{level.name}</span>
          </div>
        )}
        {category && (
          <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
            <div className="flex items-center gap-2 min-w-[120px]">
              <BookMarked className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-medium">Category:</span>
            </div>
            <span className="truncate">{category.name}</span>
          </div>
        )}
        {semester && (
          <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
            <div className="flex items-center gap-2 min-w-[120px]">
              <BookOpenCheck className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-medium">Semester:</span>
            </div>
            <span className="truncate">{semester.name}</span>
          </div>
        )}
        {unit && (
          <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
            <div className="flex items-center gap-2 min-w-[120px]">
              <BookOpenText className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-medium">Unit:</span>
            </div>
            <span className="truncate">{unit.name}</span>
          </div>
        )}
      </div>
    );
  };

  // Droppable Day Component
  const DroppableDay = ({ day }: { day: Day }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `day-${day}`,
      data: { type: 'day', day }
    });

    const isSelected = selectedDay === day;
    const hasModule = isSelected && draggedModule;

    return (
      <div 
        ref={setNodeRef}
        className={`p-4 border-2 rounded-lg transition-all duration-300 min-h-[120px] flex flex-col ${
          isSelected 
            ? 'bg-primary/10 border-primary shadow-lg' 
            : isOver 
              ? 'bg-primary/5 border-primary/50 shadow-md' 
              : 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155] hover:border-primary/50 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-[#2563EB] dark:text-[#F1F5F9]">{day}</h3>
        </div>
        
        {hasModule ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full border-primary/20 bg-white dark:bg-[#1E293B] shadow-sm">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-medium truncate">{draggedModule?.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                    {draggedModule?.moduletype}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {draggedModule?.credits} Credits
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
            {isOver ? 'Drop module here' : 'No module selected'}
          </div>
        )}
      </div>
    );
  };

  // Droppable Session Type Component
  const DroppableSessionType = ({ type }: { type: SessionType }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `session-${type}`,
      data: { type: 'session', sessionType: type }
    });

    const isSelected = selectedSessionType === type;
    const hasModule = isSelected && draggedModule;

    return (
      <div 
        ref={setNodeRef}
        className={`p-4 border-2 rounded-lg transition-all duration-300 min-h-[120px] flex flex-col ${
          isSelected 
            ? 'bg-primary/10 border-primary shadow-lg' 
            : isOver 
              ? 'bg-primary/5 border-primary/50 shadow-md' 
              : 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155] hover:border-primary/50 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-[#2563EB] dark:text-[#F1F5F9]">{type}</h3>
        </div>
        
        {hasModule ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full border-primary/20 bg-white dark:bg-[#1E293B] shadow-sm">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-medium truncate">{draggedModule?.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                    {draggedModule?.moduletype}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {draggedModule?.credits} Credits
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
            {isOver ? 'Drop module here' : 'No module selected'}
          </div>
        )}
      </div>
    );
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormation = selectedFormation === 'all' ||
      module.unit?.semester?.category?.level?.formation?.idformation.toString() === selectedFormation;
    const matchesLevel = selectedLevel === 'all' ||
      module.unit?.semester?.category?.level?.idlevel.toString() === selectedLevel;
    const matchesCategory = selectedCategory === 'all' ||
      module.unit?.semester?.category?.idcategory.toString() === selectedCategory;
    const matchesSemester = selectedSemester === 'all' ||
      module.unit?.semester?.idsemester.toString() === selectedSemester;
    const matchesUnit = selectedUnit === 'all' ||
      module.unit?.idunit.toString() === selectedUnit;

    return matchesSearch && matchesFormation && matchesLevel && matchesCategory && matchesSemester && matchesUnit;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'module') {
      const module = active.data.current.module;
      setDraggedModule(module);
      
      if (overType === 'day') {
        setSelectedDay(over.data.current.day);
        toast.success(`Module "${module.name}" assigned to ${over.data.current.day}`);
      } else if (overType === 'session') {
        setSelectedSessionType(over.data.current.sessionType);
        toast.success(`Module "${module.name}" assigned to ${over.data.current.sessionType} session`);
      }
    }
  };

  const handleSubmitPreference = async () => {
    if (!draggedModule || !selectedDay || !selectedSessionType) {
      toast.error('Please select a module, day, and session type');
      return;
    }

    if (!profile?.id_user) {
      toast.error('User profile not found');
      return;
    }

    setIsSubmittingPreference(true);
    try {
      const requestData: Partial<TeacherAssignmentRequest> = {
        id_module: draggedModule.id_module,
        session_type: selectedSessionType,
        status: 'Pending' as RequestStatus,
        request_date: new Date().toISOString(),
        StudyingDay: selectedDay,
        id_user: profile.id_user
      };
      
      console.log('Submitting request data:', requestData);
      const { data, error } = await teacherAssignmentRequestService.create(requestData);
      console.log('Server response:', { data, error });
      
      if (error) {
        console.error('Server error:', error);
        throw new Error(error.message || 'Failed to submit preference request');
      }

      if (!data) {
        throw new Error('No data returned from server');
      }

      toast.success('Preference request submitted successfully');
      
      // Reset selections
      setDraggedModule(null);
      setSelectedDay(null);
      setSelectedSessionType(null);
    } catch (error) {
      console.error('Error submitting request:', error);
      if (error instanceof Error) {
        toast.error(`Failed to submit preference request: ${error.message}`);
      } else {
        toast.error('Failed to submit preference request. Please try again.');
      }
    } finally {
      setIsSubmittingPreference(false);
    }
  };

  const clearPreferenceSelection = () => {
    setDraggedModule(null);
    setSelectedDay(null);
    setSelectedSessionType(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Teaching Preferences
          </h1>
          <p className="text-muted-foreground">
            Set your preferred teaching schedule
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg mt-6">
        <CardHeader className="bg-muted/30 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Teaching Preferences
              </CardTitle>
              <CardDescription>Drag modules to set your preferred teaching schedule</CardDescription>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-2">
              <div className="relative w-50 group">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 transition-all duration-300 group-hover:border-primary focus:shadow-sm"
                />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-10">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Formation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formations</SelectItem>
                    {formations.map((formation) => (
                      <SelectItem key={formation.idformation} value={formation.idformation.toString()}>
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level.idlevel} value={level.idlevel.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.idcategory} value={category.idcategory.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.idsemester} value={semester.idsemester.toString()}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    {unitsWithFullPath.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        <div className="text-sm">
                          <div className="font-medium">{unit.name}</div>
                          <div className="text-xs text-muted-foreground">{unit.fullPath}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module List */}
              <div className="lg:col-span-1 border rounded-lg p-4 bg-muted/5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Available Modules
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                    </div>
                  ) : filteredModules.length > 0 ? (
                    filteredModules.map((module) => (
                      <DraggableModuleCard 
                        key={module.id_module} 
                        module={module} 
                        id={`module-${module.id_module}`} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No modules found
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preferences Panel */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  {/* Days Grid */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Select Day
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {days.map((day) => (
                        <DroppableDay 
                          key={day} 
                          day={day}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Session Types */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Session Type
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sessionTypes.map((type) => (
                        <DroppableSessionType 
                          key={type} 
                          type={type}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Summary and Actions */}
                <div className="mt-6 p-4 border rounded-lg bg-muted/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Preference:</h4>
                      {draggedModule && selectedDay && selectedSessionType ? (
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">
                            <span className="font-medium">Module:</span> {draggedModule.name}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Day:</span> {selectedDay}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Session:</span> {selectedSessionType}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Drag a module to a day and session type to set your preference
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={clearPreferenceSelection}
                        disabled={!draggedModule && !selectedDay && !selectedSessionType}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleSubmitPreference}
                        disabled={!draggedModule || !selectedDay || !selectedSessionType || isSubmittingPreference}
                        className="bg-primary/90 hover:bg-primary"
                      >
                        {isSubmittingPreference ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Preference'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherPreferences;