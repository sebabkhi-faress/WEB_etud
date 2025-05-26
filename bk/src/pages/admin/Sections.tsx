import { useState, useEffect } from 'react';
import {
  Users, Plus, Search, Edit, Trash2, MoreHorizontal, School, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { sectionService, semesterService, categoryService, levelService, formationService } from '@/services/supabase.service';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/sonner';
import type { Section, Semester, Category, Level, Formation } from '@/types/database.types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SectionWithPath extends Section {
  fullPath?: string;
  formationName?: string;
  levelName?: string;
  categoryName?: string;
  semesterName?: string;
}

const Sections = () => {
  const [sections, setSections] = useState<SectionWithPath[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    capacity: '', 
    idsemester: '' 
  });
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [sectionsRes, semestersRes, categoriesRes, levelsRes, formationsRes] = await Promise.all([
        sectionService.getAll(),
        semesterService.getAll(),
        categoryService.getAll(),
        levelService.getAll(),
        formationService.getAll()
      ]);
      
      if (sectionsRes.data) {
        // Transform sections with their full paths
        const transformedSections = sectionsRes.data.map(section => {
          const semester = section.semester || {};
          const category = semester.category || {};
          const level = category.level || {};
          const formation = level.formation || {};
          
          const formationName = formation.name || '';
          const levelName = level.name || '';
          const categoryName = category.name || '';
          const semesterName = semester.name || '';
          
          const fullPath = [formationName, levelName, categoryName, semesterName]
            .filter(Boolean)
            .join(' > ');
          
          return {
            ...section,
            fullPath,
            formationName,
            levelName,
            categoryName,
            semesterName
          };
        });
        
        setSections(transformedSections);
        
        // Fix type issues by using type assertions with unknown as intermediate step
        if (semestersRes.data) {
          // First cast to unknown, then to the target type
          setSemesters(semestersRes.data as unknown as Semester[]);
        }
        
        if (categoriesRes.data) {
          // First cast to unknown, then to the target type
          setCategories(categoriesRes.data as unknown as Category[]);
        }
        
        if (levelsRes.data) {
          // First cast to unknown, then to the target type
          setLevels(levelsRes.data as unknown as Level[]);
        }
        
        if (formationsRes.data) {
          // First cast to unknown, then to the target type
          setFormations(formationsRes.data as unknown as Formation[]);
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteClick = (section: Section) => {
    setSelectedSection(section);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSection) return;
    try {
      await sectionService.delete(selectedSection.idsection);
      toast.success(`Section "${selectedSection.name}" deleted successfully`);
      fetchData();
    } catch {
      toast.error('Failed to delete section');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSection(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sectionData = {
      name: formData.name,
      capacity: parseInt(formData.capacity),
      idsemester: parseInt(formData.idsemester),
    };
    try {
      if (editingSection) {
        await sectionService.update(editingSection.idsection, sectionData);
        toast.success(`Section "${formData.name}" updated successfully`);
      } else {
        await sectionService.create(sectionData);
        toast.success(`Section "${formData.name}" created successfully`);
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch {
      toast.error('Failed to save section');
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      capacity: section.capacity.toString(),
      idsemester: section.idsemester.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', capacity: '', idsemester: '' });
    setEditingSection(null);
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormation = selectedFormation === 'all' || 
      section.semester?.category?.level?.formation?.idformation.toString() === selectedFormation;
    const matchesLevel = selectedLevel === 'all' || 
      section.semester?.category?.level?.idlevel.toString() === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || 
      section.semester?.category?.idcategory.toString() === selectedCategory;
    const matchesSemester = selectedSemester === 'all' || 
      section.semester?.idsemester.toString() === selectedSemester;
    
    return matchesSearch && matchesFormation && matchesLevel && matchesCategory && matchesSemester;
  });

  const getSemestersWithFullPath = () => {
    return semesters.map(semester => {
      // Create a type-safe empty object
      const emptyObj = {} as Record<string, any>;
      
      // Use optional chaining and nullish coalescing to safely access properties
      const category = semester.category || emptyObj;
      
      // Use type guards to check if properties exist
      const hasLevel = category && 'level' in category;
      const level = hasLevel ? category.level : emptyObj;
      
      const hasFormation = level && 'formation' in level;
      const formation = hasFormation ? level.formation : emptyObj;
      
      // Safely access name properties
      const formationName = formation && 'name' in formation ? formation.name : '';
      const levelName = level && 'name' in level ? level.name : '';
      const categoryName = category && 'name' in category ? category.name : '';
      const semesterName = semester.name || '';
      
      const fullPath = [formationName, levelName, categoryName, semesterName]
        .filter(Boolean)
        .join(' > ');
      
      return {
        ...semester,
        fullPath
      };
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Sections Management
          </h1>
          <p className="text-muted-foreground">Manage all student sections and their details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit Section' : 'Create New Section'}</DialogTitle>
              <DialogDescription>
                {editingSection ? 'Update the section details' : 'Fill in the details to create a new section'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name">Section Name</label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="capacity">Capacity</label>
                  <Input 
                    id="capacity" 
                    type="number" 
                    value={formData.capacity} 
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })} 
                    required 
                    min="1" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="semester">Semester</label>
                  <Select
                    value={formData.idsemester}
                    onValueChange={(value) => setFormData({ ...formData, idsemester: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {getSemestersWithFullPath().map((semester) => (
                        <SelectItem key={semester.idsemester} value={semester.idsemester.toString()}>
                          <div className="text-sm">
                            <div className="font-medium">{semester.name}</div>
                            <div className="text-xs text-muted-foreground">{semester.fullPath}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingSection ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2"><School className="h-5 w-5" /> Sections List</CardTitle>
              <CardDescription>All sections with their details</CardDescription>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sections..." className="pl-10 w-full md:w-[300px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSections.length > 0 ? filteredSections.map(section => (
                    <TableRow key={section.idsection}>
                      <TableCell className="font-medium">{section.idsection}</TableCell>
                      <TableCell>
                        <Link to={`/sections/${section.idsection}`} className="font-medium hover:underline">{section.name}</Link>
                      </TableCell>
                      <TableCell><Badge variant="outline">{section.capacity} students</Badge></TableCell>
                      <TableCell className="max-w-md">
                        <div className="text-xs text-muted-foreground truncate">
                          {section.fullPath || 'No path information'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(section)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(section)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No sections found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the section "{selectedSection?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sections;
