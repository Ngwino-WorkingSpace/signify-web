import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

export function ImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: 250000,
      suffix: "+",
      label: "Communities Reached",
      duration: 2000,
    },
    {
      value: 1200000,
      suffix: "+",
      label: "Surveys Completed",
      duration: 2500,
    },
    {
      value: 3500,
      suffix: "+",
      label: "Early Alerts Generated",
      duration: 2000,
    },
    {
      value: 12,
      suffix: "",
      label: "Regions Covered",
      duration: 1500,
    },
  ];

  return (
    <section
      id="impact"
      ref={ref}
      className="py-20 bg-[#18392b] text-white scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Impact & Value
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Real-time health surveillance transforming preventive care across
            Africa.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
                <Counter
                  end={stat.value}
                  duration={stat.duration}
                  isInView={isInView}
                  suffix={stat.suffix}
                />
                <p className="text-gray-200 mt-3">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">

            <h3 className="text-lg mb-2">Faster Response</h3>
            <p className="text-gray-300 text-sm">
              Authorities act on signals within hours, not weeks
            </p>
          </div>
          <div className="text-center">

            <h3 className="text-lg mb-2">Cost Effective</h3>
            <p className="text-gray-300 text-sm">
              Prevention costs far less than reactive emergency care
            </p>
          </div>
          <div className="text-center">

            <h3 className="text-lg mb-2">Community Powered</h3>
            <p className="text-gray-300 text-sm">
              Built for African contexts, accessible to all
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Counter({
  end,
  duration,
  isInView,
  suffix,
}: {
  end: number;
  duration: number;
  isInView: boolean;
  suffix: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentCount = Math.floor(startValue + (end - startValue) * progress);
        setCount(currentCount);
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="text-4xl lg:text-5xl mb-2">
      {formatNumber(count)}
      {suffix}
    </div>
  );
}
