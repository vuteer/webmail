"use client";
import React from "react";
import { useQueryState } from "nuqs";
import { LayoutGrid, List, Paperclip, Plus, RefreshCcw } from "lucide-react";
import { FaChartPie } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { Heading2, Paragraph } from "@/components/ui/typography";

import { FileBreadcrumbs } from "./breadcrumbs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Folder } from "./folder";

import { fileStateStore } from "@/stores/files";
import useMounted from "@/hooks/useMounted";
import { formatBytes } from "@/utils/size";

export const FilesContainer = () => {
  const mounted = useMounted();
  const { total, used } = fileStateStore();
  const [dir] = useQueryState("dir");
  const [refresh, setRefresh] = React.useState(false);

  if (!mounted) return null;

  return (
    <div className="space-y-4 py-7 px-4">
      <div className="flex justify-between w-full ">
        <FileBreadcrumbs />
        <div className="flex items-center gap-2 w-fit">
          <ViewTabs />
          <Button
            size="sm"
            className="space-x-3"
            onClick={() => setRefresh(!refresh)}
          >
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
      {!dir ? (
        <div className="space-y-3">
          <Heading2 className="font-extrabold">
            Welcome to Vu.Mail Cloud Storage
          </Heading2>
          <Paragraph className="max-w-[60%]">
            Manage your files and folders here. There is so much more you can do
            with your files using our platform. Upload, share, collaborate, and
            secure your files with ease.
          </Paragraph>
          <div className="flex gap-2 items-end">
            <FaChartPie size={24} />
            <div className="space-y-1">
              <Paragraph className="font-bold">
                <span>
                  {formatBytes(used || 0)}/{formatBytes(total || 1)}
                </span>
              </Paragraph>
              <div className="relative w-[400px] h-[7px] rounded-full bg-green-500 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                  style={{
                    width: `${((used || 0) / (total || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2 mt-2">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="space-x-2">
                <Plus size={16} />
                <span>Create Folder</span>
              </Button>
              <Button variant="secondary" size="sm" className="space-x-2">
                <Paperclip size={16} />
                <span>Upload File</span>
              </Button>
            </div>
            <Button size="sm" variant="outline" className="space-x-2">
              Request More Storage
            </Button>
          </div>
          <Separator />
        </div>
      ) : null}

      <Folder refresh={refresh} />
    </div>
  );
};

export default function ViewTabs() {
  const [, setView] = useQueryState("view");
  return (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="grid"
          className="flex items-center gap-2 justify-center"
          onClick={() => setView("grid")}
        >
          <LayoutGrid className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="flex items-center gap-2 justify-center"
          onClick={() => setView("list")}
        >
          <List className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
