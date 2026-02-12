import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Wallet,
  UserPlus,
  Edit,
  CheckCircle,
  ViewIcon,
  View,
} from "lucide-react";
import { set, useForm } from "react-hook-form";
import { Student } from "@/types";
import AddEditStudent from "./AddEditStudent";
import api from "@/apiService/api";
import { userType } from "@/types/validadion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { XCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminStudents() {
  const { students, addStudent, updateStudentBalance, deleteStudent } =
    useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<String>("");
  const [balanceAmount, setBalanceAmount] = useState<number>(1);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [userId, setUSerId] = useState<String>("");
  ///yne nachihu
  const [isOpen, setIsOpen] = useState(false);
  const [editStudent, SetEditStudent] = useState<userType[]>([]);
  const [student, setStudents] = useState<userType[]>([]); // Add Student Form

  const handleTopUp = async () => {
    console.log("id:", userId);
    console.log("balance:", typeof balanceAmount);
    if (!balanceAmount || balanceAmount <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid amount",
      });
      return;
    }

    try {
      const res = await api.post(`/wallet/top-up/${userId}`, {
        amount: balanceAmount,
      });
      console.log("topup data ", res);

      Swal.fire({
        icon: "success",
        title: "Top Up Successful",
        text: `New Balance: $${res.data.balance}`,
        timer: 2000,
        showConfirmButton: false,
      });

      setBalanceAmount(0);
      setIsBalanceOpen(false);
    } catch (error: any) {
      console.error("Error during topup", error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Top Up Failed",
        text: error.response?.data?.message || "Failed to add balance",
      });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    // console.log(status)
    try {
      const res = await api.patch(`/users/status/${id}`, { status: status });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Student status changed to "${status}"`,
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(res);
    } catch (error: any) {
      console.error("Status changing Error", error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  useEffect(() => {
    getAllUSer();
  }, []);

  const getAllUSer = async () => {
    try {
      const response = await api.get("/users");
      // console.log("List of users",response.data.data)
      setStudents(response.data.data);
    } catch (error: any) {
      console.error("Error During Fetching Users", error.response);
    }
  };

  console.log("List of User", student);

  const filteredStudents = student.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Students Management
          </h1>
          <p className="text-muted-foreground">
            Manage student accounts and balances
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-orange-600 shadow-md hover:cursor-pointer"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button>

        <AddEditStudent
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          editStudent={editStudent || null}
        />

        {/* <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student profile in the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  {...register("studentId", { required: true })}
                  placeholder="STU-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="student@uni.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance ($)</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  {...register("balance")}
                  placeholder="0.00"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog> */}
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
                <TableHead>Profile</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.full_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.full_name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {student.profile.department}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <span>{student?.profile?.phone}</span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`font-bold ${
                          (student?.wallet?.balance ?? 0) < 5
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ${student?.wallet?.balance ?? 0}
                      </span>
                    </TableCell>

                    <TableCell className="text-right space-x-2 hover:cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`hover:cursor-pointer
                                            ${
                                              student.status === "approved"
                                                ? "text-green-600 border-green-600"
                                                : student.status === "rejected"
                                                  ? "text-red-600 border-red-600"
                                                  : "text-yellow-600 border-yellow-600"
                                            }
                                          `}
                          >
                            {student.status === "approved" && (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {student.status === "rejected" && (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            {student.status === "pending" && (
                              <Clock className="h-4 w-4 mr-1" />
                            )}
                            {student.status}
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => updateStatus(student.id, "approved")} // <- changed
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => updateStatus(student.id, "rejected")} // <- changed
                          >
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Reject
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => updateStatus(student.id, "pending")}
                          >
                            <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                            Pending
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        className="hover:cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student.full_name);
                          setUSerId(student?.id);
                          setIsBalanceOpen(true);
                        }}
                      >
                        <Wallet className="h-4 w-4 mr-1" /> Top Up
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer hover:bg-red-50"
                        onClick={() => deleteStudent(student.id)}
                      >
                        <View className="h-4 w-4" />
                      </Button>

                      <Button
                        className="hover:cursor-pointer"
                        onClick={() => SetEditStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
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
              Top up balance for{" "}
              <span className="font-bold text-primary">{selectedStudent}</span>
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
                onChange={(e) => setBalanceAmount(Number(e.target.value))}
                className="col-span-3"
                placeholder="20.00"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              onClick={handleTopUp}
            >
              Confirm Top Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
