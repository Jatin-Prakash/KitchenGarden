import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function SellerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.phone === phone && u.role === 'seller');

    if (!user) {
      toast.error('User not found. Please register first.');
      return;
    }

    // Generate mock OTP (in production, this would be sent via SMS)
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    
    // In development, show OTP in console and toast
    console.log('OTP:', mockOtp);
    toast.success(`OTP sent! (Mock OTP: ${mockOtp})`);
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      toast.error('Invalid OTP');
      return;
    }

    // Get user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.phone === phone && u.role === 'seller');

    if (user) {
      login(user);
      toast.success('Login successful!');
      navigate('/seller/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)'
        }}
      />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader>
          <Link to="/" className="mb-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <CardTitle className="text-2xl">Seller Login</CardTitle>
          <CardDescription>Enter your phone number to receive OTP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10 digit phone number"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              disabled={otpSent}
            />
          </div>

          {!otpSent ? (
            <Button onClick={handleSendOtp} className="w-full bg-green-600 hover:bg-green-700" size="lg">
              Send OTP
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Verify & Login
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/seller/register" className="text-green-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}