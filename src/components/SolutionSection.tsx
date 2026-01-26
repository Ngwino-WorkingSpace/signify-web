import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Users, Radio, BarChart3, Zap } from "lucide-react";

export function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: Users,
      title: "People Send Health Signals",
      description:
        "Communities report symptoms, exposures, and concerns through simple channels.",
      color: "bg-teal-100",
      iconColor: "text-cyan-700",
    },
    {
      icon: Radio,
      title: "Data is Aggregated",
      description:
        "Signals are collected in real-time from USSD, mobile apps, and web platforms.",
      color: "bg-teal-100",
      iconColor: "text-teal-700",
    },
    {
      icon: BarChart3,
      title: "Authorities See Trends",
      description:
        "Health officials access dashboards showing emerging patterns and hotspots.",
      color: "bg-teal-100",
      iconColor: "text-cyan-700",
    },
    {
      icon: Zap,
      title: "Early Action is Taken",
      description:
        "Preventive measures deployed before situations become critical.",
      color: "bg-teal-100",
      iconColor: "text-cyan-700",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#18392b] mb-4">
            The Signify Solution
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, accessible system that connects communities directly to
            health decision-makers.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 transform -translate-y-1/2 z-0"></div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  {/* Step number */}
                  <div className="absolute -top-4 left-6 bg-[#18392b] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`${step.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 mt-2`}
                  >
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg text-[#18392b] mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="lg:hidden flex justify-center my-4"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
