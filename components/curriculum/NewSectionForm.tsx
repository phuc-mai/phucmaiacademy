"use client";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Course, Section } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SectionList from "@/components/curriculum/SectionList";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const NewSectionForm = ({
  course,
}: {
  course: Course & { sections: Section[] };
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Basic Information",
      path: `/instructor/courses/${course.id}/basic`,
    },
    {
      label: "Curriculum",
      path: `/instructor/courses/${course.id}/sections`,
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course.id}/sections`,
        values
      );
      router.push(
        `/instructor/courses/${course.id}/sections/${response.data.id}`
      );
      toast.success("New Section created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.log("Failed to create new section", error);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${course.id}/sections/reorder`, {
        list: updateData
      });
      toast.success("Sections reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to reorder sections", error);
    }
  }

  return (
    <div className="px-10 py-6">
      <div className="flex gap-5">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.path}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB] text-sm font-medium ${
              pathname === route.path
                ? "bg-[#FDAB04]"
                : "border"
            }`}
          >
            {route.label}
          </Link>
        ))}
      </div>

      <SectionList
        onEdit={(id) => router.push(`/instructor/courses/${course.id}/sections/${id}`)}
        onReorder={onReorder}
        items={course.sections || []}
      />

      <h1 className="text-xl font-bold">Add New Section</h1>

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
                    placeholder="e.g. Introduction to JavaScript"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5">
            <Link href="/instructor/courses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewSectionForm;
