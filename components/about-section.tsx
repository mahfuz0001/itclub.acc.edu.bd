import Image from "next/image";
import { Code, Lightbulb, Users, Laptop, BookOpen, Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-16" id="about">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          About Us
        </h2>
        <p className="max-w-[85%] leading-normal text-[#94a3b8] sm:text-lg sm:leading-7">
          We are a community of passionate students dedicated to exploring and
          advancing technology. Our club provides a platform for learning,
          collaboration, and innovation in the world of IT.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative flex flex-col justify-center">
          <div className="p-6">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="mt-4 text-[#94a3b8]">
              To foster a vibrant community of tech enthusiasts who learn,
              innovate, and grow together. We aim to bridge the gap between
              academic learning and industry requirements by providing hands-on
              experience and networking opportunities.
            </p>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-xl bg-muted">
          <Image
            src="/placeholder.svg?height=600&width=800"
            alt="Students collaborating on a project"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <Code className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Technical Workshops</h3>
          <p className="mt-2 text-[#94a3b8]">
            Regular workshops on the latest technologies, programming languages,
            and tools.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <Lightbulb className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Project Incubation</h3>
          <p className="mt-2 text-[#94a3b8]">
            Support for student-led projects with mentorship and resources.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <Users className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Networking</h3>
          <p className="mt-2 text-[#94a3b8]">
            Connect with peers, alumni, and industry professionals.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <Laptop className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Hackathons</h3>
          <p className="mt-2 text-[#94a3b8]">
            Competitive coding events to test skills and foster teamwork.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <BookOpen className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Learning Resources</h3>
          <p className="mt-2 text-[#94a3b8]">
            Access to curated learning materials and resources.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border p-6 text-center">
          <Award className="h-10 w-10 mb-4 text-[#3b82f6]" />
          <h3 className="text-xl font-bold">Certifications</h3>
          <p className="mt-2 text-[#94a3b8]">
            Preparation for industry-recognized certifications.
          </p>
        </div>
      </div>
    </section>
  );
}
