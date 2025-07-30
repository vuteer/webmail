"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppInput } from "@/components";
import { calendarStateStore } from "@/stores/calendar";
import { createToast } from "@/utils/toast";
import { Card } from "@/components/ui/card";
import { Paragraph } from "@/components/ui/typography";

const COLORS = [
  "#f43f5e", // Rose
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
];

export function CalendarModal({
  open,
  existingCalendar,
  onClose,
  setOpen,
}: {
  open: boolean;
  existingCalendar?: any;
  onClose: () => void;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { addCalendar, editCalendar, deleteCalendar } = calendarStateStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingCalendar) {
      setTitle(existingCalendar.displayName);
      setDescription(existingCalendar.description);
      setColor(existingCalendar.calendarColor);
    } else {
      setTitle("");
      setDescription("");
      setColor(COLORS[0]);
    }
  }, [existingCalendar, open]);

  const handleSave = async () => {
    if (!title.trim()) {
      createToast("Input Error", "Calendar name cannot be empty", "danger");
      return;
    }

    if (!existingCalendar) {
      const cal = {
        name: title,
        description,
        color,
      };
      setLoading(true);
      const res = await addCalendar(cal);
      if (res) {
        createToast("Success", "Calendar added successfully", "success");
        setTitle("");
        setDescription("");
        setColor(COLORS[0]);
        setOpen(false);
      } else {
        createToast("Error", "Failed to add calendar", "danger");
      }
      setLoading(false);
    } else {
      let update: any = {};

      if (title !== existingCalendar.displayName) update.name = title;
      if (description !== existingCalendar.description)
        update.description = description;
      if (color !== existingCalendar.calendarColor) update.color = color;

      if (!Object.keys(update).length) {
        createToast("Info", "No changes made", "warning");
        return;
      }
      update.url = existingCalendar.url;

      setLoading(true);
      const urlArr = existingCalendar.url.split("/");
      const res = await editCalendar(urlArr[urlArr.length - 2], update);
      if (res) {
        createToast("Success", "Calendar updated successfully", "success");
        setTitle("");
        setDescription("");
        setColor(COLORS[0]);
        setOpen(false);
      } else {
        createToast("Error", "Failed to update calendar", "danger");
      }
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!existingCalendar) return;
    setLoading(true);
    const urlArr = existingCalendar.url.split("/");
    const res = await deleteCalendar(urlArr[urlArr.length - 2]);
    if (res) {
      createToast("Success", "Calendar deleted successfully", "success");
      setOpen(false);
    } else {
      createToast("Error", "Failed to delete calendar", "danger");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarPlus size={16} /> Add Calendar
          </Button>
        )}
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingCalendar ? "Edit Calendar" : "Add New Calendar"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <AppInput
              value={title}
              setValue={setTitle}
              disabled={loading}
              placeholder="e.g. Personal, Work"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <AppInput
              value={description}
              setValue={setDescription}
              textarea={true}
              disabled={loading}
              placeholder="Describe this calendar..."
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{color}</span>
                  <Palette size={16} className="ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto grid grid-cols-6 gap-2 p-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-3 gap-1">
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={loading} variant="outline" onClick={handleSave}>
            {existingCalendar ? "Update" : "Create"}
          </Button>
          {existingCalendar && (
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </DialogFooter>
        {existingCalendar && (
          <Card className="w-full p-4 flex items-center gap-3">
            <Info />
            <Paragraph>
              Deleting a calendar is permanent and cannot be undone. It also
              deletes all events associated with it.
            </Paragraph>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
