"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Eye, EyeOff, CheckCircle } from "lucide-react";

export function FtpUpload() {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">FTP Upload</h3>
          <p className="text-muted-foreground">
            Use these credentials to connect to our FTP server and upload your
            files.
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Make sure to keep these credentials secure and do not share them
            with others.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="server" className="text-lg">
              Server
            </Label>
            <div className="flex">
              <Input
                id="server"
                value="content-ftp.example.com"
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none px-3"
                onClick={() => handleCopy("content-ftp.example.com", "server")}
              >
                {copied === "server" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg">
              Username
            </Label>
            <div className="flex">
              <Input
                id="username"
                value="your-username"
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none px-3"
                onClick={() => handleCopy("your-username", "username")}
              >
                {copied === "username" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">
              Password
            </Label>
            <div className="flex">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value="your-secure-password"
                readOnly
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-r-0 px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none px-3"
                onClick={() => handleCopy("your-secure-password", "password")}
              >
                {copied === "password" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full">Connect to FTP</Button>
        </div>
      </Card>
    </motion.div>
  );
}
