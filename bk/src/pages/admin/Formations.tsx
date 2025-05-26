import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { formationService } from '@/services/supabase.service';
import { Formation } from '@/types/database.types';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const Formations = () => {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
    const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        durationyears: 0,
    });

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            const response = await formationService.getAll();
            if (response.data) {
                setFormations(response.data);
            }
        } catch (error) {
            console.error('Error fetching formations:', error);
            toast.error('Failed to fetch formations');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingFormation) {
                await formationService.update(editingFormation.idformation, formData);
                toast.success('Formation updated successfully', {
                    description: `"${formData.name}" has been updated.`,
                    duration: 3000,
                });
            } else {
                await formationService.create(formData);
                toast.success('Formation created successfully', {
                    description: `"${formData.name}" has been added to your formations.`,
                    duration: 3000,
                });
            }
            setIsDialogOpen(false);
            fetchFormations();
            resetForm();
        } catch (error) {
            console.error('Error saving formation:', error);
            toast.error('Failed to save formation', {
                description: 'There was a problem saving the formation. Please try again.',
                duration: 5000,
            });
        }
    };

    const handleEdit = (formation: Formation) => {
        setEditingFormation(formation);
        setFormData({
            name: formation.name,
            durationyears: formation.durationyears,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (formation: Formation) => {
        setFormationToDelete(formation);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!formationToDelete) return;

        try {
            await formationService.delete(formationToDelete.idformation);
            toast.success('Formation deleted successfully', {
                description: `"${formationToDelete.name}" has been permanently deleted.`,
                duration: 3000,
            });
            fetchFormations();
        } catch (error) {
            console.error('Error deleting formation:', error);
            toast.error('Failed to delete formation', {
                description: 'There was a problem deleting the formation. Please try again.',
                duration: 5000,
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setFormationToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            durationyears: 0,
        });
        setEditingFormation(null);
    };

    const filteredFormations = formations.filter(formation =>
        formation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Formations</h1>
                    <p className="text-muted-foreground">Manage your educational formations</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => resetForm()}
                            className="transition-all duration-300 hover:shadow-md hover:scale-105"
                        >
                            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300" /> Add Formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingFormation ? 'Edit Formation' : 'Add New Formation'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingFormation
                                    ? 'Update the formation details below.'
                                    : 'Fill in the details to create a new formation.'}
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
                                    placeholder="Enter formation name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="durationyears" className="text-sm font-medium">
                                    Duration (Years)
                                </label>
                                <Input
                                    id="durationyears"
                                    type="number"
                                    value={formData.durationyears}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            durationyears: parseInt(e.target.value),
                                        })
                                    }
                                    placeholder="Enter duration in years"
                                    required
                                    min="1"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    {editingFormation ? 'Update' : 'Create'}
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
                            <CardTitle>Formations List</CardTitle>
                            <CardDescription>
                                View and manage all your formations
                            </CardDescription>
                        </div>
                        <div className="relative w-64 group">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                            <Input
                                placeholder="Search formations..."
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
                                    <TableHead>Duration (Years)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFormations.map((formation) => (
                                    <TableRow key={formation.idformation}>
                                        <TableCell className="font-medium">
                                            {formation.name}
                                        </TableCell>
                                        <TableCell>{formation.durationyears} years</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(formation)}
                                                    className="group relative transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                                                >
                                                    <Pencil className="h-4 w-4 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                                        Edit Formation
                                                    </span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(formation)}
                                                    className="group relative transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="h-4 w-4 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                                                        Delete Formation
                                                    </span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredFormations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            No formations found
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
                            This action cannot be undone. This will permanently delete the formation
                            {formationToDelete && (
                                <>
                                    <span className="font-semibold"> "{formationToDelete.name}"</span>
                                    {formationToDelete.durationyears > 0 && (
                                        <span> ({formationToDelete.durationyears} years)</span>
                                    )}
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
                            Delete Formation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Formations; 