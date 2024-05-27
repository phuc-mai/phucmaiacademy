"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Resource, Section } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/custom/FileUpload";

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  fileUrl: z.string().min(1),
});

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        values
      );
      toast.success("Resource added");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Failed to add resource", error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
      );
      toast.success("Resource deleted");
      setDeletingId("");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Failed to delete resource", error);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center text-xl font-bold mt-12"><PlusCircle /> Add Resources (optional)</div>
      <p className="text-sm font-medium mt-2">
        Add resources to this section to help your students learn better
      </p>

      <div className="mt-5 flex flex-col gap-5">
        {section.resources.map((resource) => (
          <div key={resource.id} className="flex justify-between bg-[#FFF8EB] rounded-lg text-sm font-medium p-3">
            <div className="flex items-center">
              <File className="h-4 w-4 mr-4" />
              {resource.name}
            </div>
            <button
              className="text-[#FDAB04]"
              onClick={() => onDelete(resource.id)}
              disabled={isSubmitting}
            >
              {deletingId === resource.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. Textbook, Worksheet, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload file</FormLabel>
                <FormControl>
                  <FileUpload
                    endpoint="sectionResource"
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    page="Edit Section"
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting || !isValid}>
            Upload
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ResourceForm;
