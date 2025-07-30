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

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/files" className="flex items-center gap-1">
            <Folder className="w-4 h-4" />
            <span>All Files</span>
          </Link>
        </BreadcrumbItem>

        {dirArr.map((item: string, index: number) => {
          const path = `/files?view=${viewMode || "list"}&dir=${dirArr.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem key={index}>
                <Link href={path}>{item}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
