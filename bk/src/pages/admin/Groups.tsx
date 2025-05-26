import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Plus,
  Search,
  Edit,
  GraduationCap,
  Layers,
  BookMarked,
  BookOpenCheck,
  BookOpenText
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { groupService, sectionService, semesterService, categoryService, levelService, formationService } from '@/services/supabase.service';
import { Group, Section, Semester, Category, Level, Formation } from '@/types/database.types';

interface GroupWithRelations extends Group {
  section?: Section & {
    semester?: Semester & {
      category?: Category & {
        level?: Level & {
          formation?: Formation;
        };
      };
    };
  };
}

const GroupsDashboard = () => {
  const [groups, setGroups] = useState<GroupWithRelations[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
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
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupWithRelations | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idsection: '',
  });
  const [sectionsWithFullPath, setSectionsWithFullPath] = useState<{ id: string, name: string, fullPath: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupData = {
        name: formData.name,
        idsection: parseInt(formData.idsection),
      };

      if (editingGroup) {
        await groupService.update(editingGroup.idgroup, groupData);
        toast.success(`Group "${formData.name}" has been updated.`);
      } else {
        await groupService.create(groupData);
        toast.success(`Group "${formData.name}" has been added.`);
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving group:', error);
      toast.error('Failed to save group. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      idsection: '',
    });
    setEditingGroup(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [groupsRes, sectionsRes, semestersRes, categoriesRes, levelsRes, formationsRes] = await Promise.all([
        groupService.getAll(),
        sectionService.getAll(),
        semesterService.getAll(),
        categoryService.getAll(),
        levelService.getAll(),
        formationService.getAll()
      ]);

      console.log('Sections data:', sectionsRes.data); // Debug log

      if (groupsRes.data && sectionsRes.data) {
        // Create maps for quick lookups with proper type casting
        const sectionMap = new Map((sectionsRes.data as any[]).map(section => [section.idsection, section]));

        // Transform groups with their relations
        const transformedGroups = (groupsRes.data as any[]).map(group => {
          const section = sectionMap.get(group.idsection);
          
          if (section) {
            return {
              ...group,
              section: {
                ...section,
                semester: section.semester ? {
                  ...section.semester,
                  category: section.semester.category ? {
                    ...section.semester.category,
                    level: section.semester.category.level ? {
                      ...section.semester.category.level,
                      formation: section.semester.category.level.formation
                    } : null
                  } : null
                } : null
              }
            };
          }
          
          return group;
        });

        setGroups(transformedGroups);
        console.log('Transformed groups:', transformedGroups); // Debug log
      }

      if (sectionsRes.data) {
        // Transform sections with their full paths
        const transformedSections = (sectionsRes.data as any[]).map(section => {
          const semesterName = section.semester?.name || '';
          const categoryName = section.semester?.category?.name || '';
          const levelName = section.semester?.category?.level?.name || '';
          const formationName = section.semester?.category?.level?.formation?.name || '';

          return {
            id: section.idsection.toString(),
            name: section.name,
            fullPath: `${formationName} > ${levelName} > ${categoryName} > ${semesterName} > ${section.name}`
          };
        });

        setSectionsWithFullPath(transformedSections);
        setSections(sectionsRes.data as any[]);
        setSemesters(semestersRes.data as any[]);
        setCategories(categoriesRes.data as any[]);
        setLevels(levelsRes.data as any[]);
        setFormations(formationsRes.data as any[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormation = selectedFormation === 'all' ||
      group.section?.semester?.category?.level?.formation?.idformation.toString() === selectedFormation;
    const matchesLevel = selectedLevel === 'all' ||
      group.section?.semester?.category?.level?.idlevel.toString() === selectedLevel;
    const matchesCategory = selectedCategory === 'all' ||
      group.section?.semester?.category?.idcategory.toString() === selectedCategory;
    const matchesSemester = selectedSemester === 'all' ||
      group.section?.semester?.idsemester.toString() === selectedSemester;
    const matchesSection = selectedSection === 'all' ||
      group.section?.idsection.toString() === selectedSection;

    return matchesSearch && matchesFormation && matchesLevel && matchesCategory && matchesSemester && matchesSection;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Groups
          </h1>
          <p className="text-muted-foreground">Manage student groups and their details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="transition-all duration-300 hover:shadow-md hover:scale-105 bg-primary/90 hover:bg-primary"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingGroup ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {editingGroup ? 'Edit Group' : 'Add New Group'}
              </DialogTitle>
              <DialogDescription>
                {editingGroup
                  ? 'Update the group details below.'
                  : 'Fill in the details to create a new student group.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Group Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter group name"
                  required
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="section" className="text-sm font-medium">Section</label>
                <Select
                  value={formData.idsection}
                  onValueChange={(value) => setFormData({ ...formData, idsection: value })}
                  required
                >
                  <SelectTrigger className="w-full focus:ring-primary">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {sectionsWithFullPath.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        <div className="text-sm">
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-muted-foreground">{section.fullPath}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-secondary/80">Cancel</Button>
                <Button type="submit" className="bg-primary/90 hover:bg-primary">
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-lg mt-6">
        <CardHeader className="bg-muted/30 rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Groups List
          </CardTitle>
          <CardDescription>View and manage all student groups</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-12 lg:col-span-2">
              <div className="relative w-full group">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-10 grid grid-cols-2 md:grid-cols-5 gap-3">
              <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                <SelectTrigger><SelectValue placeholder="Formation" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formations</SelectItem>
                  {formations.map((f) => <SelectItem key={f.idformation} value={f.idformation.toString()}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((l) => <SelectItem key={l.idlevel} value={l.idlevel.toString()}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c.idcategory} value={c.idcategory.toString()}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((s) => <SelectItem key={s.idsemester} value={s.idsemester.toString()}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sectionsWithFullPath.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="text-sm">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.fullPath}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-60">
              <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute text-sm text-muted-foreground">Loading...</div>
            </div>
          ) : (
            filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <Card key={group.idgroup} className="overflow-hidden border-none ring-1 ring-muted/40 shadow-sm hover:shadow-md transition-all duration-300 hover:ring-primary/20 group">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {group.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm">
                        {[{
                          label: 'Formation', icon: GraduationCap, value: group.section?.semester?.category?.level?.formation?.name
                        }, {
                          label: 'Level', icon: Layers, value: group.section?.semester?.category?.level?.name
                        }, {
                          label: 'Category', icon: BookMarked, value: group.section?.semester?.category?.name
                        }, {
                          label: 'Semester', icon: BookOpenCheck, value: group.section?.semester?.name
                        }, {
                          label: 'Section', icon: BookOpenText, value: group.section?.name
                        }].map(({ label, icon: Icon, value }) => (
                          <div key={label} className="flex items-center gap-2 text-muted-foreground/80 hover:text-primary/80 transition-colors duration-200">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Icon className="h-3.5 w-3.5 text-primary/70" />
                              <span className="font-medium">{label}:</span>
                            </div>
                            <span className="truncate">{value || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">No groups found.</div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupsDashboard;





