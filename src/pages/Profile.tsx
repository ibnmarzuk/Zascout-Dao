import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield } from 'lucide-react';

export default function Profile() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>ZD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>User Name</CardTitle>
            <p className="text-sm text-neutral-500">Member since May 2026</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-neutral-400" />
            <span>email@example.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-neutral-400" />
            <span>Verified Contributor</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
