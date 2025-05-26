import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  BookOpenIcon
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
import { moduleService, semesterService, unitService, categoryService, levelService, formationService } from '@/services/supabase.service';
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
import { toast } from '@/components/ui/sonner';
import { Formation, Level, Category, Semester, Unit, Module } from '@/types/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const Modules = () => {
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleWithRelations | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleWithRelations | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idunit: '',
  });
  const [sortField, setSortField] = useState<keyof ModuleWithRelations>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Create a map for unit full paths
  const [unitsWithFullPath, setUnitsWithFullPath] = useState<{ id: string, name: string, fullPath: string }[]>([]);

    const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
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

        setUnitsWithFullPath(unitFullPaths);
        setModules(modulesWithRelations);
        setUnits(unitsRes.data as any[]);
        setSemesters(semestersRes.data as any[]);
        setCategories(categoriesRes.data as any[]);
        setLevels(levelsRes.data as any[]);
        setFormations(formationsRes.data as any[]);
      }
    } catch (error) {
      toast("Failed to fetch data - There was a problem loading the data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field: keyof ModuleWithRelations) => {
    setSortDirection(prevDirection => 
      sortField === field && prevDirection === 'asc' ? 'desc' : 'asc'
    );
    setSortField(field);
  };

  const handleDeleteClick = (module: ModuleWithRelations) => {
    setSelectedModule(module);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedModule) return;
    try {
      await moduleService.delete(selectedModule.id_module);
      toast("Module \"" + selectedModule.name + "\" has been permanently deleted.");
      fetchData();
    } catch (error) {
      toast("Failed to delete module - There was a problem deleting the module. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedModule(null);
    }
  };

  const SortIcon = ({ field }: { field: keyof ModuleWithRelations }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const moduleData = {
        name: formData.name,
        idunit: parseInt(formData.idunit),
      };

      if (editingModule) {
        await moduleService.update(editingModule.id_module, moduleData);
        toast("Module \"" + formData.name + "\" has been updated.");
      } else {
        await moduleService.create(moduleData);
        toast("Module \"" + formData.name + "\" has been added to your modules.");
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast("Failed to save module - There was a problem saving the module. Please try again.");
    }
  };

  const handleEdit = (module: ModuleWithRelations) => {
    setEditingModule(module);
    setFormData({
      name: module.name,
      idunit: module.idunit.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      idunit: '',
    });
    setEditingModule(null);
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
  }).sort((a, b) => {
    const fieldA = a[sortField] || '';
    const fieldB = b[sortField] || '';

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
    return 0;
  });

  const renderModuleHierarchy = (module: ModuleWithRelations) => {
    const formation = module.unit?.semester?.category?.level?.formation;
    const level = module.unit?.semester?.category?.level;
    const category = module.unit?.semester?.category;
    const semester = module.unit?.semester;
    const unit = module.unit;

    return (
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
          <div className="flex items-center gap-2 min-w-[120px]">
            <GraduationCap className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">Formation:</span>
          </div>
          <span className="truncate">{formation?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
          <div className="flex items-center gap-2 min-w-[120px]">
            <Layers className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">Level:</span>
          </div>
          <span className="truncate">{level?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
          <div className="flex items-center gap-2 min-w-[120px]">
            <BookMarked className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">Category:</span>
          </div>
          <span className="truncate">{category?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
          <div className="flex items-center gap-2 min-w-[120px]">
            <BookOpenCheck className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">Semester:</span>
          </div>
          <span className="truncate">{semester?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
          <div className="flex items-center gap-2 min-w-[120px]">
            <BookOpenText className="h-3.5 w-3.5 text-primary/70" />
            <span className="font-medium">Unit:</span>
          </div>
          <span className="truncate">{unit?.name || 'N/A'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Administrator Modules
          </h1>
            <p className="text-muted-foreground">
              Manage and organize teaching modules
            </p>
          </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="transition-all duration-300 hover:shadow-md hover:scale-105 bg-primary/90 hover:bg-primary"
            >
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingModule ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {editingModule ? 'Edit Module' : 'Add New Module'}
              </DialogTitle>
              <DialogDescription>
                {editingModule
                  ? 'Update the module details below.'
                  : 'Fill in the details to create a new module.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Module Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter module name"
                  required
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium">Teaching Unit</label>
                <Select
                  value={formData.idunit}
                  onValueChange={(value) => setFormData({ ...formData, idunit: value })}
                  required
                >
                  <SelectTrigger className="w-full focus:ring-primary">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
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
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="hover:bg-secondary/80"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary/90 hover:bg-primary"
                >
                  {editingModule ? 'Update Module' : 'Create Module'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="bg-muted/30 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-primary" />
                Administrator Modules List
              </CardTitle>
              <CardDescription>View and manage all administrator modules</CardDescription>
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
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : (
            <>
              {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((module) => (
                    <Card 
                      key={module.id_module} 
                      className="overflow-hidden border-none ring-1 ring-muted/40 shadow-sm hover:shadow-md transition-all duration-300 hover:ring-primary/20 group"
                    >
                      <CardHeader className="pb-2 relative border-b border-muted/10 bg-muted/5">
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(module)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(module)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
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
                      
                      <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t border-muted/10 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(module)}
                          className="text-xs h-8 hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                            </Button>
                          <Button 
                          variant="outline"
                          size="sm"
                            onClick={() => handleDeleteClick(module)}
                          className="text-xs h-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                          </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 rounded-lg border border-dashed border-muted">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium text-muted-foreground">No modules found</h3>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFormation('all');
                      setSelectedLevel('all');
                      setSelectedCategory('all');
                      setSelectedSemester('all');
                      setSelectedUnit('all');
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Reset all filters
                  </Button>
              </div>
              )}
            </>
            )}
          </CardContent>

        <CardFooter className="border-t border-muted/20 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'} found
          </div>
        </CardFooter>
        </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Module
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module
              {selectedModule && (
                <>
                  <span className="font-semibold"> "{selectedModule.name}"</span>
                </>
              )} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
  );
};

export default Modules;