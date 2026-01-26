import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Mail, MessageSquare } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 bg-gradient-to-br from-[#18392b] to-[#234a39] text-white scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
            Help Move African Health Systems from Reaction to Prevention
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Join the growing network of health leaders using Signify to save
            lives through early action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="mailto:contact@signify.health"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white text-[#18392b] px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:shadow-xl group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Request Demo
            </motion.a>

            <motion.a
              href="mailto:ngwinosignify@info.com"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all group"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Contact Us
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 pt-12 border-t border-white/20"
          >
            <p className="text-gray-300 text-sm mb-4">
              Questions about implementation, pricing, or data security?
            </p>
            <p className="text-white">
              Email us at{" "}
              <a
                href="mailto:ngwinosignify@info.com"
                className="underline hover:text-gray-200 transition-colors"
              >
                ngwinosignify@info.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
