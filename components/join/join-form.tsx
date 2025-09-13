"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { STREAM_SECTIONS, STREAMS, YEARS } from "@/constants/form-options";
import { submitJoinApplication } from "@/lib/firebase/join";
import { useToast } from "@/components/ui/use-toast";

const techSkillOptions = [
  "Programming",
  "Web Development",
  "UI/UX",
  "Web Designing",
  "PowerPoint Presentation",
  "Graphics Designing",
  "Gaming",
  "Illustration",
  "Animation",
  "Olympiad",
  "Videography",
  "Video Editing",
  "VFX",
  "3D Modeling",
  "Photography",
  "Photo Editing",
  "Beginner",
];

const leadershipOptions = [
  "Event Management",
  "Hosting",
  "Event Organizing",
  "Public Speaking",
  "Presentation",
  "Leading",
];

const learningOptions = [
  "Programming",
  "Graphics Designing",
  "Web Development",
  "Presentation",
  "Olympiad",
  "Video Editing",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  phone: z.string().min(10, { message: "Enter a valid phone number." }),
  facebook: z.string().url().optional(),
  address: z.string().min(5, { message: "Enter your present address." }),
  previousSchool: z.string().optional(),
  stream: z.string(),
  section: z.string(),
  year: z.string(),
  rollNumber: z.string().min(1, { message: "ID number is required." }),
  techSkills: z
    .array(z.string())
    .min(1, { message: "Select at least one skill." }),
  techSkillsOther: z.string().optional(),
  leadershipSkills: z.array(z.string()).optional(),
  leadershipOther: z.string().optional(),
  thingsToLearn: z.array(z.string()).optional(),
  achievements: z.string().optional(),
  portfolio: z.string().url().optional(),
  github: z.string().url().optional(),
  freelancing: z.string().url().optional(),
  reason: z
    .string()
    .min(10, { message: "Tell us why you want to join (min 10 chars)." }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<
    keyof typeof STREAM_SECTIONS | null
  >(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      techSkills: [],
      leadershipSkills: [],
      thingsToLearn: [],
      agreeToTerms: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      await submitJoinApplication(values);
      toast({
        title: "Application Submitted",
        description: "We'll get back to you soon!",
      });
      form.reset();
      router.push("/join/thank-you");
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(
        "There was an error submitting your application. Please try again later."
      );
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredSections = selectedStream
    ? STREAM_SECTIONS[selectedStream]
    : [];

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="01XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="facebook"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Profile Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/your.profile"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Present Address</FormLabel>
                <FormControl>
                  <Input placeholder="Your current address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="previousSchool"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous School</FormLabel>
                <FormControl>
                  <Input placeholder="Your previous school" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Academic Info */}
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              name="stream"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      setSelectedStream(val as keyof typeof STREAM_SECTIONS);
                      field.onChange(val);
                      form.setValue("section", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(STREAM_SECTIONS).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedStream && (
              <FormField
                name="section"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSections.map((sec) => (
                          <SelectItem key={sec.value} value={sec.value}>
                            {sec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="year"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y.value} value={y.value}>
                          {y.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Skills */}
          <FormField
            name="techSkills"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {techSkillOptions.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={(checked) => {
                          checked
                            ? field.onChange([...field.value, skill])
                            : field.onChange(
                                field.value.filter((v) => v !== skill)
                              );
                        }}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
                <Input
                  placeholder="Other (specify)"
                  {...form.register("techSkillsOther")}
                />
              </FormItem>
            )}
          />

          {/* Leadership */}
          <FormField
            name="leadershipSkills"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Management & Leadership Skills</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {leadershipOptions.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={(checked) => {
                          checked
                            ? field.onChange([...(field.value ?? []), skill])
                            : field.onChange(
                                field.value?.filter((v) => v !== skill)
                              );
                        }}
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
                <Input
                  placeholder="Other (specify)"
                  {...form.register("leadershipOther")}
                />
              </FormItem>
            )}
          />

          {/* Things to Learn */}
          <FormField
            name="thingsToLearn"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Things You Want to Learn From ACCITC</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {learningOptions.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={(checked) => {
                          checked
                            ? field.onChange([...(field.value ?? []), opt])
                            : field.onChange(
                                field.value?.filter((v) => v !== opt)
                              );
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {/* Other Info */}
          <FormField
            name="achievements"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Past Achievements</FormLabel>
                <Textarea
                  placeholder="List your past achievements in tech or competitions"
                  {...field}
                />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              name="portfolio"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio (Optional)</FormLabel>
                  <Input placeholder="https://myportfolio.com" {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="github"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Link</FormLabel>
                  <Input placeholder="https://github.com/username" {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="freelancing"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freelance Profile</FormLabel>
                  <Input placeholder="https://fiverr.com/username" {...field} />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="reason"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why Join ACCITC?</FormLabel>
                <Textarea placeholder="Your reason for joining" {...field} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the terms and conditions of the IT Club
                  </FormLabel>
                  <FormDescription>
                    By submitting this form, you agree to our{" "}
                    <a href="/terms" className="text-[#3b82f6] underline">
                      Terms of Service
                    </a>
                    .
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
