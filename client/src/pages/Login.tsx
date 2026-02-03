import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { GraduationCap, ShieldCheck } from "lucide-react";

export default function Login() {
  const { login, students } = useData();
  const [, setLocation] = useLocation();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const handleStudentLogin = () => {
    if (!selectedStudentId) return;
    login('student', parseInt(selectedStudentId));
    setLocation('/student/dashboard');
  };

  const handleAdminLogin = () => {
    login('admin');
    setLocation('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Welcome Section */}
        <div className="text-white flex flex-col justify-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
            University Digital <br/> <span className="text-yellow-400">Meal System</span>
          </h1>
          <p className="text-blue-100 text-lg">
            Manage your meal plans, order ahead, and track your balance with ease.
          </p>
        </div>

        {/* Login Cards */}
        <div className="space-y-6">
          
          {/* Student Login */}
          <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap className="h-6 w-6" />
                <CardTitle className="text-xl">Student Access</CardTitle>
              </div>
              <CardDescription>Select your profile to continue (Demo Mode)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="w-full bg-primary hover:bg-blue-800" 
                onClick={handleStudentLogin}
                disabled={!selectedStudentId}
              >
                Login as Student
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="border-none shadow-xl bg-slate-50">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="h-6 w-6" />
                <CardTitle className="text-xl">Administrator</CardTitle>
              </div>
              <CardDescription>Manage system, students, and menu</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleAdminLogin}
              >
                Access Admin Dashboard
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
