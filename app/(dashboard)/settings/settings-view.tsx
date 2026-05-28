'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  createHousehold,
  joinHousehold,
  leaveHousehold,
  toggleFeatureSharing
} from '@/lib/actions/household';
import {
  Copy,
  Users,
  LogOut,
  Check,
  Settings2,
  Plus,
  ShieldAlert
} from 'lucide-react';
import Image from 'next/image';

type Member = {
  id: string;
  uid: string;
  name: string | null;
  avatar: string | null;
};

type HouseholdDetails = {
  inHousehold: boolean;
  household?: {
    id: string;
    code: string;
    name: string | null;
    members: Member[];
  };
  userSettings: {
    shareDecisionHelper: boolean;
    shareBucketList: boolean;
  };
} | null;

export default function SettingsView({
  uid,
  initialDetails
}: {
  uid: string;
  initialDetails: HouseholdDetails;
}) {
  const router = useRouter();
  const [details, setDetails] = useState<HouseholdDetails>(initialDetails);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Join Flow Dialog State
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [pendingJoinCode, setPendingJoinCode] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    const res = await createHousehold(uid);
    setLoading(false);

    if (res.success && res.household) {
      toast({
        title: 'Household Created! 🎉',
        description: `Your household has been created. Invite code: ${res.household.code}`,
        variant: 'success'
      });
      // Refresh page data
      router.refresh();
      window.location.reload();
    } else {
      toast({
        title: 'Error Creating Household 🚨',
        description: res.error || 'Something went wrong.',
        variant: 'destructive'
      });
    }
  };

  const triggerJoinFlow = () => {
    if (!inviteCode.trim()) {
      toast({
        title: 'Invite Code Required',
        description: 'Please enter a valid household invite code.',
        variant: 'destructive'
      });
      return;
    }
    setPendingJoinCode(inviteCode.trim());
    setShowJoinDialog(true);
  };

  const handleJoin = async (mergeData: boolean) => {
    setShowJoinDialog(false);
    setLoading(true);
    const res = await joinHousehold(uid, pendingJoinCode, mergeData);
    setLoading(false);

    if (res.success && res.household) {
      toast({
        title: 'Joined Household! 🏠',
        description: `You have successfully joined the household.`,
        variant: 'success'
      });
      setInviteCode('');
      router.refresh();
      window.location.reload();
    } else {
      toast({
        title: 'Error Joining Household 🚨',
        description: res.error || 'Invalid code or something went wrong.',
        variant: 'destructive'
      });
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    const res = await leaveHousehold(uid);
    setLoading(false);

    if (res.success) {
      toast({
        title: 'Left Household 🚪',
        description: 'You are no longer in a household.',
        variant: 'success'
      });
      router.refresh();
      window.location.reload();
    } else {
      toast({
        title: 'Error Leaving Household 🚨',
        description: res.error || 'Failed to leave household.',
        variant: 'destructive'
      });
    }
  };

  const handleToggle = async (
    feature: 'decisionHelper' | 'bucketList',
    enabled: boolean
  ) => {
    // Optimistic UI update
    if (details) {
      setDetails({
        ...details,
        userSettings: {
          ...details.userSettings,
          [feature === 'decisionHelper'
            ? 'shareDecisionHelper'
            : 'shareBucketList']: enabled
        }
      });
    }

    const res = await toggleFeatureSharing(uid, feature, enabled);
    if (!res.success) {
      // Revert on error
      if (details) {
        setDetails({
          ...details,
          userSettings: {
            ...details.userSettings,
            [feature === 'decisionHelper'
              ? 'shareDecisionHelper'
              : 'shareBucketList']: !enabled
          }
        });
      }
      toast({
        title: 'Failed to update sharing settings',
        description: res.error || 'Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Settings Updated',
        description: `${feature === 'decisionHelper' ? 'Decision Helper' : 'Bucket List'} sharing is now ${enabled ? 'enabled' : 'disabled'}.`,
        variant: 'success'
      });
      router.refresh();
    }
  };

  const copyCodeToClipboard = () => {
    if (details?.household?.code) {
      navigator.clipboard.writeText(details.household.code);
      setCopied(true);
      toast({
        title: 'Code Copied! 📋',
        description: 'Household invite code has been copied to your clipboard.',
        variant: 'success'
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-2">
        <Settings2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Profile & Sharing Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Household Admin Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Household Management
            </CardTitle>
            <CardDescription>
              Manage your household association to share features with family or
              roommates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {details?.inHousehold && details.household ? (
              <div className="space-y-6">
                {/* Code display */}
                <div className="p-4 rounded-lg bg-muted flex flex-col gap-2 relative">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">
                    Household Invite Code
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold tracking-wider text-primary">
                      {details.household.code}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyCodeToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Members list */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Household Members ({details.household.members.length})
                  </h3>
                  <div className="divide-y border rounded-lg bg-card">
                    {details.household.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3"
                      >
                        {member.avatar ? (
                          <Image
                            src={member.avatar}
                            width={32}
                            height={32}
                            alt={member.name || 'Avatar'}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                            {(member.name || member.uid)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {member.name || 'Anonymous User'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.uid}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave Household */}
                <div className="pt-2">
                  <AlertDialog>
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                      disabled={loading}
                    >
                      <LogOut className="h-4 w-4" />
                      Leave Household
                    </Button>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5 text-destructive" />
                          Are you sure you want to leave?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You will lose access to all shared Decision Helper
                          lists and Bucket List items. Your personal data
                          remains untouched, but you will no longer collaborate
                          with this household.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLeave}>
                          Leave Household
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* No household UI */}
                <div className="text-center p-6 border border-dashed rounded-lg bg-muted/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    You are not currently in a household. Create one or enter a
                    code to join an existing one.
                  </p>
                  <Button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create a New Household
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or Join One
                    </span>
                  </div>
                </div>

                {/* Join code input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Invite Code (e.g. HH-ABCD-1234)"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={loading}
                    className="font-mono tracking-wide uppercase"
                  />
                  <Button onClick={triggerJoinFlow} disabled={loading}>
                    Join
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Sharing Permissions Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Feature Sharing Permissions
            </CardTitle>
            <CardDescription>
              Toggle which features you actively collaborate on with your
              household members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!details?.inHousehold ? (
              <div className="text-center p-8 text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/10">
                Join a household to unlock collaborative feature sharing
                settings.
              </div>
            ) : (
              <div className="space-y-5">
                {/* Decision Helper Toggle */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                  <Checkbox
                    id="shareDecisionHelper"
                    checked={details.userSettings.shareDecisionHelper}
                    onCheckedChange={(checked) =>
                      handleToggle('decisionHelper', checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="shareDecisionHelper"
                      className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Decision Helper Sharing
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Access and coordinate shared options and spinning wheels.
                      When enabled, your views and selections will switch to the
                      household-wide dataset.
                    </p>
                  </div>
                </div>

                {/* Bucket List Toggle */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                  <Checkbox
                    id="shareBucketList"
                    checked={details.userSettings.shareBucketList}
                    onCheckedChange={(checked) =>
                      handleToggle('bucketList', checked === true)
                    }
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="shareBucketList"
                      className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Bucket List Sharing
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Collaborate on personal growth and lifetime goals with
                      your household. Changes and checkoffs are visible to all
                      members in real-time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Join Flow Alert Dialog for Merging Data */}
      <AlertDialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
              Merge Existing Data?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You are about to join household{' '}
                <span className="font-bold font-mono">{pendingJoinCode}</span>.
              </p>
              <p>
                Would you like to{' '}
                <strong>merge your existing private items</strong> (Decision
                Helper lists and Bucket List items) into this household so other
                members can see and collaborate on them?
              </p>
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded border border-amber-200 dark:border-amber-900">
                <strong>Keep Separate:</strong> Your existing items will remain
                private. You will start with the household's shared items while
                sharing is active.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel onClick={() => setShowJoinDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <Button variant="outline" onClick={() => handleJoin(false)}>
              Keep Separate
            </Button>
            <AlertDialogAction onClick={() => handleJoin(true)}>
              Yes, Merge Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
