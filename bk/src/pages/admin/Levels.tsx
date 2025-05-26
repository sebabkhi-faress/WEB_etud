import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { levelService, formationService } from '@/services/supabase.service';
import { Level, Formation } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

const Levels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<Level | null>(null);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idformation: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [levelsRes, formationsRes] = await Promise.all([
        levelService.getAll(),
        formationService.getAll()
      ]);

      if (levelsRes.data) {
        setLevels(levelsRes.data);
      }
      if (formationsRes.data) {
        setFormations(formationsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLevel) {
        await levelService.update(editingLevel.idlevel, formData);
        toast.success('Level updated successfully', {
          description: `"${formData.name}" has been updated.`,
          duration: 3000,
        });
      } else {
        await levelService.create(formData);
        toast.success('Level created successfully', {
          description: `"${formData.name}" has been added to your levels.`,
          duration: 3000,
        });
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving level:', error);
      toast.error('Failed to save level', {
        description: 'There was a problem saving the level. Please try again.',
        duration: 5000,
      });
    }
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      idformation: level.idformation,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (level: Level) => {
    setLevelToDelete(level);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!levelToDelete) return;

    try {
      await levelService.delete(levelToDelete.idlevel);
      toast.success('Level deleted successfully', {
        description: `"${levelToDelete.name}" has been permanently deleted.`,
        duration: 3000,
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Failed to delete level', {
        description: 'There was a problem deleting the level. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setLevelToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      idformation: 0,
    });
    setEditingLevel(null);
  };

  const filteredLevels = levels.filter(level =>
    level.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFormationName = (idformation: number) => {
    const formation = formations.find(f => f.idformation === idformation);
    return formation ? formation.name : 'Unknown Formation';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Levels</h1>
          <p className="text-muted-foreground">
            Manage your educational levels
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add Level
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLevel ? 'Edit Level' : 'Add New Level'}
              </DialogTitle>
              <DialogDescription>
                {editingLevel
                  ? 'Update the level details below.'
                  : 'Fill in the details to create a new level.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter level name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="formation" className="text-sm font-medium">
                  Formation
                </label>
                <Select
                  value={formData.idformation.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, idformation: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map((formation) => (
                      <SelectItem
                        key={formation.idformation}
                        value={formation.idformation.toString()}
                      >
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingLevel ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Levels List</CardTitle>
              <CardDescription>
                View and manage all your levels
              </CardDescription>
            </div>
            <div className="relative w-64 group">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              <Input
                placeholder="Search levels..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLevels.map((level) => (
                  <TableRow key={level.idlevel}>
                    <TableCell className="font-medium">
                      {level.name}
                    </TableCell>
                    <TableCell>{getFormationName(level.idformation)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(level)}
                          className="group relative transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Pencil className="h-4 w-4 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Edit Level
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(level)}
                          className="group relative transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            Delete Level
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLevels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No levels found
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
              This action cannot be undone. This will permanently delete the level
              {levelToDelete && (
                <>
                  <span className="font-semibold"> "{levelToDelete.name}"</span>
                  <span> from {getFormationName(levelToDelete.idformation)}</span>
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
              Delete Level
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Levels; 