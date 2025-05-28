
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reset password logic here
    console.log('Reset password for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-mailr-dark flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-mailr-darkgray border-mailr-lightgray">
          <CardHeader className="text-center">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-mailr-red">Mailr</h1>
              <p className="text-gray-400 text-sm">Smart Email Solution</p>
            </div>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline" 
                className="w-full bg-mailr-darkgray border-mailr-lightgray text-white hover:bg-mailr-lightgray/10"
              >
                Try Different Email
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full text-mailr-red hover:bg-mailr-red/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mailr-dark flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-mailr-darkgray border-mailr-lightgray">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-mailr-red">Mailr</h1>
            <p className="text-gray-400 text-sm">Smart Email Solution</p>
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <p className="text-gray-400">Enter your email to receive a reset link</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-mailr-darkgray border-mailr-lightgray text-white"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-mailr-red hover:bg-mailr-red/90 text-white">
              Send Reset Link
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-mailr-red hover:underline inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
