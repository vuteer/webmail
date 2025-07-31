import React from "react";
import Link from "next/link";
import { Folder } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function FileBreadcrumbs() {
  const [dir] = useQueryState("dir");
  const [viewMode] = useQueryState("view");

  const dirArr = dir ? dir.split("/").filter(Boolean) : [];
  const cleanedDirArr = dirArr.filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/files" className="flex items-center gap-1">
            <Folder className="w-4 h-4" />
            <span>All Files</span>
          </Link>
        </BreadcrumbItem>
        {cleanedDirArr.length > 0 && <BreadcrumbSeparator />}

        {cleanedDirArr.map((item: string, index: number) => {
          const path = `/files?view=${viewMode || "list"}&dir=/${cleanedDirArr.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <Link href={path}>{item}</Link>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
