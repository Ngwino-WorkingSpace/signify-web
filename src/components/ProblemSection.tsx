import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Clock, AlertCircle, Building2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import  Doc  from "./figma/doc.avif"

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: Clock,
      title: "Delayed Health Data",
      description:
        "By the time data reaches decision-makers, outbreaks have already spread.",
    },
    {
      icon: AlertCircle,
      title: "Reactive Decisions",
      description:
        "Health systems respond to crises instead of preventing them.",
    },
    {
      icon: Building2,
      title: "Facility-Only Reporting",
      description:
        "Most data comes from clinics, missing community-level early warning signs.",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#18392b] mb-6">
              The Challenge African Health Systems Face
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Traditional health surveillance relies on facility-based reporting,
              creating dangerous gaps in early detection and response.
            </p>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-[#18392b]" />
                  </div>
                  <div>
                    <h3 className="text-lg text-[#18392b] mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[#18392b] opacity-20 z-10"></div>
              <ImageWithFallback
                src={Doc}
                alt="African healthcare worker in the field"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
