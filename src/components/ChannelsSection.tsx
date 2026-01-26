import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import ussdImg from "./figma/ussd.png";
import mobile from "./figma/mobile.webp"
import { Smartphone, Globe, Phone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ChannelsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const channels = [
    {
      icon: Phone,
      title: "USSD (Feature Phones)",
      description:
        "Simple dial codes work on any phone, no internet required. Perfect for rural and low-resource communities.",
      image: ussdImg ,
      alt: "African woman using mobile phone",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description:
        "Intuitive smartphone app with offline capabilities and multimedia support for detailed reporting.",
      image:
        mobile,
      alt: "African village community",
    },
    {
      icon: Globe,
      title: "Web Dashboard",
      description:
        "Comprehensive analytics platform for health authorities to monitor, analyze, and respond to health signals.",
      image:
        "https://images.unsplash.com/photo-1586448646505-e7bcafcd83a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBkYXRhJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTI3NDQxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Health data dashboard",
    },
  ];

  return (
    <section
      id="how-it-works"
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
            How Signify Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Multiple channels ensure everyone can participate, regardless of
            technology access.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#18392b] transition-all hover:shadow-xl">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-[#18392b] opacity-20 z-10 group-hover:opacity-30 transition-opacity"></div>
                  <ImageWithFallback
                    src={channel.image}
                    alt={channel.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md z-20">
                    <channel.icon className="w-6 h-6 text-[#18392b]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg text-[#18392b] mb-3">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {channel.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
