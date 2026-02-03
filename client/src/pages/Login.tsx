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
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 relative z-10">
        
        {/* Welcome Section */}
        <div className="text-white flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">University Meal Management</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight drop-shadow-lg">
              Digital Meal <br/> 
              <span className="text-yellow-300">System</span>
            </h1>
            <p className="text-orange-50 text-lg leading-relaxed max-w-md">
              Order delicious meals, track your balance, and enjoy a seamless dining experience on campus.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center gap-3 text-orange-50">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Quick & Easy Ordering</span>
            </div>
            <div className="flex items-center gap-3 text-orange-50">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Real-time Balance Tracking</span>
            </div>
            <div className="flex items-center gap-3 text-orange-50">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Fresh, Delicious Meals Daily</span>
            </div>
          </div>
        </div>

        {/* Login Cards */}
        <div className="space-y-5 animate-in fade-in slide-in-from-right duration-700">
          
          {/* Student Login */}
          <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/95 hover:shadow-orange-500/20 transition-all duration-300">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Student Portal</CardTitle>
                  <CardDescription className="text-xs">Access your meal account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Your Profile</label>
                <Select onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Choose a student account" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{student.name}</span>
                          <span className="text-xs text-muted-foreground">({student.studentId})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full h-11 bg-primary hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold" 
                onClick={handleStudentLogin}
                disabled={!selectedStudentId}
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="border-2 border-orange-200 shadow-lg backdrop-blur-sm bg-orange-50/95 hover:border-orange-400 transition-all duration-300">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-200 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Administrator</CardTitle>
                  <CardDescription className="text-xs">System management access</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full h-11 border-2 border-orange-400 text-orange-700 hover:bg-orange-100 hover:border-orange-500 font-semibold transition-all duration-200"
                onClick={handleAdminLogin}
              >
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-white/70 pt-2">
            Demo Mode • All data is simulated
          </p>
        </div>
      </div>
    </div>
  );
}
