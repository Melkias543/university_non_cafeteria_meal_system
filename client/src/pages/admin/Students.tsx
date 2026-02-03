import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Search, Trash2, Wallet, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Student } from "@/types";

export default function AdminStudents() {
  const { students, addStudent, updateStudentBalance, deleteStudent } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);

  // Add Student Form
  const { register, handleSubmit, reset } = useForm<Omit<Student, 'id'>>();
  
  const onAddSubmit = (data: any) => {
    addStudent({
      ...data,
      balance: parseFloat(data.balance) || 0,
      studentId: data.studentId
    });
    setIsAddOpen(false);
    reset();
  };

  const handleTopUp = () => {
    if (selectedStudent && balanceAmount) {
      updateStudentBalance(selectedStudent.id, parseFloat(balanceAmount));
      setIsBalanceOpen(false);
      setBalanceAmount("");
      setSelectedStudent(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Students Management</h1>
            <p className="text-muted-foreground">Manage student accounts and balances</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-orange-600 shadow-md">
                <UserPlus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Create a new student profile in the system.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" {...register("studentId", { required: true })} placeholder="STU-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email", { required: true })} placeholder="student@uni.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance ($)</Label>
                <Input id="balance" type="number" step="0.01" {...register("balance")} placeholder="0.00" />
              </div>
              <DialogFooter>
                <Button type="submit">Create Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input 
              className="flex-1 outline-none bg-transparent text-sm" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
                </TableRow>
              ) : (
                filteredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell>
                        <span className={`font-bold ${student.balance < 5 ? 'text-red-600' : 'text-green-600'}`}>
                            ${student.balance.toFixed(2)}
                        </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsBalanceOpen(true);
                        }}
                      >
                        <Wallet className="h-4 w-4 mr-1" /> Top Up
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Up Modal */}
      <Dialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
                Top up balance for <span className="font-bold text-primary">{selectedStudent?.name}</span>
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                Amount
                </Label>
                <Input
                id="amount"
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="col-span-3"
                placeholder="20.00"
                autoFocus
                />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit" onClick={handleTopUp}>Confirm Top Up</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </div>
  );
}
