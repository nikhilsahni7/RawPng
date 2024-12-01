import { FaRegImages, FaRegSmileBeam, FaRegClock } from "react-icons/fa";

export const Features = [
  {
    title: "High-Quality Images",
    description: "Access a curated library of high-resolution images.",
    icon: <FaRegImages className="h-12 w-12 text-blue-600" />,
  },
  {
    title: "User-Friendly",
    description:
      "Easily find and download resources with our intuitive interface.",
    icon: <FaRegSmileBeam className="h-12 w-12 text-blue-600" />,
  },
  {
    title: "24/7 Support",
    description: "Our team is here to help you anytime.",
    icon: <FaRegClock className="h-12 w-12 text-blue-600" />,
  },
];

export function FeatureSection() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="mb-10 text-4xl font-bold text-center text-black">
          Why Choose Us
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {Features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-black">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
