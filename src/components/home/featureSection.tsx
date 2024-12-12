// components/home/featureSection.tsx
"use client";
import { LucideCloudLightning } from "lucide-react";
import { CreditCard, ShieldCheck, Download } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: CreditCard,
      title: "No Credit Card Required",
      description: "Instant access to premium content, no credit card needed",
      color: "text-blue-600",
    },
    {
      icon: LucideCloudLightning,
      title: "Blazing Fast Downloads",
      description: "Download your files at the speed of light",
      color: "text-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Complete Download Security",
      description: "Trust in 100% secure and safe downloads every time",
      color: "text-blue-600",
    },
    {
      icon: Download,
      title: "Unlimited Free Downloads",
      description:
        "Unlimited access to high-quality files, with full commercial usage rights",
      color: "text-blue-600",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50/50 to-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-600">Pngly</span>?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white rounded-xl 
                           shadow-sm hover:shadow-lg transition-all
                           border border-blue-100 hover:border-blue-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className="p-3 bg-blue-50 rounded-full 
                                group-hover:bg-blue-100 transition-colors"
                  >
                    <Icon
                      className="w-8 h-8 text-blue-600 
                               group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
