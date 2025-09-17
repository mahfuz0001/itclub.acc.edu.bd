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
import { ErrorBoundary } from "@/components/error-boundary";
import { 
  getSafeErrorMessage, 
  logError, 
  retryOperation 
} from "@/lib/utils/error-handler";
import { 
  sanitizeObject, 
  checkRateLimit 
} from "@/lib/utils/validation";

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
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: "Name can only contain letters, spaces, and common punctuation." }),
  email: z.string()
    .email({ message: "Enter a valid email address." })
    .max(254, { message: "Email address is too long." }),
  phone: z.string()
    .min(10, { message: "Enter a valid phone number." })
    .max(15, { message: "Phone number is too long." })
    .regex(/^[\d\-\+\(\)\s]+$/, { message: "Phone number contains invalid characters." }),
  facebook: z
    .string()
    .optional()
    .refine((val) => !val || (z.string().url().safeParse(val).success && val.includes('facebook.com')), {
      message: "Enter a valid Facebook URL or leave empty",
    }),
  address: z.string()
    .min(5, { message: "Enter your present address." })
    .max(500, { message: "Address is too long." }),
  previousSchool: z.string()
    .max(200, { message: "School name is too long." })
    .optional(),
  stream: z.string().min(1, { message: "Please select your stream." }),
  section: z.string().min(1, { message: "Please select your section." }),
  year: z.string().min(1, { message: "Please select your year." }),
  rollNumber: z.string()
    .min(1, { message: "ID number is required." })
    .max(20, { message: "ID number is too long." }),
  techSkills: z
    .array(z.string())
    .min(1, { message: "Select at least one skill." })
    .max(10, { message: "Please select at most 10 skills." }),
  techSkillsOther: z.string()
    .max(200, { message: "Additional skills description is too long." })
    .optional(),
  leadershipSkills: z.array(z.string())
    .max(5, { message: "Please select at most 5 leadership skills." })
    .optional(),
  leadershipOther: z.string()
    .max(200, { message: "Additional leadership description is too long." })
    .optional(),
  thingsToLearn: z.array(z.string())
    .max(10, { message: "Please select at most 10 items to learn." })
    .optional(),
  achievements: z.string()
    .max(1000, { message: "Achievements description is too long." })
    .optional(),
  portfolio: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Enter a valid portfolio URL or leave empty",
    }),
  github: z
    .string()
    .optional()
    .refine((val) => !val || (z.string().url().safeParse(val).success && val.includes('github.com')), {
      message: "Enter a valid GitHub URL or leave empty",
    }),
  freelancing: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Enter a valid freelancing URL or leave empty",
    }),
  reason: z
    .string()
    .min(10, { message: "Tell us why you want to join (min 10 chars)." })
    .max(1000, { message: "Reason is too long (max 1000 chars)." }),
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

      // Rate limiting check
      const rateLimit = checkRateLimit(`join-form-${values.email}`, 3, 3600000); // 3 submissions per hour per email
      if (!rateLimit.allowed) {
        throw new Error("You have submitted too many applications recently. Please try again later.");
      }

      // Sanitize all form data
      const sanitizedValues = sanitizeObject(values);

      // Remove undefined and empty optional fields
      const cleanedValues = Object.fromEntries(
        Object.entries(sanitizedValues).filter(([key, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === 'string' && value.trim() === '') {
            // Only keep empty strings for optional fields
            const optionalFields = ['facebook', 'previousSchool', 'techSkillsOther', 'leadershipOther', 'achievements', 'portfolio', 'github', 'freelancing'];
            return optionalFields.includes(key) ? false : true;
          }
          return true;
        })
      );

      // Submit with retry mechanism
      await retryOperation(
        async () => {
          await submitJoinApplication(cleanedValues);
        },
        2,
        2000,
        "Submitting join application"
      );

      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your application. We'll review it and get back to you soon!",
        variant: "default",
      });

      form.reset();
      router.push("/join/thank-you");
    } catch (err) {
      const errorMessage = getSafeErrorMessage(err);
      setError(errorMessage);
      
      logError(err, "Join form submission", {
        email: values.email?.substring(0, 3) + "***",
        stream: values.stream,
        hasPersonalInfo: !!values.name,
      });

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredSections = selectedStream
    ? STREAM_SECTIONS[selectedStream]
    : [];

  return (
    <ErrorBoundary>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 ml-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
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
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        maxLength={100}
                      />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        maxLength={254}
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
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="01XXXXXXXXX" 
                        {...field} 
                        maxLength={15}
                      />
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
                    <FormLabel>Facebook Profile Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/your.profile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Present Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your current address" 
                      {...field} 
                      maxLength={500}
                    />
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
                  <FormLabel>Previous School (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your previous school" 
                      {...field} 
                      maxLength={200}
                    />
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
                    <FormLabel>Stream *</FormLabel>
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
                      <FormLabel>Section *</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name="year"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="rollNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your student ID number" 
                      {...field} 
                      maxLength={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills */}
            <FormField
              name="techSkills"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills * (Select at least 1, max 10)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {techSkillOptions.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(skill)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            if (checked) {
                              if (currentValues.length < 10) {
                                field.onChange([...currentValues, skill]);
                              }
                            } else {
                              field.onChange(currentValues.filter((v) => v !== skill));
                            }
                          }}
                          disabled={!field.value?.includes(skill) && field.value?.length >= 10}
                        />
                        <span className={!field.value?.includes(skill) && field.value?.length >= 10 ? "text-gray-400" : ""}>
                          {skill}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Input
                    placeholder="Other skills (specify)"
                    {...form.register("techSkillsOther")}
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground">
                    Selected: {field.value?.length || 0}/10
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Leadership */}
            <FormField
              name="leadershipSkills"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management & Leadership Skills (Optional, max 5)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {leadershipOptions.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(skill)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value ?? [];
                            if (checked) {
                              if (currentValues.length < 5) {
                                field.onChange([...currentValues, skill]);
                              }
                            } else {
                              field.onChange(currentValues.filter((v) => v !== skill));
                            }
                          }}
                          disabled={!field.value?.includes(skill) && (field.value?.length ?? 0) >= 5}
                        />
                        <span className={!field.value?.includes(skill) && (field.value?.length ?? 0) >= 5 ? "text-gray-400" : ""}>
                          {skill}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Input
                    placeholder="Other leadership skills (specify)"
                    {...form.register("leadershipOther")}
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground">
                    Selected: {field.value?.length || 0}/5
                  </p>
                </FormItem>
              )}
            />

            {/* Things to Learn */}
            <FormField
              name="thingsToLearn"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Things You Want to Learn From ACCITC (Optional, max 10)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {learningOptions.map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(opt)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value ?? [];
                            if (checked) {
                              if (currentValues.length < 10) {
                                field.onChange([...currentValues, opt]);
                              }
                            } else {
                              field.onChange(currentValues.filter((v) => v !== opt));
                            }
                          }}
                          disabled={!field.value?.includes(opt) && (field.value?.length ?? 0) >= 10}
                        />
                        <span className={!field.value?.includes(opt) && (field.value?.length ?? 0) >= 10 ? "text-gray-400" : ""}>
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected: {field.value?.length || 0}/10
                  </p>
                </FormItem>
              )}
            />

            {/* Other Info */}
            <FormField
              name="achievements"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Achievements (Optional)</FormLabel>
                  <Textarea
                    placeholder="List your past achievements in tech or competitions"
                    {...field}
                    maxLength={1000}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/1000 characters
                  </p>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="github"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link (Optional)</FormLabel>
                    <Input placeholder="https://github.com/username" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="freelancing"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freelance Profile (Optional)</FormLabel>
                    <Input placeholder="https://fiverr.com/username" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="reason"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Join ACCITC? *</FormLabel>
                  <Textarea 
                    placeholder="Tell us why you want to join our club and what you hope to achieve..."
                    {...field} 
                    maxLength={1000}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/1000 characters
                  </p>
                  <FormMessage />
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
                    <FormLabel className="cursor-pointer">
                      I agree to the terms and conditions of the IT Club *
                    </FormLabel>
                    <FormDescription>
                      By submitting this form, you agree to our{" "}
                      <a href="/terms" className="text-[#3b82f6] underline hover:text-[#2563eb]">
                        Terms of Service
                      </a>{" "}
                      and acknowledge that your information will be used for club membership purposes.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
}
