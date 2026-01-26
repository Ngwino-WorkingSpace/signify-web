import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Building2, Users, Stethoscope } from "lucide-react";

export function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const partnerTypes = [
    {
      icon: Building2,
      title: "Ministries of Health",
      description:
        "National and regional health authorities using Signify for real-time surveillance and rapid response coordination.",
      benefits: [
        "Early warning system integration",
        "Policy-informed decision making",
        "Resource allocation optimization",
      ],
    },
    {
      icon: Users,
      title: "NGOs & Development Partners",
      description:
        "International and local organizations leveraging Signify to enhance program effectiveness and community engagement.",
      benefits: [
        "Program impact measurement",
        "Community-level data access",
        "Evidence-based interventions",
      ],
    },
    {
      icon: Stethoscope,
      title: "Health Research Institutions",
      description:
        "Academic and research partners using population-level data for epidemiological studies and health system strengthening.",
      benefits: [
        "Anonymized data for research",
        "Pattern analysis capabilities",
        "Publication-ready insights",
      ],
    },
  ];

  return (
    <section
      id="partners"
      ref={ref}
      className="py-20 bg-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#18392b] mb-4">
            Trusted by Health Leaders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Signify partners with institutions committed to transforming African
            health systems from reactive to preventive.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {partnerTypes.map((partner, index) => (
            <motion.div
              key={partner.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-[#18392b] transition-all hover:shadow-lg">
                <div className="bg-[#18392b] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <partner.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl text-[#18392b] mb-3">
                  {partner.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {partner.description}
                </p>
                <ul className="space-y-2">
                  {partner.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner logos placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-12 border border-gray-200"
        >
          <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-wider">
            Working with Leading Health Organizations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-400 text-xs">Partner Logo</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
