"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectUpload } from "./direct-upload";
import { CsvUpload } from "./csv-upload";
import { FtpUpload } from "./ftp-upload";
import { Upload, FileSpreadsheet, Server } from "lucide-react";

export function UploadTabs() {
  const [activeTab, setActiveTab] = useState("direct");

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Tabs
      defaultValue="direct"
      className="space-y-8"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
        <TabsTrigger value="direct" className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Direct Upload</span>
        </TabsTrigger>
        <TabsTrigger value="csv" className="flex items-center space-x-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span>CSV Upload</span>
        </TabsTrigger>
        <TabsTrigger value="ftp" className="flex items-center space-x-2">
          <Server className="h-4 w-4" />
          <span>FTP Upload</span>
        </TabsTrigger>
      </TabsList>
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabVariants}
      >
        <TabsContent value="direct">
          <DirectUpload />
        </TabsContent>
        <TabsContent value="csv">
          <CsvUpload />
        </TabsContent>
        <TabsContent value="ftp">
          <FtpUpload />
        </TabsContent>
      </motion.div>
    </Tabs>
  );
}
