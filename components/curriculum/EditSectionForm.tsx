"use client";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Resource, Section } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/custom/RichEditor";
import { Switch } from "@/components/ui/switch";
import ResourceForm from "@/components/curriculum/ResourseForm";
import Delete from "@/components/custom/Delete";

interface EditSectionFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  resources: z
    .array(z.object({ name: z.string(), url: z.string() }))
    .optional(),
  isFree: z.boolean(),
});

const EditSectionForm = ({ section, courseId }: EditSectionFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || "",
      resources: section.resources || [],
      isFree: section.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      toast.success("Section updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Failed to update section", error);
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="flex justify-between">
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant="outline" className="text-sm font-medium mb-7">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to curriculum
          </Button>
        </Link>
        <div className="flex gap-5 items-start">
          <Button variant="outline">Publish</Button>
          <Delete item="section" courseId={courseId} sectionId={section.id} />
        </div>
      </div>

      <h1 className="text-xl font-bold">Section Details</h1>
      <p className="text-sm font-medium mt-2">
        Complete this section with detailed information, good video and
        resources to give your students the best learning experience
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="e.g. Introduction to Web Development"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder="What this section is about?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Accessibility</FormLabel>
                  <FormDescription>
                    Everyone can access this section for FREE
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href={`/instructor/courses/${courseId}/sections`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>

      <ResourceForm section={section} courseId={courseId} />
    </div>
  );
};

export default EditSectionForm;
