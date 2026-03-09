import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChefHat,
  Clock,
  Compass,
  MapPin,
  Music,
  Smile,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

const jobs = [
  {
    icon: Compass,
    title: "Deck Officer",
    department: "Navigation",
    pay: "$5,000 – $8,000/mo",
    type: "Full-Time",
    location: "International Waters",
    description:
      "Lead and oversee navigation operations aboard our world-class vessels. Responsible for safe passage through diverse maritime environments.",
    requirements: [
      "Officer of the Watch Certificate",
      "STCW Certification",
      "3+ years experience",
    ],
    highlight: "Senior Role",
  },
  {
    icon: ChefHat,
    title: "Chef / Culinary Staff",
    department: "Food & Beverage",
    pay: "$3,500 – $5,500/mo",
    type: "Full-Time",
    location: "All Vessels",
    description:
      "Create world-class dining experiences for up to 4,000 guests. Work across multiple cuisines from fine dining to casual fare.",
    requirements: [
      "Culinary Degree or equivalent",
      "Food Safety Certification",
      "2+ years experience",
    ],
    highlight: "High Demand",
  },
  {
    icon: Smile,
    title: "Hospitality & Guest Services",
    department: "Guest Experience",
    pay: "$3,200 – $4,800/mo",
    type: "Full-Time",
    location: "All Vessels",
    description:
      "Be the face of NCL's exceptional service standards. Ensure every guest has an unforgettable vacation experience.",
    requirements: [
      "Excellent communication skills",
      "Service industry experience",
      "Multilingual a plus",
    ],
    highlight: "Entry Friendly",
  },
  {
    icon: Music,
    title: "Entertainment Staff",
    department: "Entertainment",
    pay: "$3,000 – $4,500/mo",
    type: "Full-Time",
    location: "All Vessels",
    description:
      "Deliver Broadway-style shows, themed parties, and daily activities. Keep passengers engaged and entertained throughout their voyage.",
    requirements: [
      "Performing arts background",
      "Stage or event experience",
      "High energy personality",
    ],
    highlight: "Creative Role",
  },
  {
    icon: Wrench,
    title: "Engineering Technician",
    department: "Technical Operations",
    pay: "$4,500 – $7,000/mo",
    type: "Full-Time",
    location: "All Vessels",
    description:
      "Maintain critical ship systems including propulsion, HVAC, electrical, and safety equipment. Keep our fleet running at peak performance.",
    requirements: [
      "Marine Engineering degree",
      "STCW Basic Safety",
      "5+ years technical experience",
    ],
    highlight: "Technical Expert",
  },
  {
    icon: Stethoscope,
    title: "Medical Officer",
    department: "Medical Services",
    pay: "$6,000 – $9,000/mo",
    type: "Full-Time",
    location: "Select Vessels",
    description:
      "Provide primary care and emergency medical services to guests and crew. Lead the onboard medical team in a fully equipped medical center.",
    requirements: [
      "Medical Doctor license",
      "ATLS or equivalent",
      "Emergency medicine experience",
    ],
    highlight: "Premium Pay",
  },
];

interface JobsSectionProps {
  onApplyClick: () => void;
}

export default function JobsSection({ onApplyClick }: JobsSectionProps) {
  return (
    <section id="positions" className="py-24 bg-navy-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-[0.25em] uppercase block mb-3">
            Open Positions
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Find Your Role at Sea
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Competitive pay, world-class training, and the opportunity to travel
            the globe while building your career.
          </p>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.12 }}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-gold/15 bg-navy-mid hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10"
              data-ocid={`jobs.item.${i + 1}`}
            >
              {/* Header */}
              <div className="p-6 pb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/25 transition-colors mt-0.5">
                    <job.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white leading-tight">
                      {job.title}
                    </h3>
                    <span className="text-gold/70 text-xs font-medium tracking-wide">
                      {job.department}
                    </span>
                  </div>
                </div>
                <Badge className="bg-gold/15 text-gold border-0 text-xs whitespace-nowrap font-semibold flex-shrink-0">
                  {job.highlight}
                </Badge>
              </div>

              {/* Pay range */}
              <div className="px-6 pb-4">
                <span className="font-display font-bold text-xl text-gold">
                  {job.pay}
                </span>
              </div>

              {/* Meta */}
              <div className="px-6 pb-4 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              </div>

              {/* Description */}
              <div className="px-6 pb-4 flex-1">
                <p className="text-white/60 text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="px-6 pb-5">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">
                  Requirements
                </p>
                <ul className="space-y-1">
                  {job.requirements.map((req) => (
                    <li
                      key={req}
                      className="text-white/55 text-xs flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold/50 mt-1.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply button */}
              <div className="p-4 pt-0">
                <Button
                  onClick={onApplyClick}
                  className="w-full bg-transparent border border-gold/30 text-gold hover:bg-gold hover:text-navy-deep font-semibold transition-all duration-200 group/btn"
                  variant="outline"
                  data-ocid={`jobs.apply_button.${i + 1}`}
                >
                  Apply for This Position
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
