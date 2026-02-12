import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

import React from "react";
import { useForm } from "react-hook-form";

type props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editStudent: any;
};


function AddEditStudent({ isOpen, setIsOpen, editStudent }: props) {
    const {register, formState,handleSubmit}=useForm()
    
    const onSubmit=async()=>{
    try {
        
    } catch (error) {
        
    }
    }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button className="bg-primary hover:bg-orange-600 shadow-md">
          <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student profile in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
    </Dialog>
  );
}

export default AddEditStudent;
