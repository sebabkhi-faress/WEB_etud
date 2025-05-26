import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { semesterService, categoryService } from '@/services/supabase.service';
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
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from "@/lib/utils";

interface Semester {
  idsemester: number;
  name: string;
  startdate: string;
  enddate: string;
  idcategory: number;
  category?: {
    name: string;
    level?: {
      name: string;
    };
  };
}

interface Category {
  idcategory: number;
  name: string;
  idlevel: number;
  CategoryType: string;
  level: {
    name: string;
  }[];
}

const datePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
  .react-datepicker__header {
    background-color: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
  }
  .react-datepicker__current-month {
    color: hsl(var(--foreground));
  }
  .react-datepicker__day {
    color: hsl(var(--foreground));
  }
  .react-datepicker__day:hover {
    background-color: hsl(var(--primary) / 0.1);
  }
  .react-datepicker__day--selected {
    background-color: hsl(var(--primary)) !important;
    color: hsl(var(--primary-foreground)) !important;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: hsl(var(--primary) / 0.2);
  }
  .react-datepicker__navigation-icon::before {
    border-color: hsl(var(--foreground));
  }
`;

const style = document.createElement('style');
style.textContent = datePickerStyles;
document.head.appendChild(style);

const Semesters = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(null);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [formData, setFormData] = useState<Partial<Semester>>({
    name: '',
    startdate: '',
    enddate: '',
    idcategory: 0
  });
  const [sortField, setSortField] = useState<keyof Semester>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSemesters();
    fetchCategories();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await semesterService.getAll();
      console.log('Semester data:', res.data);
      if (res.data) {
        setSemesters(res.data as unknown as Semester[]);
      }
    } catch (error) {
      toast.error('Failed to fetch semesters');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      console.log('Category data:', res.data);
      if (res.data) {
        setCategories(res.data as unknown as Category[]);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      if (editingSemester) {
        await semesterService.update(editingSemester.idsemester, formData);
        toast.success('Semester updated successfully');
      } else {
        await semesterService.create(formData);
        toast.success('Semester created successfully');
      }
      
      resetForm();
      fetchSemesters();
    } catch (error) {
      toast.error('Failed to save semester');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setFormData({
      name: semester.name,
      startdate: semester.startdate,
      enddate: semester.enddate,
      idcategory: semester.idcategory
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (semester: Semester) => {
    setSemesterToDelete(semester);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!semesterToDelete) return;
    try {
      await semesterService.delete(semesterToDelete.idsemester);
      toast.success('Semester deleted successfully', {
        description: `"${semesterToDelete.name}" has been permanently deleted.`,
        duration: 3000,
      });
      fetchSemesters();
    } catch (error) {
      toast.error('Failed to delete semester', {
        description: 'There was a problem deleting the semester. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSemesterToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startdate: '',
      enddate: '',
      idcategory: 0
    });
    setEditingSemester(null);
  };

  const handleSort = (field: keyof Semester) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Semester) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const filteredSemesters = semesters.filter(semester =>
    semester.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSemesters = [...filteredSemesters].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Semesters</h1>
          <p className="text-muted-foreground">Manage your semesters</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add Semester
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSemester ? 'Edit Semester' : 'Add New Semester'}</DialogTitle>
              <DialogDescription>
                {editingSemester
                  ? 'Update the semester details below.'
                  : 'Fill in the details to create a new semester.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter semester name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="startdate" className="text-sm font-medium">Start Date</label>
                <DatePicker
                  id="startdate"
                  selected={formData.startdate ? new Date(formData.startdate) : null}
                  onChange={(date: Date) => setFormData({ ...formData, startdate: date.toISOString().split('T')[0] })}
                  className={cn(
                    "w-full p-2 border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "bg-background text-foreground"
                  )}
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="enddate" className="text-sm font-medium">End Date</label>
                <DatePicker
                  id="enddate"
                  selected={formData.enddate ? new Date(formData.enddate) : null}
                  onChange={(date: Date) => setFormData({ ...formData, enddate: date.toISOString().split('T')[0] })}
                  className={cn(
                    "w-full p-2 border rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "bg-background text-foreground"
                  )}
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="idcategory" className="text-sm font-medium">Category</label>
                <select
                  id="idcategory"
                  value={formData.idcategory}
                  onChange={(e) => setFormData({ ...formData, idcategory: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.idcategory} value={category.idcategory}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">{editingSemester ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Semesters List</CardTitle>
              <CardDescription>View and manage all your semesters</CardDescription>
            </div>
            <div className="relative w-64 group">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              <Input
                placeholder="Search semesters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 transition-all duration-300 group-hover:border-primary focus:shadow-sm"
              />
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
                    onClick={() => handleSort('startdate')}
                  >
                    <div className="flex items-center gap-2">
                      Start Date {getSortIcon('startdate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('enddate')}
                  >
                    <div className="flex items-center gap-2">
                      End Date {getSortIcon('enddate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('idcategory')}
                  >
                    <div className="flex items-center gap-2">
                      Category {getSortIcon('idcategory')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSemesters.map((semester) => (
                  <TableRow key={semester.idsemester}>
                    <TableCell className="font-medium">{semester.name}</TableCell>
                    <TableCell>{semester.startdate}</TableCell>
                    <TableCell>{semester.enddate}</TableCell>
                    <TableCell>
                      {semester.category ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{semester.category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {semester.category.level?.name || 'No Level'}
                          </span>
                        </div>
                      ) : (
                        'No Category'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(semester)}
                          className="group relative transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil className="h-4 w-4 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Edit Semester
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(semester)}
                          className="group relative transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Delete Semester
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSemesters.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No semesters found
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
              This action cannot be undone. This will permanently delete the semester
              {semesterToDelete && (
                <>
                  <span className="font-semibold"> "{semesterToDelete.name}"</span>
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
              Delete Semester
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Semesters; 
