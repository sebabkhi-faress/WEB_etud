import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { unitService, semesterService } from '@/services/supabase.service';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

interface Unit {
  idunit: number;
  name: string;
  idsemester: number;
  semester?: {
    name: string;
    category?: {
      name: string;
      CategoryType: string;
      level: {
        name: string;
        formation?: {
          name: string;
        };
      };
    };
  };
}

interface Semester {
  idsemester: number;
  name: string;
  category?: {
    name: string;
    CategoryType: string;
    level: {
      name: string;
      formation?: {
        name: string;
      };
    };
  };
}

// Color mapping for different unit types
const unitColors = {
  'Fundamental': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Methodological': 'bg-purple-100 text-purple-800 border border-purple-200',
  'Discovery': 'bg-green-100 text-green-800 border border-green-200',
  'Transversal': 'bg-orange-100 text-orange-800 border border-orange-200',
  'default': 'bg-gray-100 text-gray-800 border border-gray-200'
};

const Units = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idsemester: '',
  });
  const [sortField, setSortField] = useState<keyof Unit>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchUnits();
    fetchSemesters();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await unitService.getAll();
      if (res.data) {
        setUnits(res.data as Unit[]);
      }
    } catch (error) {
      toast.error('Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await semesterService.getAll();
      if (res.data) {
        setSemesters(res.data as unknown as Semester[]);
      }
    } catch (error) {
      toast.error('Failed to fetch semesters');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const unitData = {
        name: formData.name,
        idsemester: parseInt(formData.idsemester),
      };

      if (editingUnit) {
        await unitService.update(editingUnit.idunit, unitData);
        toast.success('Unit updated successfully', {
          description: `"${formData.name}" has been updated.`,
          duration: 3000,
        });
      } else {
        await unitService.create(unitData);
        toast.success('Unit created successfully', {
          description: `"${formData.name}" has been added to your units.`,
          duration: 3000,
        });
      }
      setIsDialogOpen(false);
      fetchUnits();
      resetForm();
    } catch (error) {
      toast.error('Failed to save unit', {
        description: 'There was a problem saving the unit. Please try again.',
        duration: 5000,
      });
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      idsemester: unit.idsemester.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!unitToDelete) return;
    try {
      await unitService.delete(unitToDelete.idunit);
      toast.success('Unit deleted successfully', {
        description: `"${unitToDelete.name}" has been permanently deleted.`,
        duration: 3000,
      });
      fetchUnits();
    } catch (error) {
      toast.error('Failed to delete unit', {
        description: 'There was a problem deleting the unit. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUnitToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      idsemester: '',
    });
    setEditingUnit(null);
  };

  const handleSort = (field: keyof Unit) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Unit) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getUnitColor = (name: string) => {
    const type = name.split(' ')[0];
    return unitColors[type as keyof typeof unitColors] || unitColors.default;
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || unit.idsemester.toString() === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const sortedUnits = [...filteredUnits].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">Manage your units</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
              <DialogDescription>
                {editingUnit
                  ? 'Update the unit details below.'
                  : 'Fill in the details to create a new unit.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter unit name (e.g., Fundamental Unit 1, Methodological Unit 1)"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="semester" className="text-sm font-medium">Semester</label>
                <select
                  id="semester"
                  value={formData.idsemester}
                  onChange={(e) => setFormData({ ...formData, idsemester: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a semester</option>
                  {semesters.map((semester) => (
                    <option key={semester.idsemester} value={semester.idsemester}>
                      {semester.name} - {semester.category?.name || 'No Category'}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">{editingUnit ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Units List</CardTitle>
              <CardDescription>View and manage all your units</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64 group">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                <Input
                  placeholder="Search units..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 transition-all duration-300 group-hover:border-primary focus:shadow-sm"
                />
              </div>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Filter by semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.idsemester} value={semester.idsemester.toString()}>
                      {semester.name} - {semester.category?.name || 'No Category'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('idsemester')}
                  >
                    <div className="flex items-center gap-2">
                      Semester {getSortIcon('idsemester')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUnits.map((unit) => (
                  <TableRow key={unit.idunit}>
                    <TableCell className="font-medium">
                      <Badge className={getUnitColor(unit.name)}>
                        {unit.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {unit.semester ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{unit.semester.name}</span>
                            <span className="text-sm text-muted-foreground">(Semester)</span>
                          </div>
                          {unit.semester.category && (
                            <>
                              <div className="text-sm text-muted-foreground pl-2 border-l-2 border-gray-200">
                                {unit.semester.category.name} (Category)
                              </div>
                              {unit.semester.category.level && (
                                <>
                                  <div className="text-sm text-muted-foreground pl-4 border-l-2 border-gray-200">
                                    {unit.semester.category.level.name} (Level)
                                  </div>
                                  {unit.semester.category.level.formation && (
                                    <div className="text-sm text-muted-foreground pl-6 border-l-2 border-gray-200">
                                      {unit.semester.category.level.formation.name} (Formation)
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        'No Semester'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(unit)}
                          className="group relative transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil className="h-4 w-4 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Edit Unit
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(unit)}
                          className="group relative transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Delete Unit
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUnits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No units found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the unit
              {unitToDelete && (
                <>
                  <span className="font-semibold"> "{unitToDelete.name}"</span>
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
              Delete Unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Units; 