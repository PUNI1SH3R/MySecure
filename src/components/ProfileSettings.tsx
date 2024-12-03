import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Key, Shield, Bell, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/types';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/storage';

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    notifications: true,
    twoFactor: false,
    walletAddress: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedProfile = loadFromLocalStorage('userProfile');
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = saveToLocalStorage('userProfile', profile);
      
      if (success) {
        toast({
          title: "Settings Updated",
          description: "Your profile settings have been saved successfully.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateKeys = async () => {
    try {
      // Simulate key generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Keys Generated",
        description: "New encryption keys have been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate keys. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <h3 className="font-semibold">Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <h3 className="font-semibold">Security Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={profile.twoFactor}
                onCheckedChange={(checked) => setProfile({ ...profile, twoFactor: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your account activity
                </p>
              </div>
              <Switch
                checked={profile.notifications}
                onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Key className="h-5 w-5" />
            <h3 className="font-semibold">Encryption Keys</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your encryption keys for secure document storage
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGenerateKeys}
            >
              Generate New Key Pair
            </Button>
          </div>
        </div>
      </Card>

      <Button 
        onClick={handleSave} 
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Changes...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </div>
  );
}