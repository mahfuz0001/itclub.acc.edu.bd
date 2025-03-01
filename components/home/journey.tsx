import { JOURNEY_DATA } from "@/constants/home-content";

export default function Journey() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Our Journey
          </h2>
          <p className="mx-auto max-w-2xl text-[#94a3b8]">
            From humble beginnings to where we are today
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[#3b82f6]" />

          {/* Timeline items */}
          {JOURNEY_DATA.milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative mb-12 flex flex-col md:flex-row"
              style={{
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              }}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-[#3b82f6]" />

              {/* Content */}
              <div className="ml-0 mt-6 w-full md:ml-0 md:mt-0 md:w-1/2 md:px-8">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-2 text-sm font-medium text-[#94a3b8]">
                    {milestone.year}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{milestone.title}</h3>
                  <p className="text-[#94a3b8]">{milestone.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
