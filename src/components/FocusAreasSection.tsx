import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import {
  Bug,
  Heart,
  Wind,
  Apple,
  Droplet,
  AlertTriangle,
} from "lucide-react";

export function FocusAreasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const focusAreas = [
    {
      icon: Bug,
      title: "Malaria",
      description: "Early detection of symptoms and vector presence",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
    {
      icon: Heart,
      title: "Maternal Health",
      description: "Pregnancy monitoring and postnatal care signals",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
    {
      icon: Wind,
      title: "Respiratory Illness",
      description: "Tracking coughs, breathing issues, and flu patterns",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
    {
      icon: Apple,
      title: "Nutrition",
      description: "Food security and malnutrition indicators",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
    {
      icon: Droplet,
      title: "Sanitation",
      description: "Water quality and hygiene condition reports",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
    {
      icon: AlertTriangle,
      title: "Outbreak Detection",
      description: "Pattern recognition for emerging disease threats",
      color: "bg-blue-50",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#18392b] mb-4">
            Preventive Focus Areas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Signify monitors the health signals that matter most for early
            intervention and prevention.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#18392b] transition-all hover:shadow-lg h-full">
                <div
                  className={`${area.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <area.icon className={`w-7 h-7 ${area.iconColor}`} />
                </div>
                <h3 className="text-lg text-[#18392b] mb-2">{area.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {area.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-emerald-50 rounded-xl px-6 py-4 border border-emerald-200">
            <p className="text-[#18392b]">
              <span className="font-semibold">Prevention First:</span> All focus
              areas emphasize early detection before conditions escalate into
              emergencies.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
